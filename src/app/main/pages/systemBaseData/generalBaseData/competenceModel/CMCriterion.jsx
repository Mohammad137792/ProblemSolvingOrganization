import React, {useState} from "react";
import TablePro from "../../../../components/TablePro";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";

export default function CMCriterion({actionObject}) {
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const tableCols = [
        {name: "criterionCode", label: "کد معیار", type: "text"},
        {name: "criterionTitle", label: "عنوان معیار", type: "text"},
        {name: "criterionWeight", label: "وزن", type: "number"},
        {name: "criterionRateEnumId", label: "نوع نمره دهی", type: "select", options: "OrdinalScale"},
        {name: "parentCriterionId", label: "معیار بالاتر", type: "select", options: tableContent, optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle"},
        {name: "description", label: "توضیحات", type: "text"},
    ]
    function handleGet(id){
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/CompetenceCriterion", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {competenceModelId: id}
        }).then(res => {
            setTableContent(res.data)
            setLoading(false)
        }).catch(() => {
            setTableContent([])
            setLoading(false)
        });
    }
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/CompetenceCriterion",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: oldData
            }).then( () => {
                resolve()
            }).catch(()=>{
                reject("امکان حذف این مورد وجود ندارد!")
            });
        })
    }
    React.useEffect(()=>{
        if(actionObject){
            handleGet(actionObject)
        }else{
            setTableContent([])
        }
    },[actionObject]);
    return(
        <Card variant="outlined">
            <TablePro
                title="معیارهای مدل شایستگی"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                fixedLayout={true}
                rowNumberWidth="40px"
                add="external"
                addForm={<TableForm actionObject={actionObject} tableContent={tableContent}/>}
                edit="external"
                editForm={<TableForm editing={true} actionObject={actionObject} tableContent={tableContent}/>}
                removeCallback={handleRemove}
            />
        </Card>
    )
}

function TableForm({editing=false, tableContent, actionObject,...restProps}) {
    const [criterionGroup, setCriterionGroup] = useState([]);
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;

    const formStructure = [
        {name: "criterionCode", label: "کد معیار", type: "text", required: true},
        {name: "criterionTitle", label: "عنوان معیار", type: "text", required: true},
        {name: "criterionWeight", label: "وزن", type: "number"},
        {name: "criterionRateEnumId", label: "نوع نمره دهی", type: "select", options: "OrdinalScale", required: true,
            filterOptions: options => options.filter(o=>!o["parentEnumId"])},
        {name: "parentCriterionId", label: "معیار بالاتر", type: "select", options: tableContent, optionIdField: "competenceCriterionId", optionLabelField: "criterionTitle",
            filterOptions: options => options.filter(o=>criterionGroup.findIndex(i=>i["competenceCriterionId"]===o["competenceCriterionId"])<0)},
        {name: "description", label: "توضیحات", type: "textarea", col: 12},
    ]
    const handleAdd = ()=>{
        axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/CompetenceCriterion", {
            ...formValues,
            competenceModelId: actionObject
        }, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then((res) => {
            successCallback({...formValues, ...res.data})
            setFormValues({})
        }).catch(() => {
            failedCallback()
        });
    }
    const handleEdit = ()=>{
        axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/CompetenceCriterion", {
            ...formValues,
        }, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            successCallback(formValues)
            setFormValues({})
        }).catch(() => {
            failedCallback()
        });
    }

    const getCriterionAndSub = ()=>{
        let criterionGroupList = []
        const addSubCriterion = (list, id) => {
            const sup = tableContent.find(i=>i.competenceCriterionId===id)
            list.push(sup)
            tableContent.filter(i=>i.parentCriterionId===id).forEach(i=>addSubCriterion(list, i.competenceCriterionId))
        }
        addSubCriterion(criterionGroupList, oldData.competenceCriterionId)
        return criterionGroupList
    }

    React.useEffect(()=>{
        if(oldData.competenceCriterionId)
            setCriterionGroup( getCriterionAndSub() )
    },[oldData.competenceCriterionId])

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    handleAdd()
                }
            }}
            resetCallback={()=>{
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
