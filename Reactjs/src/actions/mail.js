import {
    COMPOSE_SUCCESS,
    COMPOSE_FAIL,
    SET_MESSAGE,
    UPDATE_INBOX_SUCCESS,
    UPDATE_INBOX_FAIL
  } from "./types";
  
  import MailService from "../services/mail.service";
  
  /**
   * compose message 
   * @param {number} fromUserId 
   * @param {number} toUserId 
   * @param {string} subject 
   * @param {string} message 
   * @param {number} messageId 
   */
  export const composeMessage = (fromUserId, toUserId, subject, message, messageId) => (dispatch) => {
    return MailService.composeMessage(fromUserId, toUserId, subject, message, messageId).then(
      (response) => {
        dispatch({
          type: COMPOSE_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: COMPOSE_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };

  /**
   * update inbox 
   * @param {*} data 
   */
  export const updateInbox = (data) => (dispatch) => {
    return MailService.updateInbox(data).then(
      (response) => {
        dispatch({
          type: UPDATE_INBOX_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: UPDATE_INBOX_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };