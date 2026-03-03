# Reggycodas Website - Installation Guide

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) 14 or higher

## 1. Clone and Install

```bash
git clone <repository-url>
cd reggycodas
npm install
```

## 2. Set Up PostgreSQL Database

If you don't have PostgreSQL installed, install it first:

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)

### Create the database

```bash
sudo -u postgres psql
```

Then in the PostgreSQL shell:

```sql
CREATE USER reggycodas WITH PASSWORD 'your_password';
CREATE DATABASE reggycodas_db OWNER reggycodas;
GRANT ALL PRIVILEGES ON DATABASE reggycodas_db TO reggycodas;
\q
```

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://reggycodas:your_password@localhost:5432/reggycodas_db
SESSION_SECRET=any-random-string-here
```

Replace `your_password` with the password you set above.

`SESSION_SECRET` is optional. If not set, a random one is generated automatically.

## 4. Create Database Tables

```bash
npm run db:push
```

This reads the schema from `shared/schema.ts` and creates all the required tables in your database. The tables created are:

- `users` - Admin accounts
- `contacts` - Contact form submissions
- `products` - Product listings
- `blog_posts` - Blog content
- `seo_settings` - SEO meta tags per page
- `social_links` - Social media links
- `session` - Login sessions

## 5. Start the App

**Development:**
```bash
npm run dev
```
Runs on `http://localhost:5000` with hot reload.

**Production:**
```bash
npm run build
npm start
```

## 6. Default Admin Login

Once the app starts, it automatically seeds a default admin account.

- URL: `http://localhost:5000/admin/login`
- Username: `admin`
- Password: `admin123`

Change these credentials after your first login.

## Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:push` | Sync database schema |
| `npm run check` | TypeScript type check |
