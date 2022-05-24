import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Card from "@material-ui/core/Card";
import { SERVER_URL } from 'configs';
import TablePro from 'app/main/components/TablePro';
import { CardContent } from '@material-ui/core';




const EvaluatorDeterminationTest = (props) => {

    const { evaluatingTableContent, setEvaluatingTableContent } = props
    const [applicationType, setApplicationType] = useState([])
    const [lodinggEvaluted, setlodinggEvaluted] = useState(true);
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const evaluatingTableCols = [
        {
            name: "fullName",
            label: "  نام ارزیابی شونده ",
            type: "text",
            style: { minWidth: "130px" },
            disabled: true
        },

        {
            name: "pseudoId",
            label: "کد پرسنلی ",
            type: "text",
            style: { minWidth: "130px" },
            disabled: true
        },
        {
            name: "unitOrganization",
            label: "واحد سازمانی ",
            type: "text",
            style: { minWidth: "130px" },
            disabled: true
        },
        {
            name: "emplPosition",
            type: "text",
            label: "پست سازمانی ",
            style: { minWidth: "130px" },
            disabled: true
        },
        {
            name: "questionnaireId",
            label: "  فرم ارزیابی  ",
            type: "select", style: { minWidth: "90px" },
            options: applicationType,
            optionLabelField: "name",
            optionIdField: "questionnaireId",
        },


    ];




    const getEnum = () => {
       
        let filter = { categoryEnumId: "QcPerformanceEvaluation" ,subCategoryEnumId:"QcPETest"}
        axios.get(SERVER_URL + "/rest/s1/questionnaire/archive", {
            headers: { 'api_key': localStorage.getItem('api_key') }, params: filter
        }).then(res => {
            setApplicationType(res.data.questionnaires)
            setlodinggEvaluted(false)
        }).catch(() => {
        });


    }


    useEffect(() => {
        getEnum();

    }, []);
    const handleEditEvaluatingTable = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            const listTableContentE = [...evaluatingTableContent];
            let fList = listTableContentE.findIndex(ele => ele === oldData)
            let reduser = listTableContentE.splice(fList, 1)
            setEvaluatingTableContent(listTableContentE)
            let array = []
            array.push(newData)
            setEvaluatingTableContent(prevState => { return [...prevState, ...array] })
            resolve()
        })


    }
    useEffect(() => {
        scrollToRef()
    }, [])

    return (
        <Card style={{paddingBottom:"30%"}}>
        
            <CardContent ref={myRef}>
                <TablePro
                    columns={evaluatingTableCols}
                    rows={evaluatingTableContent}
                    setRows={setEvaluatingTableContent}
                    loading={lodinggEvaluted}
                    editCallback={handleEditEvaluatingTable}
                    edit="inline"

                />
            </CardContent>
            </Card>
    );
};

export default EvaluatorDeterminationTest;