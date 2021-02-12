import React, { useRef } from 'react';
import '../css/UserAdmisson.css';
import { Link } from 'react-router-dom';
import { RiUser3Fill } from 'react-icons/ri';
import { MdEmail, MdLock } from 'react-icons/md';
import { BiErrorCircle } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const Registration = () => {
    const { register, errors, handleSubmit, watch } = useForm({
        criteriaMode: 'all',
    });
    const onSubmit = (data) => console.log(data);
    const password = useRef({});
    password.current = watch('password', '');

    return (
        <div id='registration' className='user-admisson'>
            <h1 className='form-title blue-color'>Registration</h1>
            <p className='yellow-color'>Create your free account</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='input-container'>
                    <input
                        type='text'
                        name='username'
                        placeholder='Username'
                        ref={register({
                            required: 'This is required',
                            pattern: {
                                value: /^[a-zA-Z0-9 ]+$/,
                                message: 'Letters and numbers are allowed only',
                            },
                        })}
                    />
                    <RiUser3Fill className='input-icon' />
                    <ErrorMessage
                        errors={errors}
                        name='username'
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <div className='error-container'>
                                    <BiErrorCircle className='error-icon' />
                                    <p key={type} className='error-message'>
                                        {message}
                                    </p>
                                </div>
                            ))
                        }
                    />
                </div>
                <div className='input-container'>
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        ref={register({
                            required: 'This is required',
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: 'Invalid Email Address',
                            },
                        })}
                    />
                    <MdEmail className='input-icon' />
                    <ErrorMessage
                        errors={errors}
                        name='email'
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <div className='error-container'>
                                    <BiErrorCircle className='error-icon' />
                                    <p key={type} className='error-message'>
                                        {message}
                                    </p>
                                </div>
                            ))
                        }
                    />
                </div>
                <div className='input-container'>
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        ref={register({
                            required: 'This is required',
                            minLength: {
                                value: 6,
                                message: 'Password must have at least 6 characters',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Password must have less than 20 characters',
                            },
                        })}
                    />
                    <MdLock className='input-icon' />
                    <ErrorMessage
                        errors={errors}
                        name='password'
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <div className='error-container'>
                                    <BiErrorCircle className='error-icon' />
                                    <p key={type} className='error-message'>
                                        {message}
                                    </p>
                                </div>
                            ))
                        }
                    />
                </div>
                <div className='input-container'>
                    <input
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirm Password'
                        ref={register({
                            required: 'This is required',
                            validate: (value) => value === password.current || 'The password does not match',
                        })}
                    />
                    <MdLock className='input-icon' />
                    <ErrorMessage
                        errors={errors}
                        name='confirmPassword'
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <div className='error-container'>
                                    <BiErrorCircle className='error-icon' />
                                    <p key={type} className='error-message'>
                                        {message}
                                    </p>
                                </div>
                            ))
                        }
                    />
                </div>
                <p className='suggestion blue-color mt-50'>
                    Already have an account?{' '}
                    <span>
                        <Link to='/login' className='yellow-color'>
                            Login
                        </Link>
                    </span>
                </p>
                <div>
                    <button type='submit'>Register</button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
