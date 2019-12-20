import { Geolocation } from "../geolocation-service";

export interface CurrentWeather {
  iconURL: string | null;
  location: {
    coordinates: Geolocation;
    name: string;
  };
  temperature: {
    current: number;
    high: number;
    low: number;
  };
  timestamp: Date;
}
