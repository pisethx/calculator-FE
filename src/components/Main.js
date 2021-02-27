import React from 'react';
import '../css/App.css';
import Header from './Header';
import Footer from './Footer';
// import SimpleCalculator from './SimpleCalculator';
// import ScientificCalculator from './ScientificCalculator';
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import ResetPasswordLink from './ResetPasswordLink';
import ResetPassword from './ResetPassword';
import SaveList from './SaveList';

const Main = () => {
    return (
        <div>
            <Header />
            {/* <div className='main-container'> */}
                <Switch>
                    {/* <Route exact path='/' component={SimpleCalculator} />
                <Route path='/simple-calculator' component={SimpleCalculator} />
                <Route path='/scientific-calculator' component={ScientificCalculator} /> */}
                    <Route path='/login' component={Login} />
                    <Route path='/registration' component={Registration} />
                    <Route path='/reset-password-link' component={ResetPasswordLink} />
                    <Route path='/reset-password' component={ResetPassword} />
                    <Route path='/save-list' component={SaveList} />
                </Switch>
            {/* </div> */}
            <Footer />
        </div>
    );
};

export default Main;
