import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Config from "./config";
import CurrentWeatherPage from "./pages/CurrentWeatherPage";
import ForecastPage from "./pages/ForecastPage";
import { GeolocationService, Geolocation } from "./geolocation-service";
import NavBar from "./components/NavBar";
import WeatherService from "./weather-service";
import LoadingIndicator from "./components/LoadingIndicator";

const weatherService = new WeatherService(Config.OpenWeatherAPIKey);
const geoLocationService = new GeolocationService();

type Props = {};
type State = {
  currentPosition: Geolocation | null;
  currentPositionRequestState: CurrentPositionRequestState;
};

enum CurrentPositionRequestState {
  Uninitialized,
  Requesting,
  Success,
  Fail
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPosition: null,
      currentPositionRequestState: CurrentPositionRequestState.Uninitialized
    };
  }

  async componentDidMount() {
    try {
      this.setState({
        currentPositionRequestState: CurrentPositionRequestState.Requesting
      });
      const currentPosition = await geoLocationService.getCurrentPosition();
      this.setState({
        currentPosition,
        currentPositionRequestState: CurrentPositionRequestState.Success
      });
    } catch (error) {
      this.setState({
        currentPositionRequestState: CurrentPositionRequestState.Fail,
        currentPosition: null
      });
    }
  }

  render() {
    const { currentPosition, currentPositionRequestState } = this.state;

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
          {currentPositionRequestState ===
            CurrentPositionRequestState.Requesting && <LoadingIndicator />}
          {currentPositionRequestState === CurrentPositionRequestState.Fail && (
            <p>
              Yikes, we were not able to fetch your location! Make sure you have
              location services enabled in order to use this app.
            </p>
          )}
          {currentPositionRequestState ===
            CurrentPositionRequestState.Success &&
            currentPosition && (
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
