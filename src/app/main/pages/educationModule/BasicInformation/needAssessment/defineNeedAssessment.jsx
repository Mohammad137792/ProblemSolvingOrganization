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


const DefineNeedAssessment = (props) =>{
    
    const {classes,initData,data,setData,setActiveAssessment,activeAssessment,needsContacts ,setNeedsContacts} = props

    const tableCols = [
        {name: "pseudoId", label: "شماره پرسنلی", type: "text"},
        {name: "firstName", label: "نام", type: "text"   },
        {name: "lastName", label: "نام خانوادگی", type: "text"},
        {name: "unitOrganization", label: "واحد سازمانی", type: "text"},
        {name: "emplPosition", label: "سمت", type: "text"},
        {name: "organizationName", label: "شرکت", type: "text"},
    ]

    const [formValidation, setFormValidation] = useState({});

    const [tableContent, setTableContent] = useState([]);

    const [loading, setLoading] = useState(false);
    
    const [expanded, setExpanded] = useState(false);
    
    const formDefaultValues = [];

    const [responsibles,setResponsibles] = useState([])

    const [contact,setContact] = useState({'orgs':'','unit':'','positions':'','employees':''})

    const [formValues, setFormValues] = useState( formDefaultValues );
    
    const [companyFormValues, setcompanyFormValues] = useState( formDefaultValues );
    
    const [byUnitformValues, setbyUnitformValues] = useState( formDefaultValues );
    
    const [byEmplformValues, setbyEmplformValues] = useState( formDefaultValues );
    
    const [byPersonnelformValues, setbyPersonnelformValues] = useState( formDefaultValues );

    const formStructure = [{
        label:  "کد نیازسنجی",
        name:   "code",
        type:   "text",
        required: true,
    },{
        label:  "عنوان نیازسنجی",
        name:   "title",
        type:   "text",
        required: true,
    },{
        label:  "انتخاب مسئول نیازسنجی",
        name:   "emplPositionId",
        type:   "select",
        required: true,
        optionIdField:'emplPositionId',
        options: responsibles ,
    },{
        label:  "تاریخ شروع",
        name:   "fromDate",
        type:   "date",
        required: true,
    },{
        label:  "تاریخ پایان",
        name:   "thruDate",
        type:   "date",
        required: true,
    }]

    const companyFormStructure = [{
        label:  "شرکت",
        name:   "subOrg",
        type:   "select",
        required:true,
        optionLabelField: 'organizationName',
        optionIdField:'partyId',
        options: contact.subOrgans ,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) : options
    }]

    const byUnitformStructure = [{
        label:  "واحد سازمانی",
        name:   "unit",
        type:   "multiselect",
        optionLabelField: 'organizationName',
        optionIdField:'partyId',
        options: contact.units,
        required : true,
        filterOptions: options => companyFormValues["subOrg"] ? options.filter(o=>o["parentOrg"] == companyFormValues["subOrg"]) : options
    },{
        label:  "پست سازمانی",
        name:   "positions",
        type:   "multiselect",
        options: contact.positions  ,
        filterOptions: options =>  byUnitformValues["unit"] && eval(byUnitformValues["unit"]).length > 0 ? options.filter((item) =>
            byUnitformValues["unit"].indexOf(item.parentEnumId) >= 0
        ) :
            companyFormValues["subOrg"] && companyFormValues["subOrg"] != "" ? options.filter(o=>o["parentOrgId"] == companyFormValues["subOrg"])
                :options
    },{
        label:  "لیست کارمندان",
        name:   "persons",
        type:   "multiselect",
        optionLabelField: 'fullName',
        optionIdField:'partyId',
        options: contact.employees.party,
        filterOptions: options =>  byUnitformValues["positions"] && eval(byUnitformValues["positions"]).length > 0 ? options.filter((item) =>
            byUnitformValues["positions"].indexOf(item.emplPositionId) >= 0
            ) :
            byUnitformValues["unit"] && eval(byUnitformValues["unit"]).length > 0 ? options.filter((item) =>
                byUnitformValues["unit"].indexOf(item.unitOrganization) >= 0
                ) :
            companyFormValues["subOrg"] && companyFormValues["subOrg"] != "" ? options.filter(o=>o["ownerPartyId"] == companyFormValues["subOrg"])
                :options
    },]

    const byEmplformStructure = [{
        label:  "نقش های سازمانی",
        name:   "roles",
        type:   "multiselect",
        optionIdField:   "roleTypeId",
        required:true,
        options: contact.roles,
    }]

    const byPersonnelformStructure = [{
        label:  "گروه پرسنلی",
        name:   "persongroup",
        type:   "multiselect",
        required:true,
        optionIdField:'partyClassificationId',
        options: contact.group ,
        filterOptions: options => companyFormValues["subOrg"] ? options.filter(o=>o["parentOrg"] == companyFormValues["subOrg"]) : options
    }]

    const dispatch = useDispatch();

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };

    function submitAssessment(){
        
        var codeUniqe = true
        let checkUniqeCode = new Promise(function(uniqeResolve, uniqeReject) {
            let arr = initData.assessments

            if(arr.length>0){
                for(let i = 0 ; i<arr.length ; i++){
                    if(arr[i].code == formValues.code)
                        codeUniqe = false

                    if(i == arr.length-1)
                        uniqeResolve()
                }
            }
            else{
                uniqeResolve()
            }
        });

        checkUniqeCode.then(() => {
            if (codeUniqe) {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                axios.post(SERVER_URL + "/rest/s1/training/addNeedsAssessment", {data: formValues}, {
                    headers: {'api_key': localStorage.getItem('api_key')}
                })
                    .then(res => {
                        let newNeeds = Object.assign(res.data.assessmentId, formValues)
                        setActiveAssessment(newNeeds)
                        setData(newNeeds)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                });
            } else {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد نیازسنجی تکراری است.'));
            }
        })
    }

    function resetForm(){
        setFormValues('')
    }

    function pageDefaultValues(){
        if(initData.responsibles){

            let responsibles = initData.responsibles
            // units = initData.contacts.units
            // orgs = initData.contacts.subOrgans
            // positions = initData.contacts.positions
            setResponsibles(responsibles)
            setContact(initData.contacts)

        }

    }

    function assessmentDefaultContacts(){
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessmentContacts?curriculumId="+activeAssessment.curriculumId, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            if(res.data.assessmentData.contacts)
                setTableContent(res.data.assessmentData.contacts)
            setLoading(false)

        }).catch(() => {
            setLoading(false)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }

    function addContacts(){

        if(companyFormValues['subOrg']){
            let entry={},
                data = {},
                isValid = true

            if(contactType == 'empl'){
                entry = byEmplformValues
                if(!byEmplformValues['roles'] || eval(byEmplformValues.roles).length == 0){
                    isValid = false
                }

            }

            else if(contactType == 'unit'){
                if(byUnitformValues && !Array.isArray(byUnitformValues)){
                    entry = JSON.parse(JSON.stringify(byUnitformValues))
                }

                if(!byUnitformValues || !byUnitformValues["unit"]){
                    isValid = false
                }
                else{
                    if (entry.persons && eval(entry.persons).length == 0 ) {
                        delete entry.persons;
                    }
                    if (entry.positions && eval(entry.positions).length == 0 ) {
                        delete entry.positions;
                    }
    
                    if(!entry.persons && !entry.positions ){
                        let list = contact.employees.party.filter((item) =>
                        byUnitformValues["unit"].indexOf(item.unitOrganization) >= 0).map(x => x.partyId)
                        entry.persons = list
                    }
                }
               
            }

            else{
                entry = byPersonnelformValues
                if(!byPersonnelformValues.persongroup || eval(byPersonnelformValues.persongroup).length == 0){
                    isValid = false
                }
            }

            if(isValid){

                data.curriculumId = activeAssessment.curriculumId
                data.entry = entry
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                axios.post(SERVER_URL + "/rest/s1/training/addContactNeedsAssessment", {data: data}, {
                    headers: {'api_key': localStorage.getItem('api_key')}
                })
                    .then(res => {
                        setNeedsContacts(!needsContacts)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                });

            }

            else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فیلد های اجباری را پر کنید.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فیلد شرکت انتخاب نشده است.'));
        }
    }

    function deleteContact(row){
        return axios.post(SERVER_URL + "/rest/s1/training/deleteContactNeedsAssessment",{contact:row}, {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        });
    }

    const [contactType, setContactType] = useState("unit");

    const onRadioChange = event => {
        setContactType(event.target.value);
    };


    useEffect(()=>{
        pageDefaultValues()
    },[initData]);

    useEffect(()=>{
        if(activeAssessment) {
            assessmentDefaultContacts()
        }
    },[needsContacts]);

    useEffect(()=>{
        if(activeAssessment) {
            assessmentDefaultContacts()
            setFormValues(activeAssessment)
            setExpanded(true)

        }
        else{
            setFormValues({})
            setcompanyFormValues({})
            setbyUnitformValues({})
            setbyEmplformValues({})
            setbyPersonnelformValues({})
            setExpanded(false)
        }
    },[activeAssessment]);


    return (
        <Box>
            <Card >
                <CardHeader title={"مشخصات نیازسنجی"}/>
                <CardContent>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        formDefaultValues={formDefaultValues}
                        setFormValues={setFormValues}
                        submitCallback={submitAssessment}
                        resetCallback={resetForm}
                        formValidation={formValidation} setFormValidation={setFormValidation}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">ایجاد</Button>
                        </ActionBox>}
                    />
                </CardContent>
            </Card>

            <Box mt={2}>
                <Card>

                    <CardHeader  className={classes.headerCollapse}  title={"مخاطبین نیازسنجی"}
                        action={
                            <Tooltip title="نمایش مخاطبین نیازسنجی">
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
                            <FormPro
                                append={companyFormStructure}
                                formValues={companyFormValues}
                                formDefaultValues={formDefaultValues}
                                setFormValues={setcompanyFormValues}
                                resetCallback={resetForm}
                            />

                            <div className={classes.centerFlux} >
                                        <label htmlFor="rd-unit">  </label>
                                        <input
                                            id="rd-unit"
                                            type="radio"
                                            value="unit"
                                            checked={contactType === "unit"}
                                            onChange={onRadioChange}
                                        />
                                        <div className={(contactType === "unit" ? '' : classes.DisableRow)} style={{ flexGrow: 1,margin:'14px 16px 0 0' }}>
                                            <FormPro
                                                append={byUnitformStructure}
                                                formValues={byUnitformValues}
                                                formDefaultValues={formDefaultValues}
                                                setFormValues={setbyUnitformValues}
                                                // submitCallback={submitCourse}
                                                resetCallback={resetForm}
                                            />
                                        </div>

                                    </div>

                            <div  className={classes.centerFlux} >
                                    <label htmlFor="rd-empl"> </label>
                                    <input
                                        id="rd-empl"
                                        type="radio"
                                        value="empl"
                                        checked={contactType === "empl"}
                                        onChange={onRadioChange}
                                    />
                                    <div className={(contactType === "empl" ? '' : classes.DisableRow)} style={{ flexGrow: 1,margin:'14px 16px 0 0' }}>
                                        <FormPro
                                            append={byEmplformStructure}
                                            formValues={byEmplformValues}
                                            formDefaultValues={formDefaultValues}
                                            setFormValues={setbyEmplformValues}
                                            // submitCallback={submitCourse}
                                            resetCallback={resetForm}
                                        />
                                    </div>
                                </div>

                            <div  className={classes.centerFlux} >
                                <label htmlFor="rd-person"></label>
                                    <input
                                        id="rd-person"
                                        type="radio"
                                        value="person"
                                        checked={contactType === "person"}
                                        onChange={onRadioChange}
                                    />
                                <div className={(contactType === "person" ? '' : classes.DisableRow)} style={{ flexGrow: 1,margin:'14px 16px 0 0' }}>
                                    <FormPro
                                        append={byPersonnelformStructure}
                                        formValues={byPersonnelformValues}
                                        formDefaultValues={formDefaultValues}
                                        setFormValues={setbyPersonnelformValues}
                                        formValidation={formValidation} setFormValidation={setFormValidation}

                                        resetCallback={resetForm}
                                    />
                                </div>
                            </div>

                            <ActionBox>
                                <Button type="submit" role="primary" onClick={addContacts}>افزودن</Button>
                            </ActionBox>

                            <TablePro

                                columns={tableCols}
                                loading={loading}
                                rows={tableContent}
                                setRows={setTableContent}
                                removeCallback={deleteContact}
                            />
                        </Collapse>
                    </CardContent>

                </Card>
            </Box>
        </Box>
    )
}

export default DefineNeedAssessment