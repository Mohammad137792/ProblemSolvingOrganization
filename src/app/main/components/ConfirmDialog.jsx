import React, {useReducer} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormInput from "./formControls/FormInput";
import DialogActions from "@material-ui/core/DialogActions";
import {Button, PropTypes} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

export function useDialogReducer(onConfirm) {
    const [state, dispatch] = useReducer(reducer, {display: false, data: {}, disabled: false});

    function reducer(state, updatedState) {
        return { ...state, ...updatedState };
    }

    function show_dialog(row) {
        dispatch({display: true, data: row})
    }

    function close_dialog() {
        dispatch({display: false, data: {}})
    }

    function on_confirm_dialog() {
        onConfirm(state.data)
        close_dialog()
    }

    function disable_confirm_button() {
        dispatch({disabled: true})
    }

    function enable_confirm_button() {
        dispatch({disabled: false})
    }

    return {
        ...state,
        show: show_dialog,
        close: close_dialog,
        confirm: on_confirm_dialog,
        disable: disable_confirm_button,
        enable: enable_confirm_button
    }
}

export default function ConfirmDialog({dialogReducer, title, content, confirmButtonText, cancelButtonText}) {
    return (
        <Dialog open={dialogReducer.display}
                onClose={dialogReducer.close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {content && <DialogContent>{content}</DialogContent>}
            <DialogActions>
                <Button onClick={dialogReducer.close} color="primary">{cancelButtonText}</Button>
                <Button onClick={dialogReducer.confirm} disabled={dialogReducer.disabled} color="primary" autoFocus>{confirmButtonText}</Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmDialog.defaultProps = {
    confirmButtonText: "بلی",
    cancelButtonText: "خیر",
}
