/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * Used to show an alert message. as mentioned in CAlert component, you DO NOT have to import any components to your
 * page in order to emit alerts. just use setAlertContent action creator. alert types are integrated in ALERT_TYPES
 * constant.
 */

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const SET_ALERT_CONTENT = 'SET_ALERT_CONTENT';
export const ALERT_TYPES = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success',
    INFO: 'info'
}

export const showAlert = () => ({type: SHOW_ALERT});
export const hideAlert = () => ({type: HIDE_ALERT});
export const setAlertContent = (type, message) => ({
    type: SET_ALERT_CONTENT,
    payload: {type, message}
});