#!/bin/bash

# Solana UserFactory and UserProfile Deployment Script
# This script builds and deploys both programs to the specified cluster

set -e

echo "🚀 Starting deployment process..."

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install it first:"
    echo "   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    echo "   avm install latest"
    echo "   avm use latest"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install it first:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/v1.16.0/install)\""
    exit 1
fi

# Set cluster (default to localnet)
CLUSTER=${1:-localnet}
echo "📡 Deploying to cluster: $CLUSTER"

# Configure Solana CLI for the cluster
case $CLUSTER in
    "localnet")
        solana config set --url localhost
        echo "🔧 Configured for localnet"
        ;;
    "devnet")
        solana config set --url devnet
        echo "🔧 Configured for devnet"
        ;;
    "mainnet")
        solana config set --url mainnet
        echo "🔧 Configured for mainnet"
        ;;
    *)
        echo "❌ Invalid cluster. Use: localnet, devnet, or mainnet"
        exit 1
        ;;
esac

# Check wallet
echo "💰 Checking wallet..."
WALLET_ADDRESS=$(solana address)
if [ -z "$WALLET_ADDRESS" ]; then
    echo "❌ No wallet configured. Please run: solana-keygen new"
    exit 1
fi
echo "✅ Wallet address: $WALLET_ADDRESS"

# Check balance
BALANCE=$(solana balance)
echo "💰 Wallet balance: $BALANCE SOL"

if [ "$CLUSTER" = "localnet" ]; then
    echo "🪂 Requesting airdrop for localnet..."
    solana airdrop 2
    echo "✅ Airdrop completed"
fi

# Build the programs
echo "🔨 Building programs..."
anchor build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"

# Deploy the programs
echo "🚀 Deploying programs..."

# Deploy UserFactory
echo "📦 Deploying UserFactory..."
anchor deploy --program-name user_factory

# Deploy UserProfile  
echo "📦 Deploying UserProfile..."
anchor deploy --program-name user_profile

echo "✅ Deployment completed successfully!"

# Display program IDs
echo ""
echo "📋 Program Information:"
echo "UserFactory Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
echo "UserProfile Program ID: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"

# Run tests if on localnet
if [ "$CLUSTER" = "localnet" ]; then
    echo ""
    echo "🧪 Running tests..."
    anchor test --skip-local-validator
    echo "✅ Tests completed"
fi

echo ""
echo "🎉 Deployment process completed successfully!"
echo "You can now interact with the deployed programs."
