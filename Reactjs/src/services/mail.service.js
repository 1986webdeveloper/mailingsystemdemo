import axios from "axios";
import authHeader from "./auth-header";
import config from "../Config";

const API_URL = config.apiUrl;

const getInboxData = () => {
  return axios.get(API_URL + "inbox" , { headers: authHeader() });
};

const updateInbox = (data) => {
  return axios.post(API_URL + "updateInbox", data, { headers: authHeader() });
};

const getSentData = () => {
  return axios.get(API_URL + "sent", { headers: authHeader() });
};


export default {
  getInboxData,
  getSentData,
  updateInbox
};