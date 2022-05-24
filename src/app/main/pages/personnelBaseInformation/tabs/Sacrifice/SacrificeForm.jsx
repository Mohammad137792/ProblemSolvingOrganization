import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    TextField,
    FormControl,
    FormControlLabel,
    Switch,
    Button,


} from "@material-ui/core";
import { Add, Edit, Delete, Image, SignalCellularNull } from "@material-ui/icons"
import DatePicker from "../../../../components/DatePicker";
import CTable from "../../../../components/CTable";
import { INPUT_TYPES } from "../../../../helpers/setFormDataHelper";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ModalDelete from "./ModalDelete";
import { SERVER_URL } from "../../../../../../configs";
import { makeStyles } from "@material-ui/core/styles";

// set style

const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red",
        borderWidth: "1px",
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& label span": {
            color: "red"
        }
    },

    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        },
    }
}));
const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        }
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    NonDispaly: {
        display: "none"
    },
    enter: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "green"
        },
    }
});


  
const SacrificeForm = (props) => {
    //props value
    let { styleBorder, formValues, addFormValue, sacrificeDoc, editDiseaseHistory, handlerEditExperiment, setEditExperiment
        , setFormData, addToPerson, setDiseaseHistory, currentData, setCurrentData, handerDeleteExperiment, cancelHandler, editExperimentHander,
        setStyleBorder, handlerCloseModel, openModel, setOpenModel, setTableContent,setDisplay,
        tableContent, data, handerDelete, handlerEdit, setExperimentHistory, setVal, val } = props
    //set style val
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();

    //State

    const [tables, setTables] = useState();
    const [tablesExperiment, setTablesExperiment] = useState();
    const [checkHendler, setCheckHendler] = useState({
        hasPersonnelDiseaseBackground: (currentData.getPerson && currentData.getPerson.hasPersonnelDiseaseBackground === 'Y') ? true : false,
        isPersonnelSmoker: (currentData.getPerson && currentData.getPerson.isPersonnelSmoker === 'Y') ? true : false
    })


    const setDiseaseStartDate = date => {
        if (date !== null) {
            formValues.diseaseHistory = {
                ...formValues.diseaseHistory,
                fromDate: Math.round(new Date(date._d).getTime())
            }
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
        }


    }
    const setDiseaseEndDate = date => {
        if (date !== null) {
            formValues.diseaseHistory = { ...formValues.diseaseHistory, toDate: Math.round(new Date(date._d).getTime()) }
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
        }

    }
    const setTestDate = date => {
        if (date !== null) {
            formValues.experimentHistory = { ...formValues.experimentHistory, experimentDate: Math.round(new Date(date._d).getTime())}
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
        }
    }
    const setNextTestDate = date => {
        if (date !== null) {
            formValues.experimentHistory = { ...formValues.experimentHistory, nextExperimentDate: Math.round(new Date(date._d).getTime())}
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
        }
    }
// console.log("data ->>>>" , data)



    const handlerSmoker = e => {
        formValues.person = { ...formValues.person, [e.target.name]: e.target.checked }
        const newFormData = Object.assign({}, formValues)
        setFormData(newFormData)
        if (e.target.name === 'isPersonnelSmoker') {
            setCheckHendler(prevState => { return { ...prevState, isPersonnelSmoker: e.target.checked } })

        }
    }



    const handleChange = e => {

        formValues.person = { ...formValues.person, [e.target.name]: e.target.checked }
        const newFormdata = Object.assign({}, formValues)
        setFormData(newFormdata)
        if (e.target.name === 'hasPersonnelDiseaseBackground') {
            setCheckHendler(prevState => { return { ...prevState, hasPersonnelDiseaseBackground: e.target.checked } })

        }
    }


    useEffect(() => {


        let rowsDisease = []
        let rowsExperiment = []


        if (tableContent.Disease) {
            tableContent.Disease.map((item, index) => {
                if (item !== undefined) {
                    const converted = (date) => {
                        let d = new Date(date);
                        let converte = d.toLocaleDateString('fa-IR');

                        return converte
                    }
                    const getDiseaseType = (diseaseTypeEnumId, data) => {
                        const description = data.DiseaseType.map((item) => {
                            if (diseaseTypeEnumId === item.enumId) {
                                return item.description
                            }
                        }).filter(item => item !== undefined)

                        return description[0]
                    }

                    const row = {

                        id: item.diseaseHistoryId,
                        diseaseType: getDiseaseType(item.diseaseTypeEnumId, data),
                        takenMedicine: item.medicalName,
                        fromDate: (item.fromDate) ? converted(item.fromDate) : '',
                        toDate: (item.toDate) ? converted(item.toDate) : '',
                        delete: <Button variant="contained" onClick={() => handerDelete(index)}
                            startIcon={<Delete />} style={{ background: 'red', minWidth: "90px", color: 'white' }}>حذف</Button>,
                        modify: <Button variant="contained" onClick={() => handlerEdit(index)}
                            style={{ minWidth: "90px" }} startIcon={<Edit />} color="secondary">ویرایش</Button>,

                    }


                    rowsDisease.push(row)
                }
            })
            setTables(rowsDisease)
        }

        if (tableContent.Experiment) {
            tableContent.Experiment.map((item, index) => {

                if (item !== undefined) {
                    const convertedExperiment = (date) => {
                        let d = new Date(date);
                        let converte = d.toLocaleDateString('fa-IR');
                        return converte
                    }
                    const getExperimenType = (experimentTypeEnumId, data) => {
                        const description = data.ExperimentType.map((item) => {
                            if (experimentTypeEnumId === item.enumId) {
                                return item.description
                            }
                        }).filter(item => item !== undefined)

                        return description[0]
                    }


                    const validationFile = (item) => {

                        if (item.locationContact === undefined || item.locationContact === '') {

                            return ''
                        }

                        if (item.locationContact) {

                            return (<Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.locationContact}
                                target="_blank" >  <Image />  </Button>)
                        }

                    }


                    const row = {

                        id: item.experimentHistoryId,
                        testType: getExperimenType(item.experimentTypeEnumId, data),
                        experimentDate: (item.experimentDate) ? convertedExperiment(item.experimentDate) : '',
                        nextExperimentDate: (item.nextExperimentDate) ? convertedExperiment(item.nextExperimentDate) : '',
                        resultExperiment: (item.resultExperiment) ? item.resultExperiment : '',
                        locationContact: validationFile(item),
                        delete: <Button variant="contained" onClick={() => handerDeleteExperiment(index)}
                            startIcon={<Delete />} style={{ background: 'red', minWidth: "90px", color: 'white' }}>حذف</Button>,
                        modify: <Button variant="contained"
                            style={{ minWidth: "90px" }} startIcon={<Edit />} onClick={() => handlerEditExperiment(index)} color="secondary">ویرایش</Button>,

                    }
                    rowsExperiment.push(row)
                }
            })
            setTablesExperiment(rowsExperiment)

        }



    }, [tableContent, currentData, sacrificeDoc])


    const autocompleteSet = (data, enumId, currentData) => {
        if (data) {

            let defaultValue = data.map(item => {
                if (item.enumId == currentData) {
                    return item
                }
            }).filter(item => item !== undefined)

            return (defaultValue[0]) ? defaultValue[0] : null
        }
        return ''
    }


    const percentage = e => {

        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            formValues.person = { ...formValues.person, [e.target.name]: e.target.value }
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
        }

    }

    const handleChangeAutoComplete = (newValue, field, tableName, filedName) => {



        if (newValue !== null) {

            formValues[tableName] = { ...formValues[tableName], [filedName]: newValue[field] }
            const newFormdata = Object.assign({}, formValues)
            setFormData(newFormdata)
                 setStyleBorder(preState =>({
            ...preState,
            diseaseTypeEnumId:    true  }))

            return null
        }

        formValues[tableName] = {...formValues[tableName] ,  [filedName]:''  }
        const newFormdata = Object.assign({}, formValues)
        setFormData(newFormdata)

    }


    return (
        <Card>
            <CardContent>
                <Card variant="outlined">
                    <CardHeader title="سوابق ایثارگری" />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField variant="outlined" id="sacrificeId" name="sacrificeId"
                                    label="کد ایثارگری" onChange={addFormValue("", "person")} defaultValue={( currentData.getPerson && currentData.getPerson.sacrificeId) ? currentData.getPerson.sacrificeId : '' } fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <ModalDelete open={openModel} id={currentData} setDisplay={setDisplay} setEditExperiment={setEditExperiment} setCurrentData={setCurrentData} handleClose={handlerCloseModel} setTableContent={setTableContent} setOpen={setOpenModel} setId={50} />
                                <Autocomplete
                                    id="sacrificeType"
                                    name="sacrificeType"
                                    options={data.SacrificeType}
                                    getOptionLabel={(options) => options.description || ''}
                                    fullWidth
                                    defaultValue={() => autocompleteSet(data.SacrificeType, 'enumId', currentData?.getPerson?.sacrificeTypeEnumId)}
                                    onChange={(event, newVal) => {  handleChangeAutoComplete(newVal, "enumId", "person", "sacrificeTypeEnumId") }}
                                    renderInput={(params) => <TextField {...params} label=" نوع ایثارگری" id="sacrificeType1"
                                        name="sacrificeType1" variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField variant="outlined" required
                                className={classes.formControl}
                                    type="number"
                                    id="sacrificeDuration" name="sacrificeDuration"
                                    defaultValue={(formValues.person) ? formValues.person.sacrificeDuration : (currentData.getPerson && currentData.getPerson.sacrificeDuration !== undefined) ? currentData.getPerson.sacrificeDuration : ''}

                                    label="مدت زمان ایثارگری (ماه)" onChange={(e) => percentage(e)} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField variant="outlined" id="sacrificeOperationArea" name="sacrificeOperationArea"
                                    label="منطقه عملیات" onChange={addFormValue("", "person")} fullWidth defaultValue={ (currentData.getPerson &&  currentData.getPerson.sacrificeOperationArea  !== undefined) ? currentData.getPerson.sacrificeOperationArea : ""} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="number"
                                    defaultValue={(formValues.person) ? formValues.person.sacrificePercentage : ( currentData.getPerson&& currentData.getPerson.sacrificePercentage !== undefined) ? currentData.getPerson.sacrificePercentage : ''}
                                    variant="outlined" id="sacrificePercentage" name="sacrificePercentage"
                                    label="درصد جانبازی" onChange={(e) => percentage(e)} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4} style={{ display: 'flex', alignItems: 'center', height: '43px', justifyContent: 'center' }}>
                                <Grid>
                                    <label htmlFor="sacrificeAttachment">پیوست</label><br />
                                    <input onChange={addFormValue(INPUT_TYPES.FILE, 'partycontetnt')} type="file" id="sacrificeAttachment" name="sacrificeAttachment" filename={formValues.sacrificeAttachment ?? ""} />
                                </Grid>
{
    console.log("vajk;avjadvdav" , currentData ,sacrificeDoc )
}
                                <Grid>
                                    <Button variant="outlined" color="primary"
                                        href={(sacrificeDoc || currentData.pContent) ? ((sacrificeDoc) ? (SERVER_URL + `/rest/s1/fadak/getpersonnelfile1?name=` + sacrificeDoc) : (SERVER_URL + `/rest/s1/fadak/getpersonnelfile1?name=` + currentData.pContent.contentLocation)) : ''}

                                            





                                        target="_blank" >  <Image /></Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <CardHeader title="سوابق پزشکی" />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch

                                            id="hasPersonnelDiseaseBackground"
                                            name="hasPersonnelDiseaseBackground"
                                            checked={checkHendler.hasPersonnelDiseaseBackground}
                                            onChange={handleChange} />}
                                        label="فرد دارای سابقه بیماری است" />
                                </FormControl>
                            </Grid>
                            <Grid style={{ display: 'flex', flexDirection: 'column', position: 'relative' }} item xs={12} md={6}>
                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={checkHendler.isPersonnelSmoker}
                                            id="isPersonnelSmoker"
                                            name="isPersonnelSmoker"
                                            onChange={handlerSmoker} />}
                                        label="فرد سیگاری است" />
                                </FormControl>
                            </Grid>
                            {/* add to person line --> */}
                            <Button variant="contained" color="secondary" onClick={e => addToPerson(e)} className="mt-5" startIcon={<Add />}>ثبت نهایی</Button>

                        </Grid>
                    </CardContent>
                </Card>
                <Card variant="outlined" className="mt-20">

                    <CardHeader title="سوابق بیماری" />
                    <CardContent>


                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>

                                <Autocomplete
                                    id="diseaseTypeEnumId"
                                    name="diseaseTypeEnumId"
                                    options={data.DiseaseType}
                                    getOptionLabel={(option) => option.description || ''}
                                    fullWidth

                                    defaultValue={
                                        () => {
                                            let diseaseType = {}
                                            data.DiseaseType.map((disease, index) => {
                                                if (currentData.diseaseId != -1 && disease.enumId == tableContent.Disease[currentData.diseaseId].diseaseTypeEnumId) {
                                                    diseaseType = disease;
                                                }
                                            })
                                            return diseaseType ?? null;
                                        }
                                    }
                                    onChange={(event, newVal) => {
                                        handleChangeAutoComplete(newVal, "enumId", "diseaseHistory", "diseaseTypeEnumId")
                                    }}
                                    renderInput={(params) => <TextField {...params}
                                    required

                                    helperText={(styleBorder.diseaseTypeEnumId) ? "" :  "پر کردن این فیلد الزامی است"}
                                    className={(styleBorder.diseaseTypeEnumId) ? classes.formControl: classes.root}
                                    FormHelperTextProps={{ classes: helperTestClasses }}
                                    label=" نوع بیماری" variant="outlined" />}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" id="takenMedicine" name="medicalName"

                                    label="داروی مورد استفاده" onChange={addFormValue("", "diseaseHistory")}
                                    defaultValue={(currentData.diseaseId != -1 && tableContent.Disease) ? tableContent.Disease[currentData.diseaseId].medicalName : ''}
                                    fullWidth

                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DatePicker variant="outlined" id="fromDate"
                                    value={(formValues.diseaseHistory && formValues.diseaseHistory.fromDate) ? formValues.diseaseHistory.fromDate : (currentData.diseaseId != -1) ? currentData.DiseaseHistory[currentData.diseaseId].fromDate :null}
                                    // value={(formValues.diseaseHistory) ? formValues.diseaseHistory.fromDate : (currentData.diseaseId != -1) ?  1601990820000 : new Date()}
                                    setValue={setDiseaseStartDate}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ شروع" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <DatePicker variant="outlined" id="toDate"
                                    value={(formValues.diseaseHistory && formValues.diseaseHistory.toDate) ? formValues.diseaseHistory.toDate : (currentData.diseaseId != -1) ? currentData.DiseaseHistory[currentData.diseaseId].toDate : null}
                                    // value={(formValues.diseaseHistory) ? formValues.diseaseHistory.toDate : (currentData.diseaseId != -1) ? 1601990820000 : new Date()}
                                    setValue={setDiseaseEndDate}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ پایان" fullWidth />
                            </Grid>

                        </Grid>

                        <Grid style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse' }}>
                            {(currentData.diseaseId != -1)
                                ? <Button variant="contained" style={{ color: 'black' }} className="mt-5" onClick={() => editDiseaseHistory()}
                                    startIcon={<Edit />}>ویرایش</Button> :
                                <Button variant="contained" color="secondary" className="mt-5" onClick={setDiseaseHistory}
                                    startIcon={<Add />}>افزودن</Button>
                            }

                            <Button style={{ minWidth: "90px", marginLeft: '5px' }} variant="contained" color="secondary" className="mt-5" onClick={() => cancelHandler("disease")}
                            >لفو</Button>
                        </Grid>
                        <CTable headers={[{
                            id: "diseaseType",
                            label: "نوع بیماری"
                        }, {
                            id: "takenMedicine",
                            label: "داروی مورد استفاده"
                        }, {
                            id: "fromDate",
                            label: "تاریخ شروع"
                        }, {
                            id: "toDate",
                            label: "تاریخ پایان"
                        },
                        {
                            id: "delete",
                            label: " حذف"
                        }, {
                            id: "modify",
                            label: "ویرایش"
                        },
                        ]} rows={tables} />
                    </CardContent>
                </Card>
                <Card variant="outlined" className="mt-20">
                    <CardHeader title="سوابق آزمایشات" />
                    <CardContent>

                        <Grid container spacing={2}>

                            <Grid item xs={12} md={4}>

                                <Autocomplete
                                    id="testType"
                                    options={data.ExperimentType}
                                    getOptionLabel={(option) => option.description || ''}
                                    fullWidth
                                    defaultValue={
                                        () => {
                                            let experimentType = {}
                                            data.ExperimentType.map((experiment, index) => {
                                                if (currentData.experimentId != -1 && experiment.enumId == tableContent.Experiment[currentData.experimentId].experimentTypeEnumId) {
                                                    experimentType = experiment;
                                                }
                                            })
                                            return experimentType ?? null;
                                        }
                                    }
                                    onChange={(event, newVal) => {
                                        if (newVal !== null) {
                                            formValues.experimentHistory = { ...formValues['experimentHistory'], ['experimentTypeEnumId']: newVal.enumId }
                                            const newFormData = Object.assign({}, formValues)
                                            setFormData(newFormData)
                                            setStyleBorder(preState =>({
                                                ...preState,
                                                testType:    true  }))
                                            return null
                                        }
                                        formValues.experimentHistory = { ...formValues['experimentHistory'], ['experimentTypeEnumId']: "" }
                                            const newFormData = Object.assign({}, formValues)
                                            setFormData(newFormData)
                                    }}
                                    renderInput={(params) => <TextField {...params}
                                      required
                                    helperText={(styleBorder.testType) ? "" :  "پر کردن این فیلد الزامی است"}
                                    className={(styleBorder.testType) ?  classes.formControl: classes.root}
                                    FormHelperTextProps={{ classes: helperTestClasses }}
                                    label=" نوع ازمایش" variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DatePicker variant="outlined" id="experimentDate" name="experimentDate"
                                    // value={formValues.experimentHistory ? formValues.experimentHistory.experimentDate : new Date()}
                                    value={(formValues.experimentHistory && formValues.experimentHistory.experimentDate) ? formValues.experimentHistory.experimentDate : (currentData.experimentId != -1) ? currentData.ExperimentHistory[currentData.experimentId].experimentDate : null}
                                    setValue={setTestDate}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ آزمایش" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DatePicker variant="outlined" id="nextExperimentDate" name="nextExperimentDate"
                                    // value={formValues.experimentHistory ? formValues.experimentHistory.nextExperimentDate : new Date()}
                                    value={(formValues.experimentHistory && formValues.experimentHistory.nextExperimentDate) ? formValues.experimentHistory.nextExperimentDate : (currentData.experimentId != -1) ? currentData.ExperimentHistory[currentData.experimentId].nextExperimentDate : null}
                                    setValue={setNextTestDate}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ آزمایش بعدی" fullWidth />
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <TextField variant="outlined" id="resultExperiment" name="resultExperiment"
                                    defaultValue={(currentData.experimentId != -1 && tableContent.Experiment) ? tableContent.Experiment[currentData.experimentId].resultExperiment : ''}

                                    label="نتیجه آزمایش" onChange={addFormValue("", "experimentHistory")} fullWidth />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField variant="outlined" id="diagnose" name="diagnose"
                                    defaultValue={(currentData.experimentId != -1 && tableContent.Experiment) ? tableContent.Experiment[currentData.experimentId].diagnose : ''}

                                    label="تشخیص" onChange={addFormValue("", "experimentHistory")} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <label htmlFor="locationContact">تصویر برگه</label><br />
                                <input onChange={addFormValue(INPUT_TYPES.FILE, 'experimentHistory')} type="file"
                                    name="locationContact" id="locationContact"
                                    filename={formValues.testPicture ?? ""} id="locationContact" />
                            </Grid>

                        </Grid>
                        <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                            {(currentData.experimentId !== -1)
                                ? <Button variant="contained" style={{ color: 'black' }} className="mt-5" onClick={() => editExperimentHander()}
                                    startIcon={<Edit />}>ویرایش</Button> :
                                <Button variant="contained" color="secondary" className="mt-5" onClick={() => setExperimentHistory()}
                                    startIcon={<Add />}>افزودن</Button>
                            }

                            <Button style={{ minWidth: "90px", marginLeft: '5px' }} variant="contained" color="secondary" className="mt-5" onClick={() => cancelHandler("experiment")}
                            >لفو</Button>

                        </Grid>
                        <CTable headers={[{
                            id: "testType",
                            label: "نوع آزمایش"
                        }, {
                            id: "experimentDate",
                            label: "تاریخ آزمایش"
                        }, {
                            id: "nextExperimentDate",
                            label: "تاریخ آزمایش بعدی"
                        }, {
                            id: "resultExperiment",
                            label: "نتیجه"
                        }, {
                            id: "locationContact",
                            label: "تصویر برگه"
                        }, {
                            id: "delete",
                            label: " حذف"
                        }, {
                            id: "modify",
                            label: "ویرایش"
                        },]} rows={tablesExperiment} />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

export default SacrificeForm;
