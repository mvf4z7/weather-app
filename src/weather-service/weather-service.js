import Requester from "./requester";

class WeatherService {
  constructor(apiKey) {
    this.request = new Requester(apiKey);
  }

  async getCurrentByCityName(cityName) {
    const currentWeather = await this.request.get("/weather", {
      q: cityName,
      units: "imperial"
    });

    return currentWeather;
  }
}

export default WeatherService;
