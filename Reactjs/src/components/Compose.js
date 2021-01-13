import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea"
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";
import { Redirect } from 'react-router-dom';

import UserService from "../services/user.service";
import { composeMessage } from "../actions/mail";
import MailService from "../services/mail.service";

/**
 * require validation 
 * @param {*} value 
 */
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};


const Compose = (props) => {
  const messageIdInit = !!props.match.params.messageId ? props.match.params.messageId : 0 ;
  const form = useRef();
  const checkBtn = useRef();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [toUserId, setToUserId] = useState("");
  const [msg, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [messageId, setMessageId] = useState(messageIdInit);

  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  /**
   * on change event for to user 
   * @param {*} e 
   */
  const onChangeToUser = (e) => {
    const toUserId = e.target.value;
    setToUserId(toUserId);
  };

  /**
   * on change event for message 
   * @param {*} e 
   */
  const onChangeMessage = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  /**
   * on change event for subject 
   * @param {*} e 
   */
  const onChangeSubject= (e) => {
    const subject = e.target.value;
    setSubject(subject);
  };

  /**
   * compose message handle 
   * @param {*} e 
   */
  const handleCompose = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      let fromUserId = currentUser.data.id;
      dispatch(composeMessage(fromUserId, toUserId, subject, msg, messageId))
        .then(() => {
            setLoading(false);
            setSuccessful(true);
          
        })
        .catch(() => {
          setSuccessful(false);
          setLoading(false);
        });
    }
  };

  /**
   * on click on OK button
   */
  const onClickOk = () => {
    props.history.push("/compose");
    window.location.reload();
  }

  /**
   * get message by id 
   */
  useEffect(() => {
    console.log("messageId ==>", messageId);
    if(messageId !== 0) {
      MailService.getMessageById(messageId).then(
        (response) => {
          let resData = response.data.data
          setToUserId(!!resData._fromUserId && resData._fromUserId.id);
          //setMessage(resData.message);
          setSubject('Re:'+resData.subject);
        },
        (error) => {
          const _errorMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
            console.log("_errorMessage ==>", _errorMessage);
        }
      );
    } else {
      return null
    }

  }, [toUserId, msg, subject, messageId]);

  /**
   * get user list 
   */
  useEffect(() => {
    if(!content) {
      UserService.getUsers().then(
        (response) => {
          setContent(response.data.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setContent(_content);
        }
      );
    } else {
      return null
    }
  }, [content]);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  
  return (
    <div className="col-md-12">
      <div className="card compose-container">
        <Form onSubmit={handleCompose} ref={form}>
          {!successful && (
            <div>
              { messageId === 0 && (
                <div>
                  <div className="form-group">
                    <label htmlFor="toUserId">To</label>
                    <Select className="form-control" name='toUserId' value={toUserId} validations={[required]} onChange={onChangeToUser}>
                        <option value=''>Select User</option>
                        {content && content.length > 0 && 
                          content.map( user => {
                            return <option value={user.id}>{user.fullName}</option>
                          })
                        }
                    </Select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={subject}
                      onChange={onChangeSubject}
                      validations={[required]}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Textarea
                  type="text"
                  className="form-control compose-text-area"
                  name="msg"
                  value={msg}
                  onChange={onChangeMessage}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {message && successful && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
              <button className="btn btn-primary btn-block" onClick={onClickOk}>
                <span>Ok</span>
              </button>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Compose;