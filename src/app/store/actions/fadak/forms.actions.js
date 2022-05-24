/**
 * @auth Farbod Shams
 * Fetch your post requests using submitPost action creator so it'll automatically handles success and failed alerts
 * you can also use formState.isFetching.[YOUR BUTTON ID] store sub, in order to disable your submit button or render
 * a circularLoading besides the button.
 * Also addFormData action creator is responsible for adding all tab data to store in order to make data persist during
 * tab change.
 * NOTE: It's a boilerplate that you have to implement data store on tab change in your own page.
 */

import axios from "axios";
import {ALERT_TYPES, setAlertContent} from "./alert.actions";
import {AXIOS_TIMEOUT} from "../../../../configs";
import {SERVER_URL} from "../../../../configs";

export const FETCH_STARTED = 'FETCH_STARTED';
export const FETCH_FAILED = 'FETCH_FAILED';
export const FETCH_SUCCEED = 'FETCH_SUCCEED';
export const ADD_FORM_DATA = 'ADD_FORM_DATA';

export const addFormData = (key, val) => ({
    type: ADD_FORM_DATA,
    payload: {[key]: val}
})

export const fetchStart = (id) => ({
    type: FETCH_STARTED,
    payload: {id}
});

export const fetchFailed = (id, error) => ({
    type: FETCH_FAILED,
    payload: {id, error}
});

export const fetchSucceed = (id, response) => ({
    type: FETCH_SUCCEED,
    payload: {id, response}
});

export const submitPost = (url, data, id) => dispatch => new Promise((Resolve, Reject) => {
    dispatch(fetchStart(id));
    const axiosConfig = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            api_key: localStorage.getItem('api_key')
        }
    }
    axios.post(SERVER_URL + url, data, axiosConfig).then(response => {
        dispatch(fetchSucceed(id, response));
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
        Resolve(response);
    }).catch(error => {
        dispatch(fetchFailed(id, error));
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطایی در ثبت اطلاعات رخ داده'));
        Reject(error);
    })
});
export const submitDelete = (url, data, id) => dispatch => new Promise((Resolve, Reject) => {
    dispatch(fetchStart(id));
    const axiosConfig = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            api_key: localStorage.getItem('api_key')
        }
    }
    axios.delete(SERVER_URL + url, data, axiosConfig).then(response => {
        dispatch(fetchSucceed(id, response));
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'))
        Resolve(response);
    }).catch(error => {
        dispatch(fetchFailed(id, error));
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطایی در حذف اطلاعات رخ داده'));
        Reject(error);
    })
});
export const submitPut = (url, data, id) => dispatch => new Promise((Resolve, Reject) => {
    dispatch(fetchStart(id));
    const axiosConfig = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            api_key: localStorage.getItem('api_key')
        }
    }
    axios.put(SERVER_URL + url, data, axiosConfig).then(response => {
        dispatch(fetchSucceed(id, response));
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت به روز رسانی شد'))
        Resolve(response);
    }).catch(error => {
        dispatch(fetchFailed(id, error));
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطایی در به روزرسانی اطلاعات رخ داده'));
        Reject(error);
    })
});
export const axiosGet = (url) =>  new Promise((Resolve, Reject) => {
    const axiosConfig = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            api_key: localStorage.getItem('api_key')
        }
    }
    axios.get(SERVER_URL + url, axiosConfig).then(response => {
        Resolve(response);
    }).catch(error => {
        Reject(error);
    })
});