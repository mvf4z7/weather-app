import React from "react";

import "./ForecastDay.css";

type Props = {
  day: {
    temperature: {
      high: number;
      low: number;
    };
    iconURL: string | null;
    timestamp: Date;
  };
};

function ForecastDay(props: Props) {
  const { day } = props;

  return (
    <div className="ForecastDay">
      {day.iconURL && <img src={day.iconURL} alt="weather icon" />}
      <span className="ForecastDay__date">
        {day.timestamp.toLocaleDateString()}
      </span>
      <span>high: {day.temperature.high} F</span>
      <span>low: {day.temperature.low} F</span>
    </div>
  );
}

export default ForecastDay;
