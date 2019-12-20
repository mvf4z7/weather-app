import { IGeolocation } from "../geolocation-service";
import Requester from "./requester";

class WeatherService {
  request: any;

  constructor(apiKey: string) {
    this.request = new Requester(apiKey);
  }

  async getCurrentByCityName(cityName: string): Promise<object> {
    const currentWeather = await this.request.get("/weather", {
      q: cityName,
      units: "imperial"
    });

    return currentWeather;
  }

  async getCurrentByGeolocation(geolocation: IGeolocation): Promise<object> {
    const currentWeather = await this.request.get("/weather", {
      lat: geolocation.latitude,
      lon: geolocation.longitude,
      units: "imperial"
    });

    return currentWeather;
  }
}

export default WeatherService;
