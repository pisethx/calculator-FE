import React from 'react';
import '../css/App.css';
import Header from './Header';
import Footer from './Footer';
import {Switch, Route} from 'react-router-dom';
import SimpleCalculator from './SimpleCalculator';
import ScientificCalculator from './ScientificCalculator'; 

const Main = () => {
    return (
        <div>
            <Header />
            <Switch>
                <Route path={'/simple-calculator'} component={SimpleCalculator}/>
                <Route path={'/scientific-calculator'} component={ScientificCalculator} />
            </Switch>
            <Footer />
        </div>
    );
};

export default Main;
