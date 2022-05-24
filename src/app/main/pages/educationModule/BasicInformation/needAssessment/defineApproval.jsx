import React, {useState,useEffect} from 'react';
import {CardContent,Divider,Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import TablePro from "../../../../components/TablePro";
import Box from "@material-ui/core/Box";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';


const DefineApproval = (props) =>{

    const {classes,initData,data,setData,setActiveAssessment,activeAssessment,verificarion,setVerificarion} = props

    const [expanded, setExpanded] = useState(false);

    const [approvalTableData, setApprovalTableData] = useState({});

    const tableCols = [
        {name: "unit", label: "واحد سازمانی", type: "select" , options:approvalTableData.units, required:true,optionLabelField: 'organizationName',
        optionIdField:'partyId' },
        {name: "emplPositionId", label: "سمت سازمانی", type: "select"  , options:approvalTableData.positions, required:true },
        {name: "reject", label: "امکان رد و تایید", type: "indicator"},
        {name: "modify", label: "ایجاد تغییرات", type: "indicator"},
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
        
        




        // let data = {},
        //     isValid = true

        // let checkUniqeSequence = new Promise(function(uniqeResolve, uniqeReject) {
        //     if(tableContent.length>0){
        //         for(let i = 0 ; i<tableContent.length ; i++){
        //             if(tableContent[i].sequence == newData['sequence'] )
        //                 isValid = false

        //             if(i == tableContent.length-1)
        //                 uniqeResolve()
        //         }
        //     }
        //     else{
        //         uniqeResolve()
        //     }
        // });

        // checkUniqeSequence.then(() => {
        //     if(isValid){

        //         data.curriculumId = activeAssessment.curriculumId
        //         data.entry = newData

        //         axios.post(SERVER_URL + "/rest/s1/training/addApprovalNeedsAssessment", {data: data}, {
        //             headers: {'api_key': localStorage.getItem('api_key')}
        //         })
        //             .then(res => {
        //                 setVerificarion(!verificarion)
        //                 dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
        //             }).catch(() => {
        //             dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        //         });

        //     }
        //     else{
        //         dispatch(setAlertContent(ALERT_TYPES.WARNING, 'ترتیب تایید نمیتواند تکراری باشد.'));
        //     }
        // })

    }

    function resetForm(){
        setFormValues('')
    }

    function deleteVerification(item){
        return axios.post(SERVER_URL + "/rest/s1/training/deleteApprovalNeedsAssessment",{Verification:item}, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        });
    }

    function assessmentsDefaultApprovals(){
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessmentApprovals?curriculumId="+activeAssessment.curriculumId, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            let verifications = res.data.assessmentData.verifications,
                positions = initData.contacts.positions,
                units = initData.contacts.units

                    setTableContent(verifications)

            // for(let i = 0 ; i < verifications.length ; i++){

            //     let position = positions.find(x => x.enumId == verifications[i].emplPositionId)

            //     verifications[i].position = position ? position.description : ''
            //     // verifications[i].unit = unit ? unit.organizationName : ''
            //     verifications[i].modify = verifications[i].modify == 'Y' ? 'دارد' : 'ندارد'
            //     verifications[i].reject = verifications[i].reject == 'Y' ? 'دارد' : 'ندارد'
            //     if(i == verifications.length-1){
            //         setTableContent(verifications)
            //     }
            // }
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
                            addCallback={submitApproval}
                            // editCallback={submitApproval}
                            add="inline"
                            // edit="inline"
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