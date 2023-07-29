import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* CSS Imports */
import 'styles/pages/ForgotPassword.css';
import 'styles/components/form/Form.css';
import 'styles/components/FormHeader.css';
import 'styles/components/FormButton.css';

/* 3rd Party Package Imports */
import ReCAPTCHA from 'react-google-recaptcha';

/* Utility Imports */
import Axios from 'utils/Axios';

/* Component Imports */
import FormInputText from 'components/form/FormInputText';
import FormError from 'components/form/FormError';

/* Context Imports */
import EmailContext from 'contexts/EmailContext';

/* Function Imports */
import validateEmail from 'functions/validateEmail';

function ForgotPassword() {

    /* useNavigate */
    const navigate = useNavigate();

    /* useState */
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    /* useRef */
    const recaptchaRef = useRef();

    /* useContext */
    const { setEmail: setCtxEmail } = useContext(EmailContext);

    /* Functions */
    const checkEmail = () => {
        if (email.length === 0) {
            setError('Email address must not be empty')
            return false;
        }
        if (!validateEmail(email)) {
            setError('Invalid email address');
            return false;
        }
        return true;
    };

    const checkRecaptcha = () => {
        const recaptchaToken = recaptchaRef.current.getValue();
        if (!recaptchaToken) {
            setError('Invalid reCaptcha');
            return null;
        }
        return true;
    };

    const resetPassword = () => {
        if (checkEmail() && checkRecaptcha()) {
            Axios.post('/accounts/resetpassword',
                { email: email, token: recaptchaRef.current.getValue() },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => {
                    if (res.status === 200) {
                        setCtxEmail({ reset: email });
                        navigate(`/resetpassword/${res.data.data._id}/otp`);
                    }
                })
                .catch(err => {
                    if (err?.response?.status === 404) {
                        setError('Account does not exist');
                        recaptchaRef.current.reset();
                    }
                })
            setError('');
        };
    };

    return (
        <main className='forgotpwd'>
            <div className='form' style={{ width: '400px', height: '500px' }}>
                <div className='form_container'>
                    <div className='form_header'>
                        <h2>Forgot Password?</h2>
                    </div>
                    <FormInputText
                        label='Enter Email Address'
                        autoFocus
                        onChange={(e) => {
                            setError('');
                            setEmail((e.target.value).toLowerCase());
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && resetPassword()} />
                    <FormError nbsp>{error}</FormError>
                    <div className='form_captcha' style={{ marginTop: '20px' }}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                            onChange={() => console.log(recaptchaRef.current.getValue())}
                            theme='dark' />
                    </div>
                    <div className='form_button filled'
                        onClick={() => resetPassword()}>
                        Reset Password
                    </div>
                    <div className='form_button outlined'
                        onClick={() => navigate('/login')}>
                        Cancel
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;