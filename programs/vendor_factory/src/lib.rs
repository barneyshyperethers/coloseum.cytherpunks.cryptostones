use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// VendorFactory program - manages vendor registration and fees
#[program]
pub mod vendor_factory {
    use super::*;

    /// Initialize the factory with admin and registration fee
    pub fn initialize(
        ctx: Context<Initialize>,
        admin: Pubkey,
        registration_fee: u64,
    ) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        
        factory_state.admin = admin;
        factory_state.registration_fee = registration_fee;
        factory_state.total_collected_fees = 0;
        factory_state.paused = false;
        factory_state.bump = ctx.bumps.factory_state;
        
        emit!(FactoryInitialized {
            admin,
            registration_fee,
        });
        
        Ok(())
    }

    /// Register a new vendor profile
    pub fn register_vendor(
        ctx: Context<RegisterVendor>,
        vendor_name: String,
        description: String,
    ) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        
        // Check if registration is paused
        require!(!factory_state.paused, VendorFactoryError::RegistrationPaused);
        
        // Check if vendor name is already taken
        require!(
            !factory_state.vendor_names.contains(&vendor_name),
            VendorFactoryError::VendorNameTaken
        );
        
        // Transfer registration fee
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.factory_vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, factory_state.registration_fee)?;
        
        // Update factory state
        factory_state.vendor_names.push(vendor_name.clone());
        factory_state.total_collected_fees += factory_state.registration_fee;
        
        // Initialize vendor profile via CPI to vendor_profile program
        let cpi_context = CpiContext::new(
            ctx.accounts.vendor_profile_program.to_account_info(),
            vendor_profile::cpi::accounts::InitializeProfile {
                vendor_profile: ctx.accounts.vendor_profile.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
            },
        );
        vendor_profile::cpi::initialize_profile(
            cpi_context,
            ctx.accounts.payer.key(),
            vendor_name.clone(),
            description,
        )?;
        
        emit!(VendorRegistered {
            vendor_name,
            vendor_profile: ctx.accounts.vendor_profile.key(),
        });
        
        Ok(())
    }

    /// Update registration fee (admin only)
    pub fn update_fee(ctx: Context<UpdateFee>, new_fee: u64) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        factory_state.registration_fee = new_fee;
        
        emit!(RegistrationFeeUpdated { new_fee });
        
        Ok(())
    }

    /// Withdraw collected fees (admin only)
    pub fn withdraw_fees(ctx: Context<WithdrawFees>, destination: Pubkey) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        let amount = factory_state.total_collected_fees;
        
        require!(amount > 0, VendorFactoryError::NoFeesToWithdraw);
        
        // Transfer funds to destination
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.factory_vault.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;
        
        // Reset collected fees
        factory_state.total_collected_fees = 0;
        
        emit!(FeesWithdrawn { amount, destination });
        
        Ok(())
    }

    /// Pause/unpause registration (admin only)
    pub fn pause_registration(ctx: Context<PauseRegistration>, paused: bool) -> Result<()> {
        let factory_state = &mut ctx.accounts.factory_state;
        factory_state.paused = paused;
        
        emit!(RegistrationPaused { paused });
        
        Ok(())
    }

    /// Check if vendor name is available
    pub fn check_vendor_name(ctx: Context<CheckVendorName>, vendor_name: String) -> Result<()> {
        let factory_state = &ctx.accounts.factory_state;
        
        require!(
            !factory_state.vendor_names.contains(&vendor_name),
            VendorFactoryError::VendorNameTaken
        );
        
        Ok(())
    }
}

