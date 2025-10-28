use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// Import UserProfile program
use user_profile::cpi::accounts::Initialize as UserProfileInitialize;
use user_profile::cpi::accounts::UpdateBio as UserProfileUpdateBio;
use user_profile::program::UserProfile as UserProfileProgram;
use user_profile::{self, UserProfile as UserProfileAccount};

#[program]
pub mod user_factory {
    use super::*;

    /// Initialize the UserFactory with admin and registration fee
    pub fn initialize(ctx: Context<Initialize>, registration_fee: u64) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        
        factory_state.admin = ctx.accounts.admin.key();
        factory_state.registration_fee = registration_fee;
        factory_state.total_fees_collected = 0;
        factory_state.user_count = 0;
        factory_state.bump = ctx.bumps.factory_state;
        
        emit!(FactoryInitialized {
            admin: ctx.accounts.admin.key(),
            registration_fee,
        });
        
        Ok(())
    }

    /// Register a new user by creating a UserProfile account
    pub fn register_user(
        ctx: Context<RegisterUser>,
        username: String,
        bio: String,
    ) -> Result<()> {
        // Validate username length and characters
        require!(username.len() >= 3 && username.len() <= 32, ErrorCode::InvalidUsername);
        require!(bio.len() <= 280, ErrorCode::BioTooLong);
        
        // Check if username is already taken
        require!(
            ctx.accounts.username_map.username.is_empty(),
            ErrorCode::UsernameAlreadyTaken
        );

        let factory_state = &mut ctx.accounts.factory_state;
        let user_profile = &mut ctx.accounts.user_profile;
        let username_map = &mut ctx.accounts.username_map;

        // Transfer registration fee from user to factory
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.factory_state.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, factory_state.registration_fee)?;

        // Initialize user profile via CPI to UserProfile program
        let cpi_accounts = UserProfileInitialize {
            user_profile: ctx.accounts.user_profile.to_account_info(),
            owner: ctx.accounts.user.to_account_info(),
            payer: ctx.accounts.user.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.user_profile_program.to_account_info(),
            cpi_accounts,
        );
        user_profile::cpi::initialize(cpi_ctx, ctx.accounts.user.key(), username.clone(), bio)?;

        // Update username mapping
        username_map.username = username.clone();
        username_map.user_profile = user_profile.key();
        username_map.bump = ctx.bumps.username_map;

        // Update factory state
        factory_state.total_fees_collected = factory_state
            .total_fees_collected
            .checked_add(factory_state.registration_fee)
            .ok_or(ErrorCode::Overflow)?;
        factory_state.user_count = factory_state
            .user_count
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(UserRegistered {
            username: username.clone(),
            user_profile: user_profile.key(),
            user: ctx.accounts.user.key(),
        });

        Ok(())
    }

    /// Set new registration fee (admin only)
    pub fn set_registration_fee(ctx: Context<SetRegistrationFee>, new_fee: u64) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        let old_fee = factory_state.registration_fee;
        factory_state.registration_fee = new_fee;

        emit!(FeeUpdated {
            old_fee,
            new_fee,
            admin: ctx.accounts.admin.key(),
        });

        Ok(())
    }

    /// Withdraw collected fees (admin only)
    pub fn withdraw_fees(ctx: Context<WithdrawFees>, amount: u64) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        
        require!(
            amount <= factory_state.total_fees_collected,
            ErrorCode::InsufficientFees
        );

        // Transfer SOL to destination
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.factory_state.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // Update factory state
        factory_state.total_fees_collected = factory_state
            .total_fees_collected
            .checked_sub(amount)
            .ok_or(ErrorCode::Underflow)?;

        emit!(FeesWithdrawn {
            amount,
            destination: ctx.accounts.destination.key(),
            admin: ctx.accounts.admin.key(),
        });

        Ok(())
    }

    /// Change username for an existing user profile
    pub fn change_username(
        ctx: Context<ChangeUsername>,
        new_username: String,
    ) -> Result<()> {
        require!(new_username.len() >= 3 && new_username.len() <= 32, ErrorCode::InvalidUsername);
        
        // Check if new username is already taken
        require!(
            ctx.accounts.new_username_map.username.is_empty(),
            ErrorCode::UsernameAlreadyTaken
        );

        let user_profile = &mut ctx.accounts.user_profile;
        let old_username_map = &mut ctx.accounts.old_username_map;
        let new_username_map = &mut ctx.accounts.new_username_map;

        let old_username = user_profile.username.clone();
        
        // Update user profile
        user_profile.username = new_username.clone();

        // Clear old username mapping
        old_username_map.username = String::new();
        old_username_map.user_profile = Pubkey::default();

        // Set new username mapping
        new_username_map.username = new_username.clone();
        new_username_map.user_profile = user_profile.key();

        emit!(UsernameChanged {
            old_username,
            new_username,
            user_profile: user_profile.key(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + FactoryState::INIT_SPACE,
        seeds = [b"factory_state"],
        bump
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct RegisterUser<'info> {
    #[account(
        mut,
        seeds = [b"factory_state"],
        bump = factory_state.bump
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserProfileAccount::INIT_SPACE,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfileAccount>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UsernameMap::INIT_SPACE,
        seeds = [b"username", username.as_bytes()],
        bump
    )]
    pub username_map: Account<'info, UsernameMap>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub user_profile_program: Program<'info, UserProfileProgram>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetRegistrationFee<'info> {
    #[account(
        mut,
        seeds = [b"factory_state"],
        bump = factory_state.bump,
        constraint = factory_state.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    #[account(
        mut,
        seeds = [b"factory_state"],
        bump = factory_state.bump,
        constraint = factory_state.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    #[account(mut)]
    pub destination: SystemAccount<'info>,
    
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(new_username: String)]
pub struct ChangeUsername<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump,
        constraint = user_profile.owner == user.key() @ ErrorCode::Unauthorized
    )]
    pub user_profile: Account<'info, UserProfileAccount>,
    
    #[account(
        mut,
        seeds = [b"username", user_profile.username.as_bytes()],
        bump
    )]
    pub old_username_map: Account<'info, UsernameMap>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UsernameMap::INIT_SPACE,
        seeds = [b"username", new_username.as_bytes()],
        bump
    )]
    pub new_username_map: Account<'info, UsernameMap>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct FactoryState {
    pub admin: Pubkey,
    pub registration_fee: u64,
    pub total_fees_collected: u64,
    pub user_count: u64,
    pub bump: u8,
}


#[account]
#[derive(InitSpace)]
pub struct UsernameMap {
    pub username: String,
    pub user_profile: Pubkey,
    pub bump: u8,
}

#[event]
pub struct FactoryInitialized {
    pub admin: Pubkey,
    pub registration_fee: u64,
}

#[event]
pub struct UserRegistered {
    pub username: String,
    pub user_profile: Pubkey,
    pub user: Pubkey,
}

#[event]
pub struct FeeUpdated {
    pub old_fee: u64,
    pub new_fee: u64,
    pub admin: Pubkey,
}

#[event]
pub struct FeesWithdrawn {
    pub amount: u64,
    pub destination: Pubkey,
    pub admin: Pubkey,
}

#[event]
pub struct UsernameChanged {
    pub old_username: String,
    pub new_username: String,
    pub user_profile: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid username length")]
    InvalidUsername,
    #[msg("Bio too long")]
    BioTooLong,
    #[msg("Username already taken")]
    UsernameAlreadyTaken,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Insufficient fees collected")]
    InsufficientFees,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}
