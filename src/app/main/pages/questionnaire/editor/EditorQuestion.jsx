import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ReportIcon from "@material-ui/icons/Report";
import ReportOffIcon from "@material-ui/icons/ReportOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DeleteIcon from "@material-ui/icons/Delete";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Collapse from "@material-ui/core/Collapse";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import {Typography} from "@material-ui/core";
import {ReactSortable} from "react-sortablejs";
import Tooltip from "@material-ui/core/Tooltip";
import FormInput from "../../../components/formControls/FormInput";

function ChoicesManagement({choices, set_choices, type, add_removedObjects}) {
    const handle_change_choice = (index) => (e) => {
        let updatedChoices = Object.assign([],choices)
        updatedChoices[index][e.target.name] = e.target.value
        set_choices(updatedChoices)
    }
    const handle_change_choice_value = (index) => (method) => {
        let updatedChoices = Object.assign([],choices)
        updatedChoices[index] = Object.assign({},updatedChoices[index],method({}))
        set_choices(updatedChoices)
    }
    const handle_add_choice = () => {
        let updatedChoices = Object.assign([],choices)
        updatedChoices.push({value: "", label: ""})
        set_choices(updatedChoices)
    }
    const handle_delete_choice = (index) => () => {
        let updatedChoices = Object.assign([],choices)
        let removedItem = updatedChoices.splice(index,1)
        set_choices(updatedChoices)
        if(removedItem[0].itemId)
            add_removedObjects("item",removedItem[0].itemId)
    }
    return (
        <React.Fragment>
            <div className="check-management-header">
                <div style={{width:"160px", marginRight:"72px"}}>عنوان گزینه</div>
                <div style={{width:"160px", marginLeft:"36px"}}>مقدار</div>
            </div>
            <ReactSortable
                list={choices}
                setList={set_choices}
                handle={".choice-handle"}
                group={{name: "choices"}}
                animation={200}
                delayOnTouchStart={true}
                delay={false}
                ghostClass="question-ghost"
            >
            {choices.map((opt,ind)=>(
                <Box display="flex" mb={1} key={ind}>
                    <Box mr={2} className="choice-handle">
                        <Tooltip title="جابجایی گزینه">
                            <DragIndicatorIcon fontSize="small"/>
                        </Tooltip>
                    </Box>
                    <Box mr={2}>
                        <Typography color="textSecondary">
                            {type==="check" ? (
                                <CheckBoxOutlineBlankIcon fontSize="small"/>
                            ):(
                                <RadioButtonUncheckedIcon fontSize="small"/>
                            )}
                        </Typography>
                    </Box>
                    <Box>
                        <TextField type="text" size="small" placeholder="گزینه..." name="label" value={opt.label||""} onChange={handle_change_choice(ind)} error={!opt.label}/>
                    </Box>
                    <Box>
                        {/*<TextField type="text" size="small" placeholder="برابر عنوان" name="value" value={opt.value||""} onChange={handle_change_choice(ind)} />*/}
                        <FormInput grid={false} variant="standard" type="number" size="small" placeholder="برابر عنوان" name="value" valueObject={opt} valueHandler={handle_change_choice_value(ind)} />
                    </Box>
                    <Box>
                        <Tooltip title="حذف گزینه">
                            <IconButton size="small" onClick={handle_delete_choice(ind)}>
                                <HighlightOffIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            ))}
            </ReactSortable>
            <Box display="flex">
                <div style={{marginRight:"32px"}}>
                    <Tooltip title="افزودن گزینه جدید">
                        <IconButton size="small" onClick={handle_add_choice}>
                            <AddCircleOutlineIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>
        </React.Fragment>
    )
}