/// Initialize factory context
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = FactoryState::LEN,
        seeds = [b"factory-state"],
        bump
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Register vendor context
#[derive(Accounts)]
#[instruction(vendor_name: String)]
pub struct RegisterVendor<'info> {
    #[account(
        mut,
        seeds = [b"factory-state"],
        bump = factory_state.bump
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    #[account(
        init,
        payer = payer,
        space = VendorProfile::LEN,
        seeds = [b"vendor-profile", vendor_name.as_bytes()],
        bump
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    /// CHECK: PDA for factory vault
    #[account(
        mut,
        seeds = [b"factory-vault"],
        bump
    )]
    pub factory_vault: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub vendor_profile_program: Program<'info, vendor_profile::program::VendorProfile>,
    
    pub system_program: Program<'info, System>,
}

/// Update fee context
#[derive(Accounts)]
pub struct UpdateFee<'info> {
    #[account(
        mut,
        seeds = [b"factory-state"],
        bump = factory_state.bump,
        constraint = factory_state.admin == admin.key() @ VendorFactoryError::Unauthorized
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    pub admin: Signer<'info>,
}

/// Withdraw fees context
#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    #[account(
        mut,
        seeds = [b"factory-state"],
        bump = factory_state.bump,
        constraint = factory_state.admin == admin.key() @ VendorFactoryError::Unauthorized
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    /// CHECK: PDA for factory vault
    #[account(
        mut,
        seeds = [b"factory-vault"],
        bump
    )]
    pub factory_vault: UncheckedAccount<'info>,
    
    /// CHECK: Destination account for withdrawal
    #[account(mut)]
    pub destination: UncheckedAccount<'info>,
    
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Pause registration context
#[derive(Accounts)]
pub struct PauseRegistration<'info> {
    #[account(
        mut,
        seeds = [b"factory-state"],
        bump = factory_state.bump,
        constraint = factory_state.admin == admin.key() @ VendorFactoryError::Unauthorized
    )]
    pub factory_state: Account<'info, FactoryState>,
    
    pub admin: Signer<'info>,
}

/// Check vendor name context
#[derive(Accounts)]
pub struct CheckVendorName<'info> {
    #[account(
        seeds = [b"factory-state"],
        bump = factory_state.bump
    )]
    pub factory_state: Account<'info, FactoryState>,
}

/// Factory state account
#[account]
pub struct FactoryState {
    pub admin: Pubkey,
    pub registration_fee: u64,
    pub total_collected_fees: u64,
    pub paused: bool,
    pub vendor_names: Vec<String>,
    pub bump: u8,
}

impl FactoryState {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        8 + // registration_fee
        8 + // total_collected_fees
        1 + // paused
        4 + (32 * 100) + // vendor_names (max 100 vendors)
        1; // bump
}

/// Vendor profile account (imported from vendor_profile program)
#[account]
pub struct VendorProfile {
    pub owner: Pubkey,
    pub vendor_name: String,
    pub description: String,
    pub created_at: i64,
    pub bump: u8,
}

impl VendorProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        4 + 32 + // vendor_name (String)
        4 + 256 + // description (String, max 256 chars)
        8 + // created_at
        1; // bump
}

/// Events
#[event]
pub struct FactoryInitialized {
    pub admin: Pubkey,
    pub registration_fee: u64,
}

#[event]
pub struct VendorRegistered {
    pub vendor_name: String,
    pub vendor_profile: Pubkey,
}

#[event]
pub struct RegistrationFeeUpdated {
    pub new_fee: u64,
}

#[event]
pub struct FeesWithdrawn {
    pub amount: u64,
    pub destination: Pubkey,
}

#[event]
pub struct RegistrationPaused {
    pub paused: bool,
}

/// Custom error codes
#[error_code]
pub enum VendorFactoryError {
    #[msg("Unauthorized: Only admin can perform this action")]
    Unauthorized,
    
    #[msg("Vendor name is already taken")]
    VendorNameTaken,
    
    #[msg("Insufficient funds for registration fee")]
    InsufficientFunds,
    
    #[msg("Registration is currently paused")]
    RegistrationPaused,
    
    #[msg("No fees available to withdraw")]
    NoFeesToWithdraw,
}
