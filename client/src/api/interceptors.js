import alertify from "alertifyjs";

export const axiosRequestInterceptor = {
  onFulfilled: (config) => {
    if (config.url.startsWith("http")) {
      delete config.headers["x-access-token"];
      config = { ...config, baseURL: config.url, url: "" };
    }

    if (config.data instanceof FormData) {
      Object.assign(config.headers, { "Content-Type": "multipart/form-data" });
    }

    if (config.method === "get") {
      const paramsKeys = Object.keys(config.params || {});
      paramsKeys.forEach((key) => {
        if (Array.isArray(config.params[key])) {
          config.params[key] = config.params[key].join(",");
        }
      });
    }

    return config;
  },
  onRejected: (error) => {
    return Promise.reject(error);
  },
};

export const axiosResponseInterceptor = {
  onFulfilled: (res) => {
    let requestPayload;

    if (typeof res.config.data === "string") {
      requestPayload = JSON.parse(res.config.data);
    }

    if (
      res.status >= 200 &&
      res.status < 300 &&
      !requestPayload?.disableToast
    ) {
      if (res.config.method !== "get") alertify.success(res.data.message);
    }

    if (res.data instanceof Blob) {
      return res;
    }

    return { ...res, data: res.data.data ? res.data.data : res.data };
  },
  onRejected: (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // localStorage.removeItem("token");
        console.log(error.response)
        // window.location = window.location.origin;
      }
      alertify.error(error.response?.data?.message);
    } else {
      if (error.message) alertify.error(error.message);
    }

    return Promise.reject(error);
  },
};
