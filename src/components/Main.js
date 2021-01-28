import React from 'react';
import '../css/App.css';
import Header from './Header';
import Footer from './Footer';
import ScientificCalculator from './ScientificCalculator';
import { Route, Switch } from 'react-router-dom';

const Main = () => {
    return (
        <div>
            <Header />
            <Switch>
                <Route path={'/scientific-calculator'} component={ScientificCalculator} />
            </Switch>
            <Footer />
        </div>
    );
};

export default Main;
