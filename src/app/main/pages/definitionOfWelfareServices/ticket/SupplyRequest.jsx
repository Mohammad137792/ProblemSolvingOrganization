import React from 'react';
import TablePro from 'app/main/components/TablePro';
import {Button, CardContent , Box, Card, CardHeader ,Collapse} from "@material-ui/core";
import FormPro from './../../../components/formControls/FormPro';
import ActionBox from './../../../components/ActionBox';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../configs";
import axios from "axios";
import {useSelector} from "react-redux";

const SupplyRequest = (props) => {
    const {formValues , setFormValues} = props
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [tableEmplPosition,setTableEmplPosition]= React.useState([]);
    const [editing,setEditing]= React.useState(false);
    const [editInfo,setEditInfo]= React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {label:  "عنوان رده تایید", name:   "emplPositionId", type:   "select", options :  tableEmplPosition , optionLabelField  : "description" , optionIdField: "emplPositionId", },
        {label:  "ترتیب تایید", name:   "sequence", type:   "number" },
        {label:  "امکان رد", name:   "reject", type:   "indicator" },
        {label:  "امکان رد برای اصلاح", name:   "modify", type:   "indicator" },
    ]
    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/orgInfoEmplPosition?partyRelationshipId=${partyRelationshipId}`  , axiosKey)
            .then((res)=>{
                let data=[]
                res.data.result.map((item,index)=>{
                    let newItem=Object.assign({},item,{description : `${item.description} - ${item.emplPositionId}`})
                    data.push(newItem)
                    if (index ==  res.data.result.length-1){
                        setTableEmplPosition(data)
                    }
                })
        })
    },[])
    React.useEffect(()=>{
        if(formValues.supplyVerificationId){
            axios.get(SERVER_URL + "/rest/s1/welfare/entity/VerificationLevel?verificationId=" + formValues.supplyVerificationId , axiosKey )
                .then((tableInfo)=>{
                    setTableContent(tableInfo.data)
                    setLoading(false)
                })
        }
        else {
            setTableContent([])
            setLoading(false)
        }
            
    },[loading])
    const handleRemove = (deleteData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/VerificationLevel",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: deleteData
            }).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })

    }
    const editfunction = (rowData)=>{
        setEditing(true)
        setEditInfo(rowData)
    }
    return (
        <Card>
            <CardHeader  title={"مراحل تاییدیه"} style={{justifyContent: "center" , textAlign : "center"}}
                    action={
                        <Tooltip title="نمایش مراحل">
                            <ToggleButton
                                value="check"
                                selected={expanded}
                                onChange={() => setExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
            {expanded ?  
                <CardContent >
                    <SupplyRequestForm  loading={loading} setLoading={setLoading} editing={editing} setEditing={setEditing} editInfo={editInfo} setEditInfo={setEditInfo} formValues={formValues} setFormValues={setFormValues}/>
                    <Collapse in={expanded}>
                    <TablePro
                        title="لیست مراحل"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        edit="callback"
                        editCallback={editfunction}
                        removeCallback={handleRemove}
                        loading={loading}
                    /> 
                    </Collapse>
                </CardContent>
            : "" }
        </Card>
    );
};

export default SupplyRequest;

function SupplyRequestForm({ editing, setEditing ,...restProps}) {
    const { loading, setLoading, editInfo, setEditInfo , formValues , setFormValues} = restProps;
    const [supplyRequestFormValues,setSupplyRequestFormValues]=React.useState()
    const [emplPosition,setEmplPosition]=React.useState([])
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label:  "پست سازمانی",
        name:   "emplPositionId",
        type:   "select",
        options :  emplPosition,
        optionLabelField  : "description" ,
        optionIdField: "emplPositionId",
        col     : 3
    },{
        label:  "ترتیب تایید",
        name:   "sequence",
        type:   "number",
        col     : 3
    },{
        label:  "امکان رد کردن",
        name:   "reject",
        type:   "indicator" ,
        col     : 3
    },{
        label:  "امکان رد برای اصلاح",
        name:   "modify",
        type:   "indicator" ,
        col     : 3
    }]
    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/orgInfoEmplPosition?partyRelationshipId=${partyRelationshipId}`  , axiosKey)
            .then((res)=>{
                let data=[]
                res.data.result.map((item,index)=>{
                    let newItem=Object.assign({},item,{description : `${item.description} - ${item.emplPositionId}`})
                    data.push(newItem)
                    if (index ==  res.data.result.length-1){
                        setEmplPosition(data)
                    }
                })
                
        })
    },[])
    React.useEffect(()=>{
        if(editing){
            setSupplyRequestFormValues(editInfo)
        }
        if(!editing){
            const defaultValues ={
                reject : "N" ,
                modify : "N"
            }
            setSupplyRequestFormValues(defaultValues)
        }
    },[editing])
    const handleSubmit =()=>{
        if(formValues.supplyVerificationId){
            const postData=Object.assign({},supplyRequestFormValues,{verificationId : formValues.supplyVerificationId})
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/VerificationLevel" , postData , axiosKey )
                .then(()=>{
                    setSupplyRequestFormValues({})
                    setLoading(true)
                })
        }
        else{
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
                .then(companyId=>{
                    const postData ={
                        companyPartyId : companyId.data.partyId ,
                        type : "SypplyTicketVerification"
                    }
                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/Verification" , postData , axiosKey )
                        .then(()=>{
                            axios.get(SERVER_URL + "/rest/s1/welfare/entity/Verification" , axiosKey )
                                .then((getId)=>{
                                    const newFormValues = Object.assign({},formValues,{supplyVerificationId : getId.data[getId.data.length-1].verificationId})
                                    setFormValues(newFormValues)
                                    const putData={...newFormValues , statusId : formValues.statusId == "Y" ? "activeWelfare" : "deactiveWelfare"}
                                    axios.put(SERVER_URL + "/rest/s1/welfare/entity/Welfare" , putData , axiosKey )
                                        .then(()=>{
                                            const dataForPost=Object.assign({},supplyRequestFormValues,{verificationId :  getId.data[getId.data.length-1].verificationId})
                                            axios.post(SERVER_URL + "/rest/s1/welfare/entity/VerificationLevel" , dataForPost , axiosKey )
                                                .then(()=>{
                                                    setSupplyRequestFormValues({})
                                                    setLoading(true)
                                                })
                                        })
                                })
                        })
                })
        }
    }
    const handleEdit =()=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/entity/VerificationLevel" , supplyRequestFormValues , axiosKey )
            .then(()=>{
                setSupplyRequestFormValues({})
                setLoading(true)
                setEditing(false)
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }
    const handleClose =()=>{
        const defaultValues ={
            reject : "N" ,
            modify : "N"
        }
        setSupplyRequestFormValues(defaultValues)
        setEditing(false)
    }
    return(
        <FormPro
            prepend={formStructure}
            formValues={supplyRequestFormValues}
            setFormValues={setSupplyRequestFormValues}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    handleSubmit()
                }
            }}
            resetCallback={handleClose}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}