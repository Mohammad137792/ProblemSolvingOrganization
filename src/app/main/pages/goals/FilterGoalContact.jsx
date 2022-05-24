import React, { useState, useEffect , createRef} from 'react';
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import { useSelector } from 'react-redux';


const FilterGoalContact = (props) => {

    const {tableContent,setTableContent,formValues, setFormValues, handleClose} = props

    const [fieldInfo,setFieldInfo] = useState([]);
    const [filterList,setFilterList] = useState({groupFilter : [] , subGroupFilter : [] , positionsFilter : [] , unitFilter : [] , orgsFilter : [] , rolesFilter : []})
    const [filterFields,setFilterFields] = useState({orgs : [] , positions : [] , group : []});

    const dispatch = useDispatch();

    useEffect(() => {
        getFieldsInfo();
    }, []);

    const getFieldsInfo = () => {
        let listMap = ["orgs","unit","positions","roles","group","subGroup"]
          axios
            .get(SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap , {
              headers: { api_key: localStorage.getItem("api_key") },
            })
            .then((res) => {
                setFieldInfo(res.data.contacts)
            })
            .catch(() => {
              dispatch(
                setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
    }

    const filterStructure = [
        {
            name    : "orgs",
            label   : "شرکت",
            type    : "select",
            options : fieldInfo.orgs ,
            optionLabelField :"organizationName",
            optionIdField:"partyId",
            col     : 3,
        },{
            name    : "unit",
            label   : "واحد سازمانی",
            type    : "multiselect",
            options : fieldInfo.unit ,
            optionLabelField :"organizationName",
            optionIdField:"partyId",
            filterOptions: (options) =>
            (formValues["orgs"] && formValues["orgs"] != "") 
              ? options.filter((o) =>  o["parentOrgId"] == formValues["orgs"] )
              : filterFields.positions.length != 0 
              ? options.filter(
                    (item) => filterFields.positions.indexOf(item.partyId) >= 0
              ): options,
            col     : 3,
        },{
            name    : "positions",
            label   : "پست سازمانی",
            type    : "multiselect",
            options : fieldInfo.positions ,
            optionLabelField :"description",
            optionIdField:"emplPositionId",
            filterOptions: (options) =>
            (formValues["orgs"] && formValues["orgs"] != "") 
              ? options.filter((o) => o["parentOrgId"] == formValues["orgs"])
              : 
              ((!formValues["orgs"] || formValues["orgs"] == "" ) && filterFields.orgs.length == 0) && (formValues["unit"] && eval(formValues["unit"]).length > 0 )
              ? options.filter(
                (item) => eval(formValues["unit"]).indexOf(item.organizationPartyId) >= 0
              ): 
              ((formValues["orgs"] && formValues["orgs"] != "") || filterFields.orgs.length != 0) && (formValues["unit"] && eval(formValues["unit"]).length > 0 )
              ? options.filter(
                (item) => eval(formValues["unit"]).indexOf(item.organizationPartyId) >= 0 && ((formValues["orgs"] && formValues["orgs"] != "") ? item["parentOrgId"] == formValues["orgs"] : filterFields.orgs.indexOf(item.parentOrgId) >= 0)
              ):options,
            col     : 3,
        },{
            name    : "roles",
            label   : "نقش سازمانی",
            type    : "multiselect",
            options : fieldInfo.roles ,
            optionLabelField :"description",
            optionIdField:"roleTypeId",
            col     : 3,
        },{
            name    : "group",
            label   : "گروه پرسنلی",
            type    : "multiselect",
            options : fieldInfo.group ,
            optionLabelField :"description",
            optionIdField:"partyClassificationId",
            filterOptions: (options) =>
            (formValues["orgs"] && formValues["orgs"] != "") 
              ? options.filter((o) =>  o["companyPartyId"] == formValues["orgs"])
              : filterFields.group.length != 0 
              ? options.filter(
                    (item) => filterFields.group.indexOf(item.partyClassificationId) >= 0
              ): options,
            col     : 3,
        },{
            name    : "subGroup",
            label   : "زیر گروه پرسنلی",
            type    : "multiselect",
            options : fieldInfo.subGroup ,
            optionLabelField :"description",
            optionIdField:"partyClassificationId",
            filterOptions: (options) =>
            (formValues["orgs"] && formValues["orgs"] != "")  && (!formValues["group"] || eval(formValues["group"]).length == 0 )
              ? options.filter((o) => o["companyPartyId"] == formValues["orgs"])
              : (!formValues["orgs"] || formValues["orgs"] == "") && (formValues["group"] && eval(formValues["group"]).length > 0 )
              ? options.filter(
                (item) => eval(formValues["group"]).indexOf(item.parentClassificationId) >= 0
              ):(formValues["orgs"] && formValues["orgs"] != "") && (formValues["group"] && eval(formValues["group"]).length > 0 )
              ? options.filter(
                (item) => eval(formValues["group"]).indexOf(item.parentClassificationId) >= 0 && ((formValues["orgs"] && formValues["orgs"] != "") ? item["companyPartyId"] == formValues["orgs"] : filterFields.orgs.indexOf(item.companyPartyId) >= 0)
              ): options,
            col     : 3,
        }
    ]

    useEffect(() => {
        if (formValues.orgs && formValues.orgs != "" && fieldInfo?.positions){

            filterList.orgsFilter = (tableContent?.filter((item) => item?.companyPartyId==formValues?.orgs ))
            setFilterList(Object.assign({},filterList))

            if(formValues.positions && formValues.positions != "[]"){
                let selectedPositionsInfo = fieldInfo?.positions?.filter((item) => eval(formValues["positions"]).indexOf(item?.emplPositionId) >= 0)
                let newPositions = selectedPositionsInfo.filter((item) => item?.parentOrgId == formValues?.orgs)
                formValues.positions  = JSON.stringify(newPositions.map(a => a?.emplPositionId));
            }
            if(formValues.unit && formValues.unit != "[]"){
                let selectedUnitInfo = fieldInfo?.unit.filter((item) => eval(formValues["unit"]).indexOf(item?.partyId) >= 0)
                let newUnit= selectedUnitInfo.filter((item) => item?.parentOrgId == formValues?.orgs)
                formValues.unit  = JSON.stringify(newUnit.map(a => a?.partyId));
            }
            if(formValues.group && formValues.group != "[]"){
                let selectedGroupInfo = fieldInfo?.group.filter((item) => eval(formValues["group"]).indexOf(item?.partyClassificationId) >= 0)
                let newGroup= selectedGroupInfo.filter((item) => item?.companyPartyId == formValues?.orgs)
                formValues.group  = JSON.stringify(newGroup.map(a => a?.partyClassificationId));
            }
            if(formValues?.subGroup && formValues?.subGroup != "[]"){
                let selectedSubGroupInfo = fieldInfo?.subGroup.filter((item) => eval(formValues["subGroup"]).indexOf(item?.partyClassificationId) >= 0)
                let newSubGroup= selectedSubGroupInfo.filter((item) => item?.companyPartyId == formValues?.orgs)
                formValues.subGroup  = JSON.stringify(newSubGroup.map(a => a?.partyClassificationId));
            }
            setFormValues(Object.assign({},formValues))
        }
        else {
            filterList.orgsFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.orgs,fieldInfo?.positions])

    useEffect(() => {
        if (formValues.positions && formValues.positions != "[]" && fieldInfo?.positions){
            let filterData = []
            eval(formValues.positions).map((e,i)=>{
                filterData = filterData.concat(tableContent.filter((item) => item?.mainPositionId == e))
                if (i == eval(formValues.positions).length-1 ){
                    filterList.positionsFilter = filterData
                    setFilterList(Object.assign({},filterList))
                }
            })
            let selectedPositionsInfo = fieldInfo?.positions.filter((item) => eval(formValues["positions"]).indexOf(item?.emplPositionId) >= 0)
            let unit = selectedPositionsInfo.map(a => a?.organizationPartyId);
            filterFields.positions = Array.from(new Set(unit))
            setFilterFields(Object.assign({},filterFields))
        }
        else {
            filterFields.positions = []
            setFilterFields(Object.assign({},filterFields))
            filterList.positionsFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.positions,fieldInfo?.positions])

    useEffect(() => {
        if (formValues.unit && formValues.unit != "[]"){
            let filterData = []
            eval(formValues.unit).map((e,i)=>{
                filterData = filterData.concat(tableContent.filter((item) => item?.mainUnitId == e ))
                if (i == eval(formValues.unit).length-1 ){
                    filterList.unitFilter = filterData
                    setFilterList(Object.assign({},filterList))
                }
            })
        }
        else {
            filterList.unitFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.unit])

    useEffect(() => {
        if (formValues.group && formValues.group != "[]"){
            let filterData = []
            eval(formValues.group).map((e,i)=>{
                filterData = filterData.concat(tableContent.filter((item) => item?.PCAInfo.includes(e)))
                if (i == eval(formValues.group).length-1 ){
                    filterList.groupFilter = filterData
                    setFilterList(Object.assign({},filterList))
                }
            })
        }
        else {
            filterList.groupFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.group])

    useEffect(() => {
        if (formValues.subGroup && formValues.subGroup != "[]" && fieldInfo?.subGroup){
            let filterData = []
            eval(formValues.subGroup).map((e,i)=>{
                filterData = filterData.concat(tableContent.filter((item) => item?.PCAInfo.includes(e)))
                if (i == eval(formValues.subGroup).length-1 ){
                    filterList.subGroupFilter = filterData
                    setFilterList(Object.assign({},filterList))
                }
            })
            let selectedSubGroupInfo = fieldInfo?.subGroup.filter((item) => eval(formValues["subGroup"]).indexOf(item?.partyClassificationId) >= 0)
            let group = selectedSubGroupInfo.map(a => a?.parentClassificationId);
            filterFields.group = Array.from(new Set(group))
            setFilterFields(Object.assign({},filterFields))
        }
        else {
            filterFields.group = []
            setFilterFields(Object.assign({},filterFields))
            filterList.subGroupFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.subGroup,fieldInfo?.subGroup])

    useEffect(() => {
        if (formValues.roles && formValues.roles != "[]"){
            filterList.rolesFilter = (tableContent.filter((item) => eval(formValues["roles"]).indexOf(item?.roleTypeId) >= 0 ))
            setFilterList(Object.assign({},filterList))
        }
        else {
            filterList.rolesFilter = []
            setFilterList(Object.assign({},filterList))
        }
    }, [formValues?.roles])

    const handle_filter = () => {
        let counter = 0
        if (formValues?.orgs && formValues?.orgs != ""){counter = counter +1 }
        if (formValues?.unit && formValues?.unit != "[]"){counter = counter +1 }
        if (formValues?.positions && formValues?.positions != "[]"){counter = counter +1 }
        if (formValues?.roles && formValues?.roles != "[]"){counter = counter +1 }
        if (formValues?.group && formValues?.group != "[]"){counter = counter +1 }
        if (formValues?.subGroup && formValues?.subGroup != "[]"){counter = counter +1 }
        let searchDatas = filterList.orgsFilter.concat(filterList.positionsFilter,filterList.unitFilter,filterList.groupFilter,filterList.subGroupFilter,filterList.rolesFilter)
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
                        setTableContent.set(tableData)
                        handleClose()
                    }
                })
            },100)
        }
        if (searchDatas.length == 0 && counter !=0){
            setTableContent.set([])
            handleClose()
        }
        if (searchDatas.length == 0 && counter ==0){
            setTableContent.set(tableContent)
            handleClose()
        }
    }

    const resetCallback = () => {
        setFormValues({})
        setTableContent.set(tableContent)
        handleClose()
    }

    return (
        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={filterStructure}
            submitCallback = {handle_filter}
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

export default FilterGoalContact;