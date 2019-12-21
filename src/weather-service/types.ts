import { Geolocation } from "../geolocation-service";

export interface CurrentWeather {
  iconURL: string | null;
  location: {
    coordinates: Geolocation;
    name: string;
  };
  temperature: {
    main: number;
    high: number;
    low: number;
  };
  timestamp: Date;
}

export interface Forecast {
  location: {
    coordinates: Geolocation;
    name: string;
  };
  days: Array<{
    temperature: {
      high: number;
      low: number;
    };
    timestamp: Date;
  }>;
}
