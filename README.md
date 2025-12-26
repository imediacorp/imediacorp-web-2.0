# imediacorp.com Website

Modern, production-ready website for [imediacorp.com](https://imediacorp.com) built with Next.js 14, React, TypeScript, and Tailwind CSS.

## About

This repository contains the public-facing website for **Intermedia Communications Corp (imediacorp)**, showcasing:

- **CHADD™ Suite**: Universal diagnostic intelligence across 16+ domains
- **Creative Technology Suite**: Rhapsode, Harmonia, and Production Desk
- Company information, philosophy, and governance
- Product documentation and marketing materials

## Philosophy

Guided by **Ma'at**—Balance, Unity, Harmony:

- ⚖️ **Balance**: Scientific rigor balanced with creative innovation
- 🌐 **Unity**: Universal framework unifies diagnostics across all domains
- 🎵 **Harmony**: Tools serve people, creating harmony between technology and human judgment

> "Tools serve people, profits follow innovation"

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom React components
- **SEO**: Comprehensive meta tags, structured data, sitemap
- **PWA**: Progressive Web App support
- **Accessibility**: WCAG 2.1 AA compliance with SiteLint integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/imediacorp/imediacorp-web-2.0.git
cd imediacorp-web-2.0

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend API (if using)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm test` - Run tests

### Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Marketing pages
│   │   ├── dashboards/         # CHADD dashboard pages
│   │   └── docs/               # Documentation pages
│   ├── components/             # React components
│   │   ├── marketing/         # Marketing components
│   │   ├── dashboard/         # Dashboard components
│   │   └── accessibility/     # Accessibility components
│   └── lib/                    # Utilities and helpers
│       ├── seo.ts             # SEO utilities
│       └── content/           # Content data
├── public/                     # Static assets
├── scripts/                      # Build scripts
└── .github/                    # GitHub workflows
```

## Deployment

### Automated Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically deploys to mtech.mt when changes are pushed to the `main` branch.

**Required GitHub Secrets**:
- `DEPLOY_HOST` - Server hostname
- `DEPLOY_USER` - SSH username
- `DEPLOY_PATH` - Deployment directory
- `DEPLOY_SSH_KEY` - Private SSH key
- `NEXT_PUBLIC_SITE_URL` - Production site URL
- `NEXT_PUBLIC_API_URL` - Backend API URL (if applicable)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using the deployment script
./scripts/deploy.sh production
```

## Features

### Marketing Pages

- **Homepage**: Hero section, value proposition, product overview
- **Products**: CHADD Suite and Creative Technology products
- **Services**: SaaS, Enterprise, OEM, Consulting
- **About**: Company information, philosophy, governance
- **Contact**: Contact form and information
- **Blog**: Content structure (ready for posts)

### SEO

- Comprehensive meta tags
- Structured data (JSON-LD) for Organization, Products, Services
- Auto-generated sitemap.xml
- robots.txt configuration
- Open Graph and Twitter Card tags

### Accessibility

- WCAG 2.1 AA compliance
- SiteLint integration for accessibility monitoring
- Keyboard navigation support
- Screen reader optimization
- Skip to main content link

### Performance

- Image optimization
- Code splitting
- Lazy loading
- Compression enabled
- Core Web Vitals optimization

## Contributing

This is a public repository for the imediacorp.com website. Contributions are welcome!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier (if configured)
- Write meaningful commit messages
- Add comments for complex logic
- Follow Next.js conventions

## License

Copyright © 2025 Intermedia Communications Corp. All rights reserved.

This website code is provided for public viewing and contribution. The underlying CHADD technology, methodologies, and proprietary algorithms remain the intellectual property of Intermedia Communications Corp.

For licensing inquiries regarding CHADD technology, please contact:
- Email: contact@imediacorp.com
- Website: https://imediacorp.com/contact

## Support

- **Website**: https://imediacorp.com
- **Contact**: https://imediacorp.com/contact
- **Documentation**: https://imediacorp.com/docs/chadd-methodology

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Accessibility monitoring by [SiteLint](https://sitelint.com)

---

**Intermedia Communications Corp**  
Guided by Ma'at—Balance, Unity, Harmony
