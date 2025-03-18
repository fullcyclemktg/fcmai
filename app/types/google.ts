export interface GooglePlace {
  formatted_address: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name?: string;
  place_id?: string;
  rating?: number;
  types?: string[];
  vicinity?: string;
} 