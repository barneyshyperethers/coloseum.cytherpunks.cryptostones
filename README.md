# CryptoBlueBlocks

A modern, decentralized data marketplace dashboard built with React, Vite, and TypeScript. This application showcases real-time data feeds, AI-powered agents, and a beautiful Web3-inspired UI.

## Features

- 🚀 **Modern Stack**: Built with React 18, Vite 6, and TypeScript
- 🔄 **React Query**: Powerful data fetching and caching with automatic refetching
- 🎨 **Beautiful UI**: Radix UI components with Tailwind CSS styling
- ✨ **Animations**: Smooth animations powered by Motion
- 📊 **Data Visualization**: Interactive charts with Recharts
- 🌙 **Theme Support**: Light/dark mode with next-themes
- 📱 **Responsive Design**: Mobile-first approach with responsive layouts

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd CryptoBlueBlocks
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
CryptoBlueBlocks/
├── src/
│   ├── api/            # API functions and data fetching
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   └── figma/      # Figma-specific components
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Key Technologies

- **[React](https://react.dev/)** - UI library for building user interfaces
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript for better DX
- **[React Query](https://tanstack.com/query/latest)** - Data fetching and caching
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Motion](https://motion.dev/)** - Animation library
- **[Recharts](https://recharts.org/)** - Chart library for React

## Learn More

### React Query

This project uses React Query (TanStack Query) for efficient data management:

- **Automatic caching**: Data is cached and reused across components
- **Auto-refetching**: Live feeds update every 10 seconds
- **Loading & error states**: Built-in state management for async operations
- **Background updates**: Data stays fresh without disrupting the UI

Learn more at [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

### Vite

Vite provides lightning-fast development experience:

- **Instant server start**: No matter the app size
- **Hot Module Replacement**: Updates instantly in the browser
- **Optimized builds**: Rollup-based production builds

Learn more at [Vite Documentation](https://vitejs.dev/guide/)

### Component Library

The UI is built with Radix UI primitives and styled with Tailwind CSS:

- **Accessibility**: ARIA-compliant components out of the box
- **Customizable**: Full control over styling and behavior
- **Unstyled**: No design opinions, just functionality

Learn more at [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

## Deployment

### Deploy to Vercel

The easiest way to deploy this application is with [Vercel](https://vercel.com):

1. **Push your code to GitHub, GitLab, or Bitbucket**
2. **Import your repository to Vercel**
3. **Vercel will automatically detect Vite** - No additional configuration needed!
4. **Deploy!** - Your app will be live with a production URL

The project includes:

- ✅ `vercel.json` - Proper configuration for SPA routing
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ Correct build output (`dist` directory)
- ✅ All required dependencies

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Build Settings (Auto-configured):**

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Deploy to Netlify

You can also deploy to [Netlify](https://www.netlify.com/):

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Other Hosting Options

Since this is a static site, you can deploy to:

- **GitHub Pages**: Free hosting for public repositories
- **Cloudflare Pages**: Fast global CDN with zero-config deployment
- **AWS S3 + CloudFront**: Scalable and cost-effective
- **Firebase Hosting**: Simple deployment with Firebase CLI

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Troubleshooting

### Vercel Deployment Issues

If you encounter build errors on Vercel, ensure:

1. **Output directory is correct**: Should be `dist` (configured in `vite.config.ts`)
2. **TypeScript is installed**: Check that `typescript`, `@types/react`, and `@types/react-dom` are in `devDependencies`
3. **Node.js version**: Vercel uses Node.js 18.x by default, which is compatible with this project
4. **Build succeeds locally**: Run `npm run build` locally to verify

### Common Build Errors

**Error: "Cannot find module 'typescript'"**

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

**Error: "Output directory not found"**

- Check `vite.config.ts` has `outDir: 'dist'`
- Verify `vercel.json` has `"outputDirectory": "dist"`

**Error: "404 on page refresh"**

- The `vercel.json` includes proper SPA routing configuration
- All routes redirect to `/index.html`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
