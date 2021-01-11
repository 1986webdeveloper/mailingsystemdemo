import axios from "axios";
import config from "../Config";

const API_URL = config.apiUrl;

const register = (fullName, email, password) => {
  return axios.post(API_URL + "register", {
    fullName,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authServices = {
  register,
  login,
  logout,
};

export default authServices