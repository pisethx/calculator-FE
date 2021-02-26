import React, { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import ResetPasswordLink from "./ResetPasswordLink";
import ResetPassword from "./ResetPassword";
import SimpleCalculator from "./SimpleCalculator";
import ScientificCalculator from "./ScientificCalculator";
import UnitConverter from "./UnitConverter";
import TeamGenerator from "./TeamGenerator";
import NamePicker from "./NamePicker";
import YesOrNo from "./YesOrNo";
import DecisionMaker from "./DecisionMaker";
import RandomPicker from "./RandomPicker";
import CustomList from "./CustomList";
import Picker from "./Picker";
import Header from "./Header";
import Footer from "./Footer";

import "../css/App.css";
import { AuthContext } from "../App";
import { randomizers } from "../service/helper";

const Main = () => {
  return (
    <AuthContext.Consumer>
      {({ state, dispatch }) => (
        <div>
          <Header user={state} />
          <Switch>
            <Route exact path="/" component={SimpleCalculator} />
            <Route exact path="/unit-converter" component={UnitConverter} />
            <Route
              path="/scientific-calculator"
              component={ScientificCalculator}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/registration" component={Registration} />
            <Route
              exact
              path="/reset-password-link"
              component={ResetPasswordLink}
            />
            {<Route exact path="/reset-password" component={ResetPassword} />}

            {state.isAuthenticated &&
              randomizers.map((randomizer) => (
                <Route
                  exact
                  key={randomizer.name}
                  path={`/${randomizer.name}`}
                  render={() => <Picker {...randomizer} />}
                />
              ))}
            {/* <Route path="/team-generator" component={TeamGenerator} />
            <Route path="/name-picker" component={NamePicker} />
            <Route path="/yes-or-no" component={YesOrNo} />
            <Route path="/decision-maker" component={DecisionMaker} />
            <Route path="/random-picker" component={RandomPicker} />
            <Route path="/custom-list" component={CustomList} />{" "} */}
          </Switch>
          <Footer />
        </div>
      )}
    </AuthContext.Consumer>
  );
};

export default Main;
