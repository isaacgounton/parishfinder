import type { Parish } from '../types/parish';
import { loadGoogleMaps } from './mapsLoader';

let placesService: google.maps.places.PlacesService | null = null;

export const initPlacesService = async () => {
  const maps = await loadGoogleMaps();
  if (!placesService) {
    const mapDiv = document.createElement('div');
    document.body.appendChild(mapDiv); // Maps needs the div to be in the DOM
    const map = new maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });
    placesService = new maps.places.PlacesService(map);
    mapDiv.style.display = 'none'; // Hide the map div since we don't need to show it
  }
  return placesService;
};

const parseOpeningHours = (hours: google.maps.places.PlaceOpeningHours | undefined) => {
  if (!hours?.weekday_text) return {};
  return hours.weekday_text.reduce((acc, day) => {
    const [name, time] = day.split(': ');
    return { ...acc, [name]: time };
  }, {});
};

const parseAddress = (place: google.maps.places.PlaceResult) => {
  const components = place.address_components || [];
  const address = {
    street: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  };

  let postalCode = '';

  components.forEach(component => {
    const types = component.types;
    if (types.includes('street_number') || types.includes('route')) {
      address.street += `${component.long_name} `;
    } else if (types.includes('locality')) {
      address.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      address.province = component.short_name;
    } else if (types.includes('country')) {
      address.country = component.short_name; // Using short_name for "US", "NG" format
    } else if (types.includes('postal_code')) {
      postalCode = component.long_name;
      address.postalCode = component.long_name;
    }
  });

  address.street = address.street.trim();
  // Combine province and postal code in the expected format
  address.province = `${address.province} ${postalCode}`.trim();

  return address;
};

export const searchParishes = async (query: string): Promise<Parish[]> => {
  const service = await initPlacesService();
  
  return new Promise((resolve, reject) => {
    const request: google.maps.places.TextSearchRequest = {
      query: `${query} church parish`,
      type: 'church',
    };

    service.textSearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        reject(new Error('Places API request failed'));
        return;
      }

      const placePromises = results.map(result => {
        if (!result.place_id || !result.name || !result.geometry?.location) {
          return Promise.reject(new Error('Invalid place data'));
        }

        return new Promise<Parish>((resolvePlace, rejectPlace) => {
          service.getDetails(
            { 
              placeId: result.place_id!,
              fields: ['address_components', 'formatted_address', 'formatted_phone_number', 'website', 'opening_hours', 'photos']
            },
            (place, detailStatus) => {
              if (detailStatus !== google.maps.places.PlacesServiceStatus.OK) {
                rejectPlace(new Error('Place details request failed'));
                return;
              }

              const address = parseAddress(place!);
              const parish: Parish = {
                id: `-${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`, // Generate Firebase-like ID
                name: result.name!,
                address,
                description: place?.formatted_address || '',
                leaderName: '',
                phone: place?.formatted_phone_number || '',
                email: '',
                website: place?.website || '',
                latitude: result.geometry!.location!.lat(),
                longitude: result.geometry!.location!.lng(),
                openingHours: parseOpeningHours(place?.opening_hours),
                photos: place?.photos?.map(photo => photo.getUrl()) || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                importSource: 'google_places',
                sourceId: result.place_id!
              };

              resolvePlace(parish);
            }
          );
        });
      });

      Promise.all(placePromises)
        .then(resolve)
        .catch(reject);
    });
  });
};