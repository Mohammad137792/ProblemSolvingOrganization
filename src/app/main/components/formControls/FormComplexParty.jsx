import React, { useState, useEffect, createRef } from "react";

import Box from "@material-ui/core/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import FormPro from "./FormPro";
import { getData } from "../../../store/actions/fadak/formComplexParty.actions";
import { useSelector } from 'react-redux';

const FormComplexParty = (props) => {
  const { structure = null ,formValues, setFormValues, actionBox, submitCallback, resetCallback} = props;
  const dispatch = useDispatch();
  // ==============================     state  variables  ====================================================
  const [formValidation, setFormValidation] = useState([]);
  const [optionStructure, setOptionStructure] = useState([]);
  const selectedData = useSelector(({ fadak }) => fadak.formComplexParty.data);

  // ==============================     Structures  ====================================================
  const defultFormStructure = [
    {
      label: "شرکت",
      name: "orgs",
      type: "select",
      options: selectedData.orgs,
      required: true,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      col: 3,
    },
    {
      label: "واحد سازمانی",
      name: "unit",
      type: "multiselect",
      options: selectedData.unit,
      col: 3,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      filterOptions: (options) =>
        formValues?.orgs
          ? options.filter((o) => o["parentOrgId"] == formValues?.orgs)
          : options,
    },
    {
      label: "پست سازمانی",
      name: "positions",
      type: "multiselect",
      options: selectedData.positions,
      optionLabelField: "description",
      optionIdField: "emplPositionId",
      col: 3,
      filterOptions: (options) =>
        formValues["unit"] && eval(formValues["unit"]).length > 0
          ? options.filter(
              (item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0
            )
          : formValues["orgs"] && formValues["orgs"] != ""
          ? options.filter((o) => o["parentOrgId"] == formValues["orgs"])
          : options,
    },
    {
      label: "لیست کارمندان",
      name: "employees",
      type: "multiselect",
      options: selectedData.employees,
      optionLabelField: "name",
      optionIdField: "partyId",
      col: 3,
      filterOptions: (options) =>
        formValues["positions"] && eval(formValues["positions"]).length > 0
          ? options.filter(
              (item) =>
                formValues["positions"].indexOf(item.emplPositionIds[0]) >= 0
            )
          : formValues["unit"] && eval(formValues["unit"]).length > 0
          ? options.filter(
              (item) => formValues["unit"].indexOf(item.unitPartyId[0]) >= 0
            )
          : formValues["orgs"] && formValues["orgs"] != ""
          ? options.filter((o) => o["subOrgPartyId"][0] == formValues["orgs"])
          : options,
    },
    {
      label: "نقش های سازمانی",
      name: "roles",
      type: "multiselect",
      optionLabelField: "description",
      optionIdField: "emplPositionId",
      col: 3,
      options: selectedData.roles,
    },
    {
      label: "گروه پرسنلی",
      name: "group",
      type: "multiselect",
      
      options: selectedData.group,
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      col: 3,
      filterOptions: (options) =>
        formValues["orgs"]
          ? options.filter((o) => o["partyId"] == formValues["orgs"])
          : options,
    },
    {
      label: "زیر گروه پرسنلی",
      name: "subGroup",
      type: "multiselect",
      
      options: selectedData.subGroup,
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      col: 3,
      filterOptions: (options) =>
        formValues["orgs"]
          ? options.filter((o) => o["partyId"] == formValues["orgs"])
          : formValues["group"] && eval(formValues["group"]).length > 0
          ? options.filter(
              (item) => formValues["group"].indexOf(item.parentClassificationId) >= 0
            ): options,
    },
    {
      label: "منطقه فعالیت",
      name: "activityArea",
      type: "multiselect",
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      
      options: selectedData.activityArea,
      col: 3,
    },
    {
      label: "حوزه کاری",
      name: "areaOfExpertise",
      type: "multiselect",
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      
      options: selectedData.areaOfExpertise,
      col: 3,
    },
    {
      label: "مرکز هزینه ",
      name: "costCenter",
      type: "multiselect",
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      
      options: selectedData.costCenter,
      col: 3,
    },
  ];
  function buildStructures(selectedData) {
    let array = [];
    if (structure != null )
      structure.map((item, index) => {
        switch (item.name) {
          case "orgs":
            // selectedData
            pushArray(0,item)
            break;
          case "unit":
            pushArray(1,item)
            break;
          case "positions":
            pushArray(2,item)
            break;
          case "employees":
            pushArray(3,item)
            break;
          case "roles":
            pushArray(4,item)
            break;
          case "group":
            pushArray(5,item)
            break;
          case "subGroup":
            pushArray(6,item)
            break;
          case "activityArea":
            pushArray(7,item)
            break;
          case "areaOfExpertise":
            pushArray(8,item)
            break;
          case "costCenter":
            pushArray(9,item)
            break;
          default:
        }
      });

    else array = defultFormStructure;

    function pushArray(index,item) {
      if (item.label) defultFormStructure[index].label = item.label;
      if (item.required) defultFormStructure[index].required = item.required;
      if (item.type) defultFormStructure[index].type = item.type;
      if (item.col) defultFormStructure[index].col = item.col;
      if (item.filterOptions) defultFormStructure[index].filterOptions = item.filterOptions;
      array.push(defultFormStructure[index]);
      return array;
    }

    if (selectedData) {
      setOptionStructure(array);
    }
  }
  // ==============================     useEffect  ====================================================
  useEffect(() => {
    getAssessments();
  }, []);
  

  useEffect(() => {
    buildStructures(selectedData);
  }, [selectedData,formValues]);
  // ==============================     functions  ====================================================
  function getAssessments() {
    let listMap = []
    structure.map((item,index)=>{
      if(!selectedData.hasOwnProperty(`${item.name}`)){
        listMap.push(`${item.name}`)
      }
    })
    if(listMap.length != 0 ){
      axios
        .get(SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap , {
          headers: { api_key: localStorage.getItem("api_key") },
        })
        .then((res) => {
          let reduxArray = {}
          structure.map((item,index)=>{
            reduxArray={...reduxArray , [item.name] : res.data.contacts[item.name]}
          })
          dispatch(getData(selectedData , reduxArray))
          
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
    }
  }
  //$&$&$&$&$&$&................................نمایش صفحه ........................................$&$&$&$&$&$&
  return (
    <Box mt={2}>
        <FormPro
            id="top"
            append={optionStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={submitCallback}
            resetCallback={resetCallback}
            actionBox={actionBox}
          />
    </Box>
  );
};
export default FormComplexParty;
