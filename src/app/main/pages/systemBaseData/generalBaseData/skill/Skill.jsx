import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {CardContent, CardHeader} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import SkillForm from "./SkillForm";
import SkillTable from "./SkillTable";

export default function Skill() {
    const [loading, setLoading] = useState(true);
    const [actionObject, setActionObject] = React.useState(null); //skill
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "skillCode", label: "کد", type: "text"},
        {name: "title", label: "عنوان", type: "text", style: {width:"35%"}},
        {name: "parentSkillId", label: "نوع", type: "render", render: (row)=>(row.parentSkillId ? "مهارت" : "گروه مهارت")},
        {name: "sequenceNum", label: "ترتیب نمایش", type: "number"},
        {name: "status", label: "فعال", type: "indicator"},
    ]
    function handleEdit(row){
        setActionObject(row)
    }
    function handleDelete(row){
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/skill?skillId="+row.skillId,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then((res) => {
                if(res.data.result==="OK"){
                    if(actionObject===row.skillId){
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
        axios.get(SERVER_URL + "/rest/s1/orgStructure/skill", {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setTableContent(res.data.skills)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    },[])

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف گروه و مهارت"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <SkillForm
                                actionObject={actionObject} setActionObject={setActionObject}
                                tableContent={tableContent} setTableContent={setTableContent}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <SkillTable
                    title="لیست گروه مهارت ها"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    removeCallback={handleDelete}
                    edit={"callback"}
                    editCallback={handleEdit}
                    defaultOrderBy="skillCode"
                    // showRowNumber={false}
                />
            </Card>
        </React.Fragment>
    )
}
