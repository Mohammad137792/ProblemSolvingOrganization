import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader} from "@material-ui/core";
import EOOForm from "./EOOForm";
import Box from "@material-ui/core/Box";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";

export default function EmplOrderOrders(){
    const [loading, setLoading] = useState(true);
    const [userCompany, setUserCompany] = useState({});
    const [actionObject, setActionObject] = React.useState(null); //settingId
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "title", label: "عنوان حکم کارگزینی", type: "text", style: {width:"unset"}},
        {name: "dateEnumId", label: "زمان تنظیم حکم", type: "select", options: "IssueTimeEmplOrder", style: {width:"unset"}}, /* todo: name? */
        {name: "description", label: "شرح", type: "text", style: {width:"400px"}},
        {name: "statusId", label: "فعال", type: "indicator", style: {width:"80px"}},
    ]
    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${userCompany.userCompanyId}&typeEnumId=EostEmplOrder`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setTableContent(res.data.result)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            });
        }
    },[userCompany])
    const handleEdit = (row)=>{
        setActionObject(row.settingId)
    }
    const handleDelete = (row)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/emplOrder/emplOrderSetting?settingId="+row.settingId,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then((res) => {
                if(res.data.status==="OK"){
                    resolve()
                }else{
                    reject("امکان حذف این مورد وجود ندارد!")
                }
            }).catch(() => {
                reject()
            });
        })
    }
    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف احکام کارگزینی"/>
                <CardContent>
                    <EOOForm
                        actionObject={actionObject} setActionObject={setActionObject}
                        tableContent={tableContent} setTableContent={setTableContent}
                        userCompany={userCompany} setUserCompany={setUserCompany}
                    />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    title="لیست احکام کارگزینی"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    fixedLayout={true}
                    rowNumberWidth="40px"
                    edit="callback"
                    editCallback={handleEdit}
                    removeCallback={handleDelete}
                />
            </Card>
        </React.Fragment>
    )
}
