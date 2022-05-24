import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid , TextField , Typography} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from "../../../../components/TablePro";
import ActionBox from "../../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import FormComplexParty from '../../../../components/formControls/FormComplexParty'
import {Visibility} from "@material-ui/icons"


const ManagerConformForm = () => {

    const [formValidation, setFormValidation] = useState({});
    const [formValues, setFormValues] = useState([]);
    const [evaluatedTableContent, setEvaluatedTableContent] = React.useState([{}]);
    const [evaluatorTableContent, setEvaluatorTableContent] = React.useState([{}]);
    const [loading, setLoading] = React.useState(false);
    const [fieldInfo, setFieldInfo] = useState({evaluationMethodEnumId : [] , centerEvaluatorRelationshipId : [] , evaluatingPersonsInfo : [] , positionInfo : [] , companyPartyId : "" , unitInfo : []});
    const [assignEvaluator,setAssignEvaluator] = React.useState(false);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
        
    const FormComplexPartyStructure = [
        {
            name  : "unit",
            label : "واحد سازمانی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "positions",
            label : "پست سازمانی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "employees",
            label : "پرسنل",
            type  : "multiselect",
            col   : 4,
        }
    ];    

    const evaluatedTableCols = [
        {
          name: "name",
          label: "ارزیابی شونده",
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
          name: "unit",
          label : "واحد سازمانی",
          type  : "select",
          options: fieldInfo.unitInfo,
          optionLabelField: "organizationName",
          optionIdField: "partyId",
          filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
          style: { minWidth: "130px" },
        },
        {
          name: "positions",
          label : "پست سازمانی",
          type  : "select",
          options: fieldInfo.positionInfo,
          optionLabelField: "description",
          optionIdField: "emplPositionId",
          filterOptions: (options) => formValues.unit 
          ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
          : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
          style: { minWidth: "130px" },
        },
        {
            name: "status",
            label: " وضعیت پیشنهادارزیاب",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "status",
            label: " وضعیت تایید مدیر قبلی",
            type: "text",
            style: { minWidth: "130px" },
        },
      ];

    const evaluatorTableCols = [
        {
            name  : "name",
            label : "نام ارزیاب",
            type  : "text",
            col   : 3,
        },
        {
            name: "unit",
            label : "واحد سازمانی",
            type  : "select",
            options: fieldInfo.unitInfo,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },
        {
            name: "positions",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => formValues.unit 
            ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },
        {
            name  : "evaluationLevelEnumId",
            label : "دسته بندی",
            type  : "select",
            col   : 3,
        },
        {
            name  : "evaluatingForm",
            label : "فرم مربوطه",
            type  : "select",
            col   : 3,
        },
    ];

    const evaluatedInfo = [
        {
            name: "companyPartyId",
            label: "شرکت",
            type: "text",
            disabled: true,
            col   : 2,
      },       
        {
            name: "name",
            label: "نام و نام خانوادگی",
            type: "text",
            disabled: true,
            col   : 3,
      },
      {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            disabled: true,
            col   : 2,
      }, 
      {
            name: "unit",
            label : "واحد سازمانی",
            type  : "select",
            options: fieldInfo.unitInfo,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            disabled: true,
            col   : 2,
      },
      {
            name: "positions",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => formValues.unit 
            ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            disabled: true,
            col   : 3,
      },
    ]

    const getFieldsInfo = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/difineEvaluationTimeFieldsInfo?partyRelationshipId=${partyRelationshipId}`, axiosKey)
        .then((res) => {
          setFieldInfo(res.data.result)
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
      }

    useEffect(() => {
        if(partyRelationshipId){
            getFieldsInfo()
        }
    }, [partyRelationshipId])

    const handleEvaluatorRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            },200)
        })
    }

    const handleViewEvaluator = () => {
        setAssignEvaluator(true)
    }

    const handleNextStep = () => {

    }

    return (
        <Card>
            <CardContent>
                <Card>
                     <CardContent>
                        <TablePro
                            title = "لیست ارزیابی شوندگان"
                            columns={evaluatedTableCols}
                            rows={evaluatedTableContent}
                            setRows={setEvaluatedTableContent}
                            filter="external"
                            filterForm={
                                <FormComplexParty
                                    structure = {FormComplexPartyStructure}
                                    formValues = {formValues}
                                    setFormValues = {setFormValues}
                                    formValidation = {formValidation}
                                    setFormValidation = {setFormValidation}
                                    actionBox={
                                        <ActionBox>
                                            <Button type="submit" role="primary">فیلتر</Button>
                                            <Button type="reset" role="secondary">لغو</Button>
                                        </ActionBox>
                                    }
                                />}
                            loading={loading}
                            rowActions={[{
                                title: "مشاهده ارزیاب",
                                icon: Visibility,
                                onClick: (row)=>{
                                    handleViewEvaluator(row)
                                }
                            }]}
                        />
                    </CardContent>
                </Card>
                {assignEvaluator ? 
                    <>
                        <Box m={2}/>
                        <Card>
                            <CardContent>
                                <Card>
                                    <CardContent>
                                        <CardHeader title="مشخصات ارزیابی شونده"/>
                                        <FormPro
                                            title = "مشخصات ارزیابی شونده"
                                            formValues = {formValues}
                                            setFormValues = {setFormValues}
                                            append={evaluatedInfo}
                                        /> 
                                    </CardContent>
                                </Card>
                                <Box m={2}/>
                                <Card>
                                    <CardContent>
                                        <TablePro
                                            title = "لیست ارزیاب "
                                            columns={evaluatorTableCols}
                                            rows={evaluatorTableContent}
                                            setRows={setEvaluatorTableContent}
                                            add="external"
                                            addForm={<AddEvaluatorForm  fieldInfo={fieldInfo} />}
                                            edit="external"
                                            editForm={<AddEvaluatorForm  editing={true} fieldInfo={fieldInfo} />}
                                            removeCallback={handleEvaluatorRemove}
                                            loading={loading}
                                        />
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </>
                :""}
                <Box m={2}/>
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        style={{
                            width: 140 ,
                            color: "white",
                            backgroundColor: "#039be5",
                            marginRight: "8px",
                        }}
                        variant="outlined"
                        type="submit"
                        role="primary"
                        onClick={handleNextStep}
                        >
                        {" "} تایید{" "}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ManagerConformForm;

function AddEvaluatorForm (props) {

    const {editing = false, formValues, setFormValues, handleClose, fieldInfo} = props

    const formStructure = [
        {
            name: "unit",
            label : "واحد سازمانی",
            type  : "select",
            options: fieldInfo.unitInfo,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },
        {
            name: "positions",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => formValues.unit 
            ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },        
        {
            name  : "employee",
            label : "پرسنل",
            type  : "select",
            col   : 3,
        },
        {
            name  : "evaluationLevelEnumId",
            label : "دسته بندی",
            type  : "select",
            col   : 3,
        },
    ]

    const editEvaluator = () => {

    } 

    const addEvaluator = () => {

    }
    
    const resetCallback = () => {
        setFormValues({})
        handleClose()
    }

    return (
        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={formStructure}
            submitCallback={()=>{
                if(editing){
                    editEvaluator()
                }else{
                    addEvaluator()
                }
            }}
            resetCallback={resetCallback}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">افزودن</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />
    )
}
