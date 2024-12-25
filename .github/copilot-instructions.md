# Project Instructions

This is a Church Finder application built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase
- Google Maps/Places API

## Key Components
- ParishCard: Displays individual parish information
- ParishForm: Handles parish creation/editing
- SearchBar: Enables parish search functionality

## Important Files
- src/lib/firebase.ts: Firebase configuration
- src/lib/database.ts: Database operations
- src/lib/places.ts: Google Places API integration
- src/types/parish.ts: Parish type definitions

## Coding Standards
1. Use TypeScript strict mode
2. Follow React hooks best practices
3. Implement proper error handling
4. Use Tailwind CSS for styling
5. Use Lucide React for icons
6. Maintain proper component structure
7. Implement responsive design

## Environment Variables Required
- VITE_GOOGLE_MAPS_API_KEY
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
- VITE_FIREBASE_DATABASE_URL
- VITE_GOOGLE_MAPS_ID

## Build Commands
- npm run dev: Start development server
- npm run build: Build for production
- npm run lint: Run ESLint
- npm run preview: Preview production build