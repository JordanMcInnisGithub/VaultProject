import React, { useState } from 'react';

const FormField = ({ title, validator, id, placeholder="", error }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleBlur = async (value) => {
        if (validator) {
            setIsLoading(true);
            await validator(value);
            setIsLoading(false);
        }
    };

    return (
        <div id={id} className='form-field'>
            <label className='form-field__label'>{title}</label>
            <input
                className={`form-field__input ${error ? 'form-field__input--error' : ''} ${isLoading ? 'form-field__input--loading' : ''}`}
                placeholder={placeholder}
                type="text"
                onBlur={(e) => handleBlur(e.target.value)}
            />
            {isLoading && <div className='form-field__loading'>Loading...</div>}
            {error && !isLoading && <div className='form-field__error'>{error}</div>}
        </div>
    );
};

export default FormField;