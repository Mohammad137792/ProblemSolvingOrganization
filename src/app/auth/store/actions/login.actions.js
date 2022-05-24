import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import FadakAPIService from 'app/services/fadakAPIService';
import { setUserData } from './user.actions';
import * as Actions from 'app/store/actions';
import { setAlertContent } from "app/store/actions";
import { addConstData, emptyConstData } from "../../../store/actions/fadak";
import { SERVER_URL } from 'configs';
import axios from 'axios'
import { setPermision } from "app/store/actions/fadak";

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';


export function submitLogin({ email, password }) {
    return (dispatch) =>
        FadakAPIService.signIn(email, password)
            .then((res) => {
                dispatch(setUserData(res));
                dispatch(emptyConstData())

                FadakAPIService.getPermisionList().then(response => {
                    
                    dispatch(setPermision(response))

                    return dispatch({
                        type: LOGIN_SUCCESS
                    });
                })}

            
            )
            .catch(error => {
                const res = error.response;
                dispatch({
                    type: LOGIN_ERROR,
                    payload: error
                });
                let message = (res) ?
                    'نام کاربری یا کلمه عبور نادرست است' :
                    'خطایی رخ داده لطفا مجددا تلاش کنید';
                dispatch(setAlertContent('error', message))
            });
}

export function submitLoginWithFireBase({ username, password }) {
    return (dispatch) =>
        firebaseService.auth && firebaseService.auth.signInWithEmailAndPassword(username, password)
            .then(() => {
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            })
            .catch(error => {
                const usernameErrorCodes = [
                    'auth/email-already-in-use',
                    'auth/invalid-email',
                    'auth/operation-not-allowed',
                    'auth/user-not-found',
                    'auth/user-disabled'
                ];
                const passwordErrorCodes = [
                    'auth/weak-password',
                    'auth/wrong-password'
                ];

                const response = {
                    username: usernameErrorCodes.includes(error.code) ? error.message : null,
                    password: passwordErrorCodes.includes(error.code) ? error.message : null
                };

                if (error.code === 'auth/invalid-api-key') {
                    dispatch(Actions.showMessage({ message: error.message }));
                }

                return dispatch({
                    type: LOGIN_ERROR,
                    payload: response
                });
            });
}
