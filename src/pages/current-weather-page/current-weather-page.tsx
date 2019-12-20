import React, { Component } from "react";

import { Geolocation } from "../../geolocation-service";
import LoadingIndicator from "../../components/LoadingIndicator";
import WeatherService, { CurrentWeather } from "../../weather-service";

import "./current-weather-page.css";

type Props = {
  currentPosition: Geolocation | null;
  weatherService: WeatherService;
};

type State = {
  loading: boolean;
  currentWeather: CurrentWeather | null;
  errored: boolean;
};

class CurrentWeatherPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      currentWeather: null,
      errored: false
    };
  }

  async componentDidMount() {
    const { currentPosition, weatherService } = this.props;

    if (currentPosition === null) {
      return;
    }

    try {
      const currentWeather = await weatherService.getCurrentByGeolocation(
        currentPosition
      );
      this.setState({ loading: false, currentWeather });
    } catch (error) {
      this.setState({ loading: false, errored: true });
    }
  }

  render() {
    const { currentWeather, errored, loading } = this.state;

    return (
      <>
        <h1>Current Weather</h1>
        {loading && <LoadingIndicator />}
        {!loading && errored && (
          <div>Oh no, somethign went wrong! Please refresh the page.</div>
        )}
        {!loading && currentWeather && (
          <div>
            <h2>Location: {currentWeather.location.name}</h2>
            <div className="CurrentWeatherPage__current-weather-container">
              {currentWeather.iconURL && (
                <img src={currentWeather.iconURL} alt="currentWeather" />
              )}
              <span>Temperature: {currentWeather.temperature.main} F</span>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default CurrentWeatherPage;
