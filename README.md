# Recipe Book Full-Stack App

## Overview

This project consists of two separate applications:

- **Backend (be/):** Node.js (Express) + TypeScript
- **Frontend (fe/):** Next.js + TypeScript + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd be
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `be` folder:
   ```env
   BASE_URL=https://www.themealdb.com/api/json/v1/1/
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd fe
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the `fe` folder:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/
   ```
4. Start the frontend server:
   ```sh
   npm run dev
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000)

## Linting & Formatting

- Both projects use ESLint and Prettier for code quality.
- Run `npx eslint .` and `npx prettier --write .` in each folder to lint and format code.

## Project Structure

- `be/` - Backend (Express.js + TypeScript)
- `fe/` - Frontend (Next.js + Tailwind CSS)

## API Reference

- The backend proxies and filters data from [TheMealDB API](https://www.themealdb.com/api.php).

## License

RRV
