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
import {setFormDataHelper} from "../../../../../helpers/setFormDataHelper";
import {FusePageSimple} from "@fuse";
import { Paper } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {INPUT_TYPES} from "../../../../../helpers/setFormDataHelper";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import {Add} from "@material-ui/icons";
import DatePicker from "../../../../../components/DatePicker";
import CTable from "../../../../../components/CTable";
import InlineTable from "../../../../../components/inlinetabel";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tables from "./Tables"
import ModalDelete from "./ModalDelete";
import {makeStyles} from "@material-ui/core/styles";

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


const SystemBaseInfo = ({addFormData,  setFormData, formData,tableContent,enableDisableCreate,expandedAccor,addRow,cancelAdd,idCompete,cancelUpdate,createDate1,
                            setCurrentData, currentData,idDelete,competeToEdit,handleClose,setTableContent,setDisplay,open,display,enablecancel,updateRow,
                            competenceModelIdGet,settitle,title, setexpandedAccor,setEnableDisableCreate,addrowss,
                            settitle1, title1, addrowss1
                        }) => {

    const [afteraddId, setafteraddId] = React.useState(false);

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
                    <CardHeader title="تعریف مدل شایستگی"/>
                    {display &&
                    <>
                        <Grid container spacing={2}>
                            {
                                console.log("cuuuuuu",currentData)
                            }

                            <Grid item xs={12} md={4}>
                                <TextField  fullWidth required
                                            variant="outlined" id="title" name="title"
                                            label="عنوان مدل شایستگی"
                                            value={formData.title}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    console.log("vvvvvv",title,title1,afteraddId)
                                                    settitle1(true)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["title"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                    setafteraddId(true)
                                                    settitle(true)

                                                } else if((e.target.value) !== ''){
                                                    settitle1(false)
                                                    formData.CompetenceModel = {...formData.CompetenceModel,["title"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                    setafteraddId(false)
                                                    settitle(false)

                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={((  title === true) && addrowss === true) || (addrowss1 === true && title1 === true) ?  classes.as :classes.formControl }
                                            helperText={((  title ===true) && addrowss === true) || (addrowss1 === true && title1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeToEdit !== -1 && currentData.getCompetenceModel[competeToEdit]
                                                && currentData.getCompetenceModel[competeToEdit].title) ?  currentData.getCompetenceModel[competeToEdit].title : ''}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <DatePicker variant="outlined" id="createDate"
                                    // disabled={createDate1 === true ? true : false}
                                            disabled={true}
                                    // value = {formData.thruDate  ?? ((familyToEdit !== -1
                                    // )
                                    //     ? currentData.result[familyToEdit].relationship.thruDate : null)}
                                            setValue={handleDateChangecreateDate}
                                            value={Date.now()}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="تاریخ ایجاد  " fullWidth/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField  fullWidth
                                            variant="outlined" id="description" name="description"
                                            label=" توضیحات " multiline rows={3}
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
                                            defaultValue={(competeToEdit !== -1 && currentData.getCompetenceModel[competeToEdit]
                                                && currentData.getCompetenceModel[competeToEdit].description) ?
                                                currentData.getCompetenceModel[competeToEdit].description : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <ModalDelete currentData={currentData}
                                             setCurrentData={setCurrentData} open={open} id={idDelete} handleClose={handleClose}
                                             setTableContent={setTableContent} competeToEdit={competeToEdit} setDisplay={setDisplay}/>
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
                                                                         updateRow(currentData && currentData.getCompetenceModel && currentData.getCompetenceModel[competeToEdit]
                                                                             && currentData.getCompetenceModel[competeToEdit].competenceModelId)
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
                                    {/*expanded={expandedAccor}*/}
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
                                        <Tables competenceModelIdGet={competenceModelIdGet} setexpandedAccor={setexpandedAccor}
                                                setEnableDisableCreate={setEnableDisableCreate} expandedAccor={expandedAccor}
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
                        { title: 'ردیف ', field: 'criterionRow' },
                        { title: 'عنوان مدل شایستگی ', field: 'criterionTitle' },
                        { title: 'تاریخ ایجاد', field: 'createDate' },
                        { title: ' توضیحات', field: 'description' },
                        { title: 'ویرایش/نمایش', field: 'modify',},
                        { title: 'حذف', field: 'delete',},

                    ]}   title="تعریف مدل شایستگی "
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


export default SystemBaseInfo;
