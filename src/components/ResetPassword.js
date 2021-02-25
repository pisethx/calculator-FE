import React, { useRef } from "react";
import "../css/UserAdmisson.css";
import { MdEmail, MdLock } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const ResetPassword = () => {
  const { register, errors, handleSubmit, watch } = useForm({
    criteriaMode: "all",
  });
  const onSubmit = (data) => console.log(data);
  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  return (
    <div id="reset-password" className="user-admisson">
      <h1 className="form-title blue-color">Reset Password</h1>
      <p className="yellow-color">Reset your password here</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            type="email"
            name="email"
            defaultValue="piseth_lee@yahoo.com"
            placeholder="Email"
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
            name="newPassword"
            placeholder="New Password"
            ref={register({
              required: "This is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
              maxLength: {
                value: 20,
                message: "Password must have less than 20 characters",
              },
            })}
          />
          <MdLock className="input-icon" />
          <ErrorMessage
            errors={errors}
            name="newPassword"
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
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            ref={register({
              required: "This is required",
              validate: (value) =>
                value === newPassword.current || "The password does not match",
            })}
          />
          <MdLock className="input-icon" />
          <ErrorMessage
            errors={errors}
            name="confirmNewPassword"
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
        <div className="mt-50">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
