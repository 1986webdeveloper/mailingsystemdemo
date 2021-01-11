import axios from "axios";
import authHeader from "./auth-header";
import config from "../Config";

const API_URL = config.apiUrl;

const getInboxData = () => {
  return axios.get(API_URL + "inbox" , { headers: authHeader.authHeader() });
};

const updateInbox = (data) => {
  return axios.put(API_URL + "updateInbox", data, { headers: authHeader.authHeader() });
};

const composeMessage = (fromUserId, toUserId, subject, message, messageId) => {
  let data = {
    fromUserId,
    toUserId,
    subject,
    message,
    messageId,
  };

  return axios.post(API_URL + "composeMessage", data, { headers: authHeader.authHeader() });
};

const getSentMessageById = (messageId) => {
  console.log("messageId ==>", messageId);
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getSentMessageById", data, { headers: authHeader.authHeader() });
}

const getInboxMessageById = (messageId) => {
  console.log("messageId ==>", messageId);
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getInboxMessageById", data, { headers: authHeader.authHeader() });
}

const getMessageById = (messageId) => {
  console.log("messageId ==>", messageId);
  let data = {
    messageId: messageId,
  };
  return axios.post(API_URL + "getMessageById", data, { headers: authHeader.authHeader() });
}

const getSentData = () => {
  return axios.get(API_URL + "sent", { headers: authHeader.authHeader() });
};


export default {
  getInboxData,
  getSentData,
  updateInbox,
  composeMessage,
  getSentMessageById,
  getInboxMessageById,
  getMessageById
};