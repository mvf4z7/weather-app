import React, { Component } from "react";

import Config from "./config";
import WeatherService, { CurrentWeather } from "./weather-service";
import { GeolocationService } from "./geolocation-service";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

interface Props {}
interface State {
  currentWeather: CurrentWeather | null;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentWeather: null
    };
  }

  async componentDidMount() {
    const currentPosition = await geoLocationService.getCurrentPosition();
    const currentWeather = await weatherService.getCurrentByGeolocation(
      currentPosition
    );

    this.setState({ currentWeather });
  }

  render() {
    const { currentWeather } = this.state;

    if (currentWeather === null) {
      return <div>loading</div>;
    }

    return (
      <div>
        <header>Weather App</header>
        <div>
          {currentWeather.iconURL ? <img src={currentWeather.iconURL} /> : null}
          <pre>{JSON.stringify(currentWeather, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default App;
