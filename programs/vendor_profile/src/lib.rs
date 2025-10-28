use anchor_lang::prelude::*;

declare_id!("VendorProfile111111111111111111111111111111111111");

/// VendorProfile program - manages individual vendor profiles
#[program]
pub mod vendor_profile {
    use super::*;

    /// Initialize vendor profile (called only by factory)
    pub fn initialize(
        ctx: Context<InitializeProfile>,
        owner: Pubkey,
        vendor_name: String,
        description: String,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        
        vendor_profile.owner = owner;
        vendor_profile.vendor_name = vendor_name.clone();
        vendor_profile.description = description;
        vendor_profile.created_at = Clock::get()?.unix_timestamp;
        vendor_profile.bump = ctx.bumps.vendor_profile;
        vendor_profile.products = Vec::new();
        
        emit!(ProfileInitialized {
            vendor_name,
            owner,
        });
        
        Ok(())
    }

    /// Update vendor description (owner only)
    pub fn update_description(
        ctx: Context<UpdateDescription>,
        new_description: String,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        vendor_profile.description = new_description.clone();
        
        emit!(ProfileUpdated {
            vendor_name: vendor_profile.vendor_name.clone(),
            field: "description".to_string(),
            new_value: new_description,
        });
        
        Ok(())
    }

    /// Update vendor name (owner only, must check uniqueness via factory)
    pub fn update_vendor_name(
        ctx: Context<UpdateVendorName>,
        new_name: String,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        let old_name = vendor_profile.vendor_name.clone();
        
        // Check uniqueness with factory
        let cpi_context = CpiContext::new(
            ctx.accounts.vendor_factory.to_account_info(),
            vendor_factory::cpi::accounts::CheckVendorName {
                factory_state: ctx.accounts.factory_state.to_account_info(),
            },
        );
        vendor_factory::cpi::check_vendor_name(cpi_context, new_name.clone())?;
        
        // Update name
        vendor_profile.vendor_name = new_name.clone();
        
        emit!(VendorNameChanged {
            old_name,
            new_name,
        });
        
        Ok(())
    }

    /// Add a product to vendor profile (owner only)
    pub fn add_product(
        ctx: Context<AddProduct>,
        product_id: String,
        price: u64,
        description: String,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        
        // Check if product already exists
        require!(
            !vendor_profile.products.iter().any(|p| p.product_id == product_id),
            VendorProfileError::ProductAlreadyExists
        );
        
        let product = Product {
            product_id: product_id.clone(),
            price,
            description,
            created_at: Clock::get()?.unix_timestamp,
        };
        
        vendor_profile.products.push(product);
        
        emit!(ProductAdded {
            vendor_name: vendor_profile.vendor_name.clone(),
            product_id,
            price,
        });
        
        Ok(())
    }

    /// Remove a product from vendor profile (owner only)
    pub fn remove_product(
        ctx: Context<RemoveProduct>,
        product_id: String,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        
        // Find and remove product
        let initial_len = vendor_profile.products.len();
        vendor_profile.products.retain(|p| p.product_id != product_id);
        
        require!(
            vendor_profile.products.len() < initial_len,
            VendorProfileError::ProductNotFound
        );
        
        emit!(ProductRemoved {
            vendor_name: vendor_profile.vendor_name.clone(),
            product_id,
        });
        
        Ok(())
    }

    /// Transfer ownership of vendor profile (owner only)
    pub fn transfer_ownership(
        ctx: Context<TransferOwnership>,
        new_owner: Pubkey,
    ) -> Result<()> {
        let vendor_profile = &mut ctx.accounts.vendor_profile;
        let old_owner = vendor_profile.owner;
        
        vendor_profile.owner = new_owner;
        
        emit!(OwnershipTransferred {
            vendor_name: vendor_profile.vendor_name.clone(),
            old_owner,
            new_owner,
        });
        
        Ok(())
    }

    /// Get vendor profile info
    pub fn get_profile_info(ctx: Context<GetProfileInfo>) -> Result<()> {
        let vendor_profile = &ctx.accounts.vendor_profile;
        
        emit!(ProfileInfoRetrieved {
            vendor_name: vendor_profile.vendor_name.clone(),
            owner: vendor_profile.owner,
            description: vendor_profile.description.clone(),
            created_at: vendor_profile.created_at,
            product_count: vendor_profile.products.len() as u32,
        });
        
        Ok(())
    }
}

