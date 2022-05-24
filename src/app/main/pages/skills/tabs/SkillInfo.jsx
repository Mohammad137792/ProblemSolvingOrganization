import React from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader, Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem, Select,
    TextField, Typography
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import {setFormDataHelper} from "../../../helpers/setFormDataHelper";
import {FusePageSimple} from "../../../../../@fuse";
import { Paper } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {INPUT_TYPES} from "../../../helpers/setFormDataHelper";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import {Add} from "@material-ui/icons";
import DatePicker from "../../../components/DatePicker";
import CTable from "../../../components/CTable";
import InlineTable from "../../../components/inlinetabel";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tables from "./Tables"
import ModalDelete from "./ModalDelete";
import {makeStyles} from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';

const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red"
    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        }
    }
}));
const useStyles = makeStyles((theme,theme1) => ({
    showTable:{
      display:"block"
    },
    hideTable:{
      display:"none"
    },
    label: {
        display: 'block',
    },
    input: {
        width: 1000,
    },
    listbox: {
        width:1000,
        margin: 0,
        padding: 0,
        zIndex: 1,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        maxHeight: 200,
        border: '1px solid rgba(0,0,0,.25)',
        '& li[data-focus="true"]': {
            backgroundColor: '#4a8df6',
            color: 'white',
            cursor: 'pointer',
        },
        '& li:active': {
            backgroundColor: '#2977f5',
            color: 'white',
        },
    },
    theme1:{

    },
//     &.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary {
//   display : "none"
// },
    adornedStart : {
        // paddingRight:0,
        display : "none"
    },
    buttonStyle: {
        disabled: true
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    // textField: {
    //     width: 200,
    //     "&:hover .MuiInputLabel-root": {
    //         color: theme.palette.text.primary
    //     },
    //     "& .Mui-focused.MuiInputLabel-root": {
    //         color: theme.palette.primary.main
    //     }
    // },
    as:{
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
    div: {
        // "&:hover .MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        //     color: theme.palette.text.primary
        // },
        // "&.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
            // display : "none"
        }
    }
}));


const SkillInfo = ({addFormData,  setFormData, formData,tableContent,enableDisableCreate,expandedAccor,addRow,cancelAdd,idCompete,cancelUpdate,createDate1,
                            setCurrentData, currentData,idDelete,competeToEdit,handleClose,setTableContent,setDisplay,open,display,enablecancel,updateRow,
                            competenceModelIdGet,settitle,title, setexpandedAccor,setEnableDisableCreate,addrowss,
                            settitle1, title1, addrowss1,skillCode, skillCode1, setskillCode, setskillCode1,setcompetenceModelIdGet,
                       dataCriteria5,addrowss365,setaddrowss365,setcompeteToEdit
                        }) => {

    const [afteraddId, setafteraddId] = React.useState(false);
    const [state1, setState1] = React.useState({
        status: ""
    });
    const handleChange = name => event => {
        setState1({ ...state1, [name]: event.target.checked });
        console.log("dcdcdcdcdcd",event.target.checked)
        if(event.target.checked === true){
            formData.status = event.target.checked;
            formData.CompetenceModel ={...formData.CompetenceModel,["status"]: formData.status};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)
        }else if (event.target.checked === false){
            formData.status = event.target.checked;
            formData.CompetenceModel ={...formData.CompetenceModel,["status"]: formData.status};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)
        }
    };
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();

    const handleDateChangecreateDate = (date1)=>{
        // if( date1 !== null) {
        //     formData.createDate = date1.format("Y-MM-DD");
        //     formData.CompetenceModel = {...formData.CompetenceModel, ["createDate"]: formData.createDate};
        //     const newFormdata = Object.assign({}, formData);
        //     setFormData(newFormdata)
        // }
        // else if(date1 === null){
        //     formData.CompetenceModel ={...formData.CompetenceModel,["createDate"]: ""}
        //     const newFormdata = Object.assign({},formData)
        //     setFormData(newFormdata)
        // }



        if( date1 !== null){
            formData.createDate = date1._d;
            formData.CompetenceModel ={...formData.CompetenceModel,["createDate"]: Math.round(new Date(formData.createDate).getTime())   };
            // formData.asset ={...formData.asset,["fromDate"]: Math.round(new Date(date1._d).getTime())};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)
        }
        else if(date1 === null){
            formData.CompetenceModel ={...formData.CompetenceModel,["createDate"]: ""}
            const newFormdata = Object.assign({},formData)
            setFormData(newFormdata)
        }

    };
    return (
        <>

            <Card >
                <CardContent>
                    <CardHeader title="تعریف  گروه مهارت"/>
                    {display &&
                    <>
                        <Grid container spacing={2}>
                            {
                                console.log("cuuuuuu",currentData)
                            }

                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="skillCode" name="skillCode"
                                            label="کد گروه مهارت  "
                                            value={formData.skillCode}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    setskillCode(true)
                                                    setskillCode1(true)

                                                    formData.CompetenceModel = {...formData.CompetenceModel,["skillCode"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    setskillCode(false)
                                                    setskillCode1(false)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["skillCode"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={((  skillCode === true) && addrowss === true) || (addrowss1 === true && skillCode1 === true ) ?  classes.as :classes.formControl }
                                            helperText={((  skillCode ===true) && addrowss === true) || (addrowss1 === true && skillCode1 === true ) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                                && currentData.resultList[competeToEdit].skillCode) ?
                                                currentData.resultList[competeToEdit].skillCode : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="title" name="title"
                                            label="عنوان گروه مهارت"
                                            value={formData.title}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    settitle(true)
                                                    settitle1(true)
                                                    console.log("vvvvvv",title,title1,afteraddId)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["title"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)

                                                } else if((e.target.value) !== ''){
                                                    settitle(false)
                                                    settitle1(false)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["title"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)

                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={((  title === true) && addrowss === true) || (addrowss1 === true && title1 === true) ?  classes.as :classes.formControl }
                                            helperText={((  title ===true) && addrowss === true) || (addrowss1 === true && title1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                                && currentData.resultList[competeToEdit].title) ?  currentData.resultList[competeToEdit].title : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth
                                            variant="outlined" id="sequenceNum" name="sequenceNum"
                                            label="ترتیب نمایش  " type={"number"}
                                            value={formData.title}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    console.log("vvvvvv",title,title1,afteraddId)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["sequenceNum"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)

                                                } else if((e.target.value) !== ''){
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["sequenceNum"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)

                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                    // className={((  title === true) && addrowss === true) || (addrowss1 === true && title1 === true) ?  classes.as :classes.formControl }
                                    // helperText={((  title ===true) && addrowss === true) || (addrowss1 === true && title1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                    // FormHelperTextProps={{ classes: helperTestClasses }}
                                    defaultValue={(competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                        && currentData.resultList[competeToEdit].sequenceNum) ?  currentData.resultList[competeToEdit].sequenceNum : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                {
                                    console.log("FFFFFFFF",currentData)
                                }
                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch name="status"
                                                           value={formData.status}
                                                         defaultChecked={(competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                                             && (currentData.resultList[competeToEdit].status === true))

                                                             ? true :(
                                                                 (competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                                                     && currentData.resultList[competeToEdit].status === 'Y' ? (true) : false
                                                                 )
                                                             )}
                                                           onChange={handleChange('status')}
                                        />}
                                        label="فعال"/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField  fullWidth multiline rows={3}
                                            variant="outlined" id="description" name="description"
                                            label=" توضیحات "
                                            value={formData.description}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["description"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["description"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            defaultValue={(competeToEdit !== -1 && currentData.resultList[competeToEdit]
                                                && currentData.resultList[competeToEdit].description) ?
                                                currentData.resultList[competeToEdit].description : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <ModalDelete currentData={currentData}
                                             setCurrentData={setCurrentData} open={open} id={idDelete} handleClose={handleClose}
                                             setTableContent={setTableContent} competeToEdit={competeToEdit} setDisplay={setDisplay}
                                             setcompetenceModelIdGet={setcompetenceModelIdGet} competenceModelIdGet={competenceModelIdGet} setEnableDisableCreate={setEnableDisableCreate}
                                             setexpandedAccor={setexpandedAccor}
                                />
                                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                                    { !enableDisableCreate ? <Button variant="outlined"  id="add" variant="contained" color="primary" startIcon={<Add/>}
                                                                     className="mt-5"
                                                                     onClick={addRow}
                                    >افزودن</Button> : null }
                                    { !enableDisableCreate ? <Button variant="outlined" style={{marginLeft : "20px"}} variant="contained"
                                                                     className="mt-5"
                                                                     onClick={cancelAdd}
                                    >لغو</Button> : null }
                                </Grid>
                                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                                    { enableDisableCreate ?  <Button id="modify" variant="contained"
                                                                     className="mt-5"   disabled={(!enableDisableCreate) } style={{color:"white",backgroundColor:"green"}}
                                                                     onClick={() =>
                                                                         updateRow(currentData && currentData.resultList
                                                                             && currentData.resultList[competeToEdit]
                                                                             && currentData.resultList[competeToEdit].skillId)
                                                                     }
                                    >ثبت</Button> : null}
                                    { (enableDisableCreate ) ?  <Button id="modify" variant="contained" disabled={enablecancel}
                                                                        className="mt-5" style={{marginLeft : "20px"}}
                                                                        onClick={cancelUpdate}
                                    >لغو</Button> : null }
                                </Grid>
                            </Grid>

                            {
                                console.log("idCompeteidCompete",competenceModelIdGet)
                            }
                            <Grid item xs={12} md={12} className={expandedAccor === true ? classes.showTable : classes.hideTable }>
                                {/* expanded={expanded}  */}
                                {/*<Accordion*/}
                                    {/*expanded={true}*/}
                                    {/*variant={"outlined"}>*/}
                                    {/*<AccordionSummary*/}
                                        {/*expandIcon={<ExpandMoreIcon />}*/}
                                        {/*aria-controls="panel1a-content"*/}
                                        {/*id="panel1a-header"*/}
                                    {/*>*/}
                                        {/*<Typography >*/}

                                            {/*<Button  size="medium"></Button>*/}
                                        {/*</Typography>*/}
                                    {/*</AccordionSummary>*/}
                                    {/*<AccordionDetails style={{ width: "100%" }}>*/}
                                        {/* onChange={() => setExpanded(prevState => !prevState)} */}
                                    <Tables competenceModelIdGet={competenceModelIdGet}
                                            setexpandedAccor={setexpandedAccor}
                                            expandedAccor={expandedAccor}
                                            setEnableDisableCreate={setEnableDisableCreate}
                                            dataCriteria5={dataCriteria5} addrowss365={addrowss365} setaddrowss365={setaddrowss365}
                                        // competenceModelId={competenceModelId}
                                    />
                                        {/* <SearchPersonnelForm formValues={formValues} setFormValues={setFormValues} handleChanges={setExpanded} reloadTable={reloadTable} data={data} /> */}
                                    {/*</AccordionDetails>*/}
                                {/*</Accordion>*/}

                            </Grid >


                            {/*<CTable headers={[*/}
                            {/*{*/}
                            {/*id: "criterionRow",*/}
                            {/*label: "ردیف"*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "criterionTitle",*/}
                            {/*label: "عنوان مدل شایستگی "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "createDate",*/}
                            {/*label: "تاریخ ایجاد  "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "description",*/}
                            {/*label: "توضیحات    "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "delete",*/}
                            {/*label: " حذف"*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "modify",*/}
                            {/*label: " ویرایش"*/}
                            {/*},*/}
                            {/*]} rows={tableContent}/>*/}
                        </Grid>

                    </>}

                </CardContent>
            </Card>
            <Card style={{margin:"auto"}}>
                <CardContent>
                    <InlineTable  columns={[
                        { title: 'کد گروه مهارت ', field: 'code' },
                        { title: 'عنوان گروه مهارت  ', field: 'title' },
                        { title: 'ترتیب نمایش ', field: 'seq' },
                        { title: ' فعال', field: 'description' },
                        { title: 'ویرایش/نمایش', field: 'modify',},
                        { title: 'حذف', field: 'delete',},

                    ]}   title="تعریف گروه مهارت "
                                  grouping={true} exportButton={true}
                        // title="لیست پرسنل"
                        // grouping={true}
                        // exportButton={true}
                                  data={tableContent}
                    >
                    </InlineTable>
                </CardContent>
            </Card>
        </>
    );
}


export default SkillInfo;
