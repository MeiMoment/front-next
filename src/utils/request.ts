import axios from "axios";
import { JWT } from "../constants";
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
  baseURL: "/api/api/v1",
  timeout: 1000 * 10,
});

// 请求拦截器
ajaxWithLogin.interceptors.request.use(
  (config) => {
    // 获取 JWT Token
    const token = localStorage.getItem(JWT); // 假设你将 JWT 存储在 localStorage 中
    if (token) {
      // 在头部添加 Authorization 字段
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
ajaxWithLogin.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token 失效或未授权
          window.dispatchEvent(new CustomEvent("not_login"));
          message.error('登录已过期，请重新登录');
          break;
        case 403:
          message.error('没有权限访问此资源');
          break;
        default:
          message.error(data?.message || codeMessage[status] || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default ajaxWithLogin;