/// Initialize profile context
#[derive(Accounts)]
#[instruction(owner: Pubkey, vendor_name: String)]
pub struct InitializeProfile<'info> {
    #[account(
        init,
        payer = payer,
        space = VendorProfile::LEN,
        seeds = [b"vendor-profile", vendor_name.as_bytes()],
        bump
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Update description context
#[derive(Accounts)]
pub struct UpdateDescription<'info> {
    #[account(
        mut,
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump,
        constraint = vendor_profile.owner == owner.key() @ VendorProfileError::Unauthorized
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    pub owner: Signer<'info>,
}

/// Update vendor name context
#[derive(Accounts)]
pub struct UpdateVendorName<'info> {
    #[account(
        mut,
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump,
        constraint = vendor_profile.owner == owner.key() @ VendorProfileError::Unauthorized
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    /// CHECK: Factory state for uniqueness check
    #[account(
        seeds = [b"factory-state"],
        bump
    )]
    pub factory_state: UncheckedAccount<'info>,
    
    pub owner: Signer<'info>,
    
    pub vendor_factory: Program<'info, vendor_factory::program::VendorFactory>,
}

/// Add product context
#[derive(Accounts)]
pub struct AddProduct<'info> {
    #[account(
        mut,
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump,
        constraint = vendor_profile.owner == owner.key() @ VendorProfileError::Unauthorized
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    pub owner: Signer<'info>,
}

/// Remove product context
#[derive(Accounts)]
pub struct RemoveProduct<'info> {
    #[account(
        mut,
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump,
        constraint = vendor_profile.owner == owner.key() @ VendorProfileError::Unauthorized
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    pub owner: Signer<'info>,
}

/// Transfer ownership context
#[derive(Accounts)]
pub struct TransferOwnership<'info> {
    #[account(
        mut,
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump,
        constraint = vendor_profile.owner == owner.key() @ VendorProfileError::Unauthorized
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
    
    pub owner: Signer<'info>,
}

/// Get profile info context
#[derive(Accounts)]
pub struct GetProfileInfo<'info> {
    #[account(
        seeds = [b"vendor-profile", vendor_profile.vendor_name.as_bytes()],
        bump = vendor_profile.bump
    )]
    pub vendor_profile: Account<'info, VendorProfile>,
}

/// Vendor profile account
#[account]
pub struct VendorProfile {
    pub owner: Pubkey,
    pub vendor_name: String,
    pub description: String,
    pub created_at: i64,
    pub products: Vec<Product>,
    pub bump: u8,
}

impl VendorProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        4 + 32 + // vendor_name (String)
        4 + 256 + // description (String, max 256 chars)
        8 + // created_at
        4 + (Product::LEN * 50) + // products (max 50 products)
        1; // bump
}

/// Product structure
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Product {
    pub product_id: String,
    pub price: u64,
    pub description: String,
    pub created_at: i64,
}

impl Product {
    pub const LEN: usize = 4 + 32 + // product_id (String)
        8 + // price
        4 + 128 + // description (String, max 128 chars)
        8; // created_at
}

/// Events
#[event]
pub struct ProfileInitialized {
    pub vendor_name: String,
    pub owner: Pubkey,
}

#[event]
pub struct ProfileUpdated {
    pub vendor_name: String,
    pub field: String,
    pub new_value: String,
}

#[event]
pub struct VendorNameChanged {
    pub old_name: String,
    pub new_name: String,
}

#[event]
pub struct ProductAdded {
    pub vendor_name: String,
    pub product_id: String,
    pub price: u64,
}

#[event]
pub struct ProductRemoved {
    pub vendor_name: String,
    pub product_id: String,
}

#[event]
pub struct OwnershipTransferred {
    pub vendor_name: String,
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
}

#[event]
pub struct ProfileInfoRetrieved {
    pub vendor_name: String,
    pub owner: Pubkey,
    pub description: String,
    pub created_at: i64,
    pub product_count: u32,
}

/// Custom error codes
#[error_code]
pub enum VendorProfileError {
    #[msg("Unauthorized: Only owner can perform this action")]
    Unauthorized,
    
    #[msg("Product already exists")]
    ProductAlreadyExists,
    
    #[msg("Product not found")]
    ProductNotFound,
    
    #[msg("Invalid vendor name")]
    InvalidVendorName,
    
    #[msg("Maximum products limit reached")]
    MaxProductsReached,
}
