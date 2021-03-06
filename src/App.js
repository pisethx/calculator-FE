import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

import { getUser } from "./service/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  role: null,
  id: null,
  email: null,

  alert: {
    show: false,
    type: "error",
    msg: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        ...action.payload,
        isAuthenticated: action.payload?.role === "user",
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(async () => {
    const user = await getUser();
    if (user) dispatch({ type: "SET_USER", payload: user });
  }, []);

  return (
    <Router>
      <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <ToastContainer />
        <Main />
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
