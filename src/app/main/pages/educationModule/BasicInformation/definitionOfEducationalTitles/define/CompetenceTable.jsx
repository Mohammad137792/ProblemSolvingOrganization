import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {Button} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import TablePro from "../../../../../components/TablePro";
import {useSelector} from "react-redux";

export default function CompetenceTable({formValues, setFormValues ,editing , courseId, resetMainTable , editable}) {
    const [loading, setLoading] = useState(true);
    const [criteria, setCriteria] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [tableData, setTableData] = React.useState([]);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const tableCols = [
        {name: "competenceModelId", label: "مدل شایستگی", type: "select", options: models,
            optionIdField: "competenceModelId", optionLabelField: "title"},
        {name: "competenceCriterionId", label: "شاخص / معیار", type: "select", options: criteria,
            optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle"}
    ]

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            let deletedData={
                    courseId : editing ? formValues.courseId : courseId ,
                    competenceCriterionId : rowData.competenceCriterionId
                }
            axios.delete(SERVER_URL + "/rest/s1/training/entity/CourseCompetence",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: deletedData
            }).then(() => {
                resolve()
                resetMainTable(true)
            }).catch((rejres) => {
                reject()
            });
        })
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/training/defineCourseFields?partyRelationshipId=${partyRelationshipId}`,axiosKey).then(res => {
            setModels(res.data.response.competenceModel)
            setCriteria(res.data.response.criteria)
        })
    },[partyRelationshipId]);

    React.useEffect(()=>{
        if(!editing){
            setTableData([])
            setLoading(false)
        }
        if(editing){
            if(formValues?.criterionInfo && formValues.criterionInfo.length>0){
                setTableData(formValues?.criterionInfo )
                setLoading(false)
            }
            if(!formValues?.criterionInfo || formValues.criterionInfo.length==0) {
                setTableData([])
                setLoading(false)
            }
        }
    },[formValues?.criterionInfo]);

    return (
        editable ?
        <TablePro
            title={`شایستگی های دوره ی ${formValues.title}`}
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm tableData={tableData} models={models} criteria={criteria} courseId={formValues.courseId??courseId} resetMainTable={resetMainTable}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        /> :
        <TablePro
            title={`شایستگی های دوره ی ${formValues.title}`}
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            loading={loading}
            fixedLayout
        />
    )
}
function ExternalForm({editing=false, tableData, models, criteria,courseId, resetMainTable, ...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] =React.useState({});

    const formStructure = [
        {name: "competenceModelId", label: "مدل شایستگی", type: "select", options: models, required: true,
            optionIdField: "competenceModelId", optionLabelField: "title" , col : 6},
        {name: "competenceCriterionId", label: " معیار شایستگی", type: "select", options: criteria, required: true,
            optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle", col : 6 ,
            filterOptions: options => options.filter(o=>o["competenceModelId"]===formValues["competenceModelId"]),
            disabled: !formValues["competenceModelId"]
        }
    ]

    React.useEffect(()=>{
        // skip initial render
        return () => {
            // do something with dependency
            setFormValues(prevState=>({
                ...prevState,
                competenceCriterionId: null
            }))
        }
    },[formValues["competenceModelId"]])

    const handleCreate = (formData)=>{
        const postData = {
            courseId: courseId,
            competenceCriterionId : formData.competenceCriterionId
        }
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/training/entity/CourseCompetence", postData ,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
                setFormValues({})
                resetMainTable(true)
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
                const ind = tableData.findIndex(i=>i.competenceCriterionId===formValues.competenceCriterionId)
                if(ind>-1){
                    failedCallback("شایستگی اضافه شده تکراری است!")
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