import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import MailService from "../services/mail.service";

const SentView = (props) => {
  const messageId = props.match.params.id;
  const { user: currentUser } = useSelector((state) => state.auth);

  const [sentMessage, setSentMessage] = useState("");

  /**
   * get sent message by message id
   */
  useEffect(() => {
    if(!sentMessage) {
      MailService.getSentMessageById(messageId).then(
        (response) => {
          setSentMessage(response.data.data);
        },
        (error) => {
          const _sentMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            setSentMessage(_sentMessage);
        }
      );
    } else {
      return null
    }
  }, [sentMessage, messageId]);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
           Sent View Meesage
        </h3>
      </header>
      <p>
        <strong>From:</strong> {currentUser.data.fullName}
      </p>
      <p>
        <strong>To:</strong> {!!sentMessage._toUserId && sentMessage._toUserId.fullName}
      </p>
      <p>
        <strong>Subject:</strong> {sentMessage.subject}
      </p>
      <p>
        <strong>Message:</strong> {sentMessage.message}
      </p>
    </div>
  );
};

export default SentView;