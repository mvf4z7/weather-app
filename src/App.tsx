import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import Config from "./config";
import WeatherService, { CurrentWeather } from "./weather-service";
import { GeolocationService } from "./geolocation-service";
import NavBar from "./components/NavBar";

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
      <Router>
        <div>
          <NavBar
            title="Weather App"
            items={[
              { text: "Current", path: "/", exact: true },
              { text: "Forecast", path: "/forecast" }
            ]}
          />

          <div>
            {currentWeather.iconURL ? (
              <img src={currentWeather.iconURL} alt="currentWeather" />
            ) : null}
            <pre>{JSON.stringify(currentWeather, null, 2)}</pre>
          </div>

          <Switch>
            <Route path="/" exact>
              <div>Current Page</div>
            </Route>
            <Route path="/forecast">
              <div>Forecast</div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
