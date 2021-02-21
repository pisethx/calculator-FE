import React, { useState, useEffect, useRef } from 'react';
import '../css/Header.css';
import { Link } from 'react-router-dom';
import { AiFillCaretDown, AiOutlineClose } from 'react-icons/ai';
import { MdAccountCircle, MdExpandMore } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showMenuSide, setShowMenuSide] = useState(false);
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
        <>
            <div id='header'>
                <div id='left-navbar' className='navbar blue'>
                    <Link to='/' className='brand'>
                        KASHIO
                    </Link>
                    <div className='dropdown'>
                        <button type='button' className='dropdown-btn'>
                            Calculator
                            <AiFillCaretDown className='caret-icon' />
                        </button>
                        <div className='dropdown-content display-none'>
                            <Link to='/simple-calculator' className='dropdown-link'>
                                Simple Calculator
                            </Link>
                            <hr />
                            <Link to='/scientific-calculator' className='dropdown-link'>
                                Scientific Calculator
                            </Link>
                            <hr />
                        </div>
                    </div>
                    <Link to='/unit-converter' className='link'>
                        Unit Converter
                    </Link>
                    {/* <div className='dropdown'>
                    <button className='dropdown-btn'>
                        Randomizer
                        <AiFillCaretDown className='caret-icon' />
                    </button>
                    <div className='dropdown-content display-none'>
                        <Link to='/team-generator' className='dropdown-link'>
                            Team Generator
                        </Link>
                        <hr />
                        <Link to='/name-picker' className='dropdown-link'>
                            Name Picker
                        </Link>
                        <hr />
                        <Link to='/yes-or-no' className='dropdown-link'>
                            Yes or No
                        </Link>
                        <hr />
                        <Link to='/decison-maker' className='dropdown-link'>
                            Decision Maker
                        </Link>
                        <hr />
                        <Link to='/random-picker' className='dropdown-link'>
                            Random Picker
                        </Link>
                        <hr />
                        <Link to='/custom-list' className='dropdown-link'>
                            Custom List
                        </Link>
                        <hr />
                    </div>
                </div> */}
                </div>
                <div id='right-navbar'>
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
                                Cheakimse
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
                    <Link to='/login' className='link'>
                        Login
                    </Link>
                    <Link to='/registration' className='link no-pr-navbar'>
                        Registration
                    </Link>
                    {/* menu-side */}
                    <button
                        type='button'
                        id='menu-icon'
                        className='dropdown-btn no-pr-navbar display-none'
                        onClick={() => setShowMenuSide((showMenuSide) => !showMenuSide)}>
                        <FiMenu className='menu-icon' />
                    </button>
                </div>
            </div>
            {showMenuSide && (
                <div className='menu-side'>
                    <button
                        type='button'
                        className='dropdown-btn'
                        onClick={() => setShowMenuSide((showMenuSide) => !showMenuSide)}>
                        <AiOutlineClose className='close-icon' />
                    </button>
                    {/* <div>
                        <MdAccountCircle className='menu-account-icon' />
                        <p className='username'>Cheakimse</p>
                    </div> */}
                    <div className='menu-side-content'>
                        <div className='menu-dropdown'>
                            <button type='button' className='menu-side-btn'>
                                Calculator
                                <MdExpandMore className='expand-icon' />
                            </button>
                            <div className='sub-menu display-none'>
                                <Link to='/simple-calculator' className='menu-side-link no-mt-menu-side'>
                                    Simple Calculator
                                </Link>
                                <Link to='/scientific-calculator' className='menu-side-link'>
                                    Scientific Calculator
                                </Link>
                            </div>
                        </div>
                        <hr />
                        <Link to='/unit-converter' className='menu-side-link'>
                            Unit Converter
                        </Link>
                        <hr />
                        <Link to='/login' className='menu-side-link'>
                            Login
                        </Link>
                        <hr />
                        <Link to='/registration' className='menu-side-link'>
                            Registration
                        </Link>
                        <hr />
                        {/* <div className='menu-dropdown'>
                            <button type='button' className='menu-side-btn'>
                                Randomizer
                                <MdExpandMore className='expand-icon' />
                            </button>
                            <div className='sub-menu display-none'>
                                <Link to='/team-generator' className='menu-side-link no-mt-menu-side'>
                                    Team Generator
                                </Link>
                                <Link to='/name-picker' className='menu-side-link'>
                                    Name Picker
                                </Link>
                                <Link to='/yes-or-no' className='menu-side-link'>
                                    Yes or No
                                </Link>
                                <Link to='/decision-maker' className='menu-side-link'>
                                    Decision Maker
                                </Link>
                                <Link to='/random-picker' className='menu-side-link'>
                                    Random Picker
                                </Link>
                                <Link to='/custom-list' className='menu-side-link'>
                                    Custom List
                                </Link>
                            </div>
                            <hr />
                        </div>
                        <Link to='/' className='menu-side-link'>
                            Save List
                        </Link>
                        <hr />
                        <Link to='/' className='menu-side-link'>
                            Logout
                        </Link>
                        <hr /> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
