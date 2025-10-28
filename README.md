# Solana Vendor Management System

A decentralized vendor registration and management system built on Solana using the Anchor framework.

## Overview

This system consists of two main smart contracts:

1. **VendorFactory** - Factory/registry contract that manages vendor registration and fees
2. **VendorProfile** - Individual vendor profile contracts for each registered vendor

## Features

### VendorFactory Contract
- ✅ Decentralized vendor registration with SOL fees
- ✅ Unique vendor name enforcement
- ✅ Admin-controlled registration fee management
- ✅ Fee collection and withdrawal system
- ✅ Registration pause/unpause functionality
- ✅ Comprehensive event logging

### VendorProfile Contract
- ✅ Individual vendor profile management
- ✅ Owner-only profile updates
- ✅ Product management (add/remove products)
- ✅ Ownership transfer functionality
- ✅ Vendor name updates with uniqueness checks
- ✅ Detailed event tracking

## Project Structure

```
├── programs/
│   ├── vendor_factory/
│   │   ├── src/
│   │   │   └── lib.rs          # VendorFactory program
│   │   └── Cargo.toml
│   └── vendor_profile/
│       ├── src/
│       │   └── lib.rs          # VendorProfile program
│       └── Cargo.toml
├── tests/
│   └── vendor-system.ts        # TypeScript tests
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Workspace configuration
├── package.json                # Node.js dependencies
└── tsconfig.json              # TypeScript configuration
```

## Getting Started

### Prerequisites
- Rust (latest stable)
- Solana CLI (v1.16+)
- Anchor CLI (v0.29+)
- Node.js (v16+)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the programs:
   ```bash
   anchor build
   ```

4. Run tests:
   ```bash
   anchor test
   ```

## Usage

### 1. Initialize Factory
```typescript
await vendorFactoryProgram.methods
  .initialize(admin.publicKey, new anchor.BN(1000000000)) // 1 SOL fee
  .accounts({
    factoryState: factoryStatePDA,
    payer: admin.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

### 2. Register Vendor
```typescript
await vendorFactoryProgram.methods
  .registerVendor("MyVendor", "Description of my vendor")
  .accounts({
    factoryState: factoryStatePDA,
    vendorProfile: vendorProfilePDA,
    factoryVault: factoryVaultPDA,
    payer: vendor.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([vendor])
  .rpc();
```

### 3. Update Vendor Profile
```typescript
await vendorProfileProgram.methods
  .updateDescription("New description")
  .accounts({
    vendorProfile: vendorProfilePDA,
    owner: vendor.publicKey,
  })
  .signers([vendor])
  .rpc();
```

### 4. Add Product
```typescript
await vendorProfileProgram.methods
  .addProduct("PROD001", new anchor.BN(500000000), "Product description")
  .accounts({
    vendorProfile: vendorProfilePDA,
    owner: vendor.publicKey,
  })
  .signers([vendor])
  .rpc();
```

## Security Features

- **PDA-based accounts** for deterministic address generation
- **Owner-only operations** with proper access controls
- **Unique name enforcement** to prevent conflicts
- **Fee validation** to ensure proper payment
- **Pause functionality** for emergency situations
- **Comprehensive error handling** with custom error codes

## Events

The system emits detailed events for transparency:

- `FactoryInitialized` - Factory setup
- `VendorRegistered` - New vendor registration
- `ProfileUpdated` - Profile modifications
- `ProductAdded`/`ProductRemoved` - Product management
- `OwnershipTransferred` - Ownership changes
- `RegistrationFeeUpdated` - Fee changes
- `FeesWithdrawn` - Admin withdrawals

## Error Handling

Custom error codes provide clear feedback:

- `Unauthorized` - Access control violations
- `VendorNameTaken` - Duplicate name attempts
- `InsufficientFunds` - Payment issues
- `RegistrationPaused` - System pause state
- `ProductAlreadyExists` - Duplicate products

## Testing

The test suite covers:
- Factory initialization
- Vendor registration (success and failure cases)
- Profile updates and ownership transfers
- Product management
- Admin functions (fee updates, withdrawals, pause)

Run tests with:
```bash
anchor test
```

## Deployment

Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

Deploy to mainnet:
```bash
anchor deploy --provider.cluster mainnet
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For questions or issues, please open a GitHub issue or contact the development team.