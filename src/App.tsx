import React, { Component } from "react";

import Config from "./config";
import WeatherService from "./weather-service";
import { GeolocationService } from "./geolocation-service";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

class App extends Component<{}, {}> {
  state = {
    currentWeather: null,
    currentPositon: null
  };

  async componentDidMount() {
    const currentPosition = await geoLocationService.getCurrentPosition();
    const currentWeather = await weatherService.getCurrentByGeolocation(
      currentPosition
    );

    this.setState({ currentWeather });
  }

  render() {
    const { currentWeather } = this.state;

    return (
      <div>
        <header>Weather App</header>
        {currentWeather ? (
          <div>
            <pre>{JSON.stringify(currentWeather, null, 2)}</pre>
          </div>
        ) : (
          <div>loading</div>
        )}
      </div>
    );
  }
}

export default App;
