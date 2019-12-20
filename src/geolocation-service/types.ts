export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface IGeolocationService {
  getCurrentPosition(): Promise<Geolocation>;
}
