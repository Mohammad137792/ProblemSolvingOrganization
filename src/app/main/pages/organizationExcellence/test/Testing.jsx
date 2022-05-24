import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import axios from "axios";
import { SERVER_URL } from "./../../../../../configs";

const Testing = () => {
  const [formValues, setFormValues] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusId, setStatusId] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [btnName, setBtnName] = useState("افزودن");
  const [uom, setUom] = useState([]);
  const [tableContent, setTableContent]= useState([]);
  const [alertContent, setAlertContent]= useState([]);

  const statusObjects = [
    {
      enumId: "ضعیف",
      name: "ضعیف",
      description: "ضعیف",
    },
    {
      enumId: "متوسط",
      name: "متوسط",
      description: "متوسط",
    },
    {
      enumId: "خوب",
      name: "خوب",
      description: "خوب",
    },
  ];
 
    const formStructure = [
      {
        enumId: "1",
        name: "workEffortName",
        label: "کد",
        type: "text",
        col: 3,
        required: false,
      },
      {
        enumId: "2",
        name: "description",
        label: "عنوان",
        type: "text",
        col: 6,
        required: false,
      },
      {
        enumId: "3",
        name: "statusId",
        label: "وضعیت",
        type: "select",
        options: statusId,

        options: statusObjects,

        col: 3,

        required: false,
      },
      {
        enumId: "4",
        name: "purposeEnumId",
        label: "نوع مولفه",
        type: "select",
        options: statusObjects,
        col: 3,
      },
      {
        enumId: "5",
        name: "scopeEnumId",
        label: "دسته مولفه",
        options: statusObjects,
        type: "select",
        col: 3,

        required: false,
      },
      {
        enumId: "6",
        name: "parentWorkEffortId",
        label: "مولفه بالاتر",
        type: "select",
        options: statusObjects,

        col: 3,

        display: formValues.purposeEnumId === "ضعیف" ? false : true,
      },
      {
        enumId: "7",
        name: "parameterScore",
        label: "امتیاز",
        type: "text",
        col: 3,
        display: formValues.purposeEnumId === "متوسط" ? false : true,
      },
      {
        enumId: "8",
        name: "weight",
        label: "وزن",
        type: "number",
        col: 3,
        display: formValues.purposeEnumId === "متوسط" || "ضعیف" ? false : true,
      },
      {
        enumId: "9",
        name: "parameterScore",
        label: "هدف کمی",
        type: "number",
        col: 3,
      },
      {
        enumId: "10",
        name: "uomId",
        label: "واحد",
        type: "select",
        col: 3,
        options: statusObjects,
        optionLabelField: "description",
        optionIdField: "uomId",
      },
    ];

useEffect( () => {
  setTableRows( [
    {
      workEffortName: "اول",
      description: "اولین تست",
      purposeEnumId: "نوع اول",
      scopeEnumId: "دسته اول",
      parentWorkEffortId: "مولفه اول",
      statusId: "اولین",
    },
    {
      workEffortName: "دوم",
      description: "دومین تست",
      purposeEnumId: "نوع دوم",
      scopeEnumId: "دسته دوم",
      parentWorkEffortId: "مولفه دوم",
      statusId: "دومین",
    },
  ])
},[]);

  const tableCols = [
    {
      name: "workEffortName",
      label: "کد",
      type: "text",
    },
    {
      name: "description",
      label: "عنوان",
      type: "text",
    },
    {
      name: "purposeEnumId",
      label: "نوع مولفه",
      type: "select",
    },
    {
      name: "scopeEnumId",
      label: "دسته مولفه",
      type: "select",
    },
    {
      name: "parentWorkEffortId",
      label: "مولفه بالاتر",
      type: "select",
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
    },
  ];
  let newTableRows = [];

  const handleEdit = (rows) => {
    setBtnName("ویرایش");
    setFormValues(rows);
  };
  const handleReset = () => {
    setBtnName("افزودن");
    setEdit(false);
    // edit(false) ? setBtnName("افزودن") : setBtnName('ویرایش');
    setFormValues({});
  };
  

  const handleSubmit = () => {

   let oldData = {...tableRows};
   const newObject={ workEffortName: formValues.workEffortName,
    description: formValues.description,
    purposeEnumId: formValues.purposeEnumId,
    scopeEnumId: formValues.scopeEnumId,
    parentWorkEffortId: formValues.parentWorkEffortId,
    statusId: formValues.statusId,}
    
   
   setTableRows([...tableRows, newObject])
   console.log(oldData,"old")
   console.log(newObject,"new")
   console.log(tableRows,"tableRows")
    setFormValues({});

      // axios
      //     .get(SERVER_URL +"/rest/s1/excellence/model",
      //     {headers: {api_key: localStorage.getItem("api_key")}}
      //     )
      //     .then ((res)=>{
      //       console.log(res,"reeees")
      //     })
      //     .catch (()=>{});
        
        // useEffect(()=>{
          
        //   getData();
        // },[]);

   
  };
  function handleRemove() {
    
    return new Promise(function(resolve, reject) {
      
      resolve(true);
    })
    promise.then(bool => console.log('Bool is true'))
 

  }

  return (
    <>
      <Card>
        <CardHeader title="ایجاد مولفه مدل" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormPro
                formValues={formValues}
                setFormValues={setFormValues}
                
                append={formStructure}
                submitCallback={edit ? handleEdit : handleSubmit}
                resetCallback={handleReset}
                actionBox={
                  <ActionBox>
                    <Button type="submit" role="primary">
                      {btnName}
                    </Button>
                    <Button type="reset" role="secondary">
                      لغو
                    </Button>
                  </ActionBox>
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box p={1}>
        <Card variant="outlined">
          <TablePro
            title="لیست مولفه های موجود در مدل"
            columns={tableCols}
            rows={tableRows}
            edit="callback"
            editCallback={handleEdit}
            removeCallback={handleRemove}
          />
        </Card>
      </Box>
    </>
  );
};

export default Testing;
