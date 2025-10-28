use anchor_lang::prelude::*;

declare_id!("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");

#[program]
pub mod user_profile {
    use super::*;

    /// Initialize a user profile (called by UserFactory)
    pub fn initialize(
        ctx: Context<Initialize>,
        owner: Pubkey,
        username: String,
        bio: String,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        user_profile.owner = owner;
        user_profile.username = username.clone();
        user_profile.bio = bio;
        user_profile.created_at = Clock::get()?.unix_timestamp;
        user_profile.bump = ctx.bumps.user_profile;
        
        emit!(ProfileInitialized {
            owner,
            username,
            user_profile: user_profile.key(),
        });
        
        Ok(())
    }

    /// Update user bio (owner only)
    pub fn update_bio(ctx: Context<UpdateBio>, new_bio: String) -> Result<()> {
        require!(new_bio.len() <= 280, ErrorCode::BioTooLong);
        
        let user_profile = &mut ctx.accounts.user_profile;
        let old_bio = user_profile.bio.clone();
        user_profile.bio = new_bio.clone();
        
        emit!(BioUpdated {
            username: user_profile.username.clone(),
            old_bio,
            new_bio,
            user_profile: user_profile.key(),
        });
        
        Ok(())
    }

    /// Transfer ownership of the profile
    pub fn transfer_ownership(ctx: Context<TransferOwnership>, new_owner: Pubkey) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        let old_owner = user_profile.owner;
        user_profile.owner = new_owner;
        
        emit!(OwnershipTransferred {
            old_owner,
            new_owner,
            user_profile: user_profile.key(),
        });
        
        Ok(())
    }

    /// Update profile information (owner only)
    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        new_bio: String,
    ) -> Result<()> {
        require!(new_bio.len() <= 280, ErrorCode::BioTooLong);
        
        let user_profile = &mut ctx.accounts.user_profile;
        let old_bio = user_profile.bio.clone();
        user_profile.bio = new_bio.clone();
        
        emit!(ProfileUpdated {
            username: user_profile.username.clone(),
            old_bio,
            new_bio,
            user_profile: user_profile.key(),
        });
        
        Ok(())
    }

    /// Get profile information (view function)
    pub fn get_profile_info(ctx: Context<GetProfileInfo>) -> Result<ProfileInfo> {
        let user_profile = &ctx.accounts.user_profile;
        
        Ok(ProfileInfo {
            owner: user_profile.owner,
            username: user_profile.username.clone(),
            bio: user_profile.bio.clone(),
            created_at: user_profile.created_at,
            user_profile: user_profile.key(),
        })
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"user_profile", owner.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    /// CHECK: This account is validated by the UserFactory program
    pub owner: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateBio<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump,
        constraint = user_profile.owner == user.key() @ ErrorCode::Unauthorized
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferOwnership<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", current_owner.key().as_ref()],
        bump = user_profile.bump,
        constraint = user_profile.owner == current_owner.key() @ ErrorCode::Unauthorized
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    pub current_owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump,
        constraint = user_profile.owner == user.key() @ ErrorCode::Unauthorized
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetProfileInfo<'info> {
    #[account(
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    /// CHECK: This account is used to derive the PDA
    pub user: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,
    pub username: String,
    pub bio: String,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProfileInfo {
    pub owner: Pubkey,
    pub username: String,
    pub bio: String,
    pub created_at: i64,
    pub user_profile: Pubkey,
}

#[event]
pub struct ProfileInitialized {
    pub owner: Pubkey,
    pub username: String,
    pub user_profile: Pubkey,
}

#[event]
pub struct BioUpdated {
    pub username: String,
    pub old_bio: String,
    pub new_bio: String,
    pub user_profile: Pubkey,
}

#[event]
pub struct OwnershipTransferred {
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
    pub user_profile: Pubkey,
}

#[event]
pub struct ProfileUpdated {
    pub username: String,
    pub old_bio: String,
    pub new_bio: String,
    pub user_profile: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Bio too long")]
    BioTooLong,
    #[msg("Unauthorized access")]
    Unauthorized,
}
