import React, { forwardRef } from 'react';

/* CSS Imports */
import 'styles/components/form/FormInputText.css';

const FormInputText = forwardRef((props, ref) => {
    return (
        <div
            className='form_input_text'>
            <input
                type='text'
                required='required'
                ref={ref}
                {...props} />
            <label>{props.label}</label>
            <hr />
        </div>
    );
});

export default FormInputText;