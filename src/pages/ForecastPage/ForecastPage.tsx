import React, { Component } from "react";

import { Geolocation } from "../../geolocation-service";
import WeatherService, { Forecast } from "../../weather-service";
import LoadingIndicator from "../../components/LoadingIndicator";
import ForecastDay from "./ForecastDay";

import "./ForecastPage.css";

type Props = {
  currentPosition: Geolocation | null;
  weatherService: WeatherService;
};

type State = {
  errored: boolean;
  forecast: Forecast | null;
  loading: boolean;
};

class ForecastPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      errored: false,
      loading: true,
      forecast: null
    };
  }

  async componentDidMount() {
    const { currentPosition, weatherService } = this.props;

    if (currentPosition === null) {
      return;
    }

    try {
      const forecast = await weatherService.getForecastByGeolocation(
        currentPosition
      );
      this.setState({ loading: false, errored: false, forecast });
    } catch (error) {
      this.setState({ loading: false, errored: true, forecast: null });
    }
  }

  render() {
    const { errored, forecast, loading } = this.state;

    return (
      <>
        <h1>5 Day Forecast</h1>
        {loading && <LoadingIndicator />}

        {!loading && errored && (
          <div>Oh no, somethign went wrong! Please refresh the page.</div>
        )}

        {!loading && forecast && (
          <>
            <h2>Location: {forecast.location.name}</h2>
            <div className="ForecastPage__ForecastDays">
              {forecast.days.map(day => (
                <ForecastDay key={day.timestamp.toJSON()} day={day} />
              ))}
            </div>
          </>
        )}
      </>
    );
  }
}

export default ForecastPage;
