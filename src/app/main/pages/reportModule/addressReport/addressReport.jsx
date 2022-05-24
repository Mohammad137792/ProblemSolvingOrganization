import React from 'react';
import AddressReportForm from "./addressReportForm";
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
import addressModal from "./addressModal.jsx";

const AddressReport=()=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const [contactData,setContactData]=React.useState([]);
    const [personAddress,setPersonAddress]=React.useState([]);
    const [formValues, setFormValues] = React.useState({filter:{}});
    const [orgInfo, setOrgInfo] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [close, setClose] = React.useState(false);
    const [display, setDisplay] = React.useState(false);
    const [enumData,setEnumData]=React.useState(false);
    const [addressData,setAddressData]=React.useState([]);
    const [excelData,setExcelData]=React.useState([]);
    const [loading,setLoading]=React.useState(true)
    const [value,setValue]=React.useState(true)
    React.useEffect(()=>{getEnums()},[])
    React.useEffect(()=>{getOrganizations()},[])
    React.useEffect(()=>{if(enumData)loadTable()},[enumData]);

    const getEnums=()=> {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE&typeAddressList=CmtPostalAddress",{
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(async res => {
                await setEnumData(res.data)
                resolve('Success!');
            }).catch(err => {
                reject('Failed!');
            });
        });
    }
    const getEnumDescription = (enumType, enumId)=>{
        let en;
        if(enumId){
            en = enumData.geos[enumType].find(o => o.geoId === enumId)
            return en?en.geoName:""
        }else{
            return "-"
        }
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
    const loadTable=()=>{
        setLoading(true);
        setAddressData([])
        getAddress(false);
    }
    const reloadTable = ()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true);
        setAddressData([])
        getAddress(true);
    }
    const moment = require('moment-jalaali')
    const editHandler = (party) => {
        dispatch(setUser(party.partyId))
        dispatch(setUserId(party.username,party.userId,party.partyRelationshipId,party.accountDisabled ))
        history.push(`/personnelBaseInformation/2`);
    }
    const cancelFilter=()=>{
        if(Object.keys(formValues.filter).length === 0)return;
        setLoading(true);
        setAddressData([])
        setFormValues({filter:{}});
        setValue(true)
        loadTable();
    }
    const addFormValue = setFormDataHelper(setFormValues)
    const modalHandler=(data)=>{
        let rowsModal=[]
        data.allAddress.forEach((address)=>{
            let entry={};
            let country=address?.countryGeoId?getEnumDescription("GEOT_COUNTRY",address.countryGeoId)+",":""
            let province=address?.stateProvinceGeoId?getEnumDescription("GEOT_PROVINCE",address.stateProvinceGeoId)+",":""
            let county=address?.countyGeoId?getEnumDescription("GEOT_COUNTY",address.countyGeoId)+",":""
            let district=address?.district??""
            let street=address?.street??""
            let alley=address?.alley??""
            let floor=address?.floor??""
            let unitNumber=address?.unitNumber??""
            let addressTelecomeNumber=address?.contactNumber??""
            let addressAreaCode=address?.areaCode??""
            let postalCode=address?.postalCode??""
            let plate=address?.plate??""
            district=district!=""?"محله "+district+",":""
            street=street!=""?"خیابان "+street+",":""
            alley=alley!=""?"کوچه "+alley+",":""
            floor=floor!=""?"طبقه "+floor+",":""
            postalCode=postalCode!=""?"کد پستی "+postalCode:""
            unitNumber=unitNumber!=""?"واحد "+unitNumber+",":""
            plate=plate!=""?"پلاک "+plate+",":""
            entry.address=country+" "+province+" "+county+" "+district+" "+street+" "+alley+" "+plate+" "+floor+" "+unitNumber+" "+postalCode
            entry.type=address?.purposeDescription??""
            entry.addressTelecomeNumber=addressAreaCode+"-"+addressTelecomeNumber
            rowsModal.push(entry);
        })
            setPersonAddress(rowsModal)
            setOpen(true);
    }
    const handleClose=()=>{
        setOpen(false);
    }
    const getAddress=(filter)=> {
        let paramData = filter? formValues.filter: {};
        paramData.ownerStatus=value?"ActiveRel":"NotActiveRel"
        const stringifyArrays = (field)=>{
            return paramData[field] && {[field]: JSON.stringify(paramData[field])}
        }
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=true",{
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...paramData,
                ...(stringifyArrays("ownerPartyId")),
                ...(stringifyArrays("countyGeoId")),
                ...(stringifyArrays("stateProvinceGeoId")),
                ...(stringifyArrays("contactMechPurposeId")),
                ...(stringifyArrays("countryGeoId")),
            }
        }).then(res => {
            let rows=[];
            res.data.party.forEach((party,index)=>{
                let entry={};
                let excel={};
                let address=party?.address?party?.address.find(ele=>ele.contactMechPurposeId=="PostalHome"):[]
                let country=address?.countryGeoId?getEnumDescription("GEOT_COUNTRY",address.countryGeoId)+",":""
                let province=address?.stateProvinceGeoId?getEnumDescription("GEOT_PROVINCE",address.stateProvinceGeoId)+",":""
                let county=address?.countyGeoId?getEnumDescription("GEOT_COUNTY",address.countyGeoId)+",":""
                let district=address?.district??""
                let street=address?.street??""
                let alley=address?.alley??""
                let floor=address?.floor??""
                let unitNumber=address?.unitNumber??""
                let addressTelecomeNumber=address?.contactNumber??""
                let addressAreaCode=address?.areaCode??""
                let postalCode=address?.postalCode??""
                let plate=address?.plate??""
                district=district!=""?"محله "+district+",":""
                street=street!=""?"خیابان "+street+",":""
                alley=alley!=""?"کوچه "+alley+",":""
                floor=floor!=""?"طبقه "+floor+",":""
                postalCode=postalCode!=""?"کد پستی "+postalCode:""
                unitNumber=unitNumber!=""?"واحد "+unitNumber+",":""
                plate=plate!=""?"پلاک "+plate+",":""
                entry.partyId=party.partyId
                entry.username=party.username
                entry.userId=party.userId
                entry.partyRelationshipId=party.partyRelationshipId
                entry.accountDisabled=party.accountDisabled
                entry.index= index+1
                entry.pseudoId= party?.pseudoId
                entry.organizationName=party?.organizationName
                entry.name=party?.firstName+" "+party?.lastName
                entry.address=country+" "+province+" "+county+" "+district+" "+street+" "+alley+" "+plate+" "+floor+" "+unitNumber+" "+postalCode
                entry.addressTelecomeNumber=addressAreaCode+"-"+addressTelecomeNumber
                entry.allAddress=party?.address
                rows.push(entry);
            })
            setLoading(false);
            prepareExcel(res.data)
            setAddressData(rows);
        }).catch(err => {
        });
    }
    const prepareExcel=(data)=>{
        let rows=[];
        data.party.forEach((party,index)=>{
            party.address.forEach((address,indexAdd)=>{
                let row={};
                let country=address?.countryGeoId?getEnumDescription("GEOT_COUNTRY",address.countryGeoId)+",":""
                let province=address?.stateProvinceGeoId?getEnumDescription("GEOT_PROVINCE",address.stateProvinceGeoId)+",":""
                let county=address?.countyGeoId?getEnumDescription("GEOT_COUNTY",address.countyGeoId)+",":""
                let district=address?.district??""
                let street=address?.street??""
                let alley=address?.alley??""
                let floor=address?.floor??""
                let unitNumber=address?.unitNumber??""
                let addressTelecomeNumber=address?.contactNumber+","??""
                let addressAreaCode=address?.areaCode+","??""
                let postalCode=address?.postalCode+","??""
                let plate=address?.plate+","??""
                district=district!=""?"محله "+district+",":""
                street=street!=""?"خیابان "+district+",":""
                alley=alley!=""?"کوچه "+alley+",":""
                floor=floor!=""?"طبقه "+floor+",":""
                postalCode=postalCode!=""?"کد پستی "+postalCode:""
                unitNumber=unitNumber!=""?"واحد "+unitNumber+",":""
                plate=plate!=""?"پلاک "+plate+",":""
                row["ردیف"]=indexAdd+1;
                row["کد پرسنلی"]=party.pseudoId??"";
                row["نام پرسنل"]=party?.firstName+" "+party?.lastName;
                row["شرکت"]=party?.organizationName
                row["نوع آدرس"]=address.purposeDescription??""
                row["آدرس"]=country+" "+province+" "+county+" "+district+" "+street+" "+alley+" "+plate+" "+floor+" "+unitNumber+" "+postalCode
                row["شماره تماس"]=addressAreaCode+"-"+addressTelecomeNumber
                rows.push(row)
            })
            setExcelData(rows)
        })
    }
    return(
        <Grid>
            <AddressReportForm addressData={addressData}  enumData={enumData}  formValues={formValues} setFormValues={setFormValues}
                                reloadTable={reloadTable} cancelFilter={cancelFilter} addFormValue={addFormValue} orgs={orgInfo} open={open} handleClose={handleClose} setDisplay={setDisplay} personAddress={personAddress} loading={loading} editHandler={editHandler} modalHandler={modalHandler} value={value} setValue={setValue} excelData={excelData}/>
        </Grid>
    )
    
};
export default AddressReport;