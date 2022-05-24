import React , {useState , useEffect} from 'react';
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import axios from "axios";
import {useSelector} from "react-redux";
import TablePro from '../../../../components/TablePro'
import OrganizationForm from './OrganizationForm'
import PersonalStructure from './PersonalStructure';
import {Card, CardContent, CardHeader ,Grid} from "@material-ui/core"

const OrganizationInformation = props => {
const [loading, setLoading] = React.useState(true);
const [tableContent, setTableContent] = React.useState([]);
const [formValues, setFormValues] =React.useState();
const [edit,setEdit]=React.useState(false)
const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
const [EntRoleType,setEntRoleType] = React.useState([]);
const axiosKey = {
    headers: {
        'api_key': localStorage.getItem('api_key')
    }
}
const tableCols = [
    {label:  "واحد سازمانی ", name:   "organizationUnit", type:   "select", options : "OrganizationUnit", optionIdField  : "partyId", optionLabelField  : "organizationName" , },
    {label:  "پست سازمانی", name:   "emplPositionId", type:   "select", options : "EmplPosition", optionIdField: "emplPositionId",},
    {label:  "پست اصلی", name:   "mainPosition", type:   "indicator",  },
    {label:  "نقش", name:   "roleTypeId", type:   "select", options : EntRoleType , optionIdField  : "roleTypeId" , optionLabelField  : "description"},
    {label:  "درصد اشتغال", name:   "occupancyRate", type:   "number",}
    ]
    useEffect(()=>{
        if(loading){
            axios.get(SERVER_URL + `/rest/s1/fadak/OrganizationInformationTable?partyId=${partyId}&partyRelationshipId=${partyRelationshipId} ` , axiosKey)
            .then((res)=>{
                setTableContent(res.data.Info)
                setLoading(false)
            })
        }
    },[loading])
    useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/RoleType` , axiosKey)
        .then((res)=>{
            setEntRoleType(res.data.result)
        })
    },[])
    const handleRemove=(rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + `/rest/s1/fadak/entity/EmplPositionParty?partyId=${partyId}&emplPositionId=${rowData.emplPositionId}&roleTypeId=${rowData.roleTypeId}&fromDate=${rowData.fromDate}` ,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }
    const handleEdit = (rowData) =>{
        setFormValues(rowData)
        setEdit(true)
    }
    return (
        <Card>
            <CardContent>
                <Card variant="outlined">
                    <CardContent>
                        <OrganizationForm tableContent={tableContent} setTableContent={setTableContent} loading={loading}  setLoading={setLoading} 
                        formValues={formValues} setFormValues={setFormValues} edit={edit} setEdit={setEdit} />
                    </CardContent>
                    <CardContent>
                        <TablePro
                            title="پست های سازمانی"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            edit="callback"
                            editCallback={handleEdit}
                            removeCallback={handleRemove}
                            loading={loading}
                        />
                    </CardContent> 
                </Card>
                <Card variant="outlined">
                   <CardHeader title=" ساختار پرسنلی"/>
                       <CardContent>
                           <PersonalStructure/>
                       </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
export default OrganizationInformation;