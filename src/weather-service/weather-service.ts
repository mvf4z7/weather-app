import { Geolocation } from "../geolocation-service";
import {
  CurrentWeatherDTO,
  unmarshalCurrentWeather,
  unmarshallForecast,
  ForecastDTO
} from "./marshaller";
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

    return unmarshalCurrentWeather(dto);
  }

  async getCurrentByGeolocation(
    geolocation: Geolocation
  ): Promise<CurrentWeather> {
    const dto: CurrentWeatherDTO = await this.request.get("/weather", {
      lat: geolocation.latitude,
      lon: geolocation.longitude,
      units: "imperial"
    });

    return unmarshalCurrentWeather(dto);
  }

  async getForecastByGeolocation(geolocation: Geolocation): Promise<Object> {
    const dto: ForecastDTO = await this.request.get("/forecast", {
      lat: geolocation.latitude,
      lon: geolocation.longitude,
      units: "imperial"
    });

    return unmarshallForecast(dto);
  }
}

export default WeatherService;
