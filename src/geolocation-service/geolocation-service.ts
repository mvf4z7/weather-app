import { Geolocation, IGeolocationService } from "./types";

class GeolocationService implements IGeolocationService {
  getCurrentPosition(): Promise<Geolocation> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        geolocationPosition => {
          const geolocation = {
            latitude: geolocationPosition.coords.latitude,
            longitude: geolocationPosition.coords.longitude
          };
          resolve(geolocation);
        },
        () => reject(new Error("Unable to get user's location"))
      );
    });
  }
}

export default GeolocationService;
