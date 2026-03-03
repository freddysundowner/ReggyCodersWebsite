# Reggycodas - Modern Technology Company Website

## Overview

This is a modern, responsive company website for Reggycodas, a technology company founded by Fredrick Mundia Githumbi in Kenya. The application is built as a full-stack web application featuring a React frontend with TypeScript and Express.js backend, showcasing the company's software products and startup incubation services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Comprehensive component library using Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development Server**: Custom Vite integration for SSR-like development experience
- **API Structure**: RESTful API with `/api` prefix routing

### Database & Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for PostgreSQL (Neon Database serverless)
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Key Components

### Frontend Components
1. **Navigation**: Fixed header with smooth scrolling navigation
2. **Hero Section**: Company introduction with call-to-action buttons
3. **Products Section**: Fetches products from database API, with hardcoded fallback
4. **About Section**: Company story and founder information
5. **Startups Section**: Startup incubation services
6. **Contact Section**: Contact form submitting to API
7. **Footer**: Company links and social media placeholders
8. **Admin Login** (`/admin/login`): Secure admin authentication
9. **Admin Dashboard** (`/admin`): Manage products and view contact messages

### Backend Components
1. **Route Handler**: API routes for products CRUD, contacts, and authentication
2. **Storage Layer**: PostgreSQL-backed storage via Drizzle ORM
3. **Authentication**: Passport.js with local strategy, session-based auth with connect-pg-simple
4. **Vite Integration**: Development server with HMR support
5. **Request Logging**: Comprehensive API request logging middleware

### Database Schema
- **Users Table**: Admin authentication (username/hashed password)
- **Contacts Table**: Contact form submissions with timestamps
- **Products Table**: Website products with name, description, icon, image, tags, color, link, sort order
- **Type Safety**: Drizzle-generated types with Zod validation schemas

### Admin Panel
- **URL**: `/admin/login` → `/admin`
- **Default credentials**: username: `admin`, password: `admin123`
- **Features**: Add/edit/delete products, view/delete contact messages

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express.js routes handle business logic
3. **Data Persistence**: Storage interface manages database operations
4. **Response Handling**: Type-safe responses with error handling
5. **UI Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **UI Framework**: Radix UI component primitives
- **Icons**: Lucide React icon library
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer
- **Development Features**: Runtime error overlay and cartographer plugins

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Public assets served from build directory
4. **Environment Variables**: Database URL and other config via environment

### Production Configuration
- **Server**: Express.js serves both API routes and static frontend
- **Database**: PostgreSQL connection via environment variable
- **Asset Serving**: Static file serving for production builds
- **Error Handling**: Comprehensive error middleware with proper status codes

### Development Workflow
- **Hot Reload**: Vite HMR for frontend development
- **API Proxy**: Development server proxies API calls to Express backend
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: Shared types between frontend and backend via `shared/` directory

## Changelog

Changelog:
- June 29, 2025. Initial setup
- March 3, 2026. Added admin panel with authentication, product management (CRUD from database), and contact message viewing. Switched from in-memory to PostgreSQL storage.

## User Preferences

Preferred communication style: Simple, everyday language.