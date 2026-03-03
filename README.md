# Reggycodas - Technology Company Website

A modern, responsive company website for **Reggycodas**, a technology company founded by Fredrick Mundia Githumbi in Kenya. Features a full content management system (CMS) for managing products, blog posts, SEO settings, social links, and contact messages.

## Features

- **Company Website** - Hero section, product showcase, about, startups, and contact form
- **Blog** - Public blog with listing and individual post pages
- **Admin CMS** - Full content management panel with sidebar navigation
  - Product management (add, edit, delete)
  - Blog post management (draft/publish workflow)
  - Contact message viewer
  - SEO settings per page (server-side injected for Google)
  - Social media link management
- **Server-Side SEO** - Meta tags injected into HTML before reaching the browser
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reggycodas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   SESSION_SECRET=your-secret-key-here
   ```

   - `DATABASE_URL` (required) - Your PostgreSQL connection string
   - `SESSION_SECRET` (optional) - Secret for session encryption. A random one is generated if not set.

4. **Push the database schema**

   ```bash
   npm run db:push
   ```

   This creates all the required tables in your database.

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build for production (frontend + backend) |
| `npm start` | Start the production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push schema changes to the database |

## Project Structure

```
├── client/                  # Frontend (React)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (home, blog, admin)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities (API client, query config)
│   └── index.html           # HTML template
├── server/                  # Backend (Express)
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database operations
│   ├── auth.ts              # Authentication logic
│   ├── db.ts                # Database connection
│   └── vite.ts              # Vite dev server integration
├── shared/                  # Shared code (frontend + backend)
│   └── schema.ts            # Database schema and TypeScript types
└── package.json
```

## Admin Panel

Access the admin panel at `/admin/login`.

**Default credentials:**
- Username: `admin`
- Password: `admin123`

The admin panel lets you manage:
- **Products** - Add, edit, and delete product listings
- **Blog Posts** - Create posts, save as draft or publish
- **Contact Messages** - View and manage form submissions
- **SEO Settings** - Set page titles, descriptions, and keywords for each page
- **Social Links** - Add URLs for your social media profiles (only links with URLs show on the site)

## Products Showcased

- Pointify POS ([pointifypos.com](https://pointifypos.com))
- Bankykit ([bankykit.com](https://bankykit.com))
- MediCare
- Shambakit
- Listing App
- Tokshop App ([tokshoplive.com](https://tokshoplive.com))

## Production Build

```bash
npm run build
npm start
```

The build process compiles the React frontend with Vite and bundles the Express backend with esbuild. The production server serves both the API and static frontend on a single port.

## License

MIT
