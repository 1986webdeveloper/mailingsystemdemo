import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Redirect } from 'react-router-dom';

import { register } from "../actions/auth";
import { login } from "../actions/auth";

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

/**
 * email validation
 * @param {*} value 
 */
const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

/**
 * full name validation
 * @param {*} value 
 */
const vfullname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The fullname must be between 3 and 20 characters.
      </div>
    );
  }
};

/**
 * password validation 
 * @param {*} value 
 */
const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  /**
   * on chnage event for full name
   * @param {*} e 
   */
  const onChangeFullname = (e) => {
    const fullname = e.target.value;
    setFullname(fullname);
  };

  /**
   * on change event for email
   * @param {*} e 
   */
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  /**
   * on chnage event for password
   * @param {*} e 
   */
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  /**
   * register hendle
   * @param {*} e 
   */
  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(fullname, email, password))
        .then(() => {
          dispatch(login(email, password))
            .then(() => {
              setSuccessful(true);
              props.history.push("/inbox");
              window.location.reload();
            })
            .catch(() => {
              setLoading(false);
              setSuccessful(false);
            });
        })
        .catch(() => {
          setSuccessful(false);
          setLoading(false);
        });
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }


  return (
    <div className="col-md-12">
      <div className="card card-container">
        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="fullnam">Full Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={fullname}
                  onChange={onChangeFullname}
                  validations={[required, vfullname]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;