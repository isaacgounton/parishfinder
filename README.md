# Parish Finder

A web application for finding and managing church parish information. Built with modern web technologies and powered by Google Maps/Places API for accurate location data.

## Features

- 🔍 Search parishes by location or name
- 🗺️ Integrated Google Maps/Places API
- 💾 Save and edit parish information
- 👤 User authentication (Google & Email)
- 📱 Responsive design for all devices
- 📖 Search history tracking
- 🔄 Real-time updates
- 🌐 Worldwide parish database

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Database & Auth:** Firebase
- **Location Services:** Google Maps/Places API
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Firebase account
- Google Cloud account with Maps API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parish-finder.git
cd parish-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

### Development

Run the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginPage.tsx   # Authentication UI
│   ├── ParishCard.tsx  # Parish information display
│   ├── ParishForm.tsx  # Parish editing form
│   ├── SearchBar.tsx   # Search interface
│   └── SearchHistory.tsx# Recent searches
├── lib/                # Core functionality
│   ├── firebase.ts     # Firebase configuration
│   ├── database.ts     # Database operations
│   ├── places.ts       # Google Places API
│   └── mapsLoader.ts   # Maps API loader
└── types/              # TypeScript definitions
    ├── parish.ts       # Parish interface
    └── auth.ts         # Auth types
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email & Google)
3. Create a Realtime Database
4. Set up security rules:

```json
{
  "rules": {
    "parishes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "searchHistory": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Maps Platform
- Firebase team
- React community
- Tailwind CSS team