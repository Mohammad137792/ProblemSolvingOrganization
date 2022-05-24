import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader, Divider} from "@material-ui/core";
import EOFForm from "./EOFForm";
import Box from "@material-ui/core/Box";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import Grid from "@material-ui/core/Grid";
import EOFFormula from "./EOFFormula";

export default function EmplOrderFactors(){
    const [loading, setLoading] = useState(true);
    const [userCompany, setUserCompany] = useState({});
    const [actionObject, setActionObject] = React.useState(null); //payrollFactorId
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "title", label: "عنوان عامل حکمی", type: "text", style: {width:"unset"}},
        {name: "groupEnumId", label: "گروه عامل حکمی", type: "select", options: "PayrollFactorGroup", style: {width:"unset"}},
        {name: "displaySequence", label: "ترتیب نمایش", type: "number", style: {width:"unset"}},
        {name: "calcSequence", label: "ترتیب محاسبه", type: "number", style: {width:"unset"}},
        {name: "payrollForm", label: "نمایش در فرم حکم", type: "indicator", style: {width:"unset"}},
        {name: "emplPayrollForm", label: "نمایش در فرم حکم کارمند", type: "indicator", style: {width:"unset"}},
    ]
    function handleEdit(row){
        setActionObject(row)
    }
    function handleDelete(row){
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PayrollFactor?payrollFactorId="+row.payrollFactorId,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then((res) => {
                if(res.status===200){
                    resolve()
                }else{
                    reject("امکان حذف این مورد وجود ندارد!")
                }
            }).catch(err => {
                console.log('Error while deleting PayrollFactor..', err);
                reject()
            });
        })
    }

    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayrollFactor?companyPartyId=${userCompany.userCompanyId}`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setTableContent(res.data.result)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                console.log('get error..', err);
            });
        }
    },[userCompany])

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف عوامل حکمی"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <EOFForm
                                actionObject={actionObject} setActionObject={setActionObject}
                                tableContent={tableContent} setTableContent={setTableContent}
                                userCompany={userCompany} setUserCompany={setUserCompany}
                            />
                        </Grid>
                        {actionObject &&
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Divider variant="fullWidth"/>
                            </Grid>
                            <Grid item xs={12}>
                                <EOFFormula actionObject={actionObject} userCompany={userCompany}/>
                            </Grid>
                        </React.Fragment>
                        }
                    </Grid>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    title="لیست عوامل حکمی"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    removeCallback={handleDelete}
                    edit={"callback"}
                    editCallback={handleEdit}
                    defaultOrderBy="title"
                />
            </Card>
        </React.Fragment>
    )
}
