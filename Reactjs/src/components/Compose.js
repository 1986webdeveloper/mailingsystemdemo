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
  const form = useRef();
  const checkBtn = useRef();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [toUserId, setToUserId] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { displaymessage } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeToUser = (e) => {
    const toUserId = e.target.value;
    setToUserId(toUserId);
  };

  const onChangeMessage = (e) => {
    const message = e.target.value;
    setMessage(message);
  };

  const onChangeSubject= (e) => {
    const subject = e.target.value;
    setSubject(subject);
  };

  const handleCompose = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      let fromUserId = currentUser.data.id;
      dispatch(composeMessage(fromUserId, toUserId, subject, message))
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
      <div className="card card-container col-md-12">
        <Form onSubmit={handleCompose} ref={form}>
          {!successful && (
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
                    {/* <option value='1'>London</option>
                    <option value='2'>Kyiv</option>
                    <option value='3'>New York</option> */}
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

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Textarea
                  type="text"
                  className="form-control"
                  name="message"
                  value={message}
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

          {displaymessage && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {displaymessage}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Compose;