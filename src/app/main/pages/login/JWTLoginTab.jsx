import React, {useEffect, useRef, useState} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import {useDispatch, useSelector} from 'react-redux';

import {setAuthFunction} from './../../helpers/setAuthMobile'

function JWTLoginTab(props) {
    const dispatch = useDispatch();
    const login = useSelector(({auth}) => auth.login);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (login.error && (login.error.email || login.error.password)) {
            formRef.current.updateInputsWithError({
                ...login.error
            });
            disableButton();
        }
    }, [login.error]);

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        setAuthFunction(model)
        dispatch(authActions.submitLogin(model));
    }


    return (
        <div className="w-full">
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >
                <TextFieldFormsy
                    className="mb-16"
                    type="text"
                    name="email"
                    label="نام کاربری"
                    validations={{
                        minLength: 4
                    },{
                        checkCharacters: function (values, value) {
                            let myRegex = /([A-Za-z0-9\-\_]+)/
                          return (!value || (value?.match(myRegex) ? value?.match(myRegex)[0] : '') === value) ? true : 'فقط حروف انگلیسی و عدد می توانید وارد کنید'; // You can return an error
                        }
                    }}
                    validationErrors={{
                        minLength: 'این فیلد باید حداقل ۴ کارکتر باشد'
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Icon className="text-20"
                                                                           color="action">email</Icon></InputAdornment>
                    }}
                    variant="outlined"
                    required
                />

                <TextFieldFormsy
                    className="mb-16"
                    type="password"
                    name="password"
                    label="کلمه عبور"
                    validations={{
                        minLength: 4
                    }}
                    validationErrors={{
                        minLength: 'این فیلد باید حداقل ۴ کارکتر باشد'
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Icon className="text-20"
                                                                           color="action">vpn_key</Icon></InputAdornment>
                    }}
                    variant="outlined"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16 normal-case"
                    aria-label="LOG IN"
                    disabled={!isFormValid}
                    value="legacy">
                    ورود
                </Button>
            </Formsy>
        </div>
    );
}

export default JWTLoginTab;
