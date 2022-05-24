import React from 'react'
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";

const FuncInput=(props)=>{
    const changeFormula=(event)=>{
        let value=event?.target?.value;
        props.setFormulaText(value);
    }
    const useStyles = makeStyles((theme) => ({
        lock: {
            resize: "none",
            height:"400px",
            width:"100%",
            fontSize:"15px",
        }
    }));
    const classes = useStyles();
    return (
        <textarea value={props.formulaText} dir="ltr" className={classes.lock}   onChange={(event)=>{changeFormula(event)}}>
        </textarea>
    )
}

export default FuncInput;