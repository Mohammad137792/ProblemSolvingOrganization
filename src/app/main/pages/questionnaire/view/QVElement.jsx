import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Radio} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from '@material-ui/core/styles';
import {shuffle} from "./QuestionnaireView";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
    info: {
        margin: "0 0 -6px 3px"
    }
}));

export default function QVElement({element, number, answer, setQuestionAnswer, defaultItemsArrangement, readOnly}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [items, setItems] = React.useState([])
    const elementId = element.elementId ?? `preview-q#${number}`

    React.useEffect(()=>{
        let itm = element.items
        let arrangement = element.itemsArrangementEnumId||"ArrInherit"
        if (arrangement==="ArrInherit")
            arrangement = defaultItemsArrangement
        switch (arrangement) {
            case "ArrSequence":
                itm = itm.sort((a,b)=>a.sequenceNum-b.sequenceNum)
                break
            case "ArrRandom":
                itm = shuffle(itm)
                break
            default:
        }
        setItems(itm)
    }, [element])

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const handleChangeText = (e) => {
        let questionAnswer = {
            elementId: elementId,
            elementType: element.type,
            value: e.target.value
        }
        if(element.type==="radio") {
            let selectedItem = element.items.find(i=>i.value===questionAnswer.value)
            if(selectedItem) {
                questionAnswer.itemId = selectedItem.itemId
            } else {
                selectedItem = element.items.find(i=>i.label===questionAnswer.value)
                if(selectedItem) {
                    questionAnswer.itemId = selectedItem.itemId
                }
            }
        }
        setQuestionAnswer(elementId, questionAnswer)
    }
    const handleChangeCheck = (itemId, itemValue, index) => (e) => {
        let questionAnswer = {
            elementId: elementId,
            elementType: element.type,
            value: {},
            ...answer[elementId],
        }
        questionAnswer.value[itemId??index] = {
            checked: e.target.checked,
            value: itemValue
        }
        setQuestionAnswer(elementId, questionAnswer)
    }
    const handleClearAnswer = () => {
        let questionAnswer = {
            elementId: elementId,
            elementType: element.type,
            value: null,
            itemId: null
        }
        setQuestionAnswer(elementId, questionAnswer)
    }
    const open = Boolean(anchorEl);
    const displayClear = element.type==="radio" && answer[elementId]?.value && element.required!=="Y" && !readOnly
    return (
        <Box my={2}>
            <Box mb={1}>
                <Typography align="justify">
                    {element.required==="Y" && <span className="question-required">*&nbsp;</span>}
                    {number}. {element.title}
                    {element.hint && (
                        <React.Fragment>
                            <Typography
                                component="span"
                                color="secondary"
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                            >
                                <InfoOutlinedIcon fontSize={"small"} className={classes.info}/>
                            </Typography>
                            <Popover
                                id="mouse-over-popover"
                                className={classes.popover}
                                classes={{
                                    paper: classes.paper,
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'right',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                            >
                                <Typography>{element.hint}</Typography>
                            </Popover>
                        </React.Fragment>
                    )}
                    {displayClear &&
                    <Button onClick={handleClearAnswer} color="secondary" size="small">حذف پاسخ</Button>
                    }
                </Typography>
            </Box>
            {element.type==="text" && (
                <TextField type="text" size="small" variant="outlined" fullWidth value={answer[elementId]?.value||""} onChange={handleChangeText} inputProps={{maxlength: 127, readOnly: readOnly}}/>
            )}
            {element.type==="textarea" && (
                <TextField type="textarea" size="small" variant="outlined" rows={4} multiline fullWidth  value={answer[elementId]?.value||""} onChange={handleChangeText} inputProps={{maxlength: 255, readOnly: readOnly}}/>
            )}
            {element.type==="number" && (
                <TextField type="number" size="small" variant="outlined" value={answer[elementId]?.value||""} onChange={handleChangeText} inputProps={{readOnly: readOnly}}/>
            )}
            {element.type==="radio" && (
                <RadioGroup aria-label={element.name} name={`q${number}-${element.name}-items`} value={answer[elementId]?.value||""} onChange={handleChangeText}>
                    <Grid container spacing={1}>
                        {items.map((item,index)=>(
                            <Grid key={index} item xs={12} md={element.colspan||3}>
                                <FormControlLabel
                                    label={item.label}
                                    value={item.value || item.label || "?"}
                                    className="form-grid"
                                    control={<Radio size="small" inputProps={{disabled: readOnly}}/>}/>
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>
            )}
            {element.type==="check" && (
                <Grid container spacing={1}>
                    {items.map((item,index)=>(
                        <Grid key={index} item xs={12} md={element.colspan||3}>
                            <FormControlLabel
                                label={item.label}
                                checked={answer[elementId]?.value[item.itemId??index]?.checked||false}
                                onChange={handleChangeCheck(item.itemId??index,item.value,index)}
                                className="form-grid"
                                control={<Checkbox size="small" color="secondary" inputProps={{disabled: readOnly}}/>}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    )
}
