import React, {useState,useEffect} from 'react';
import {CardContent,Divider,Button} from "@material-ui/core";
import TablePro from "../../../../../components/TablePro";
import Box from "@material-ui/core/Box";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import moment from "moment-jalaali";
import SearchInArrayList from "../../../../../components/SearchInArrayList";

const OrganizationNeedsAssessment = (props) =>{

    const {initData,data,setData,setActiveAssessment,activeAssessment} = props

    const tableCols = [
        {name: "code", label: "کد نیازسنجی", type: "text"},
        {name: "title", label: "عنوان نیازسنجی", type: "text"   },
        {name: "fromDateConverted", label: "تاریخ شروع", type: "text"},
        {name: "thruDateConverted", label: "تاریخ پایان", type: "text"},
        {name: "responsibleName", label: "مسئول نیازسنجی", type: "text"},
        {name: "statusDescription", label: "وضعیت نیازسنجی", type: "text"},

    ]

    const [tableContent, setTableContent] = useState([]);
    
    const [statuses, setStatuses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [contact,setContact] = useState({'orgs':'','unit':'','positions':'','employees':''})

    const formDefaultValues = [];
    
    const formStructure = [{
        label:  "کد نیازسنجی",
        name:   "code",
        type:   "multiselect",
        optionLabelField: 'code',
        optionIdField:'code',
        options: initData.assessments ? initData.assessments.filter(item => item.code) : [] ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    },{
        label:  "عنوان نیازسنجی",
        name:   "title",
        type:   "multiselect",
        optionLabelField: 'title',
        optionIdField:'title',
        options: initData.assessments ? initData.assessments.filter(item => item.title) : [] ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    },{
        label:  "واحد سازمانی",
        name:   "unit",
        type:   "multiselect",
        optionLabelField: 'organizationName',
        optionIdField:'partyId',
        options: contact.units ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    },{
        label:  "وضعیت نیازسنجی",
        name:   "status",
        type:   "multiselect",
        optionLabelField: 'description',
        optionIdField:"statusId",
        options: statuses ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    },{
        label:  "مسئول نیازسنجی",
        name:   "partyId",
        type:   "multiselect",
        optionLabelField: 'responsibleName',
        optionIdField:'partyId',
        options: initData.assessments ? initData.assessments.filter(item => item.responsibleName) : [] ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    },{
        label:  "تاریخ شروع",
        name:   "fromDate",
        type:   "date",
    },{
        label:  "تاریخ پایان",
        name:   "thruDate",
        type:   "date",
    },{
        label:  "شرکت",
        name:   "org",
        optionLabelField: 'organizationName',
        optionIdField:'partyId',
        type:   "multiselect",
        options: contact.subOrgans ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    }]

    const [formValues, setFormValues] = useState( formDefaultValues );

    const dispatch = useDispatch();

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };

    function searchAssessments(){
        let assessmentsList = initData.assessments.slice()

        assessmentsList = SearchInArrayList(assessmentsList,formValues,'and')
        setTableContent(assessmentsList)

    }

    function resetForm(){
        setFormValues('')
    }

    function pageDefaultValues(){
        let assessments = initData.assessments
        if(assessments){
            for(let i =0 ; i<assessments.length ;i++){
                assessments[i].fromDateConverted = moment(assessments[i].fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD')
                assessments[i].thruDateConverted = moment(assessments[i].thruDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD')
                if(i == assessments.length-1){
                    setTableContent(assessments)
                }
            }

        }

        if(initData.contacts){
            setContact(initData.contacts)
            setLoading(false)
        }

        if(initData.statuses){
            setStatuses(initData.statuses)
        }
    }

    function editAssessment(item) {
        if(!item.requestId){
            document.querySelector(".ps--active-y").scrollTo(0,0)
            setActiveAssessment(item)
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'این نیازمندی قابل ویرایش نیست.'));
            
        }
        
    }

    function deleteCourse(item){
        return new Promise((resolve,reject)=>{
            if(item.status == "Created"){
                axios.post(SERVER_URL + "/rest/s1/training/deleteCurriculum",{course:item}, {
                    headers: {'api_key': localStorage.getItem('api_key')}
                }).then(res => {
                    resolve()
                    setActiveAssessment(null)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                });
            }
            else{
                reject('این نیازمندی قابل حذف شدن نیست.')
            }
        })
    }
    
    useEffect(()=>{
        pageDefaultValues()
    },[initData]);


    return (
        <Box m={2}>

            <FormPro
                append={formStructure}
                formValues={formValues}
                formDefaultValues={formDefaultValues}
                setFormValues={setFormValues}
                submitCallback={searchAssessments}
                resetCallback={resetForm}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary">جستجو</Button>
                </ActionBox>}
            />


            <TablePro

                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                removeCallback={deleteCourse}
                edit={"callback"}
                editCallback={editAssessment}
            />


        </Box>
    )
}

export default OrganizationNeedsAssessment