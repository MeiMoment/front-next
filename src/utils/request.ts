import axios from "axios";
import { message } from "antd";

const codeMessage: Record<number, string> = {
  200: "The server successfully returned the requested data.",
  201: "Data created or modified successfully.",
  202: "A request has entered the background queue (asynchronous task).",
  204: "Data deleted successfully.",
  400: "The request had errors, server did not create or modify data.",
  401: "User not authorized (token, username, password error).",
  403: "User is authorized but access is forbidden.",
  404: "The requested resource does not exist, server took no action.",
  406: "Requested format not available.",
  410: "The requested resource is permanently deleted and will not be available again.",
  422: "Validation error occurred when creating an object.",
  429: "Too Many Requests",
  500: "Server error occurred, please check the server.",
  502: "Gateway error.",
  503: "Service unavailable, server is temporarily overloaded or under maintenance.",
  504: "Gateway timeout.",
};

export const ajaxWithLogin = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 响应拦截器
ajaxWithLogin.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && !String(error.response.status).startsWith("2")) {
      message.error(codeMessage[error.response.status]);
    } else {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default ajaxWithLogin;
