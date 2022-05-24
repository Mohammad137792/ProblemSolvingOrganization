import React from 'react';
import BankReportForm from "./bankReportForm";
import {Grid,Button} from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import { useDispatch} from "react-redux";
import {setUser,setUserId } from "../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import {INPUT_TYPES, setFormDataHelper} from "../../../helpers/setFormDataHelper";


const BankReport=()=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading,setLoading]=React.useState(true);
    const [formValues, setFormValues] = React.useState({filter:{}});
    const[orgs,setOrgs]=React.useState([])
    const[rowBank,setRowBank]=React.useState([])
    const[open,setOpen]=React.useState(false)
    const[value,setValue]=React.useState(true)
    const [close, setClose] = React.useState(false);
    const [enumData, setEnumData] = React.useState(false);
    const[display,setDisplay]=React.useState(false)
    const[bankData,setBankData]=React.useState([])
    const[excelData,setExcelData]=React.useState([])
    const addFormValue = setFormDataHelper(setFormValues)
    React.useEffect(()=>{getOrganizations()},[])
    React.useEffect(()=>{loadTable()},[])
    React.useEffect(()=>{getEnums()},[])
    const handleClose=()=>{
        setOpen(false);
    }
    const getEnums=()=> {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=PaymentMethodPurpose", {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(async res=> {

                await   setEnumData(res.data)
                resolve('Success!');
            })
        })
    }
    const editHandler = (party) => {
        dispatch(setUser(party.partyId))
        dispatch(setUserId(party.username,party.userId,party.partyRelationshipId,party.accountDisabled ))
        history.push(`/personnelBaseInformation/6`);
    }
    const modalHandler=(data)=>{
        let rowsModal=[]
        data.allBankData.forEach((bank,index)=>{
            let entry={};
            entry.index= index+1
            entry.acountOwner=(bank.firstNameOnAccount??"")+" "+(bank.lastNameOnAccount??"")+" "+(bank.suffixOnAccount??"")
            entry.bankName=bank?.bankName
            entry.routingNumber=bank?.routingNumber
            entry.accountNumber=bank?.accountNumber
            entry.shebaNumber=bank?.shebaNumber
            entry.cardNumber=bank?.cardNumber
            entry.accountType=bank?.purposeDescription
            rowsModal.push(entry);
        })
        setRowBank(rowsModal)
        setOpen(true);
    }
    const getBankInfo=(filter)=> {
        let paramData = filter? formValues.filter: {};
        paramData.ownerStatus=value?"ActiveRel":"NotActiveRel"
        const stringifyArrays = (field)=>{
            return paramData[field] && {[field]: JSON.stringify(paramData[field])}
        }
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?bankInfo=true",{
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...paramData,
                ...(stringifyArrays("ownerPartyId")),
                ...(stringifyArrays("purposeEnumId")),
            }
        }).then(res => {
            let rows=[];
            res.data.party.forEach((party,index)=>{
                let entry={};
                let  bank=party?.bank?party?.bank.find(ele=>ele.purposeEnumId=="PmpPriamryAccont"):[]
                entry.partyId=party?.partyId
                entry.username=party?.username
                entry.userId=party?.userId
                entry.partyRelationshipId=party?.partyRelationshipId
                entry.accountDisabled=party?.accountDisabled
                entry.index= index+1
                entry.pseudoId= party?.pseudoId
                entry.organizationName=party?.organizationName
                entry.name=party?.firstName+" "+party?.lastName
                entry.acountOwner=bank?bank?.firstNameOnAccount+" "+bank?.lastNameOnAccount:""
                entry.bankName=bank?.bankName
                entry.routingNumber=bank?.routingNumber
                entry.accountNumber=bank?.accountNumber
                entry.shebaNumber=bank?.shebaNumber
                entry.cardNumber=bank?.cardNumber
                entry.allBankData=party?.bank
                rows.push(entry);
            })
            prepareExcelData(res.data)
            setLoading(false)
            setBankData(rows);
        }).catch(err => {
        });
    }
    const prepareExcelData=(data)=>{
        let rows=[];
        data.party.forEach((party,index)=>{
            party.bank.forEach((bank,indexBnk)=>{
                let entry={};
                entry["ردیف"]= indexBnk+1
                entry["کد پرسنلی"]= party?.pseudoId
                entry["نام"]= party?.firstName+" "+party?.lastName
                entry["شرکت"]= party.organizationName??""
                entry["نوع حساب"]= bank.purposeDescription??""
                entry["مالک حساب"]=(bank.firstNameOnAccount??"")+" "+(bank.lastNameOnAccount??"")+(bank.suffixOnAccount??"")
                entry["نام بانک"]= bank.bankName??""
                entry["کد شعبه"]= bank.routingNumber??""
                entry["شماره حساب"]= bank.accountNumber??""
                entry["کد شبا"]= bank.shebaNumber??""
                entry["شماره کارت"]= bank.cardNumber??""
                rows.push(entry);
            })
        })
        debugger
        setExcelData(rows)
    }
    const getOrganizations=()=> {
        axios.get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            let orgList = res.data.organization.concat(res.data.subOrganization);
            setOrgs(orgList);
        }).catch(err => {
        });
    }
    const loadTable=()=>{
        getBankInfo(false);
    }
    const reloadTable = ()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true)
        getBankInfo(true);
    }
    const cancelFilter=()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true)
        setFormValues({filter:{}});
        setValue(true)
        loadTable();
    }

    return(
        <Grid>
            <BankReportForm addFormValue={addFormValue} formValues={formValues} orgs={orgs} bankData={bankData} rowBank={rowBank} open={open} handleClose={handleClose} setDisplay={setDisplay} reloadTable={reloadTable} cancelFilter={cancelFilter} enumData={enumData} loading={loading} modalHandler={modalHandler} editHandler={editHandler} value={value} setValue={setValue} excelData={excelData}/>
            
        </Grid>
    )
    
};
export default BankReport;