import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {CardContent, CardHeader, Divider} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TablePro from "../../../../components/TablePro";
import CMForm from "./CMForm";
import CMCriterion from "./CMCriterion";

export default function CompetenceModel() {
    const [loading, setLoading] = useState(true);
    const [actionObject, setActionObject] = React.useState(null); //competenceModelId
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "title", label: "عنوان مدل شایستگی", type: "text", style: {width:"35%"}},
        {name: "createDate", label: "تاریخ ایجاد", type: "date", style: {width:"20%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"45%"}},
    ]
    function handleEdit(row){
        setActionObject(row.competenceModelId)
    }
    function handleDelete(row){
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/competence/model?competenceModelId="+row.competenceModelId,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then((res) => {
                if(res.data.result==="OK"){
                    if(actionObject===row.competenceModelId){
                        setActionObject(null)
                    }
                    resolve()
                }else{
                    reject("امکان حذف این مورد وجود ندارد!")
                }
            }).catch(() => {
                reject()
            });
        })
    }

    useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/orgStructure/competence/model", {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setTableContent(res.data.competenceModels)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    },[])

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف مدل شایستگی"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CMForm
                                actionObject={actionObject} setActionObject={setActionObject}
                                tableContent={tableContent} setTableContent={setTableContent}
                            />
                        </Grid>
                        {actionObject &&
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Divider variant="fullWidth"/>
                            </Grid>
                            <Grid item xs={12}>
                                <CMCriterion actionObject={actionObject}/>
                            </Grid>
                        </React.Fragment>
                        }
                    </Grid>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    title="لیست مدل های شایستگی"
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
