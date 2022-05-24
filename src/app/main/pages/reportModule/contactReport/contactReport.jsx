import React from 'react';
import ContactReportForm from "./contactReportForm";
import {Grid,Button} from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import {EditOutlined} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch} from "react-redux";
import {setUser,setUserId } from "../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import {INPUT_TYPES, setFormDataHelper} from "../../../helpers/setFormDataHelper";
import ContactModal from "./contactModal.jsx";

const ContactReport=()=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const [contactData,setContactData]=React.useState([]);
    const [personContacts,setPersonContacts]=React.useState([]);
    
    const [formValues, setFormValues] = React.useState({filter:{}});
    const [orgInfo, setOrgInfo] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [contactType, setContactType] = React.useState([]);
    const [close, setClose] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [value, setValue] = React.useState(true);
    const [excelData,setExcelData]=React.useState([]);

    React.useEffect(()=>{getOrganizations()},[])
    React.useEffect(()=>{loadTable()},[]);
    React.useEffect(()=>{getContactType()},[]);
    
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
    const getContactType=()=> {
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/ContactMechPurpose?contactMechTypeEnumId=CmtTelecomNumber",{
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(res => {
                setContactType(res.data.result)
            }).catch(err => {
            });
   };
    const loadTable=()=>{
        getContact(false);
    }
    const reloadTable = ()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true);
        setContactData([])
        getContact(true);
    }
    const moment = require('moment-jalaali')
    const editHandler = (party) => {
        dispatch(setUser(party.partyId))
        dispatch(setUserId(party.username,party.userId,party.partyRelationshipId,party.accountDisabled ))
        history.push(`/personnelBaseInformation/1`);
    }
    const cancelFilter=()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true);
        setContactData([])
        setFormValues({filter:{}});
        setValue(true)
        loadTable();
    }
    const addFormValue = setFormDataHelper(setFormValues)
    const getContact=(filter)=> {
        let paramData = filter? formValues.filter: {};
        paramData.ownerStatus=value?"ActiveRel":"NotActiveRel"
        const stringifyArrays = (field)=>{
            return paramData[field] && {[field]: JSON.stringify(paramData[field])}
        }
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?contactInfo=true",{
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...paramData,
                ...(stringifyArrays("ownerPartyId")),
                ...(stringifyArrays("contactMechPurposeId")),
            }
        }).then(res => {
            let rows=[];
            res.data.party.forEach((party,index)=>{
               let entry={};
               let partyContact=party?.contact?.find(ele=>ele.contactMechPurposeId=="PhoneHome")
               let mobileContact=party?.contact?.find(ele=>ele.contactMechPurposeId=="PhoneMobile")
               let areaCode=partyContact?.areaCode!=null?partyContact?.areaCode+"-":""
               let areaCodeMobile=mobileContact?.areaCode!=null?mobileContact?.areaCode+"-":""
               let contactNumber=partyContact?.contactNumber??""
               let mobile=mobileContact?mobileContact?.contactNumber:""
               entry.allContact=party?.contact
               entry.index= index+1
               entry.partyId= party.partyId
               entry.username= party.username
               entry.userId= party.userId
               entry.partyRelationshipId= party.partyRelationshipId
               entry.accountDisabled= party.accountDisabled
               entry.pseudoId= party.pseudoId
               entry.organizationName=party?.organizationName
               entry.name=party?.firstName+" "+party?.lastName
               entry.mobile=areaCodeMobile+mobile
               entry.contact=areaCode+contactNumber
               rows.push(entry)
            })
            setContactData(rows);
            prepareExcel(res.data)
            setLoading(false)
        }).catch(err => {
        });
    }
    const modalHandler=(data)=>{
            let rows=[];
            data.allContact.forEach(ele=>{
                let entry={};
                entry.purposeDescription=ele.purposeDescription;
                let contactNumber="";
                let areaCode="";
                if(ele.contactMechTypeEnumId=="CmtTelecomNumber"){
                     contactNumber=ele.contactNumber
                    areaCode=ele.areaCode?ele.areaCode+"-":""
                }
                if(ele.contactMechTypeEnumId!="CmtTelecomNumber"){
                    contactNumber=ele.infoString
                }
                entry.contactNumber=areaCode+contactNumber
                rows.push(entry)
            })
            setPersonContacts(rows)
            setOpen(true);
    }
    const handleClose=()=>{
        setOpen(false);
    }
    const prepareExcel=(data)=>{
        let rows=[];
        data.party.forEach((party,index)=>{
            party.contact.forEach((partyContact,indexContact)=>{
                let entry={};
                let areaCode=partyContact?.areaCode!=null?partyContact?.areaCode+"-":""
                let contactNumber=partyContact.contactMechTypeEnumId=="CmtTelecomNumber"?partyContact.contactNumber:partyContact.infoString
                entry["ردیف"]= indexContact+1
                entry["کد پرسنلی"]= party.pseudoId
                entry["نام پرسنل"]=party?.firstName+" "+party?.lastName
                entry["شرکت"]=party?.organizationName
                entry["نوع اطلاعات تماس "]=partyContact.purposeDescription??""
                entry["اطلاعات تماس "]=areaCode+contactNumber
                rows.push(entry)
            })
        })
        setExcelData(rows)
    }
    return(
        <Grid>
            <ContactReportForm contactData={contactData}  formValues={formValues} setFormValues={setFormValues}
                                reloadTable={reloadTable} cancelFilter={cancelFilter} addFormValue={addFormValue} orgs={orgInfo} open={open} handleClose={handleClose} setDisplay={setDisplay} personContacts={personContacts} contactType={contactType} loading={loading} editHandler={editHandler} modalHandler={modalHandler} value={value} setValue={setValue} excelData={excelData}/>
        </Grid>
    )
    
};
export default ContactReport;