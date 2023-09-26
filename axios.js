import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({});

instance.interceptors.request.use(
  (config) => {
    if (Cookies.get("token")) {
      config.headers.token = Cookies.get("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject();
  }
);

instance.interceptors.response.use(
  function (config) {
    return Promise.resolve(config);
  },
  async function (error) {
    const { response } = error;
    if (response.status === 401) {
      Cookies.remove("token");
      window.location.replace(`http://a.com/login?serviceURL=${window.location.origin}${window.location.pathname}`);
    }
    return Promise.reject(response);
  }
);

export default instance;
