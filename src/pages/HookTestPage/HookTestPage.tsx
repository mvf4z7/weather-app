import React, { FunctionComponent } from "react";

import WeatherService from "../../weather-service";
import useAsyncState, { AsyncState } from "../../utils/use-async-state";

function delay(millis: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), millis);
  });
}

type Props = {
  weatherService: WeatherService;
};

const HookTestPage: FunctionComponent<Props> = ({ weatherService }) => {
  const [result, fetch] = useAsyncState(async () => {
    const currentWeather = await weatherService.getCurrentByCityName(
      "Grosse Pointe Park"
    );
    await delay(3000);

    return currentWeather;
  });

  let content;

  switch (result.state) {
    case AsyncState.Initial:
      content = <div>Initial State: {result.data}</div>;
      break;
    case AsyncState.Loading:
      content = <div>LOADING (from useAsyncState)</div>;
      break;
    case AsyncState.Success:
      content = <pre>{JSON.stringify(result.data, null, 2)}</pre>;
      break;
    case AsyncState.Failed:
      console.error(result.data);
      content = <div>Oh no, something went wrong!</div>;
      break;
  }

  return (
    <div>
      <button
        onClick={fetch}
        style={{
          margin: "8px",
          padding: "8px"
        }}
      >
        Load Weather Data
      </button>
      {content}
    </div>
  );
};

export default HookTestPage;
