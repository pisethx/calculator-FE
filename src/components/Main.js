import React from 'react';
import '../css/App.css';
import Header from './Header';
import Footer from './Footer';
// import SimpleCalculator from './SimpleCalculator';
// import ScientificCalculator from './ScientificCalculator';
import { Switch, Route } from 'react-router-dom';

const Main = () => {
    return (
        <div>
            <Header />
            {/* <Switch>
                <Route exact path='/' component={SimpleCalculator} />
                <Route path='/simple-calculator' component={SimpleCalculator} />
                <Route path='/scientific-calculator' component={ScientificCalculator} />
            </Switch> */}
            <Footer />
        </div>
    );
};

export default Main;
