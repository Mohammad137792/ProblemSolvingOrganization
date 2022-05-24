import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid , Typography} from "@material-ui/core";
import TablePro from "../../../../../components/TablePro";
import TabPro from "../../../../../components/TabPro";
import ActionBox from "../../../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import FormPro from 'app/main/components/formControls/FormPro';
import FormComplexParty from '../../../../../components/formControls/FormComplexParty'


const AdjustProtestStructure = (props) => {

    const {verificationId, setVerificationId, fieldInfo} = props

    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
     
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    useEffect(() => {
        if (verificationId.resultObjectionVerification && verificationId.resultObjectionVerification != ""){
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/VerificationLevel?verificationId=${verificationId.resultObjectionVerification}`, axiosKey)
            .then((res) => {
                if (res.data.result.length != 0){
                    let tableData = []
                    res.data.result.map((item,index) => {
                        const ind = fieldInfo.evaluatingPersonsInfo.findIndex(i=> i.emplPositionIds[0] == item.emplPositionId && i.subOrgPartyId[0] == fieldInfo.companyPartyId )
                        let rowData = {
                            ...item ,
                            pseudoId : fieldInfo.evaluatingPersonsInfo[ind].pseudoId
                        }
                        tableData.push(rowData)
                        if (index == res.data.result.length-1){
                            setTableContent(tableData)
                            setLoading(false)
                        }
                    })
                }
                else {
                    setTableContent([])
                    setLoading(false)
                }
            })
            .catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
        else{
            setTableContent([])
            setLoading(false)
        }
    }, [loading,verificationId?.resultObjectionVerification])

    const submitLevelTableCols = [
        {
            name: "sequence",
            label: " ترتیب انجام ",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            style: { minWidth: "130px" },
        }, 
        {
            name  : "emplPositionId",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col   : 3,
        },
        {
            name: "modify",
            label: "امکان رد برای اصلاح",
            type: "indicator",
            style: { minWidth: "130px" },
        },
        {
            name: "reject",
            label: "امکان رد",
            type: "indicator",
            style: { minWidth: "130px" },
        },
      ];

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/fadak/entity/VerificationLevel?levelId=${oldData.levelId}`, axiosKey).then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    } 

    return (
        <>
            <Box m={2}/>
            <Card>
                <CardContent>
                    <TablePro
                        title = "مراتب اعتراض"
                        columns={submitLevelTableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        add="external"
                        addForm={<AddConformLevelForm verificationId={verificationId} setVerificationId={setVerificationId} fieldInfo={fieldInfo} setLoading={setLoading} />}
                        edit="external"
                        editForm={<AddConformLevelForm verificationId={verificationId} setVerificationId={setVerificationId} fieldInfo={fieldInfo} setLoading={setLoading} editing={true} />}
                        loading={loading}
                        removeCallback={handleRemove}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default AdjustProtestStructure;

function AddConformLevelForm (props) {

    const {verificationId, setVerificationId, fieldInfo, setLoading, formValues, setFormValues, handleClose, editing = false} = props

    const dispatch = useDispatch();
         
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        {
            name  : "emplPositionId",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            col   : 3,
        },
        {
            name  : "sequence",
            label : "ترتیب ارسال جهت تایید",
            type  : "number",
            col   : 3,
        },
        {
            name  : "modify",
            label : "امکان رد برای اصلاح",
            type  : "indicator",
            col   : 3,
        },
        {
            name  : "reject",
            label : "امکان رد",
            type  : "indicator",
            col   : 3,
        },
    ]

    const submitVerificationLevel = () => {
        if (!verificationId.resultObjectionVerification || verificationId.resultObjectionVerification == ""){
            axios.post(SERVER_URL +"/rest/s1/evaluation/EvaluationVerification", {data : {...formValues , type : "ResultEvaluationObj"} } ,axiosKey).then((res) => {
                verificationId.resultObjectionVerification = res.data.verificationId.verificationId
                setVerificationId(Object.assign({},verificationId))
                setLoading(true)
                resetCallback()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
        else {
            axios.post(SERVER_URL +"/rest/s1/evaluation/EvaluationVerification", {data : {...formValues , verificationId : verificationId.resultObjectionVerification , type : "ResultEvaluationObj"} } ,axiosKey).then((res) => {
                setLoading(true)
                resetCallback()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
    }

    const handleEdit = () => {
        axios.put(SERVER_URL +"/rest/s1/fadak/entity/VerificationLevel", {data : formValues} ,axiosKey).then((res) => {
            setLoading(true)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ویرایش اطلاعات !'));
        });
    }

    return (

        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            append={formStructure}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    submitVerificationLevel()
                }
            }}
            resetCallback={resetCallback}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">{editing ? "ویرایش" : "افزودن"}</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />

    )
}