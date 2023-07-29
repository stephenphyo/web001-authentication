import React from 'react';

/* CSS Imports */
import 'styles/components/form/FormError.css';

function FormError(props) {
    return (
        <div className='form_error'>
            <span>{props.children}</span>
            {props.nbsp && <span>&nbsp;</span>}
        </div>
    );
}

export default FormError;