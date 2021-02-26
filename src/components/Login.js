import React from "react";
import "../css/UserAdmisson.css";
import { Link } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useHistory } from "react-router-dom";

import { login } from "../service/auth";

import { AuthContext } from "../App";

const Login = () => {
  const history = useHistory();

  const { dispatch } = React.useContext(AuthContext);
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });
  const onSubmit = async (data) => {
    const res = await login(data);

    if (res.error)
      return dispatch({
        type: "SET_USER",
      });

    dispatch({
      type: "SET_USER",
      payload: res?.user,
    });
    return history.push("/team-generator");
  };

  return (
    <div id="login" className="user-admisson">
      <h1 className="form-title blue-color">Login</h1>
      <p className="yellow-color">Let's get started</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue="piseth_lee@yahoo.com"
            ref={register({
              required: "This is required",
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid Email Address",
              },
            })}
          />
          <MdEmail className="input-icon" />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <div className="error-container">
                  <BiErrorCircle className="error-icon" />
                  <p key={type} className="error-message">
                    {message}
                  </p>
                </div>
              ))
            }
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            name="password"
            defaultValue="password1"
            placeholder="Password"
            ref={register({
              required: "This is required",
            })}
          />
          <MdLock className="input-icon" />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <div className="error-container">
                  <BiErrorCircle className="error-icon" />
                  <p key={type} className="error-message">
                    {message}
                  </p>
                </div>
              ))
            }
          />
        </div>
        <div className="flex-container">
          <form>
            {/* <input type="checkbox" name="rememberMe" />
            <label value="rememberMe">Remember Me</label> */}
          </form>
          <Link to="/reset-password-link" className="forgot-pwd">
            Forgot Password?
          </Link>
        </div>
        <p className="suggestion blue-color mt-50">
          Don't have any account yet
          <span>
            &#63;{" "}
            <Link to="/registration" className="yellow-color">
              Register here
            </Link>
          </span>
        </p>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
