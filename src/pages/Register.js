import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* CSS Imports */
import 'styles/pages/Register.css';
import 'styles/components/form/Form.css';
import 'styles/components/form/FormLink.css';
import 'styles/components/FormHeader.css';
import 'styles/components/FormButton.css';

/* Utility Imports */
import Axios from 'utils/Axios';

/* Component Imports */
import FormInputText from 'components/form/FormInputText';
import FormInputPassword from 'components/form/FormInputPassword';
import FormInputDate from 'components/form/FormInputDate';
import FormError from 'components/form/FormError';

/* Context Imports */
import EmailContext from 'contexts/EmailContext';

/* Function Imports */
import validateEmail from 'functions/validateEmail';
import validatePassword from 'functions/validatePassword';
import generateRandom from 'functions/generateRandom';

function Register() {

    /* Initialization */
    const initData = {
        firstName: '', lastName: '', username: '', email: '', password: '',
        cfmPassword: '', dob: '',
    };
    const err = {};

    const avatar = `http://oracle01.stephenphyo.com/web-001/avatars/avatar0${generateRandom(1, 5)}.png`;

    /* useNavigate */
    const navigate = useNavigate();

    /* useState */
    const [data, setData] = useState(initData);
    const [error, setError] = useState({});

    /* useRef */
    const avatarRef = useRef(avatar);

    /* useContext */
    const { setEmail: setCtxEmail } = useContext(EmailContext);

    /* Functions */
    // Data Checking & Error Handling
    const checkUsername = (username) => {
        if (username.length === 0) {
            err['username'] = 'Please choose a username';
        }
        else if (username.length < 3) {
            err['username'] = 'Username is too short';
        }
    };

    const checkEmail = (email) => {
        if (email.length === 0) {
            err['email'] = 'Email address must not be empty';
        }
        else if (!validateEmail(email)) {
            err['email'] = 'Enter a valid email address';
        }
    };

    const checkPassword = (initPwd, cfmPwd) => {
        if (initPwd.length === 0) {
            err['password'] = 'Password must not be empty';
        }
        else if (initPwd.length < 8) {
            err['password'] = 'Password length must be greater than 8';
        }
        else if (initPwd.length > 24) {
            err['password'] = 'Password length must be less than 24';
        }
        else if (!validatePassword(data['password'])) {
            err['password'] = 'Password must contain at least one uppercase, lowercase, number and special character';
        }
        else if (cfmPwd !== initPwd) {
            err['cfmPassword'] = 'Passwords do not match';
        }
    };

    const checkData = () => {
        checkUsername(data['username']);
        checkEmail(data['email']);
        checkPassword(data['password'], data['cfmPassword']);

        if (Object.keys(err).length !== 0) {
            setError(err);
            return false;
        } else {
            return true;
        }
    };

    const register = async () => {
        if (checkData()) {
            Axios.post('/accounts/register', data, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.status === 201) {
                        setCtxEmail({ register: data['email'] });
                        navigate('/register/success');
                    }
                })
                .catch(err => {
                    alert(`${err.response.status}: ${err.response.data.message}`);
                })
        }
    };

    /* useEffect */
    useEffect(() => {
        setData({ ...data, avatar: avatarRef.current });
    }, []);

    return (
        <main className='register'>
            <div className='form' style={{ width: '380px', height: '850px' }}>
                <div className='form_container'>
                    <div className='form_header'>
                        <h2>Register Account</h2>
                    </div>
                    <div className='avatar'>
                        <div className='avatar_container'>
                            <div className='avatar_container_img'>
                                <img
                                    src={avatarRef.current}
                                    alt='avatar'
                                />
                            </div>
                        </div>
                    </div>
                    <FormInputText
                        label='Enter First Name'
                        autoFocus
                        onChange={(e) => setData({ ...data, firstName: e.target.value })} />
                    <FormError nbsp />
                    <FormInputText
                        label='Enter Last Name'
                        onChange={(e) => setData({ ...data, lastName: e.target.value })} />
                    <FormError nbsp />
                    <FormInputText
                        label='Enter Username'
                        onChange={(e) => {
                            setData({ ...data, username: e.target.value });
                            setError({ ...error, username: '' })
                        }} />
                    <FormError nbsp>{'username' in error && error['username']}</FormError>
                    <FormInputText
                        label='Enter Email Address'
                        onChange={(e) => {
                            setData({ ...data, email: e.target.value });
                            setError({ ...error, email: '' })
                        }} />
                    <FormError nbsp>{'email' in error && error['email']}</FormError>
                    <FormInputPassword
                        label='Enter Password'
                        onChange={(e) => {
                            setData({ ...data, password: e.target.value });
                            setError({ ...error, password: '' })
                        }} />
                    <FormError nbsp>{'password' in error && error['password']}</FormError>
                    <FormInputPassword
                        label='Confirm Password'
                        onChange={(e) => {
                            setData({ ...data, cfmPassword: e.target.value });
                            setError({ ...error, cfmPassword: '' })
                        }} />
                    <FormError nbsp>{'cfmPassword' in error && error['cfmPassword']}</FormError>
                    <FormInputDate
                        label='Choose your Birthday'
                        onChange={(e) => setData({ ...data, dob: e.target.value })} />
                    <FormError nbsp></FormError>
                    <div className='form_button filled'
                        onClick={() => register()}>
                        Register
                    </div>
                    <div className='register_form_footer'>
                        <span className='label'>Already have an account?</span>
                        <span className='form_link' onClick={() => navigate('/login')}>Login</span>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;