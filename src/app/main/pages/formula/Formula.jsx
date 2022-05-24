/**
 * @author Mohammadmahdi Rasouli <rasoulimohammadmahdi@yahoo.com>
 */

import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Typography, CircularProgress, Button } from '@material-ui/core';
import { FusePageSimple } from "@fuse";
import TabPane from "../../components/TabPane";
import PersonnelFormHeader from "../../components/PersonnelFormHeader";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useDispatch, useSelector } from "react-redux";
import { showAlert, SET_USER, setUser } from "../../../store/actions/fadak";
import { useHistory, useParams } from 'react-router-dom';
import ConstantValues from './tabs/ConstantValues/ConstantValues';
import Formulas from './tabs/Formulas/Formulas';
import InputFactors from './tabs/InputFactors/InputFactors';
import axios from "axios";
import {SERVER_URL} from "../../../../configs";
import constData from "../../../store/reducers/fadak/constData.reducers";

const Formula = (props) => {

    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [userOrganization,setUserOrganization]=React.useState([]);
    const [inputFactor,setInputFactor]=React.useState([])
    const [constant,setConstant]=React.useState([])
    const [payrollFactor,setPayrollFactor]=React.useState([])
    const [job,setJob]=React.useState([])
    const [enumData,setEnumData]=React.useState([])
    const [systemParam,setSystemParam]=React.useState([])
    const [partyDetail,setPartyDetail]=React.useState([])
    const [persons,setPersons]=React.useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const params = useParams()
    const history = useHistory();
    const dispatch = useDispatch();
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin

    const handleGoBack = () => {
        dispatch(setUser(null))
        history.goBack()//push("/searchPersonnel");
    }
    React.useEffect(() => {
        change()
    }, [])
    React.useEffect(()=>{getOrganization()},[])
    React.useEffect(()=>{if(userOrganization){
        console.log()
        getPayrollFactor("userOrganization",userOrganization)
        getJob()
        getEnums()
        getPartyDetail();
    }
    },[userOrganization])
    React.useEffect(()=>{if(job && enumData){makeList()}},[job,enumData])

    const getOrganization=()=>{
       

        // return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/rule/getCompanyParty", {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(async res => {
                console.log("res",res)
                await setUserOrganization(res.data?.organization);
                // resolve("success");
            })
        // })
    }
    const getPayrollFactor=()=>{
        let companyPartyId=userOrganization?.toPartyId
            axios.get(SERVER_URL+"/rest/s1/fadak/entity/PayrollFactor?companyPartyId="+companyPartyId,
            {headers:{"api_key":localStorage.getItem("api_key")}
            }).then(res=>{
        console.log("PayrollFacto",res,companyPartyId)

                setPayrollFactor(res.data.result)
        })
    }
    const change = () => {
        if (params.index) {
            setValue(parseInt(params.index))
        }
    }
    const getJob=()=>{
        let companyPartyId=userOrganization?.toPartyId
        axios.get(SERVER_URL+"/rest/s1/fadak/entity/Job?companyPartyId="+companyPartyId,
            {headers:{"api_key":localStorage.getItem("api_key")}}).then(res=>{
                setJob(res.data.result)
        })
    }
    const getEnums=()=> {
        return new Promise((resolve, reject) => {
            // axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=QualificationType,InputFactor,ConstantType", {
            axios.get(SERVER_URL + "/rest/s1/rule/getFormulaEnums?partyId="+partyId+"&partyClassificationTypeList=Militarystate,EmployeeGroups,EmployeeSubGroups,ActivityArea,ExpertiseArea,CostCenter&geoTypeList=GEOT_COUNTRY,GEOT_COUNTY,GEOT_PROVINCE&enumTypeList=UniversityType,GradeType,RelationDegree,PositionType,JobGrade,AgreementType,UniversityFields,PartyRelationshipType,EmploymentStatus,AcademicDepartmentType,SectEnumId,SacrificeType,UniversityName,ReligionEnumId,MaritalStatus,ResidenceStatus,QualificationType,InputFactor,ConstantType", {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(async res=> {
                console.log('sssssssssssss',res.data.enums)
                await   setEnumData(res.data.enums)
                await   setInputFactor(res.data.enums.enums.InputFactor)
                await   setConstant(res.data.enums.constants)
                resolve('Success!');
            })
        })
    }
    const makeList=()=>{
        let list={}

        // list["country"]=enumData?.geos?.GEOT_COUNTRY
        // list["county"]=enumData?.geos?.GEOT_COUNTY
        // list["province"]=enumData?.geos?.GEOT_PROVINCE
        list["geo"]=enumData?.geos
        list["classifications"]=enumData?.classifications
        list["religion"]=enumData?.enums?.ReligionEnumId
        list["sect"]=enumData?.enums?.SectEnumId
        list["residence"]=enumData?.enums?.ResidenceStatus
        list["marital"]=enumData?.enums?.MaritalStatus
        list["sacrifice"]=enumData?.enums?.SacrificeType
        list["university"]=enumData?.enums?.UniversityName
        list["UniversityType"]=enumData?.enums?.UniversityType
        list["fields"]=enumData?.enums?.UniversityFields
        list["department"]=enumData?.enums?.AcademicDepartmentType
        list["EmploymentStatus"]=enumData?.enums?.EmploymentStatus
        list["GradeType"]=enumData?.enums?.GradeType
        list["sibling"]=enumData?.enums?.PartyRelationshipType
        list["qualification"]=enumData?.QualificationTypeList
        list["emplPosition"]=enumData?.emplPosition
        list["organizationUnit"]=enumData?.organizationUnit
        list["orderTypes"]=enumData?.orderTypes
        list["PayGrade"]=enumData?.PayGrade
        list["AgreementType"]=enumData?.enums?.AgreementType
        list["JobGrade"]=enumData?.enums?.JobGrade
        list["relationDegree"]=enumData?.enums?.RelationDegree
        // list["JobTitle"]=enumData?.enums?.JobTitle
        list["PositionType"]=enumData?.enums?.PositionType
        list["job"]=job;

        // list = { ...list,...enumData?.classifications}
        setSystemParam(list)
    }
    const getPartyDetail=()=>{
        axios.get(SERVER_URL+"/rest/s1/fadak/entity/Person",{headers:{"api_key":localStorage.getItem("api_key")}}).then(res=>{
        let partyInfo=res.data.result.find(ele=>ele.partyId==partyIdLogin)
        setPartyDetail(partyInfo)
        setPersons(res.data.result)
        })
    }

    
    return (
        <FusePageSimple
            header={
                < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10">فرمول</Typography>

                    {(partyIdUser !== null) ?
                        <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={handleGoBack}
                            startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button> : ""
                    }
                </ div>
            }
            content={
                <>
                    <Paper>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="مقادیر ثابت" />
                             <Tab label="عوامل ورودی" />
                             <Tab label="فرمول ها" />
                        </Tabs>
                        <TabPane value={value} index={0} dir={theme.direction}>
                            <ConstantValues />
                        </TabPane>
                        <TabPane value={value} index={1} dir={theme.direction}>
                            <InputFactors />
                        </TabPane>
                        <TabPane value={value} index={2} dir={theme.direction} >
                            <Formulas constant={constant} inputFactor={inputFactor} payrollFactor={payrollFactor} systemParam={systemParam} partyId={partyIdLogin} userOrganization={userOrganization?.toPartyId} partyDetail={partyDetail} persons={persons}/>
                        </TabPane>
                    </Paper>
                </>
            } />
    )
}
export default Formula ;