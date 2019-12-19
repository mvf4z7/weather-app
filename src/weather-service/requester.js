const Methods = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH"
};

// const BaseUrl = "http://api.openweathermap.org/data/2.5";
const BaseUrl = "/data/2.5";
const APIKeyQueryParam = "APPID";

class Requester {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  buildURL(path = "", searchParamsMap = {}) {
    if (!path.startsWith("/")) {
      throw new Error(
        `URL path must begin with a "/" character, provided path was ${path}`
      );
    }

    const urlSearchParams = Object.entries(searchParamsMap).reduce(
      (params, param) => {
        const [key, value] = param;
        params.set(key, value);
        return params;
      },
      new URLSearchParams()
    );

    if (!urlSearchParams.has(APIKeyQueryParam)) {
      urlSearchParams.set(APIKeyQueryParam, this.apiKey);
    }

    return `${BaseUrl}${path}?${urlSearchParams.toString()}`;
  }

  async makeRequest({ body, method, path, queryParams } = {}) {
    const response = await fetch(this.buildURL(path, queryParams), {
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      mode: "cors"
    });

    if (response.status >= 400) {
      throw new Error(response);
    }

    return response.json();
  }

  get(path, queryParams) {
    return this.makeRequest({ method: Methods.Get, path, queryParams });
  }
}

export default Requester;
