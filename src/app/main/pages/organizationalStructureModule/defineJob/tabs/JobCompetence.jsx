import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import TablePro from "../../../../components/TablePro";

export default function JobCompetence({jobId}) {
    const [loading, setLoading] = React.useState(true);
    const [criteria, setCriteria] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "competenceModelId", label: "مدل شایستگی", type: "select", options: models,
            optionIdField: "competenceModelId", optionLabelField: "title"},
        {name: "competenceCriterionId", label: "شاخص / معیار", type: "select", options: criteria,
            optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle"}
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobCompetence",{
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
        axios.get(SERVER_URL + "/rest/s1/orgStructure/job/competence", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data["jobCompetences"])
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('get job competence error..', err);
        });
    },[jobId]);

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/CompetenceCriterion", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setCriteria(res.data.CompetenceCriterion);
        }).catch(err => {
            console.log('get criteria error..', err);
        });
        axios.get(SERVER_URL + "/rest/s1/orgStructure/competence/model", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setModels(res.data["competenceModels"]);
        }).catch(err => {
            console.log('get models error..', err);
        });
    },[]);

    return (
        <TablePro
            title="شایستگی ها"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm tableData={tableData} models={models} criteria={criteria} jobId={jobId}/>}
            edit="external"
            editForm={<ExternalForm tableData={tableData} models={models} criteria={criteria} jobId={jobId} editing={true}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}

function ExternalForm({editing=false, tableData, models, criteria, jobId, ...restProps}) {
    const {formValues, setFormValues, oldData, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] = React.useState({});
    const formStructure = [
        {name: "competenceModelId", label: "مدل شایستگی", type: "select", options: models, required: true,
            optionIdField: "competenceModelId", optionLabelField: "title",
            // filterOptions: options => formValues["competenceCriterionId"]
            // ? options.filter(o=>{
            //     let list = criteria,
            //     selected = list.find(x=>x.competenceCriterionId == formValues["competenceCriterionId"])
            //     return o["competenceModelId"]===selected.competenceModelId
            // })
            // : options,
        },
        {name: "competenceCriterionId", label: "شاخص / معیار", type: "select", options: criteria, required: true,
            optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle",
            filterOptions: options => formValues["competenceModelId"]
                ? options.filter(o=>o["competenceModelId"]===formValues["competenceModelId"])
                : options,
            // disabled: !formValues["competenceModelId"]
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

    const handleEdit = (formData,rowData)=>{
        const packet = {
            newJobCompetence: formData,
            oldJobCompetence: rowData
        }
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/job/competence", packet,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                reject(err)
            });
        })
    }
    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobCompetence", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
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
                if(editing){
                    if(ind>-1 && formValues.competenceCriterionId!==oldData.competenceCriterionId){
                        failedCallback("شایستگی اضافه شده تکراری است!")
                    }else {
                        handleEdit(formValues, oldData).then((data) => {
                            setFormValues({})
                            successCallback(data)
                        }).catch(() => {
                            failedCallback()
                        })
                    }
                }else{
                    if(ind>-1){
                        failedCallback("شایستگی اضافه شده تکراری است!")
                    }else {
                        handleCreate(formValues).then((data) => {
                            setFormValues({})
                            successCallback(data)
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
