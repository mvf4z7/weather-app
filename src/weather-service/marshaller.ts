import { CurrentWeather, Forecast } from "./types";
import { strict } from "assert";
import { string, number } from "prop-types";

export type CurrentWeatherDTO = {
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
};

export function unmarshalCurrentWeather(
  dto: CurrentWeatherDTO
): CurrentWeather {
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

export type ForecastDTO = {
  city: {
    coord: {
      lon: number;
      lat: number;
    };
    name: string;
  };
  list: Array<{
    dt_txt: string; // 2019-12-21 00:00:00"
    main: {
      temp: number;
    };
  }>;
};

export function unmarshallForecast(dto: ForecastDTO): Forecast {
  const dates: string[] = [];
  const tempsByDate: number[][] = [];

  dto.list.forEach(forecast => {
    const [currentDate, _] = forecast.dt_txt.split(" ");
    const currentTemp = forecast.main.temp;

    const lastDate = dates[dates.length - 1];
    const lastDateTemps = tempsByDate[tempsByDate.length - 1];

    if (currentDate !== lastDate) {
      dates.push(currentDate);
      tempsByDate.push([currentTemp]);
    } else {
      lastDateTemps.push(currentTemp);
    }
  });

  const highsAndLows = tempsByDate.map<{ high: number; low: number }>(temps => {
    const high = Math.max(...temps);
    const low = Math.min(...temps);
    return { high, low };
  });

  const days = dates.map<{
    temperature: { high: number; low: number };
    timestamp: Date;
  }>((dateStr, idx) => {
    const temperature = highsAndLows[idx];
    return { temperature, timestamp: new Date(dateStr) };
  });

  return {
    location: {
      coordinates: {
        latitude: dto.city.coord.lat,
        longitude: dto.city.coord.lon
      },
      name: dto.city.name
    },
    days
  };
}
