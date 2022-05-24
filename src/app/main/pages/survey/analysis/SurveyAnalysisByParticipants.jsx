import React from "react";
import {Button} from "@material-ui/core";
import TableProAjax from "../../../components/TableProAjax";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import axios from "../../../api/axiosRest";
import {CSVLink} from "react-csv";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import LoopIcon from '@material-ui/icons/Loop';
const formDefaultValues = {
    partyRelationshipId: "[]",
    elementId: "[]",
}

export default function SurveyAnalysisByParticipants({questionnaire, data}) {
    const [elements, set_elements] = React.useState([])
    const [participants, set_participants] = React.useState([])
    const [formValues, set_formValues] = React.useState(formDefaultValues);
    const [cols, set_cols] = React.useState([])
    const [elementIds, set_elementIds] = React.useState([])
    const [partyRelIds, set_partyRelIds] = React.useState([])
    const [excelData, set_excelData] = React.useState(null)
    const txtField =  React.createRef(0);

    const update_cols = (selectedCols) => {
        let allCols = [
            {name: "fullName", label: "مخاطب", type: "text", style: {width: "170px"}},
            ...selectedCols.map(elem=>({name: elem.elementId, label: `${elem.number}. ${elem.name} (صفحه ${elem.pageNumber})`, sortable: false, style: {maxWidth: "300px"}}))
        ]
        set_cols(allCols)
        csvData(allCols)
    }
    const handle_search = () => {
        const selectedPartyRelId = JSON.parse(formValues.partyRelationshipId)
        set_partyRelIds(selectedPartyRelId)
        const selectedElementsId = JSON.parse(formValues.elementId)
        set_elementIds(selectedElementsId)
        const selectedElements = selectedElementsId.length>0 ? elements.filter(i=>selectedElementsId.indexOf(i.elementId)>-1) : elements
        update_cols(selectedElements)
    }

    
    const csvData = (allCols) =>{
        // let excdata = []
        // init = initData?.postList
        // console.log("participantsdata",excdata)

        axios.get("/s1/questionnaire/answer?questionnaireAppId="+data.questionnaireAppId+"&elementId="+elementIds+"&partyRelationshipId="+partyRelIds).then(res => {
            // set_participants(res.data.participants)
            let excdata = res.data.rows,
            finalData = []
            let data0 = allCols.map(x=>x.label)
            finalData[0] = data0
            // finalData = finalData + excdata
            console.log("excdata",excdata)

            for (let i = 0 ; i < excdata?.length ; i++){
                console.log("participants",i)
            
                let arr = []

                for (let prp of allCols){
                    if (prp.name == 'fullName' ){
                        arr.push(excdata[i].fullName)
                    }
                    else{
                        // let label =
                        arr.push(excdata[i][prp.name])
                    }
                    // continue 
                    // let res = (prp == 'partyFromDate' || prp == 'thruDate' || prp == 'partyThruDate' ) ? (init[i][prp] ? moment(init[i][prp]).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD') : '-') : prp == 'statusId' ? (init[i][prp] == 'EmpsActive' ? 'فعال' : 'غیر فعال') : prp == 'mainPosition' ? (init[i][prp] == 'Y' ? 'فعال' : 'غیر فعال') : init[i][prp]
                    // arr.push(res)
                }

                finalData.push(arr)

                if(i == excdata?.length -1 ){
                    console.log("participants",finalData)
                    set_excelData(finalData)
                }
            
            }
            // let excdata = res.data.rows
            
        }).catch(() => {
        });
        
    }

    
    const exportTable = () => {
        txtField.current.link.click()
    }


    React.useEffect(()=>{
        let elems = []
        questionnaire.pages.forEach((page,index)=>{
            page.elements.forEach(elem=>{
                elem.number = page.startNumber + elem.sequenceNum
                elem.pageNumber = index+1
                elems.push(elem)
            })
        })
        set_elements(elems)
        update_cols(elems)
        axios.get("/s1/survey/surveyParticipants?statusId=QstAnsCompleted&questionnaireAppId="+data.questionnaireAppId).then(res => {
            set_participants(res.data.participants)
        }).catch(() => {
            set_participants([])
        });
    },[questionnaire])

    return (
        <React.Fragment>
            <TableProAjax
                title="جدول پاسخ های شرکت کنندگان"
                url={"/s1/questionnaire/answer?questionnaireAppId="+data.questionnaireAppId+"&elementId="+elementIds+"&partyRelationshipId="+partyRelIds}
                columns={cols}
                filter="external"
                filterForm={<FilterForm elements={elements} participants={participants} formValues={formValues} set_formValues={set_formValues} handle_search={handle_search}/>}
                // exportCsv="پاسخ شرکت کنندگان"
                actions={
                    [{
                        title: "خروجی اکسل",
                        icon: excelData ? AssignmentReturnedIcon : LoopIcon ,
                        onClick:()=>{exportTable()}
                    }]
                  }
            />
            <div style={{display:'none'}}>
                <CSVLink ref={txtField} filename={"پاسخ شرکت کنندگان.csv"} data={excelData || []}>
                    <Tooltip title="خروجی اکسل">
                        <ToggleButton size={"small"}>
                            <AssignmentReturnedIcon/>
                        </ToggleButton>
                    </Tooltip>
                </CSVLink>
            </div>
        </React.Fragment>
    )
}

function FilterForm({elements, participants, formValues, set_formValues, handle_search}) {
    const formStructure = [{
        name    : "partyRelationshipId",
        label   : "شرکت کنندگان",
        type    : "multiselect",
        options : participants,
        optionIdField: "partyRelationshipId",
        optionLabelField: "fullName"
    },{
        name    : "elementId",
        label   : "سوالات",
        type    : "multiselect",
        options : elements,
        optionIdField: "elementId",
        optionLabelField: "name",
        getOptionLabel: opt => opt ? `${opt.name} ─ ${opt.title}` : "",
        col     : {sm: 8, md: 6}
    }]
    return (
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={set_formValues}
                 submitCallback={()=>handle_search(formValues)} resetCallback={()=>handle_search(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        />
    )
}
