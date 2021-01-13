import axios from "axios";
import authHeader from "./auth-header";
import config from "../Config";

const API_URL = config.apiUrl;

const getInboxData = () => {
  return axios.get(API_URL + "inbox" , { headers: authHeader() });
};

const updateInbox = (data) => {
  return axios.put(API_URL + "updateInbox", data, { headers: authHeader() });
};

const composeMessage = (fromUserId, toUserId, subject, message, messageId) => {
  let data = {
    fromUserId,
    toUserId,
    subject,
    message,
    messageId,
  };

  return axios.post(API_URL + "composeMessage", data, { headers: authHeader() });
};

const getSentMessageById = (messageId) => {
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getSentMessageById", data, { headers: authHeader() });
}

const getInboxMessageById = (messageId) => {
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getInboxMessageById", data, { headers: authHeader() });
}

const getMessageById = (messageId) => {
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getMessageById", data, { headers: authHeader() });
}

const getSentData = () => {
  return axios.get(API_URL + "sent", { headers: authHeader() });
};

const mailServices = {
  getInboxData,
  getSentData,
  updateInbox,
  composeMessage,
  getSentMessageById,
  getInboxMessageById,
  getMessageById
};

export default mailServices