import React, { useState } from 'react';
import FormField from './formField';

function OnboardingForm() {
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [corporationNumberError, setCorporationNumberError] = useState("");
    //add value states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [corporationNumber, setCorporationNumber] = useState('');
    const [isFieldLoading, setIsFieldLoading] = useState(false);

    const isFormInvalid = firstNameError || lastNameError || phoneNumberError || corporationNumberError;
    const handleSubmit = (e) => {
        let preventSend = false;
        e.preventDefault();
        if (firstName.length === 0) {
            preventSend = true;
            setFirstNameError('Please enter a first name');
        }
        if (lastName.length === 0) {
            preventSend = true;
            setLastNameError('Please enter a last name');
        }
        if (phoneNumber.length === 0) {
            preventSend = true;
            setPhoneNumberError('Please enter a phone number');
        }
        if (corporationNumber.length === 0) {
            preventSend = true;
            setCorporationNumberError('Please enter a corporation number');
        }
        if (!isFormInvalid && !preventSend && !isFieldLoading) {
            const formData = {
                firstName: firstName,
                lastName: lastName,
                corporationNumber: corporationNumber,
                phone: phoneNumber
            };
            fetch('https://front-end-home-task-api.onrender.com/profile-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(data => {
                console.log("Successful Submit!");
            })
            .catch(error => {
                console.error(error);
            });
        }


    };
    const validators = {
        firstName: (value) => {
            setFirstName(value);
            if (value.length === 0) {
                setFirstNameError("Please enter a first name");
            } else if (value.length > 50) {
                setFirstNameError("Must be less than 50 characters");
            } else {
                setFirstNameError("");
            }
        },
        lastName: (value) => {
            setLastName(value);
            if (value.length === 0) {
                setLastNameError("Please enter a last name");
            } else if (value.length > 50) {
                setLastNameError("Must be less than 50 characters");
            } else {
                setLastNameError("");
            }
        },
        phoneNumber: (value) => {
            setPhoneNumber(value);
            if (!/^\+1\d{10}$/.test(value)) {
                setPhoneNumberError("Please enter a valid Canadian phone number starting with +1");
            } else {
                setPhoneNumberError("");
            }
        },
        corporationNumber: async (value) => {
            setCorporationNumber(value);
            setIsFieldLoading(true);
            if (value.length !== 0 && value.length !== 9) {
                setCorporationNumberError("Please enter a 9 character corporation number");
                setIsFieldLoading(false);
                return;
            }
            await fetch(`https://front-end-home-task-api.onrender.com/corporation-number/${value}`)
                .then(response => response.json())
                .then((data) => {
                    if (data.valid === false) {
                        setCorporationNumberError("Invalid corporation number");
                    } else {
                        setCorporationNumberError("");
                    }
                })
                .catch((error) => {
                    console.log("invalid corporation number");
                    setCorporationNumberError("Invalid corporation number");
                }).then(() => {
                    setIsFieldLoading(false);
                }
            );
        }
    };

    return (
        <div className='onboarding-form'>
            <div className='onboarding-form__title'>Onboarding Form</div>
            <form className='onboarding-form__main-form' onSubmit={handleSubmit}>
                <div className='onboarding-form__name'>
                    <FormField
                        title={"First Name"}
                        validator={validators.firstName}
                        id="firstName"
                        error={firstNameError}

                    />
                    <FormField
                        title={"Last Name"}
                        validator={validators.lastName}
                        id="lastName"
                        error={lastNameError}
                    />
                </div>
                <div className='onboarding-form__phone-number'>
                    <FormField
                        title={"Phone Number"}
                        validator={validators.phoneNumber}
                        id="phoneNumber"
                        error={phoneNumberError}
                    />
                </div>
                <div className='onboarding-form__corporation-number'>
                    <FormField
                        title={"Corporation Number"}
                        validator={validators.corporationNumber}
                        id="corporationNumber"
                        error={corporationNumberError}
                    />
                </div>
                <button className="onboarding-form__submit" type="submit" disabled={isFormInvalid}>Submit</button>
            </form>
        </div>
    );
}

export default OnboardingForm;