import React from 'react';
import InlineTable from "../../../components/inlinetabel"
import { useEffect, useState } from 'react';
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {useSelector} from "react-redux";
import {Card, CardContent, CardHeader ,Grid ,TextField} from "@material-ui/core"
import FormPro from '../../../components/formControls/FormPro';
import ActionBox from "../../../components/ActionBox";
import {Button, } from "@material-ui/core";
import {useDispatch} from 'react-redux'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const PersonalStructureTable = () => {
    const [formValues, setFormValues]=useState({})
    const [formValidation, setFormValidation] =React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [tableContent,setTableContent]=useState([])
    const [loading,setLoading]=useState(true)
    const [employeeGroups,setEmployeeGroups]=useState([])
    const [company,setCompany]=useState([])
    const dispatch = useDispatch();
    const [editing,setEditing]=useState(false)
    const [excelData,setExcelData]=useState([])
    const [displayDialog,setDisplayDialog]=useState(false)
    const [deleteRowData,setDeleteRowData]=useState()
    const [companyPartyClassificationId,setCompanyPartyClassificationId]=useState()

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label:  "کد",
        name:   "standardCode",
        type:   "text",
        required: true,
        col     : 6 ,
        validator: values=>{
            const ind = tableContent.findIndex(i=>i.standardCode == values.standardCode && i.partyClassificationId != values.partyClassificationId ) 
            return new Promise(resolve => {
                if(ind > -1){
                    resolve ({error: true, helper: "کد وارد شده تکراری است."})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }
    },{
        label:  "عنوان",
        name:   "description",
        type:   "text",
        required: true,
        col     : 6
    },{
        label:  "نوع ساختار پرسنلی",
        name:   "classificationTypeEnumId",
        type:   "select",
        options: "PartyClassificationType",
        filterOptions: options => options.filter(o=>o["parentEnumId"]==="PersonnelStructure") ,
        required: true,
        col     : 6
    },(!formValues["classificationTypeEnumId"] || formValues["classificationTypeEnumId"]!=="EmployeeSubGroups" ) ? {
        label:  !formValues["classificationTypeEnumId"]  ? "ساختار بالاتر" : company.organizationName ,
        name:   "parentClassificationId",
        type:   "text"  , 
        col     : 6 ,
        disabled: true
    } : {
        label:  "ساختار بالاتر" ,
        name:   "parentClassificationId",
        type:    "select" , 
        options: employeeGroups ,
        optionLabelField :  "description"  ,
        optionIdField :  "partyClassificationId" ,
        required:  true ,
        col     : 6 ,
    }]
    useEffect(()=>{
        if(partyRelationshipId) {
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
            .then(companyId=>{
                setCompany(companyId.data)
                axios.get(SERVER_URL + "/rest/s1/fadak/parentClassification?companyPartyId=" + companyId.data.partyId, axiosKey)
                .then(parentClassification=>{
                    setCompanyPartyClassificationId(parentClassification.data.companyPartyClassificationId)
                    setEmployeeGroups(parentClassification.data.personalGroup)
                    axios.get(SERVER_URL + "/rest/s1/fadak/orgStructureBaseInfo?companyPartyId=" + companyId.data.partyId, axiosKey)
                    .then(tableData=>{
                        setLoading(false)
                        setTableContent(tableData.data.tableData)
                        prepareExcelData(tableData.data.tableData)
                    })
                })
            })
        }
    },[loading , partyRelationshipId])
    const handleCreate=()=>{
        setLoading(true)
        if(formValues["classificationTypeEnumId"]!=="EmployeeSubGroups"){
            formValues.parentClassificationId=companyPartyClassificationId
            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyClassification" , {data : formValues} , axiosKey )
            .then(()=>{
                setFormValues({})
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ردیف مورد نظر با موفقیت اضافه شد."));
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات افزودن!"));
            })
        }
        if(formValues["classificationTypeEnumId"]=="EmployeeSubGroups"){
            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyClassification" , {data : formValues} , axiosKey )
            .then(()=>{
                setFormValues({})
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ردیف مورد نظر با موفقیت اضافه شد."));
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات افزودن!"));
            })
        }
    }
    const deleteConfirm=(data)=>{
        setDisplayDialog(true)
        setDeleteRowData(data)
    }
    const handlCloseDialog =()=>{setDisplayDialog(false)}
    const deleteRow=()=>{
        setDisplayDialog(false)
        setLoading(true)
        axios.delete(SERVER_URL + `/rest/s1/fadak/entity/PartyClassification?partyClassificationId=${deleteRowData.partyClassificationId}` ,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(()=>{
            setLoading(false)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ردیف مورد نظر با موفقیت حذف شد."));
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, " امکان حذف این رکورد وجود ندارد!"));
        })
    }
    const editHandler=(data)=>{
        setFormValues({})
        setEditing(true)
        setTimeout(()=>{
            if(data.classificationTypeEnumId=="EmployeeSubGroups"){setFormValues(data)}
            if(data.classificationTypeEnumId!=="EmployeeSubGroups"){
                data={...data, parentClassificationId : company.organizationName}
                setTimeout(()=>{
                    setFormValues(data)
                },50)
            }
        },50)
    }
    const putInfo=()=>{
        const ind = tableContent.findIndex(i=> i.partyClassificationId == formValues.partyClassificationId ) 
        if ((tableContent[ind].standardCode != formValues.standardCode) || (tableContent[ind].description != formValues.description) || (tableContent[ind].classificationTypeEnumId != formValues.classificationTypeEnumId)){
            setLoading(true)
            if(formValues["classificationTypeEnumId"]!=="EmployeeSubGroups"){
                formValues.parentClassificationId=companyPartyClassificationId
                axios.put(SERVER_URL + "/rest/s1/fadak/entity/PartyClassification" ,  {data : formValues} , axiosKey )
                .then(()=>{
                    setEditing(false)
                    setFormValues({})
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "تغییرات ردیف مورد نظر با موفقیت انجام شد."));
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش!"));
                })
            }
            if(formValues["classificationTypeEnumId"]=="EmployeeSubGroups"){
                axios.put(SERVER_URL + "/rest/s1/fadak/entity/PartyClassification" ,  {data : formValues} , axiosKey )
                .then(()=>{
                    setEditing(false)
                    setFormValues({})
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "تغییرات ردیف مورد نظر با موفقیت انجام شد."));
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش!"));
                })
            }
        }
        else{
            setEditing(false)
            setFormValues({})
        }
    }
    const handleReset=()=>{
        setEditing(false)
    }
    const prepareExcelData=(data)=>{
        let rows=[];
        data.map((rowInfo,index)=>{
            let entry={};
            entry["ردیف"]= index+1
            entry["کد"]= rowInfo?.standardCode ?? ""
            entry["عنوان"]= rowInfo?.description ?? ""
            entry["نوع"]= rowInfo.classificationTypeEnumTitle??""
            entry[" ساختار بالاتر"]= rowInfo.parentClassificationTitle??""
            rows.push(entry);
        })
        setExcelData(rows)
    }
    useEffect(()=>{
        formValues.standardCode = formValues?.standardCode ? formValues?.standardCode.replace(/[^A-Za-z0-9]/gi, "") : "" ;
        setFormValues(Object.assign({},formValues))

    },[formValues?.standardCode])
    
    return (
        <>
            <Card>
                <CardContent>
                    <Card>
                        <CardContent>
                            <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                formValidation={formValidation}
                                setFormValidation={setFormValidation}
                                submitCallback={()=>{
                                    if(editing){
                                        putInfo(formValues)
                                    }else{
                                        handleCreate(formValues)
                                    }
                                }}
                                resetCallback={handleReset}
                                actionBox={
                                    <ActionBox>
                                        <Button type="submit" role="primary" >{(!editing) ? "افزودن" : "ثبت"}
                                        </Button>
                                        <Button type="reset" role="secondary">لغو</Button>
                                    </ActionBox>
                                }
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <InlineTable columns={[
                                { title: 'ردیف', field: 'index',width:10 },
                                { title: 'کد', field: "standardCode" },
                                { title: 'عنوان', field: 'description' },
                                { title: 'نوع', field: 'classificationTypeEnumTitle' },
                                { title: 'ساختار بالاتر', field: 'parentClassificationTitle' }]}
                                title="لیست ساختار های پرسنلی"
                                grouping={true}
                                exportButton={true}
                                data={tableContent}
                                loading={loading} 
                                editHandler={editHandler}
                                count={tableContent.length} 
                                excelData={excelData}
                                hideDetail={true}
                                showDelete={true}
                                deleteHandler={deleteConfirm}
                                excelFileName="گزارش لیست ساختار های پرسنلی"
                                />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>


            <Dialog open={displayDialog}
            onClose={handlCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">اخطار</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                 آیا از حذف این ردیف اطمینان دارید؟
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteRow} color="primary">تایید</Button>
                <Button onClick={handlCloseDialog} color="primary" autoFocus>لغو</Button>
            </DialogActions>
            </Dialog>

        </>
    );
};

export default PersonalStructureTable;
