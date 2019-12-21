import { CurrentWeather, Forecast } from "./types";
import { strict } from "assert";
import { string, number } from "prop-types";
import { findMostCommonElement } from "../utils/list-utils";

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
    iconURL: iconToURL(icon),
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
    weather: Array<{
      icon: string;
    }>;
  }>;
};

export function unmarshallForecast(dto: ForecastDTO): Forecast {
  const dates: string[] = [];
  const tempsByDate: number[][] = [];
  const weatherIconsByDate: string[][] = [];

  dto.list.forEach(forecast => {
    const [currentDate, _] = forecast.dt_txt.split(" ");
    const currentTemp = forecast.main.temp;
    const currentWeatherIcons = forecast.weather.map(weather => weather.icon);

    const lastDate = dates[dates.length - 1];
    const lastDateTemps = tempsByDate[tempsByDate.length - 1];
    const lasteDateWeatherIcons =
      weatherIconsByDate[weatherIconsByDate.length - 1];

    if (currentDate !== lastDate) {
      dates.push(currentDate);
      tempsByDate.push([currentTemp]);
      weatherIconsByDate.push(currentWeatherIcons);
    } else {
      lastDateTemps.push(currentTemp);
      lasteDateWeatherIcons.push(...currentWeatherIcons);
    }
  });

  // Do a sanity check here
  const allArraysEqualLength = [
    dates.length,
    tempsByDate.length,
    weatherIconsByDate.length
  ].every((value, idx, array) => value === array[idx]);
  if (!allArraysEqualLength) {
    throw new Error("Woops, something went wrong");
  }

  const highsAndLows = tempsByDate.map<{ high: number; low: number }>(temps => {
    const high = Math.max(...temps);
    const low = Math.min(...temps);
    return { high, low };
  });

  const mostFrequentWeatherIcons = weatherIconsByDate.map(singleDaysIcons =>
    findMostCommonElement(singleDaysIcons)
  );

  const days = dates.map<{
    temperature: { high: number; low: number };
    timestamp: Date;
    iconURL: string | null;
  }>((dateStr, idx) => {
    const temperature = highsAndLows[idx];
    const icon = mostFrequentWeatherIcons[idx];
    return {
      temperature,
      timestamp: new Date(dateStr),
      iconURL: iconToURL(icon)
    };
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

function iconToURL(icon: string | null): string | null {
  if (icon == null) {
    return null;
  }

  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}
