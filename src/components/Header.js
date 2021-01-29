import React, { useState, useEffect, useRef } from 'react';
import '../css/header.css';
import { Link } from 'react-router-dom';
import { AiFillCaretDown } from 'react-icons/ai';
import { MdAccountCircle } from 'react-icons/md';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const drop = useRef(null);

    const handleClick = (e) => {
        if (!e.target.closest(`.${drop.current.className}`) && showMenu) {
            setShowMenu(false);
        }
    };

    // useEffect(() => {
    //     document.addEventListener('click', handleClick);
    //     return () => {
    //         document.removeEventListener('click', handleClick);
    //     };
    // });

    return (
        <div id='header'>
            <div className='navbar blue'>
                <Link to='/' className='brand'>
                    KASHIO
                </Link>
                <div className='dropdown'>
                    <button type='button' className='dropdown-btn'>
                        Calculator
                        <AiFillCaretDown className='caret-icon' />
                    </button>
                    <div className='dropdown-content display-none'>
                        <Link to='/' className='dropdown-link'>
                            Simple Calculator
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Scientific Calculator
                        </Link>
                        <hr />
                    </div>
                </div>
                <Link to='/' className='link'>
                    Unit Converter
                </Link>
                {/* <div className='dropdown'>
                    <button className='dropdown-btn'>
                        Randomizer
                        <AiFillCaretDown className='caret-icon' />
                    </button>
                    <div className='dropdown-content display-none'>
                        <Link to='/' className='dropdown-link'>
                            Team Generator
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Name Picker
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Yes or No
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Decision Maker
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Random Picker
                        </Link>
                        <hr />
                    </div>
                </div> */}
            </div>
            <div>
                {/* <button
                    type='button'
                    ref={drop}
                    className='dropdown-btn no-pr-navbar'
                    onClick={() => setShowMenu((showMenu) => !showMenu)}>
                    <MdAccountCircle className='account-icon' />
                </button>
                {showMenu && (
                    <div className='account-content'>
                        <Link to='/' className='dropdown-link'>
                            Cheakimse Mao
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Save List
                        </Link>
                        <hr />
                        <Link to='/' className='dropdown-link'>
                            Logout
                        </Link>
                        <hr />
                    </div>
                )} */}
                <Link to='/' className='link'>
                    Login
                </Link>
                <Link to='/' className='link no-pr-navbar'>
                    Registration
                </Link>
            </div>
        </div>
    );
};

export default Header;
