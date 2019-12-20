import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Config from "./config";
import CurrentWeatherPage from "./pages/current-weather-page";
import { GeolocationService, Geolocation } from "./geolocation-service";
import NavBar from "./components/NavBar";
import WeatherService, { CurrentWeather } from "./weather-service";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

interface Props {}
interface State {
  currentPosition: Geolocation | null;
  currentWeather: CurrentWeather | null;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPosition: null,
      currentWeather: null
    };
  }

  async componentDidMount() {
    const currentPosition = await geoLocationService.getCurrentPosition();
    const currentWeather = await weatherService.getCurrentByGeolocation(
      currentPosition
    );

    this.setState({ currentWeather, currentPosition });
  }

  render() {
    const { currentPosition, currentWeather } = this.state;

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

          <main>
            <Switch>
              <Route path="/" exact>
                <CurrentWeatherPage
                  currentPosition={currentPosition}
                  weatherService={weatherService}
                />
              </Route>
              <Route path="/forecast">
                <div>Forecast</div>
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
