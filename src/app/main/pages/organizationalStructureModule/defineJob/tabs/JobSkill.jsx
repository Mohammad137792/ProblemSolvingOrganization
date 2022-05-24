import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import TablePro from "../../../../components/TablePro";

export default function JobSkill({jobId}) {
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = React.useState([]);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "skillId", label: "عنوان مهارت", type: "select", options: skills.skill, style: {width:"20%"},
            optionIdField: "skillId", optionLabelField: "title"},
        {name: "skillGroupId", label: "گروه مهارت", type: "select", options: skills.skillGroup, style: {width:"20%"},
            optionIdField: "skillId", optionLabelField: "title"},
        {name: "skillLevelEnumId", label: "میزان مهارت", type: "select", options: "SkillLevel", style: {width:"15%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"unset"}},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobSkill",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: rowData
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/job/skill", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data["jobSkills"].map(i => {
                let item = Object.assign({},i)
                if(item.skillGroupId === item.skillId){
                    item.skillGroupId = null
                }
                return item
            }))
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    },[jobId]);

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/orgStructure/skill", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            const skillsList = {
                skillGroup: res.data.skills.filter(o=>!o["parentSkillId"]),
                skill: res.data.skills.filter(o=>o["parentSkillId"]),
            }
            setSkills(skillsList);
        }).catch(() => {
        });
    },[]);

    return (
        <TablePro
            title="مهارت ها"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm tableData={tableData} skills={skills} jobId={jobId}/>}
            edit="external"
            editForm={<ExternalForm tableData={tableData} skills={skills} jobId={jobId} editing={true}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}

function ExternalForm({editing=false, tableData, skills, jobId,...restProps}) {
    const {formValues, setFormValues, oldData, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] = React.useState({});
    const filterSkills = (options) => {
        if (formValues["skillGroupId"]){
            return options.filter(o=>o["parentSkillId"]===formValues["skillGroupId"])
        } else {
            return options.filter(o=>o["parentSkillId"])
        }
    }
    const formStructure = [
        {name: "skillGroupId", label: "گروه مهارت", type: "select", options: skills.skillGroup,
            optionIdField: "skillId", optionLabelField: "title"},
        {name: "skillId", label: "عنوان مهارت", type: "select", options: skills.skill, required: true,
            optionIdField: "skillId", optionLabelField: "title",
            filterOptions: filterSkills},
        {name: "skillLevelEnumId", label: "میزان مهارت", type: "select", options: "SkillLevel"},
        {name: "description", label: "توضیحات", type: "textarea", col: 12},
    ]
    React.useEffect(()=>{
        // skip initial render
        return () => {
            // do something with dependency
            setFormValues(prevState=>({
                ...prevState,
                skillId: null
            }))
        }
    },[formValues["skillGroupId"]])

    const handleEdit = (formData,rowData)=>{
        const packet = {
            newJobSkill: formData,
            oldJobSkill: rowData
        }
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/job/skill", packet,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                console.log('edit job skill error..', err);
                reject(err)
            });
        })
    }
    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobSkill", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                console.log('create job skill error..', err);
                reject(err)
            });
        })
    }
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                const ind = tableData.findIndex(i=>i.skillId===formValues.skillId)
                if(editing){
                    if(ind>-1 && formValues.skillId!==oldData.skillId){
                        failedCallback("مهارت انتخاب شده تکراری است!")
                    }else {
                        handleEdit(formValues, oldData).then((data) => {
                            successCallback(data)
                            setFormValues({})
                        }).catch(() => {
                            failedCallback()
                        })
                    }
                }else{
                    if(ind>-1){
                        failedCallback("مهارت اضافه شده تکراری است!")
                    }else {
                        handleCreate(formValues).then((data) => {
                            successCallback(data)
                            setFormValues({})
                        }).catch(() => {
                            failedCallback()
                        })
                    }
                }
            }}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
