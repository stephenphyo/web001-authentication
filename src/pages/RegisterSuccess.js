import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/* CSS Imports */
import 'styles/pages/RegisterSuccess.css';
import 'styles/components/FormHeader.css';
import 'styles/components/FormButton.css';

/* Context Imports */
import EmailContext from 'contexts/EmailContext';

function RegisterSuccess() {

    /* useNavigate */
    const navigate = useNavigate();

    /* useContext */
    const { email: ctxEmail } = useContext(EmailContext);

    return (
        <main className='regsuccess'>
            <div className='form'>
                <div className='form_container'>
                    <div className='form_header'>
                        <h2>Registration Successful</h2>
                    </div>
                    <div className='form_text'>
                        <p>Your account <span id='email'>{ctxEmail['register']}</span> has been created successfully</p>
                    </div>
                    <div className='form_button filled'
                        onClick={() => {
                            navigate('/login', { state: { fromRegister: true } });
                        }}>
                        Go to Login
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RegisterSuccess;