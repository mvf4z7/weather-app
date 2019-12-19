import React, { Component } from "react";

import Config from "./config";
import WeatherService from "./weather-service";

import "./App.css";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);

class App extends Component {
  state = {
    currentWeather: null
  };

  async componentDidMount() {
    const currentWeather = await weatherService.getCurrentByCityName("Detroit");
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
