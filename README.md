# Solana User Registration & Profile Management System

A complete Solana Anchor (Rust) smart contract system composed of two main programs: **UserFactory** and **UserProfile**, designed for decentralized user registration and profile management on Solana.

## 🏗️ Architecture

### UserFactory Program
- **Purpose**: Acts as a factory to create individual user profile accounts/programs
- **Program ID**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

### UserProfile Program  
- **Purpose**: Represents an individual user's profile on-chain
- **Program ID**: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`

## ✨ Features

### UserFactory Core Features
- ✅ **Initialize**: Sets admin and default registration fee
- ✅ **Register User**: Enforces unique usernames and collects registration fee
- ✅ **Set Registration Fee**: Admin-only fee adjustment
- ✅ **Withdraw Fees**: Admin fee withdrawal functionality
- ✅ **Change Username**: Username updates with validation

### UserProfile Core Features
- ✅ **Initialize**: Profile creation (called by factory)
- ✅ **Update Bio**: Owner-only bio updates
- ✅ **Transfer Ownership**: Profile ownership transfer
- ✅ **Update Profile**: General profile updates

## 🔧 Technical Implementation

### Security Features
- ✅ Signer validation for all privileged operations
- ✅ Safe arithmetic operations with overflow/underflow checks
- ✅ Input validation (username length, bio length)
- ✅ Access control with proper constraints
- ✅ PDA-based account derivation for security

### Data Structures
- **FactoryState**: Admin, registration fee, total collected fees, user count
- **UserProfile**: Owner, username, bio, creation timestamp
- **UsernameMap**: Username to user profile address mapping

### Events
- `FactoryInitialized`: Factory setup completion
- `UserRegistered`: New user registration
- `FeeUpdated`: Registration fee changes
- `FeesWithdrawn`: Admin fee withdrawals
- `UsernameChanged`: Username updates
- `ProfileUpdated`: Profile modifications
- `OwnershipTransferred`: Ownership changes

## 🚀 Getting Started

### Prerequisites
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+
- Node.js 16+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crypto-blue-blocks-solana-smart-contract-users
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the programs**
```bash
anchor build
```

4. **Run tests**
```bash
anchor test
```

### Deployment

1. **Start local validator**
```bash
solana-test-validator
```

2. **Deploy programs**
```bash
anchor deploy
```

## 📝 Usage Examples

### Initialize Factory
```typescript
await userFactoryProgram.methods
  .initialize(new anchor.BN(1000000000)) // 1 SOL fee
  .accounts({
    factoryState: factoryStatePDA,
    admin: admin.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

### Register User
```typescript
await userFactoryProgram.methods
  .registerUser("alice123", "Hello, I'm Alice!")
  .accounts({
    factoryState: factoryStatePDA,
    userProfile: userProfilePDA,
    usernameMap: usernameMapPDA,
    user: user.publicKey,
    userProfileProgram: userProfileProgram.programId,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([user])
  .rpc();
```

### Update Profile Bio
```typescript
await userProfileProgram.methods
  .updateBio("Updated bio!")
  .accounts({
    userProfile: userProfilePDA,
    user: user.publicKey,
  })
  .signers([user])
  .rpc();
```

## 🧪 Testing

The project includes comprehensive TypeScript tests covering:

- ✅ Factory initialization
- ✅ User registration with SOL payment
- ✅ Profile bio updates
- ✅ Username changes
- ✅ Ownership transfers
- ✅ Admin fee management
- ✅ Error handling and validation

Run tests with:
```bash
anchor test
```

## 🔒 Security Considerations

- **PDA Usage**: All accounts use Program Derived Addresses for deterministic and secure account creation
- **Access Control**: Proper signer validation and ownership checks
- **Input Validation**: Username and bio length limits enforced
- **Safe Arithmetic**: Overflow/underflow protection for all calculations
- **Fee Management**: Secure SOL transfer mechanisms

## 📁 Project Structure

```
├── programs/
│   ├── user_factory/
│   │   ├── src/lib.rs          # UserFactory program
│   │   └── Cargo.toml
│   └── user_profile/
│       ├── src/lib.rs          # UserProfile program
│       └── Cargo.toml
├── tests/
│   └── user-factory.ts         # Comprehensive test suite
├── Anchor.toml                 # Anchor workspace configuration
├── Cargo.toml                  # Workspace Cargo configuration
├── package.json                # Node.js dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.




