import React, { useState, useEffect } from 'react'


import { Box, Button, Card, CardContent, CardHeader  , Grid , TextField ,Typography} from '@material-ui/core';

import FormPro from './../../../../../../../components/formControls/FormPro'
import TablePro from './../../../../../../../components/TablePro'

import ActionBox from './../../../../../../../components/ActionBox'

import axios from 'axios'
import { SERVER_URL } from '../../../../../../../../../configs'
// import { Grid } from 'react-virtualized';
import {Image, Visibility} from "@material-ui/icons"
import DeleteIcon from "@material-ui/icons/Delete";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CloudUpload from "@material-ui/icons/CloudUpload"
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from "@material-ui/core/IconButton";

const Info = (props) => {
    const { orgPartyId, access, dispatch, setAlertContent, ALERT_TYPES, currentData, getOrgData, setCurrentData} = props
    const [formValuesInFo, setFormValuesInFo] = useState([])
    const [perosnPty, setPerosnPty] = useState()
    const [propertyType, setPropertyType] = useState([])
    const [inputFile , setInputFile] = React.useState(false)
    const [storeInputFile,setStoreInputFile] = useState({})
    const [deleteDialog,setDeleteDialog] = React.useState(false)
    const [uploadDialog,setUploadDialog] = React.useState(false)
    const contentIdFormData = new FormData()
    const inputRef = React.useRef(null);
    const [storedData,setStoredData] = React.useState({})

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const dateConvert = (dateValue) => {
        var currentDate = Date.now()
        var formDate = ' نامشخص'
        if ((currentDate > dateValue) && (dateValue != null)) {
            let result = currentDate - dateValue
            let resaYear = (result / 31536000000)
            if (1 < resaYear) {
                formDate = ` حدودا  ${resaYear.toFixed(0)}  سال`
            } else {
                let resultMonth = resaYear * 12
                formDate = ` حدودا  ${resultMonth.toFixed(0)}  ماه`
            }
        }
        setFormValuesInFo(prevState => ({
            ...prevState,
            "fromDate": formDate
        }))
    }


    String.prototype.toEnglishDigits = function () {
        var num_dic = {
            '۰': '0',
            '۱': '1',
            '۲': '2',
            '۳': '3',
            '۴': '4',
            '۵': '5',
            '۶': '6',
            '۷': '7',
            '۸': '8',
            '۹': '9',
        }

        return parseInt(this.replace(/[۰-۹]/g, function (w) {
            return num_dic[w]
        }));
    }

    const handleDeleteAttachedFile = () => {
        setDeleteDialog(false)
        axios.delete(`${SERVER_URL}/rest/s1/training/entity/PartyContent?partyContentId=${currentData?.resultRest4Pty?.partyContent[0]?.partyContentId}` , axiosKey).then(() => {
            if(currentData?.resultRest4Pty?.partyContent[0]?.contentLocation){
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فایل پیوستی با موفقیت حذف شد'))
                currentData.resultRest4Pty.partyContent[0] = ""
                setCurrentData(Object.assign({},currentData))
            }
        }).catch(()=>{
            if(currentData?.resultRest4Pty?.partyContent[0]?.contentLocation){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'حذف فایل پیوستی موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'))
            }
        })
    }

    const handleUpload = () => {
        setUploadDialog(false)
        inputRef.current.click();
        setTimeout(()=>{
            setInputFile(true)
          },5000)
    }

    useEffect(() => {
        if(inputRef?.current?.files[0] && (storeInputFile?.name != inputRef?.current?.files[0].name || storeInputFile?.size != inputRef?.current?.files[0].size)){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'))
            contentIdFormData.append("file", inputRef?.current?.files[0])
            let Skey = {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                }
            }
            axios.post(`${SERVER_URL}/rest/s1/fadak/getpersonnelfile`, contentIdFormData, Skey).then(response_upLoad => {
                let ptyList = {
                    partyContentId: perosnPty?.ptyContent ?? null,
                    contentLocation: response_upLoad.data.name,
                    partyId: orgPartyId
                }
                axios.delete(`${SERVER_URL}/rest/s1/training/entity/PartyContent?partyContentId=${currentData?.resultRest4Pty?.partyContent[0]?.partyContentId}` , axiosKey).then(() => {
                    axios.post(`${SERVER_URL}/rest/s1/training/partyContent`, { ptyList: { ...ptyList } }, Skey).then(response_ptyContent => {
                        setPerosnPty(prevState => ({ ...prevState, ptyContent: response_ptyContent.data.partyContentId }))
                        axios.get(`${SERVER_URL}/rest/s1/training/entity/PartyContent?partyContentId=${response_ptyContent.data.partyContentId}`, axiosKey).then((ptycontent) => {
                            currentData.resultRest4Pty.partyContent[0] = ptycontent.data[0]
                            setCurrentData(Object.assign({},currentData))
                            setFormValuesInFo(prevState => ({
                                ...prevState,
                                'PartyContent' : ptycontent.data[0]
                            }))
                            setStoreInputFile(inputRef?.current?.files[0])
                            setInputFile(false)
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
                        }).catch(()=>{
                             dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات,لطفا دوباره سعی کنید'))
                        })
                    })
                })
            })
        }
        else{
            setTimeout(()=>{
                if (inputFile){setInputFile(false)}
                else{setInputFile(true)}
              },5000)
        }
    },[inputFile])

    const formInstitutions = [
        { name: "major", label: "زمینه فعالیت", type: "text" },
        { name: "establishmentDate", label: 'تاریخ تاسیس', type: 'date' },
        { name: "licence", label: "دارای مجوز از", type: "text" },
        { name: "fromDate", label: 'سابقه آموزش', type: "text", readOnly: true },
        { name: "dependencies", label: "وابسته به", type: "text" },
        { name: "propertyType", label: "نوع مالکیت", type: "select", options: propertyType },
        // { name: "CEOfristname", label: "نام مدیرعامل موسسه / مرکز آموزشی", type: "text", },
        // { name: "CEOlastname", label: "نام خانوادگی مدیرعامل موسسه / مرکز آموزشی", type: "text", },
        // { name: "ManagerFristname", label: "نام مدیر / مسئول آموزش", type: "text" },
        // { name: "ManagerLastName", label: "نام خانوادگی مدیر / مسئول آموزش", type: "text" },
        {name    : "PartyContent",
        type    : "component",
        col     : {sm: 12, md: 6},
        component :
            <Box display="flex" className="outlined-input" >
                <Box flexGrow={1} style={{padding:"18px 14px"}}>
                    <Typography color="textSecondary">{`پیوست : ${formValuesInFo?.PartyContent?.name ? formValuesInFo?.PartyContent?.name?.substring(0, 5) + "..." : "" } `}</Typography>
                </Box>
                <Box style={{padding:"3px 14px"}}>
                    <input
                        type="file"
                        ref={inputRef}
                        style={{display: "none"}}
                    />
                    <Tooltip title="آپلود فایل" >
                        <IconButton >
                            <CloudUpload  onClick={()=>currentData?.resultRest4Pty?.partyContent[0]?.contentLocation ? setUploadDialog(true) : handleUpload()}>
                            </CloudUpload>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="حذف فایل پیوست شده" >
                        <IconButton size={"large"} >
                            <DeleteIcon  onClick={()=>currentData?.resultRest4Pty?.partyContent[0]?.partyContentId ? setDeleteDialog(true) : dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فایل پیوست شده ای برای حذف وجود ندارد !'))} >
                            </DeleteIcon>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="دانلود فایل پیوست شده" >
                        {currentData?.resultRest4Pty?.partyContent[0]?.partyContentId ?
                            <IconButton size={"large"} href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + formValuesInFo?.PartyContent?.contentLocation}>
                                <Visibility >
                                </Visibility>
                            </IconButton>
                        :
                            <IconButton size={"large"} >
                                <Visibility onClick={()=>dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فایل پیوست شده ای برای دانلود وجود ندارد !'))}>
                                </Visibility>
                            </IconButton>
                        }
                    </Tooltip>
                </Box>
            </Box>,
        }
    ]


    const request_infoMore = () => {
        const listOfFiled = ["major", "dependencies", "licence", "propertyType", "establishmentDate"]
        const Ins_obj = {}
        const person = [{
            firstName: formValuesInFo.CEOfristname,
            lastName: formValuesInFo.CEOlastname,
            type: "ceoParty",
            partyId: perosnPty?.Person?.ceoParty?.partyId ?? null

        },
        {
            firstName: formValuesInFo.ManagerFristname,
            lastName: formValuesInFo.ManagerLastName,
            type: "learningSupervisor",
            partyId: perosnPty?.Person?.learningSupervisor?.partyId ?? null
        }]


        listOfFiled.map(item => {
            if (formValuesInFo?.[item]) {
                Ins_obj[item] = formValuesInFo?.[item]
            }
        })

        const config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/training/addInstitutions/moreInfo?partyId=${orgPartyId}`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            data: { Ins_obj: { ...Ins_obj }, personal: [...person] }
        };
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'))
        axios(config).then(response_add => {
            setPerosnPty(prevState => ({ ...prevState, Person: response_add?.data?.resultResponse?.resultManagerPartyIds }))
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
            setStoredData(Object.assign({}, { ...Ins_obj } , {personal: [...person]} ))
        }).catch(error => dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات,لطفا دوباره سعی کنید')))
    }




    useEffect(() => {

        if (typeof formValuesInFo["establishmentDate"] === 'string') {
            let chooseDate = formValuesInFo["establishmentDate"]
            chooseDate = chooseDate.split("-")
            chooseDate.map((item, index) => {
                chooseDate[index] = item.toEnglishDigits()
            })
            var newDate = new Date(chooseDate[0], chooseDate[1] - 1, chooseDate[2]);
            dateConvert(newDate)
        }
        if (typeof formValuesInFo["establishmentDate"] === 'number') {
            dateConvert(formValuesInFo["establishmentDate"])
        }

    }, [formValuesInFo["establishmentDate"]])




    /* getData */
    useEffect(() => {
        const config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=PropertyType`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },

        };
        axios(config).then(response => {
            setPropertyType(response.data.enums.PropertyType)
        })
    }, [])



    useEffect(() => {
        getOrgData()
    }, [])





    useEffect(() => {
        const personAndEnum = currentData?.resultRest4Pty?.personAndEnum
        const partyContentInfo = currentData?.resultRest4Pty?.partyContent[0]
        let val = {}
        formInstitutions.map(ele => {
            let name = ele['name'];
            val = { ...val, [name]: currentData?.resultRest4Pty?.institute[name] }
        })
        val = { ...val, 'CEOfristname': personAndEnum?.ceoParty?.firstName, 'CEOlastname': personAndEnum?.ceoParty?.lastName, 'ManagerFristname': personAndEnum?.learningSupervisor?.firstName, 'ManagerLastName': personAndEnum?.learningSupervisor?.lastName , "PartyContent" : partyContentInfo}
        val && setFormValuesInFo(Object.assign({}, { ...val }))
        val && setStoredData(Object.assign({}, { ...val }))
        dateConvert(formValuesInFo["establishmentDate"])

    }, [currentData?.resultRest4Pty])

    const closeDeleteDialog = () => {
        setDeleteDialog(false)
    }

    const closeUpdateDialog = () => {
        setUploadDialog(false)
    }

    return (
        <>
            <Card>
                <CardHeader title="بررسی صلاحیت موسسات" />
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                        < FormPro
                            style={{ marginTop: 5, padding: 5 }}
                            formValues={formValuesInFo}

                            setFormValues={setFormValuesInFo}
                            append={formInstitutions}
                            actionBox={
                                access && <ActionBox>
                                    <Button type="submit" role="primary">{(storedData.major || 
                                       storedData.establishmentDate || storedData.licence || 
                                       storedData.dependencies || storedData.propertyType || storedData.PartyContent ) ? "ویرایش" : "ثبت"}</Button>
                                </ActionBox>}
                            submitCallback={request_infoMore}
                        />
                    </Grid>

                </Grid>
                <Dialog open={deleteDialog}
                    onClose={closeDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                   <DialogTitle id="alert-dialog-title">
                            آیا از حذف فایل پیوست شده اطمینان دارید ؟
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleDeleteAttachedFile} color="primary">بلی</Button>
                        <Button onClick={closeDeleteDialog} color="primary" autoFocus>خیر</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={uploadDialog}
                    onClose={closeUpdateDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">هشدار !</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        فایل جدید جایگزین پیوست قبلی خواهد شد. از جایگزینی فایل اطمینان دارید؟
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpload} color="primary">بلی</Button>
                        <Button onClick={closeUpdateDialog} color="primary" autoFocus>خیر</Button>
                    </DialogActions>
                </Dialog>
            </Card>

        </>
    )
}

export default Info
