export {};

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    gm_authFailure: () => void;
  }
}

declare namespace google.maps.places {
  class Autocomplete {
    constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
    addListener(eventName: string, handler: () => void): void;
    getPlace(): Place;
  }

  interface AutocompleteOptions {
    types?: string[];
  }

  interface Place {
    formatted_address: string;
    geometry?: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
    name?: string;
    place_id?: string;
    rating?: number;
    types?: string[];
    vicinity?: string;
  }
}

declare namespace google.maps.event {
  function clearInstanceListeners(instance: any): void;
} 