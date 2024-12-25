export interface Parish {
  id: string;          // Format: -OEw3zq2S7xU_3g9j_qb
  name: string;
  address: {
    city: string;
    country: string;   // Format: "NG", "US", etc.
    postalCode: string;
    province: string;  // Format: "TX 75243"
    street: string;    // Full street address
  };
  description: string; // Full formatted address
  leaderName?: string;
  phone: string;
  email: string;
  website: string;
  latitude: number;
  longitude: number;
  openingHours: Record<string, string>;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  importSource: 'google_places' | 'manual';
  sourceId: string;
}