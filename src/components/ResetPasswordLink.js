import React from "react";
import "../css/UserAdmisson.css";
import { MdEmail } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { forgotPassword } from "../service/auth";

const ResetPasswordLink = () => {
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });
  const onSubmit = (data) => forgotPassword(data);

  return (
    <div id="reset-password-link" className="user-admisson">
      <h1 className="form-title blue-color">Reset Password</h1>
      <p className="yellow-color">Reset your password here</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            type="email"
            name="email"
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
        <div className="mt-50">
          <button type="submit">Send Password Reset Link</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordLink;
