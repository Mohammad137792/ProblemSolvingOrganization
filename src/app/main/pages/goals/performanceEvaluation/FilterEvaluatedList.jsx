import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid , TextField , Typography} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import FormComplexParty from '../../../components/formControls/FormComplexParty'


const FilterEvaluatedList = (props) => {

    const {evaluatedList , evaluatedTableContent , setEvaluatedTableContent} = props

    const [formValues, setFormValues] = useState({});
    const [filterList,setFilterList] = useState({employeesFilter : [] , positionsFilter : [] , unitFilter : []})

            
    const FormComplexPartyStructure = [
        {
            name  : "unit",
            label : "واحد سازمانی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "positions",
            label : "پست سازمانی",
            type  : "multiselect",
            col   : 4,
        },
        {
            name  : "employees",
            label : "پرسنل",
            type  : "multiselect",
            col   : 4,
        }
    ];  

    useEffect(() => {
        if (formValues.employees && formValues.employees != "[]"){
            filterList.employeesFilter = (evaluatedTableContent.filter((item) => eval(formValues["employees"]).indexOf(item.partyId) >= 0 ))
            setFilterList(Object.assign({},filterList))
        }
        else {
            filterList.employeesFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.employees])

    useEffect(() => {
        if (formValues.positions && formValues.positions != "[]"){
            filterList.positionsFilter = (evaluatedTableContent.filter((item) => eval(formValues["positions"]).indexOf(item.emplPositionIds[0]) >= 0 ))
            setFilterList(Object.assign({},filterList))
        }
        else {
            filterList.positionsFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.positions])

    useEffect(() => {
        if (formValues.unit && formValues.unit != "[]"){
            filterList.unitFilter = (evaluatedTableContent.filter((item) => eval(formValues["unit"]).indexOf(item.unitPartyId[0]) >= 0 ))
            setFilterList(Object.assign({},filterList))
        }
        else {
            filterList.unitFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.unit])

    const handleFilter = () => {
        let counter = 0
        if (formValues?.unit && formValues?.unit != "[]"){counter = counter +1 }
        if (formValues?.positions && formValues?.positions != "[]"){counter = counter +1 }
        if (formValues?.employees && formValues?.employees != "[]"){counter = counter +1 }
        let searchDatas = filterList.employeesFilter.concat(filterList.positionsFilter,filterList.unitFilter)
        console.log("searchDatas" , searchDatas);
        if (searchDatas.length != 0){
            let tableData = []
            setTimeout(()=>{
                searchDatas.map((e,i)=>{
                    let numberOfData =  searchDatas.filter((item) => item.partyId == e.partyId)
                    if (numberOfData.length == counter ){
                        if (tableData.findIndex(i=> i.partyId == e.partyId ) < 0){
                            tableData.push(e)   
                        }
                    }
                    if (i === searchDatas.length-1){
                        setEvaluatedTableContent(tableData)
                    }
                })
            },100)
        }
        if (searchDatas.length == 0){
            setEvaluatedTableContent([])
        }
    }

    const resetCallback = () => {
        console.log("evaluatedList" , evaluatedList);
        setFilterList({employeesFilter : [] , positionsFilter : [] , unitFilter : []})
        setEvaluatedTableContent(evaluatedList)
    }

    return (

        <FormComplexParty
            structure = {FormComplexPartyStructure}
            formValues = {formValues}
            setFormValues = {setFormValues}
            submitCallback={handleFilter}
            resetCallback={resetCallback}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">فیلتر</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />

    );
};

export default FilterEvaluatedList;