export default function EditorQuestion({number, question, set_question, delete_question, add_removedObjects}) {
    const [more, set_more] = React.useState(false)

    const handle_change_text = (e) => {
        set_question(e.target.name, e.target.value)
    }
    const handle_change_check = (e) => {
        set_question(e.target.name, e.target.checked?"Y":"N")
    }
    const toggle_visibility = () => {
        set_question("display", question.display==="Y"?"N":"Y")
    }
    const toggle_required = () => {
        set_question("required", question.required==="Y"?"N":"Y")
    }
    const handle_change_select = (name) => (getValue) => {
        set_question(name, getValue({})[name])
    }
    const handle_change_choices = (value) => {
        set_question("items", value)
    }
    return (
        <div className="question-editor">
            <Grid container spacing={2}>
                <Grid item xs={12} className="header">
                    <Box display="flex">
                        <Box mr={1} className="question-handle">
                            <Tooltip title="جابجایی سوال">
                                <MenuIcon fontSize="small"/>
                            </Tooltip>
                        </Box>
                        <Box flexGrow={1}>
                            <FormControlLabel
                                labelPlacement="start"
                                label="نام سوال: "
                                className="text-field"
                                control={<TextField type="text" size="small" placeholder="سوال..." name="name" value={question.name||""} onChange={handle_change_text} />}  />
                        </Box>
                        <Box className="toolbar-more">
                            <Tooltip title={question.required==="Y" ? "اختیاری کردن سوال" : "اجباری کردن سوال"}>
                                <IconButton size="small" onClick={toggle_required}>
                                    {question.required==="Y" ? (
                                        <ReportIcon fontSize="small"/>
                                    ):(
                                        <ReportOffIcon fontSize="small"/>
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={question.display==="Y" ? "مخفی کردن سوال" : "نمایش سوال"}>
                                <IconButton size="small" onClick={toggle_visibility}>
                                    {question.display==="Y" ? (
                                        <VisibilityIcon fontSize="small"/>
                                    ):(
                                        <VisibilityOffIcon fontSize="small"/>
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف سوال">
                                <IconButton size="small" onClick={delete_question}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box ml={2}>
                            <Tooltip title={more ? "بستن پنجره تنظیمات" : "نمایش تنظیمات بیشتر"}>
                                <IconButton size="small" onClick={()=>set_more(prevState => !prevState)}>
                                    {more ? (
                                        <UnfoldLessIcon fontSize="small"/>
                                    ):(
                                        <UnfoldMoreIcon fontSize="small"/>
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Collapse in={more}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    labelPlacement="start"
                                    label="راهنمای سوال: "
                                    className="text-field"
                                    control={<TextField type="text" size="small" placeholder="ندارد" name="hint" value={question.hint||""} onChange={handle_change_text} />}  />
                                <FormControlLabel
                                    labelPlacement="start"
                                    label="وزن سوال:"
                                    className="text-field"
                                    control={<TextField type="number" size="small" name="weight" min={0} placeholder="1" value={question.weight||0} onChange={handle_change_text}/>}  />
                                <FormControlLabel
                                    labelPlacement="start"
                                    label="پاسخ صحیح: "
                                    className="text-field"
                                    control={
                                        question.type==="number" ? <TextField type="number" size="small" placeholder="ندارد" name="trueAnswerValue" value={question.trueAnswerValue||""} onChange={handle_change_text} /> :
                                            question.type==="radio" ? <FormInput type="select" options={question.items.map(i => ({id: i.value?.length?i.value:i.label, label: i.label}))} optionIdField="id" optionLabelField="label" variant="standard" size="small" placeholder="ندارد" name="trueAnswerValue" grid={false} valueObject={question} valueHandler={handle_change_select("trueAnswerValue")} /> :
                                                question.type==="check" ? <FormInput type="multiselect" options={question.items.map(i => ({id: i.value?.length?i.value:i.label, label: i.label}))} optionIdField="id" optionLabelField="label" variant="standard" size="small" placeholder="ندارد" name="trueAnswerValue" grid={false} valueObject={question} valueHandler={handle_change_select("trueAnswerValue")} /> :
                                                    <TextField type="text" size="small" placeholder="ندارد" name="trueAnswerValue" value={question.trueAnswerValue||""} onChange={handle_change_text} />
                                    }/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        label="نمایش سوال"
                                        className="form-grid"
                                        control={<Switch size="small" name="display" checked={question.display!=="N"} onChange={handle_change_check} />}/>
                                    <FormControlLabel
                                        label="اجباری"
                                        className="form-grid"
                                        control={<Switch size="small" name="required" checked={question.required==="Y"} onChange={handle_change_check} />}/>
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <Box my={1} display="flex">
                        {question.required==="Y" && <span className="question-required">*&nbsp;</span>}
                        <span>{number}.&nbsp;</span>
                        <TextField type="text" size="small" name="title" placeholder="صورت سوال؟" fullWidth multiline value={question.title||""} onChange={handle_change_text}/>
                        {question.hint && <Typography color="secondary"><InfoOutlinedIcon fontSize={"small"}/></Typography>}
                    </Box>
                    {question.type==="text" && (
                        <TextField type="text" size="small" variant="outlined" fullWidth disabled/>
                    )}
                    {question.type==="textarea" && (
                        <TextField type="textarea" size="small" variant="outlined" rows={4} multiline fullWidth disabled/>
                    )}
                    {question.type==="number" && (
                        <TextField type="number" size="small" variant="outlined" disabled/>
                    )}
                    {(question.type==="check" || question.type==="radio") && (
                        <ChoicesManagement type={question.type} choices={question.items} set_choices={handle_change_choices} add_removedObjects={add_removedObjects}/>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}
