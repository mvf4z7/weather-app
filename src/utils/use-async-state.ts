import { useState } from "react";

export enum AsyncState {
  Initial = "Initial",
  Loading = "Loading",
  Success = "Success",
  Failed = "Failed"
}

type InitialResult<T> = {
  state: AsyncState.Initial;
  data: T;
};

type LoadingResult = {
  state: AsyncState.Loading;
};

type SuccessResult<T> = {
  state: AsyncState.Success;
  data: T;
};

type FailedResult = {
  state: AsyncState.Failed;
  data: Error;
};

type AsyncResult<T, U> =
  | InitialResult<U>
  | LoadingResult
  | SuccessResult<T>
  | FailedResult;

export default function useAsyncState<T>(
  func: () => Promise<T>
): [AsyncResult<T, null>, () => void];

export default function useAsyncState<T>(
  func: () => Promise<T>,
  initialValue?: T
): [AsyncResult<T, T | null>, () => void] {
  const [result, setResult] = useState<AsyncResult<T, T | null>>({
    state: AsyncState.Initial,
    data: initialValue || null
  });

  const wrappedFunc = () => {
    setResult({ state: AsyncState.Loading });

    func()
      .then(result => setResult({ state: AsyncState.Success, data: result }))
      .catch(error => setResult({ state: AsyncState.Failed, data: error }));
  };

  return [result, wrappedFunc];
}
