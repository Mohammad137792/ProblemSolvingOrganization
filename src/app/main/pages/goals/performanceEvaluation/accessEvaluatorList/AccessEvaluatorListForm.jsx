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
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import IconButton from "@material-ui/core/IconButton";
import Popover from '@material-ui/core/Popover';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


const EvaluatorDeterminationForm = (props) => {

    const {showConfirmButton = true} = props

    const [formValidation, setFormValidation] = useState({});
    const [formValues, setFormValues] = useState([]);
    const [evaluatedTableContent, setEvaluatedTableContent] = React.useState([]);
    const [evaluatorTableContent, setEvaluatorTableContent] = React.useState([]);
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
            name  : "orgs",
            label : "شرکت",
            type  : "select",
            col   : 4,
        },
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
            name  : "roles",
            label : "نقش سازمانی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "employees",
            label : "پرسنل",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "group",
            label : "کروه پرسنلی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "subGroup",
            label : "زیر گروه پرسنلی",
            type  : "multiselect",
            col   : 4,
        },
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
            label: "وضعیت",
            type: "text",
            style: { minWidth: "130px" },
          },
      ];

    const evaluatorTableCols = [
        {
            name  : "pseudoId",
            label : "کد پرسنلی",
            type  : "text",
            col   : 3,
        },
        {
            name  : "name",
            label : "نام پرسنل",
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
            name: "pseudoId",
            label: "کد پرسنلی",
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

    const handleEvaluatorDetermination = () => {
        setAssignEvaluator(true)
    }

    const closeEvaluator = () => {
        setAssignEvaluator(false)
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
                            add="external"
                            addForm={<AddEvaluatedForm  fieldInfo={fieldInfo} />}
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
                                title: "تعیین ارزیاب",
                                icon: AssignmentIcon,
                                onClick: (row)=>{
                                    handleEvaluatorDetermination(row)
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
                                <Box m={2}/>
                                <div style={{display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        style={{
                                            width: 120 ,
                                            color: "white",
                                            backgroundColor: "#039be5",
                                            marginRight: "8px",
                                        }}
                                        variant="outlined"
                                        type="submit"
                                        role="primary"
                                        onClick={closeEvaluator}
                                        >
                                        {" "} تایید{" "}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                :""}
                <Box m={2}/>
                {showConfirmButton ? 
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
                            {" "}تایید{" "}
                        </Button>
                    </div>
                : ""}
            </CardContent>
        </Card>
    );
};

export default EvaluatorDeterminationForm;

function AddEvaluatorForm (props) {

    const {editing = false, formValues, setFormValues, handleClose, fieldInfo} = props

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openFormAnchorEl, setOpenFormAnchorEl] = React.useState(false);

    const evaluatingFormStructure = [
        {
            name  : "centerEvaluatorRelationshipId",
            label : "فرم ارزیابی مربوطه",
            type  : "select",
            // options: fieldInfo.centerEvaluatorRelationshipId,
            // optionLabelField: "fullName",
            // optionIdField: "partyRelationshipId",
            col   : 12,
        }
    ]; 

    const formStructure = [
        {
            name  : "pseudoId",
            label : "کد پرسنلی",
            type  : "text",
            col   : 3,
        },
        {
            name  : "name",
            label : "نام پرسنل",
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
            name  : "evaluationLevelRate",
            label : "ضریب اهمیت ارزیاب",
            type  : "number",
            col   : 3,
        },
        {
            name  : "cmp",
            type  : "component",
            component   :  
                <Box display="flex" >
                    <Box flexGrow={1} >
                        <FormPro
                            formValues = {formValues}
                            setFormValues = {setFormValues}
                            append={evaluatingFormStructure}
                        />
                    </Box>
                    <Box >
                        <IconButton >
                            <InfoOutlinedIcon fontSize={"medium"} onClick={(event)=>formAnchorEl(event)}/>  
                        </IconButton>
                    </Box>
                </Box>  ,
            col   : 3,
        },
    ]

    const formAnchorEl = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenFormAnchorEl(true)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setOpenFormAnchorEl(false)
    }

    const createFormPage = () => {

    }

    const editEvaluator = () => {

    } 

    const addEvaluator = () => {

    }
    
    const resetCallback = () => {
        setFormValues({})
        handleClose()
    }

    return (
        <>
            <Popover
                id="form-popover"
                open={openFormAnchorEl}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                PaperProps={{
                    style: { width: '15%' , padding : "10px 10px"},
                }}
            >
                <Typography>فرم مورد نظر را از لیست آبشاری انتخاب نمایید. 
                    چنانچه نیاز به تعریف فرم جدید دارید 
                    جهت انتقال به صفحه ی تعریف فرم ارزیابی دکمه زیر را بفشارید 
                </Typography>
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    <IconButton >
                        <ArrowBackIcon fontSize={"medium"} onClick={createFormPage}/>
                    </IconButton>
                </div>
            </Popover>
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
        </>
    )
}

function AddEvaluatedForm (props) {

    const {formValues, setFormValues, handleClose, fieldInfo} = props

    const addContact = [
        {
            name  : "companyPartyId",
            label : "شرکت",
            type  : "select",
            // options: fieldInfo.centerEvaluatorRelationshipId,
            // optionLabelField: "fullName",
            // optionIdField: "partyRelationshipId",
            col   : 12,
        },
        {
            name  : "evaluatedType",
            label : "نوع ارزیابی شوندگان",
            type  : "select",
            // options: fieldInfo.centerEvaluatorRelationshipId,
            // optionLabelField: "fullName",
            // optionIdField: "partyRelationshipId",
            col   : 12,
        },
        {
            name  : "choseEvaluated",
            label : "انتخاب ارزیابی شوندگان",
            type  : "select",
            // options: fieldInfo.centerEvaluatorRelationshipId,
            // optionLabelField: "fullName",
            // optionIdField: "partyRelationshipId",
            col   : 12,
        }
    ];

    return (

        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={addContact}
        /> 

    )
}
