export interface IGeolocation {
  latitude: number;
  longitude: number;
}

export interface IGeolocationService {
  getCurrentPosition(): Promise<IGeolocation>;
}
