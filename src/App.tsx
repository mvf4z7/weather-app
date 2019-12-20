import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Config from "./config";
import CurrentWeatherPage from "./pages/current-weather-page";
import ForecastPage from "./pages/forecast-page";
import { GeolocationService, Geolocation } from "./geolocation-service";
import NavBar from "./components/NavBar";
import WeatherService, { CurrentWeather } from "./weather-service";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

interface Props {}
interface State {
  currentPosition: Geolocation | null;
}

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
        <div>
          <NavBar
            title="Weather App"
            items={[
              { text: "Current", path: "/", exact: true },
              { text: "Forecast", path: "/forecast" }
            ]}
          />

          <main>
            <Switch>
              <Route path="/" exact>
                <CurrentWeatherPage
                  currentPosition={currentPosition}
                  weatherService={weatherService}
                />
              </Route>
              <Route path="/forecast">
                <ForecastPage />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
