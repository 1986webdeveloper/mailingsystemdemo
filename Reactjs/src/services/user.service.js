import axios from "axios";
import authHeader from "./auth-header";
import config from "../Config";

const API_URL = config.apiUrl;

const getUsers = () => {
  return axios.get(API_URL + "userList", { headers: authHeader() });
};

export default {
  getUsers,
};