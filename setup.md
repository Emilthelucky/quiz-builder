# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Database Setup
1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE quiz_builder;
   ```

2. Create `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/quiz_builder?schema=public"
   PORT=20001
   ```

## Backend Setup
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
npm start
```

## If you encounter dependency conflicts:
```bash
cd frontend
npm install --legacy-peer-deps
```

## Access the application:
- Frontend: http://localhost:20003
- Backend API: http://localhost:20001

## Create sample data (optional):
```bash
cd backend
npm run db:seed
```
