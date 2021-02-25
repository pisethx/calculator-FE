import React, { useState, useEffect } from "react";
import "../css/App.css";
import Header from "./Header";
import Footer from "./Footer";
// import SimpleCalculator from './SimpleCalculator';
// import ScientificCalculator from './ScientificCalculator';
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import ResetPasswordLink from "./ResetPasswordLink";
import ResetPassword from "./ResetPassword";
import TeamGenerator from "./TeamGenerator";
import NamePicker from "./NamePicker";
import YesOrNo from "./YesOrNo";
import DecisionMaker from "./DecisionMaker";
import RandomPicker from "./RandomPicker";
import CustomList from "./CustomList";

import { AuthContext } from "../App";

const Main = () => {
  return (
    <AuthContext.Consumer>
      {({ state, dispatch }) => (
        <div>
          <Header user={state} />
          <Switch>
            {/* <Route exact path='/' component={SimpleCalculator} />
                <Route path='/simple-calculator' component={SimpleCalculator} />
                <Route path='/scientific-calculator' component={ScientificCalculator} /> */}
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/reset-password-link" component={ResetPasswordLink} />
            {<Route path="/reset-password" component={ResetPassword} />}
            {state.isAuthenticated && (
              <Route path="/team-generator" component={TeamGenerator} />
            )}
            {state.isAuthenticated && (
              <Route path="/name-picker" component={NamePicker} />
            )}
            {state.isAuthenticated && (
              <Route path="/yes-or-no" component={YesOrNo} />
            )}
            {state.isAuthenticated && (
              <Route path="/decision-maker" component={DecisionMaker} />
            )}
            {state.isAuthenticated && (
              <Route path="/random-picker" component={RandomPicker} />
            )}
            {state.isAuthenticated && (
              <Route path="/custom-list" component={CustomList} />
            )}
          </Switch>
          <Footer />
        </div>
      )}
    </AuthContext.Consumer>
  );
};

export default Main;
