import { CurrentWeather } from "./types";

export interface CurrentWeatherDTO {
  coord: {
    lon: number;
    lat: number;
  };
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  name: string;
  weather: Array<{ icon: string }>;
}

export function unmarshal(dto: CurrentWeatherDTO): CurrentWeather {
  const icon = dto.weather.map(w => w.icon)[0] || null;

  return {
    iconURL: icon ? `http://openweathermap.org/img/wn/${icon}@2x.png` : null,
    location: {
      coordinates: {
        latitude: dto.coord.lat,
        longitude: dto.coord.lon
      },
      name: dto.name
    },
    temperature: {
      main: dto.main.temp,
      high: dto.main.temp_max,
      low: dto.main.temp_min
    },
    timestamp: new Date(dto.dt * 1000)
  };
}
