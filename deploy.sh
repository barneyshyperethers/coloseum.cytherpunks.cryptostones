#!/bin/bash

# Solana Vendor Management System Deployment Script

echo "🚀 Deploying Solana Vendor Management System..."

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install Anchor first."
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install Solana CLI first."
    exit 1
fi

# Build the programs
echo "🔨 Building programs..."
anchor build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to devnet
echo "🌐 Deploying to devnet..."
anchor deploy --provider.cluster devnet

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the program IDs in Anchor.toml with the deployed addresses"
echo "2. Run tests: anchor test"
echo "3. Initialize the factory with your admin key"
echo ""
echo "🔗 Program IDs:"
echo "VendorFactory: Check Anchor.toml for the deployed address"
echo "VendorProfile: Check Anchor.toml for the deployed address"
