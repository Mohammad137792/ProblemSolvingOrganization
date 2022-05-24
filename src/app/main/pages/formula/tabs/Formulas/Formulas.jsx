import React from 'react';
import FormulasForm from "./FormulasForm";
import {Box, CardContent, CardHeader} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import TablePro from "../../../../components/TablePro";
import EditIcon from "@material-ui/icons/Edit";
import {setUser, setUserId} from "../../../../../store/actions";
import SearchPersonnelForm from "../../../personnelManagement/searchPersonnel/SearchPersonnelForm";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import {SERVER_URL} from "../../../../../../configs";
import axios from "axios";
import ValidFormula from './validFormula';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
const Formulas = (props) => {

    let moment = require('moment-jalaali');
    let defaultFormValue={date: moment().format("Y-MM-DD"),"partyId":props?.partyId,"companyPartyId":props?.userOrganization,"firstName":(props?.partyDetail?.firstName!=undefined?props?.partyDetail?.firstName:"")+" "+(props?.partyDetail?.lastName!=undefined?props?.partyDetail?.lastName:"")}
    const [loading,setLoading]=React.useState(false)
    const [tableContent,setTableContent]=React.useState([]);
    const [formValues,setFormValues]=React.useState(defaultFormValue)
    const [formulaText,setFormulaText]=React.useState("")
    const [langValue,setLangValue]=React.useState(0);
    const [addForm,setAddForm]=React.useState(true)
    const [open,setOpen]=React.useState(false)
    const [modalData,setModalData]=React.useState({})
    const handleClose=()=>{
        setOpen(false)
    }
    React.useEffect(()=>{getFormulaList()},[props.userOrganization])

    const getFormulaList=()=>{
        let companyPartyId=props.userOrganization;
        if(companyPartyId){
            axios.get(SERVER_URL+"/rest/s1/fadak/entity/Formula?companyPartyId="+companyPartyId,{headers:{"api_key":localStorage.getItem("api_key")}}).then(res=>{
                console.log("mydata",data)
                let data=res.data.result.filter(ele=>ele.thruDate==null)
                    setTableContent(data)

                }
            )
        }
       
    }
    function deleteFormula(data){
        return new Promise((resolve, reject) => {
            let packet={
                "formulaId":data.formulaId,
                "thruDate":new Date()
            }
            axios.put(SERVER_URL+"/rest/s1/fadak/entity/Formula",{data : packet},{headers:{"api_key":localStorage.getItem("api_key")}}).then(res=>{
                setTableContent(prevState => prevState.filter(value => value.formulaId !== data.formulaId))
                resolve()

            })
        })

    }
    const tableCols=[
        {name:"title",label:"عنوان فرمول",type:"text"},
        {name:"description",label:"شرح فرمول",type:"text"},
        {name:"date",label:"تاریخ ایجاد",type:"date"},
        {name:"version",label:"نسخه",type:"text"}
    ]
    const prepareForm=(data)=> {
        data.formulaText = data.text;
        let person = props.persons.find(ele => ele.partyId == data.partyId)
        data.firstName = person?.firstName + " " + person?.lastName
        setFormValues(data)
        setFormulaText(data.text.replaceAll('@lt','<'))
        setLangValue(0)
    }
    const testFormula=(data)=>{
        let args=data["mantle.humanres.employment.FormulaDetail"]?.args
        let output=data["mantle.humanres.employment.FormulaDetail"]?.output
        let argList=[];
        let outputList=[];
        if(args){argList=JSON.parse(args)}
        if(output){outputList=JSON.parse(output)}
        const main = [];
        argList.forEach(ele => {
                main.push({
                    name: ele.replaceAll(" ",""),
                    label: ele.replaceAll(" ",""),
                    type: "text",
                })
            });
        let modal={};
        modal.main=main;
        modal.formulaId=data?.formulaId
        modal.output=outputList;
        setModalData(modal)
        setOpen(true)
    }
    return (
        <>
        <Card>
            <CardHeader title="فرمول"/>
            <CardContent>
                <FormulasForm addForm={addForm} setAddForm={setAddForm} langValue={langValue} setLangValue={setLangValue}  formulaText={formulaText} setFormulaText={setFormulaText} constant={props.constant} inputFactor={props.inputFactor} systemParam={props.systemParam} functionList={props.functionList} payrollFactor={props.payrollFactor} partyId={props.partyId} userOrganization={props.userOrganization} setTableContent={setTableContent} formValues={formValues} setFormValues={setFormValues} defaultFormValue={defaultFormValue}/>
            </CardContent>
        </Card>
         <Grid container>
        {/* <Grid item xs={6}>*/}
        {/*  <Card>*/}
        {/*<CardHeader title="آزمایش فرمول"/>*/}
        {/*<CardContent>*/}
        {/*    <ExperimentForm/>*/}
        {/*</CardContent>*/}
        {/*</Card>*/}
        {/*</Grid>*/}
        </Grid>
            <Box p={2}>
                <Card>
                    <TablePro
                        title="لیست فرمولها"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}

                        loading={loading}
                        defaultOrderBy="index"
                        removeCallback={deleteFormula}
                        rowActions={[
                            // {
                            //     title: "تست فرمول",
                            //     icon: CheckBoxIcon,
                            //     onClick: (row)=>{
                            //         testFormula(row)
                            //     }
                            // },
                            {
                                title: "ویرایش",
                                icon: EditIcon,
                                onClick: (row)=>{
                                    prepareForm(row)
                                    setAddForm(false)
                                }
                            }
                        ]}
                        exportCsv="لیست فرمول"
                    />
                </Card>
            </Box>
        <ValidFormula open={open} handleClose={handleClose} data={modalData} />
        </>
    );
};

export default Formulas;