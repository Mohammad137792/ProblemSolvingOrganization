import React, {useState,useEffect} from 'react';
import {CardContent,Divider,Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import TablePro from "../../../../../components/TablePro";
import Box from "@material-ui/core/Box";
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ActionBox from "../../../../../components/ActionBox";
import FormPro from "../../../../../components/formControls/FormPro";
import CircularProgress from "@material-ui/core/CircularProgress";


function ExternalForm({editing=false, tableData,approvalTableData,tableContent,setVerificarion,activeAssessment, closeForm,waiting, set_waiting,...restProps}) {
    const {formValues, setFormValues, oldData, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] = React.useState({});
    const dispatch = useDispatch();

    const formStructure = [
        {name: "unit", label: "واحد سازمانی", type: "select" , options:approvalTableData.units, required:true,optionLabelField: 'organizationName',
        optionIdField:'partyId' , filterOptions: options =>  formValues["emplPositionId"] ? options.filter((item)=>{
            return item.positions.indexOf(formValues["emplPositionId"]) >=0
        })  :options},
        {name: "emplPositionId", label: "سمت سازمانی", type: "select"  , options:approvalTableData.posts, required:true , filterOptions: options =>  formValues["unit"] ? options.filter((item) =>
        formValues["unit"] == item.parentEnumId
        ) :options },
        {name: "reject", label: "امکان رد", type: "indicator"},
        {name: "modify", label: "امکان رد برای اصلاح", type: "indicator"},
        {name: "sequence", label: "اولویت", type: "number" ,required:true},
    ]

    const checkNewPerson = (newData,oldData) => {
        return new Promise((resolve, reject) => {
            if(tableContent.findIndex(i=>i.sequence==newData.sequence)>-1){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'شماره ترتیب انتخاب شده، تکراری است!'));

            }else {

                var data = {}
                
                data.curriculumId = activeAssessment.curriculumId
                data.entry = newData
                set_waiting({'wait':true,'target':4})

                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                axios.post(SERVER_URL + "/rest/s1/training/addApprovalNeedsAssessment", {data: data}, {
                    headers: {'api_key': localStorage.getItem('api_key')}
                })
                    .then(res => {
                        if(res.data.hadError){

                        }
                        else{
                            setVerificarion((prevState)=>{
                                return !prevState
                            })
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                            resolve(newData)
                            setFormValues({})
                            successCallback(data)
                        }
                        set_waiting({'wait':false,'target':false})
                        
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                    reject()
                });
            }
        })
    }
   
    
    useEffect(() => {
        if(closeForm){
            setFormValues({})
            handleClose()
        }
    },[closeForm])

    useEffect(() => {
        if(formValues.emplPositionId != null && formValues.emplPositionId != undefined){
            let unitId = approvalTableData?.posts?.find(i=>i?.enumId == formValues.emplPositionId)?.parentEnumId
            setFormValues(prevState => ({ ...prevState, unit: unitId }))
        }
    },[formValues.emplPositionId])

    
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{checkNewPerson(formValues)}}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit"  disabled={waiting.wait} endIcon={waiting.target == 3?<CircularProgress size={20}/>:null} role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}


const DefineApproval = (props) =>{

    const {classes,initData,data,setData,setActiveAssessment,activeAssessment,verificarion,setVerificarion,setVerificationlength,waiting, set_waiting} = props

    const [expanded, setExpanded] = useState(false);

    const [approvalTableData, setApprovalTableData] = useState({});
    const [closeForm, setCloseForm] = useState(false);

    const tableCols = [
        {name: "unit", label: "واحد سازمانی", type: "select" , options:approvalTableData.units, required:true,optionLabelField: 'organizationName',
        optionIdField:'partyId' },
        {name: "emplPositionId", label: "سمت سازمانی", type: "select"  , options:approvalTableData.posts, required:true },
        {name: "reject", label: "امکان رد ", type: "indicator"},
        {name: "modify", label: "امکان رد برای اصلاح", type: "indicator"},
        {name: "sequence", label: "اولویت", type: "number" ,required:true},
    ]

    const [tableContent, setTableContent] = useState([]);

    const [loading, setLoading] = useState(false);

    const formDefaultValues = [];
    
    const [formValues, setFormValues] = useState(formDefaultValues);

    const dispatch = useDispatch();

    const submitApproval = (newData) => {

        
        return new Promise((resolve, reject) => {
            if(tableContent.findIndex(i=>i.sequence==newData.sequence)>-1){
                reject("شماره ترتیب انتخاب شده، تکراری است!")
            }else {

                var data = {}
                
                data.curriculumId = activeAssessment.curriculumId
                data.entry = newData

                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                axios.post(SERVER_URL + "/rest/s1/training/addApprovalNeedsAssessment", {data: data}, {
                    headers: {'api_key': localStorage.getItem('api_key')}
                })
                    .then(res => {
                        setVerificarion(!verificarion)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                        resolve()
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                    reject()
                });
            }
        })
        
        

    }

    function resetForm(){
        setFormValues('')
    }

    function deleteVerification(item){
        return axios.post(SERVER_URL + "/rest/s1/training/deleteApprovalNeedsAssessment",{Verification:item}, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setVerificationlength((verifications)=>{return verifications-1})

            setCloseForm(true)
            setTimeout(() => {
                setCloseForm(false)
            }, 1000);
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        });
    }

    function assessmentsDefaultApprovals(){
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessmentApprovals?curriculumId="+activeAssessment.curriculumId, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            let verifications = res.data.assessmentData.verifications
            setTableContent(verifications)
            setVerificationlength(verifications?.length)

            setLoading(false)

        }).catch((err) => {
            setLoading(false)

            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }


    useEffect(()=>{
        if(initData.contacts)
            setApprovalTableData(initData.contacts)
            // setPositions(initData.contacts.positions)
    },[initData]);


    useEffect(()=>{
        if(activeAssessment) {
            assessmentsDefaultApprovals()
        }
    },[verificarion]);


    useEffect(()=>{
        if(activeAssessment) {
            assessmentsDefaultApprovals()
            setExpanded(true)
        }
        else{
            setExpanded(false)
        }
    },[activeAssessment]);


    return (
        <Box mt={2}>
            <Card >
                <CardHeader className={classes.headerCollapse} title={"تعریف مراتب تایید"}
                    action={
                        <Tooltip title="نمایش مراتب تایید">
                            <ToggleButton
                                value="check"
                                selected={expanded}
                                onChange={() => setExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
                <CardContent className={(activeAssessment ? '' : classes.DisableRow)}>
                    <Collapse in={expanded}>
                    
                        <TablePro
                            title="لیست مراتب تایید"
                            columns={tableCols}
                            rows={tableContent}
                            loading={loading}
                            // addCallback={submitApproval}
                            add="external"
                            addForm={<ExternalForm tableData={tableContent} approvalTableData={approvalTableData} closeForm={closeForm} tableContent={tableContent} setVerificarion={setVerificarion} activeAssessment={activeAssessment} waiting={waiting} set_waiting={set_waiting}/>}
                            setRows={setTableContent}
                            removeCallback={deleteVerification}
                        />
                    </Collapse>
                </CardContent>
            </Card>

        </Box>
    )
}

export default DefineApproval