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

enum ReducedState {
  Loading,
  Loaded,
  Errored
}

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
      this.setState({ loading: true });
      const forecast = await weatherService.getForecastByGeolocation(
        currentPosition
      );
      this.setState({ loading: false, errored: false, forecast });
    } catch (error) {
      this.setState({ loading: false, errored: true, forecast: null });
    }
  }

  reduceState(state: State): ReducedState {
    const { forecast, loading } = state;
    if (loading) {
      return ReducedState.Loading;
    } else if (!loading && forecast) {
      return ReducedState.Loaded;
    } else {
      return ReducedState.Errored;
    }
  }

  render() {
    const { forecast } = this.state;
    const reducedState = this.reduceState(this.state);

    let content;
    switch (reducedState) {
      case ReducedState.Loading:
        content = <LoadingIndicator />;
        break;
      case ReducedState.Loaded:
        content = (
          <>
            <h2>Location: {forecast!.location.name}</h2>
            <div className="ForecastPage__ForecastDays">
              {forecast!.days.map(day => (
                <ForecastDay key={day.timestamp.toJSON()} day={day} />
              ))}
            </div>
          </>
        );
        break;
      case ReducedState.Errored:
      default:
        content = (
          <div>Oh no, somethign went wrong! Please refresh the page.</div>
        );
        break;
    }

    return (
      <>
        <h1>5-ish Day Forecast</h1>
        {content}
      </>
    );
  }
}

export default ForecastPage;
