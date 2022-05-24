
import React from 'react';
import FamilyReportForm from "./familyReportForm";
import {Grid,Button} from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import { useDispatch} from "react-redux";
import {setUser,setUserId } from "../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import {INPUT_TYPES, setFormDataHelper} from "../../../helpers/setFormDataHelper";

const FamilyReport=()=>{
    
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading,setLoading]=React.useState(true);
    const [personData,setPersonData]=React.useState([]);
    const [enumData,setEnumData]=React.useState(false);
    const [formValues, setFormValues] = React.useState({filter:{}});
    const [orgInfo, setOrgInfo] = React.useState([]);
    const [value,setValue]=React.useState(true);
    const [inputValue,setInputValue]=React.useState("");
    const [excelData,setExcelData]=React.useState([]);
    const ageRangeDefault = [0,100];
    const childrenRangeDefault = [0,15];
    const [valueAge, setValueAge] = React.useState(ageRangeDefault);
    const [valueChildren, setValueChildren] = React.useState(childrenRangeDefault);

    React.useEffect(()=>{getEnums()},[])
    React.useEffect(()=>{if(enumData)loadTable()},[enumData]);
    React.useEffect(()=>{getOrganizations()},[])
    
    const getEnums=()=> {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=QualificationType,EmploymentStatus,universityFields,ReligionEnumId,sectEnumId,ResidenceStatus,militaryState,MaritalStatus&geoTypeList=GEOT_PROVINCE&relationShipTypeList=FamilyMember",{
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
                params: {
                    partyClassificationTypeList: "Militarystate"
                }
            }).then(async res => {
                await setEnumData(res.data)
                resolve('Success!');
            }).catch(err => {
                reject('Failed!');
            });
        });
    }
    const getEnumDescription = (enumType, enumId,type)=>{
        let en;
        if(enumId){
            if(type=="enum") en = enumData.enums[enumType].find(o => o.enumId === enumId)
            if(type=="classification") {
                en = enumData.classifications[enumType].find(o => o.partyClassificationId === enumId)

            }
            if(type=="relation") {
                en = enumData.relationShips[enumType].find(o => o.enumId === enumId)

            }
            return en?en.description:""
        }else{
            return "-"
        }
    }
    const loadTable=()=>{
        getPersons(false);
    }
    const reloadTable = (filter)=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true)
        getPersons(filter);
    }
    const moment = require('moment-jalaali')
    const editHandler = (party) => {
        dispatch(setUser(party.personnelPartyId))
        dispatch(setUserId(party.personnelUsername,party.personnelUserId,party.personnelRelationShipId,party.personnelAccountDisabled ))
        history.push(`/personnelBaseInformation/5`);

    }
    const cancelFilter=()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true)
        setFormValues({filter:{}});
        setValueAge(ageRangeDefault)
        setValueChildren(childrenRangeDefault)
        setInputValue("")
        setValue(true)
        reloadTable(false);
    }
    const addFormValue = setFormDataHelper(setFormValues)
    const fieldEnumChange=(event,newValue)=>{
        formValues.filter={
            ...formValues.filter,
            fieldEnumId:[newValue.enumId]
        }
        const newFormData = Object.assign({}, formValues)
        setFormValues(newFormData)
    }
    const handleChangeAge = (event, newVal) => {
        setValueAge(newVal)
        formValues.filter.age = newVal;
        addFormValue(formValues.filter.age)
    }
    const handleChangeChildren = (event, newVal) => {
        setValueChildren(newVal)
        formValues.filter.NumberofKids = newVal;
        addFormValue(formValues.filter.NumberofKids)
    }
    const listFilter=enumData?.enums?.MaritalStatus.map(ele=>ele.description);
    const getPersons=(filter)=> {
        let paramData = filter? formValues.filter: {};
        paramData.fromOwnerStatus=value?"ActiveRel":"NotActiveRel"
        const stringifyArrays = (field)=>{
            return paramData[field] && {[field]: JSON.stringify(paramData[field])}
        }
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?familyInfo=true",{
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...paramData,
                ...(stringifyArrays("NumberofKids")),
                ...(stringifyArrays("age")),
                ...(stringifyArrays("militaryState")),
                ...(stringifyArrays("employmentStatusEnumId")),
                ...(stringifyArrays("relation")),
                ...(stringifyArrays("ownerPartyId")),
                ...(stringifyArrays("maritalStatusEnumId")),
                ...(stringifyArrays("residenceStatusEnumId")),
                ...(stringifyArrays("ReligionEnumID")),
                ...(stringifyArrays("sectEnumID")),
                ...(stringifyArrays("fieldEnumId")),
                ...(stringifyArrays("qualificationTypeEnumId")),
            }
        }).then(res => {
            const rows = res.data.party.map((party,index) => ({
                index:index+1,
                personnelPartyId:party.personnelPartyId,
                personnelUsername:party.personnelUsername,
                personnelUserId:party.personnelUserId,
                personnelRelationShipId:party.personnelRelationShipId,
                personnelAccountDisabled:party.personnelAccountDisabled,
                pseudoId: party.personnelPseudoId,
                organization: party.personnelOrganization,
                employmentStatus: party.employmentStatus??"",
                name:party?.firstName+" "+party?.lastName,
                personnelName:party?.personnelFirstName+" "+party?.personnelLastName,
                relation:party.relationType?getEnumDescription("PartyRelationshipType",party?.relationType,"relation"):"",
                birthProvince:party?.birthProvince?party.birthProvince:"",
                birthDate:party.birthDate?moment(party.birthDate).format('jYYYY/jM/jD'):"-",
                martialStatusEnumId:party.maritalStatusEnumId?getEnumDescription("MaritalStatus",party?.maritalStatusEnumId,"enum"):"",
                numberOfKids:party.NumberofKids?party.NumberofKids:"",
                residenceStatusEnumId:party.residenceStatusEnumId?getEnumDescription("ResidenceStatus",party?.residenceStatusEnumId,"enum"):"",
                militaryState: party.militaryState?getEnumDescription("Militarystate",party?.militaryState,"classification"):"",
            }))
            prepareExcel(res.data)
            setLoading(false)
            setPersonData(rows);
        }).catch(err => {
        });
    }
    const getOrganizations=()=> {
        axios.get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            let orgList = res.data.organization.concat(res.data.subOrganization);
            setOrgInfo(orgList);
        }).catch(err => {
        });
    }
    const prepareExcel=(data)=> {
        let rows=[];
        data.party.forEach((party, index) => {
            let entry = {};
            entry["ردیف"] = index + 1
            entry["کد پرسنلی"] = party.personnelPseudoId ?? ""
            entry["نام پرسنل"] = party?.personnelFirstName + " " + party?.personnelLastName
            entry["شرکت"] = party.personnelOrganization ?? ""
            entry["نسبت"] = party.relationType ? getEnumDescription("PartyRelationshipType", party?.relationType, "relation") : ""
            entry["نام و نام خانوادگی"] = party?.firstName + " " + party?.lastName
            entry["محل تولد"] = party?.birthProvince ? party.birthProvince : ""
            entry["تاریخ تولد"] = party.birthDate ? moment(party.birthDate).format('jYYYY/jM/jD') : "-"
            entry["وضعیت تاهل"] = party.maritalStatusEnumId ? getEnumDescription("MaritalStatus", party?.maritalStatusEnumId, "enum") : ""
            entry["تعداد فرزندان"] = party.NumberofKids ? party.NumberofKids : ""
            entry["وضعیت اشتغال"] = party.employmentStatus ?? ""
            entry["وضعیت سکونت"] = party.residenceStatusEnumId ? getEnumDescription("ResidenceStatus", party?.residenceStatusEnumId, "enum") : ""
            entry["وضعیت نظام وظیفه"] = party.militaryState ? getEnumDescription("Militarystate", party?.militaryState, "classification") : ""
            rows.push(entry);
        })
            setExcelData(rows);
    }
    return(
        <Grid>
            <FamilyReportForm personData={personData} enumData={enumData} formValues={formValues} setFormValues={setFormValues}
                                reloadTable={reloadTable} cancelFilter={cancelFilter}  handleChangeAge={handleChangeAge} handleChangeChildren={handleChangeChildren}
                                valueAge={valueAge}  valueChildren={valueChildren}  ageRangeDefault={ageRangeDefault}  childrenRangeDefault={childrenRangeDefault}
                                addFormValue={addFormValue} listFilter={listFilter} orgs={orgInfo} value={value} setValue={setValue} loading={loading} editHandler={editHandler} fieldEnumChange={fieldEnumChange} inputValue={inputValue} setInputValue={setInputValue} excelData={excelData}/>
        </Grid>
    )
    
};
export default FamilyReport;