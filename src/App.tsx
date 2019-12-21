import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Config from "./config";
import CurrentWeatherPage from "./pages/current-weather-page";
import ForecastPage from "./pages/forecast-page";
import { GeolocationService, Geolocation } from "./geolocation-service";
import NavBar from "./components/NavBar";
import WeatherService from "./weather-service";
import LoadingIndicator from "./components/LoadingIndicator";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

type Props = {};
type State = {
  currentPosition: Geolocation | null;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPosition: null
    };
  }

  async componentDidMount() {
    const currentPosition = await geoLocationService.getCurrentPosition();
    this.setState({ currentPosition });
  }

  render() {
    const { currentPosition } = this.state;

    return (
      <Router>
        <NavBar
          title="Weather App"
          items={[
            { text: "Current", path: "/", exact: true },
            { text: "Forecast", path: "/forecast" }
          ]}
        />

        <main>
          {currentPosition === null && <LoadingIndicator />}
          {currentPosition && (
            <Switch>
              <Route path="/" exact>
                <CurrentWeatherPage
                  currentPosition={currentPosition}
                  weatherService={weatherService}
                />
              </Route>
              <Route path="/forecast">
                <ForecastPage
                  currentPosition={currentPosition}
                  weatherService={weatherService}
                />
              </Route>
            </Switch>
          )}
        </main>
      </Router>
    );
  }
}

export default App;
