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
import FilterEvaluatedList from "../FilterEvaluatedList"
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import IconButton from "@material-ui/core/IconButton";
import Popover from '@material-ui/core/Popover';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const EvaluatorDeterminationForm = (props) => {

    const {showConfirmButton = true} = props

    const [formValues, setFormValues] = useState({});
    const [rowInfo,setRowInfo] = useState({});
    const [evaluatedTableContent, setEvaluatedTableContent] = React.useState([]);
    const [evaluatorTableContent, setEvaluatorTableContent] = React.useState([]);
    const [evaluatedLoading, setEvaluatedLoading] = React.useState(true);
    const [evaluatorLoading, setEvaluatorLoading] = React.useState(true);
    const [fieldInfo, setFieldInfo] = useState({evaluationLevelEnumId : [] , centerEvaluatorRelationshipId : [] , evaluatingPersonsInfo : [] , positionInfo : [] , companyPartyId : "" , unitInfo : [] , questionnaireForm : []});
    const [assignEvaluator,setAssignEvaluator] = React.useState(false);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [evaluationPeriodId,setEvaluationPeriodId] = React.useState("100053");
    const [evaluatedList,setEvaluatedList] = React.useState([]);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }  

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
          type  : "text",
        },
        {
          name: "positions",
          label : "پست سازمانی",
          type  : "text",
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
            readOnly: true,
            col   : 2,
      }, 
      {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            readOnly: true,
            col   : 2,
      },       
        {
            name: "name",
            label: "ارزیابی شونده",
            type: "text",
            readOnly: true,
            col   : 3,
      },
      {
            name: "unit",
            label : "واحد سازمانی",
            type  : "text",
            readOnly: true,
            col   : 2,
      },
      {
            name: "positions",
            label : "پست سازمانی",
            type  : "text",
            readOnly: true,
            col   : 3,
      },
    ]

    const getFieldsInfo = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/difineEvaluationTimeFieldsInfo?partyRelationshipId=${partyRelationshipId}`, axiosKey)
        .then((res) => {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/Enumeration?enumTypeId=EvalutorLevel`, axiosKey)
            .then((enums) => {
                axios.get(SERVER_URL + `/rest/s1/evaluation/getApplicationType?categoryenumid=QcPerformanceEvaluation`, axiosKey)
                .then((appType) => {
                    setFieldInfo(Object.assign({},res.data.result,{evaluationLevelEnumId : enums.data.result},{questionnaireForm : appType.data.result}))
                })
            })
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
      }

    const getEvaluatedList = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/getEvaluated?evaluationPeriodId=${evaluationPeriodId}`, axiosKey)
        .then((res) => {
            if (res.data.result.length != 0){
                let tableData = []
                res.data.result.map((e,i)=>{
                    let rowData = {
                        name : e.evaluatedName , 
                        pseudoId : e.pseudoId ,
                        unit : e.unitName[0] ,
                        positions : e.emplPositionIName ,
                        status : "" ,
                        evaluationPeriodId : e.evaluationPeriodId ,
                        partyRelationshipId : e.fromPartyRelationshipId ,
                        emplpositionId : e.fromEmplpositionId
                    }
                    tableData.push(rowData)
                    if(i == res.data.result.length-1){
                        setEvaluatedTableContent(tableData)
                        setEvaluatedLoading(false)
                        setEvaluatedList(tableData)
                    }
                })

            }else{
                setEvaluatedTableContent ([])
                setEvaluatedList([])
                setEvaluatedLoading(false)
            }
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const getEvaluatorList = (row) => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/getEvaluator?partyRealationship=${row.partyRelationshipId}`, axiosKey)
        .then((res) => {
            // if (res.data.result.length != 0){
            //     let tableData = []
            //     res.data.result.map((e,i)=>{
            //         let rowData = {
            //             name : e.evaluatedName , 
            //             pseudoId : e.pseudoId ,
            //             unit : e.unitName[0] ,
            //             positions : e.emplPositionIName ,
            //             status : "" ,

            //         }
            //         tableData.push(rowData)
            //         if(i == res.data.result.length-1){
            //             setEvaluatorTableContent(tableData)
            //             setEvaluatorLoading(false)
            //         }
            //     })

            // }else{
            //     setEvaluatorTableContent([])
            //     setEvaluatorLoading(false)
            // }
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    useEffect(() => {
        if(partyRelationshipId){
            getFieldsInfo()
            getEvaluatedList()
        }
    }, [partyRelationshipId])

    const handleEvaluatorRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + `/rest/s1/evaluation/deleteEvaluator?evalParticipatorId=${oldData.evalParticipatorId}`, axiosKey)
            .then((res) => {
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    const handleEvaluatorDetermination = (row) => {
        setAssignEvaluator(true)
        setRowInfo(row)
        getEvaluatorList(row)
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
                            filter="external"
                            filterForm={<FilterEvaluatedList evaluatedList = {evaluatedList} evaluatedTableContent = {evaluatedTableContent} setEvaluatedTableContent={setEvaluatedTableContent} />}
                            loading={evaluatedLoading}
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
                                            formValues = {rowInfo}
                                            setFormValues = {setRowInfo}
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
                                            addForm={<AddEvaluatorForm  fieldInfo={fieldInfo} rowData={rowInfo} />}
                                            edit="external"
                                            editForm={<AddEvaluatorForm  editing={true} fieldInfo={fieldInfo} rowData={rowInfo} />}
                                            removeCallback={handleEvaluatorRemove}
                                            loading={evaluatorLoading}
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
                            {" "} ارسال جهت تایید{" "}
                        </Button>
                    </div>
                : ""}
            </CardContent>
        </Card>
    );
};

export default EvaluatorDeterminationForm;

function AddEvaluatorForm (props) {

    const {editing = false, formValues, setFormValues, handleClose, fieldInfo, rowData} = props

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openFormAnchorEl, setOpenFormAnchorEl] = React.useState(false);
    const [evaluatorAnchorEl, setEvaluatorAnchorEl] = React.useState(null);
    const [openEvaluatorAnchorEl, setOpenevaluatorAnchorEl] = React.useState(false);

    const dispatch = useDispatch();
  
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const centerEvaluatorFormStructure = [
        {
            name  : "centerEvaluatorRelationshipId",
            label : "اعضای کانون",
            type  : "select",
            options: fieldInfo.centerEvaluatorRelationshipId,
            optionLabelField: "fullName",
            optionIdField: "partyRelationshipId",
            col   : 12,
        }
    ]; 

    const evaluatingFormStructure = [
        {
            name  : "applicationTypeId",
            label : "فرم ارزیابی مربوطه",
            type  : "select",
            options: fieldInfo.questionnaireForm,
            optionLabelField: "description",
            optionIdField: "enumId",
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
            options: fieldInfo.evaluationLevelEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
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
        {
            name  : "cmp",
            type  : "component",
            component   :         
                <Box display="flex" >
                    <Box flexGrow={1} >
                        <FormPro
                            formValues = {formValues}
                            setFormValues = {setFormValues}
                            append={centerEvaluatorFormStructure}
                        />
                    </Box>
                    <Box >
                        <IconButton >
                            <InfoOutlinedIcon fontSize={"medium"} onClick={(event)=>evaluatorAnchorElHandler(event)} />
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

    const evaluatorAnchorElHandler = (event) => {
        setEvaluatorAnchorEl(event.currentTarget);
        setOpenevaluatorAnchorEl(true)
    }

    const handleEvaluatorPopoverClose = () => {
        setEvaluatorAnchorEl(null);
        setOpenevaluatorAnchorEl(false)
    }

    const createEvaluatorPage = () => {

    }

    const editEvaluator = () => {

    } 

    const addEvaluator = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        let sendData = {
            ParticipatorsData :{
                // evaluationPeriodId : formValues. ,
                // toPartyRelationshipId : formValues. ,
                toEmplpositionId : formValues.positions ,
                evaluationLevelEnumId : formValues.evaluationLevelEnumId ,
                evaluationLevelRate : formValues.evaluationLevelRate
            },
            QuesAppData:{applicationTypeId : formValues.applicationTypeId}
        }
        axios.post(SERVER_URL +`/rest/s1/evaluation/addEvaluator`,{data : sendData},axiosKey).then((res) => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
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
            <Popover
                id="evaluator-popover"
                open={openEvaluatorAnchorEl}
                anchorEl={evaluatorAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handleEvaluatorPopoverClose}
                PaperProps={{
                    style: { width: '15%' , padding : "10px 10px"},
                }}
            >
                <Typography>ارزیاب  کانون را از لیست آبشاری انتخاب نمایید. 
                    چنانچه نیاز به تعریف ارزیاب جدید دارید 
                    جهت انتقال به صفحه ی تعریف ارزیاب جدید دکمه زیر را بفشارید 
                </Typography>
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    <IconButton >
                        <ArrowBackIcon fontSize={"medium"} onClick={createEvaluatorPage}/>
                    </IconButton>
                </div>
            </Popover>
        </>
    )
}
