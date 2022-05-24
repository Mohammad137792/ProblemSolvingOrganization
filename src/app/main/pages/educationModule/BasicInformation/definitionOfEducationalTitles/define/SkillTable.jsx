import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {Button} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import TablePro from "../../../../../components/TablePro";
import {useSelector} from "react-redux";

export default function SkillTable({formValues, setFormValues ,editing , courseId, resetMainTable , editable}) {
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = React.useState([]);
    const [tableData, setTableData] = React.useState([]);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "skillGroup", label: "گروه مهارت", type: "select", options: skills.skillGroup ,
            optionIdField: "skillId", optionLabelField: "title"},
        {name: "skills", label: "مهارت", type: "select", options: skills.skill,
            optionIdField: "skillId", optionLabelField: "title"}
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            let deletedData={
                courseId : formValues.courseId??courseId ,
                skillId : rowData.skills
            }
            axios.delete(SERVER_URL + "/rest/s1/training/entity/CourseSkill",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: deletedData
            }).then(() => {
                resolve()
                resetMainTable(true)
            }).catch(() => {
                reject()
            });
        })
    }
    
    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/training/defineCourseFields?partyRelationshipId=${partyRelationshipId}`,axiosKey).then(res => {
            const skillsList = {
                skillGroup: res.data.response.skill.filter(o=>!o["parentSkillId"]),
                skill: res.data.response.skill.filter(o=>o["parentSkillId"]),
            }
            setSkills(skillsList);
            if(!editing){
                setTableData([])
                setLoading(false)
            }
            if(editing){
                if(formValues?.skillInfo && formValues.skillInfo.length>0 ){
                    setTableData(formValues.skillInfo)
                    setLoading(false)
                }
                if(!formValues?.skillInfo || formValues.skillInfo.length==0) {
                    setTableData([])
                    setLoading(false)
                }
            }
        })
    },[partyRelationshipId,formValues?.skillId]);
    return (
        editable ? 
        <TablePro
            title={`مهارت های دوره ی ${formValues.title}`}
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm tableData={tableData}  courseId={formValues.courseId??courseId} resetMainTable={resetMainTable}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        /> :
        <TablePro
            title={`مهارت های دوره ی ${formValues.title}`}
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            loading={loading}
            fixedLayout
        />
    )
}

function ExternalForm({ tableData , courseId, resetMainTable, ...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] =React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [skillOptions,setSkillOptions] = React.useState([])

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        {name: "skillGroup", label: "گروه مهارت" , type: "select", options: skillOptions.skillGroup, 
            optionIdField: "skillId", optionLabelField: "title" , col : 6},
        {name: "skills", label: "مهارت", type: "select", options: skillOptions.skill, required: true,
            optionIdField: "skillId", optionLabelField: "title", col : 6 ,
            filterOptions: options => (formValues["skillGroup"] ? options.filter(o=>o["parentSkillId"]===formValues["skillGroup"]) : options),
            }
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
    },[formValues["skillGroup"]])

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/training/defineCourseFields?partyRelationshipId=${partyRelationshipId}`,axiosKey).then(res => {
            const skillsList = {
                skillGroup: res.data.response.skill.filter(o=>!o["parentSkillId"]),
                skill: res.data.response.skill.filter(o=>o["parentSkillId"]),
            }
            setSkillOptions(skillsList);
        })
    },[partyRelationshipId]);

    const handleCreate = (formData)=>{
        return new Promise((resolve, reject) => {
            let postData={
                courseId : courseId ,
                skillId : formData.skills
            }
            axios.post(SERVER_URL + "/rest/s1/training/entity/CourseSkill", postData ,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                skillOptions.skill.map((item)=>{
                    if (item.skillId==formData.skills){
                        resolve({skills : formData.skills , skillGroup : (item?.parentSkillId != item.skillId) ? item.parentSkillId : "" })
                        setFormValues({})
                        resetMainTable(true)
                    }
                })
                
            }).catch(err => {
                console.log('create job competence error..', err);
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
                const ind = tableData.findIndex(i=>i.skills===formValues.skills)
                if(ind>-1){
                    failedCallback("مهارت اضافه شده تکراری است !")
                }else{
                    handleCreate(formValues).then((data)=>{
                        successCallback(data)
                    }).catch(()=>{
                        failedCallback()
                    })
                }
            }}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

 

