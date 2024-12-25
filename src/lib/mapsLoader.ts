declare global {
  interface Window {
    initMap: () => void;
  }
}

let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<typeof google.maps> | null = null;

export const loadGoogleMaps = (): Promise<typeof google.maps> => {
  if (isLoaded) return Promise.resolve(google.maps);
  if (loadPromise) return loadPromise;
  if (isLoading) return new Promise<typeof google.maps>((resolve) => {
    const checkLoaded = setInterval(() => {
      if (isLoaded && window.google?.maps) {
        clearInterval(checkLoaded);
        resolve(google.maps);
      }
    }, 100);
  });

  isLoading = true;
  loadPromise = new Promise<typeof google.maps>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;

    script.onload = () => {
      if (window.google?.maps) {
        isLoaded = true;
        isLoading = false;
        resolve(google.maps);
      } else {
        reject(new Error('Google Maps failed to load'));
      }
    };

    script.onerror = (error) => {
      isLoading = false;
      loadPromise = null;
      reject(error);
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
