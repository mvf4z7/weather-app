import { Geolocation } from "../geolocation-service";
import { CurrentWeatherDTO, unmarshal } from "./marshaller";
import Requester from "./requester";
import { CurrentWeather } from "./types";

class WeatherService {
  request: Requester;

  constructor(apiKey: string) {
    this.request = new Requester(apiKey);
  }

  async getCurrentByCityName(cityName: string): Promise<CurrentWeather> {
    const dto: CurrentWeatherDTO = await this.request.get("/weather", {
      q: cityName,
      units: "imperial"
    });

    return unmarshal(dto);
  }

  async getCurrentByGeolocation(
    geolocation: Geolocation
  ): Promise<CurrentWeather> {
    const dto: CurrentWeatherDTO = await this.request.get("/weather", {
      lat: geolocation.latitude,
      lon: geolocation.longitude,
      units: "imperial"
    });

    return unmarshal(dto);
  }
}

export default WeatherService;
