enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH"
}

// const BaseUrl = "http://api.openweathermap.org/data/2.5";
const BaseUrl = "/data/2.5";
const APIKeyQueryParam = "APPID";

type SearchParamsMap = { [key: string]: string | number };

class Requester {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  buildURL(path = "", searchParamsMap: SearchParamsMap = {}) {
    if (!path.startsWith("/")) {
      throw new Error(
        `URL path must begin with a "/" character, provided path was ${path}`
      );
    }

    const urlSearchParams = Object.entries(searchParamsMap).reduce(
      (params, param) => {
        const [key, value] = param;
        params.set(key, value.toString());
        return params;
      },
      new URLSearchParams()
    );

    if (!urlSearchParams.has(APIKeyQueryParam)) {
      urlSearchParams.set(APIKeyQueryParam, this.apiKey);
    }

    return `${BaseUrl}${path}?${urlSearchParams.toString()}`;
  }

  async makeRequest({
    body,
    method,
    path,
    queryParams
  }: {
    body?: Object;
    method: HttpMethod;
    path: string;
    queryParams?: SearchParamsMap;
  }) {
    const response = await fetch(this.buildURL(path, queryParams), {
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      mode: "cors"
    });

    const responseBody = await response.json();

    if (response.status >= 400) {
      throw new Error(
        `Response with bad status code (${
          response.status
        }) returned: ${JSON.stringify(responseBody)}`
      );
    }

    return responseBody;
  }

  get(path: string, queryParams?: SearchParamsMap) {
    return this.makeRequest({ method: HttpMethod.Get, path, queryParams });
  }
}

export default Requester;
