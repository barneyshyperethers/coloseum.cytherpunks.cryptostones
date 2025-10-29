// Transak Configuration
// Replace these with your actual Transak API credentials

export const TRANSAK_CONFIG = {
  // Get your API key from https://transak.com/
  API_KEY: 'YOUR_TRANSAK_API_KEY_HERE',
  
  // Environment: 'STAGING' for testing, 'PRODUCTION' for live
  ENVIRONMENT: 'STAGING',
  
  // Default settings
  DEFAULT_CRYPTO_CURRENCY: 'SOL',
  DEFAULT_FIAT_CURRENCY: 'USD',
  
  // Theme colors to match your app
  THEME_COLOR: '#00BFFF',
  
  // Widget settings
  HIDE_MENU: false,
  IS_AUTO_FILL_USER_DATA: true,
  
  // Supported countries (empty array means all countries)
  SUPPORTED_COUNTRIES: [],
  
  // Supported currencies
  SUPPORTED_CRYPTO_CURRENCIES: ['SOL', 'USDC'],
  SUPPORTED_FIAT_CURRENCIES: ['USD', 'EUR', 'GBP'],
};

// Smart Contract Configuration
export const SMART_CONTRACT_CONFIG = {
  // Replace with your actual Solana program ID
  PROGRAM_ID: 'YOUR_PROGRAM_ID_HERE',
  
  // RPC endpoint
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  
  // For development, you might want to use devnet
  // RPC_ENDPOINT: 'https://api.devnet.solana.com',
};
