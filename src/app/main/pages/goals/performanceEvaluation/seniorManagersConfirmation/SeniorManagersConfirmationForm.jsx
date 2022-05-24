import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from "../../../../components/TablePro";
import ActionBox from "../../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import VisibilityIcon from '@material-ui/icons/Visibility';
import FormComplexParty from '../../../../components/formControls/FormComplexParty'
import CommentPanel from "../../../tasks/forms/EmplOrder/checking/EOCommentPanel"
import DisplayField from "../../../../components/DisplayField";
import TabPro from "../../../../components/TabPro";
import { useHistory } from 'react-router-dom'
import FilterEvaluatedList from "../FilterEvaluatedList"

const SeniorManagersConfirmationForm = () => {

    const [evaluatedTableContent, setEvaluatedTableContent] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [formValues, setFormValues] = useState([]);
    const [assignEvaluator,setAssignEvaluator] = React.useState(false);
    const [evaluatorTableContent, setEvaluatorTableContent] = React.useState([]);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const [signData, setSignData] = useState(null);
    const [verificationList,setVerificationList] = useState([]);
    const [verificationId,setVerificationId] = useState();
    const [evaluatedList,setEvaluatedList] = React.useState([]);
    const [evaluatedLoading, setEvaluatedLoading] = React.useState(true);
    const [evaluationPeriodId,setEvaluationPeriodId] = React.useState("100053");

    const history = useHistory()
    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    const evaluatedTableCols = [
        {
          name: "name",
          label: "ارزیابی شونده",
          type: "text",
          style: { minWidth: "130px" },
        },
        {
          name: "pseudoId",
          label: "کد پرسنلی",
          type: "text",
          style: { minWidth: "130px" },
        },
        {
          name: "unit",
          label : "واحد سازمانی",
          type  : "select",
        //   options: fieldInfo.unitInfo,
        //   optionLabelField: "organizationName",
        //   optionIdField: "partyId",
        //   filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
          style: { minWidth: "130px" },
        },
        {
          name: "positions",
          label : "پست سازمانی",
          type  : "select",
        //   options: fieldInfo.positionInfo,
        //   optionLabelField: "description",
        //   optionIdField: "emplPositionId",
        //   filterOptions: (options) => formValues.unit 
        //   ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
        //   : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
          style: { minWidth: "130px" },
        },
    ]; 

    const evaluatedInfo = [
        {
            name: "companyPartyId",
            label: "شرکت",
            type: "text",
            disabled: true,
            col   : 2,
      }, 
      {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            disabled: true,
            col   : 2,
      },       
        {
            name: "name",
            label: "ارزیابی شونده",
            type: "text",
            disabled: true,
            col   : 3,
      },
      {
            name: "unit",
            label : "واحد سازمانی",
            type  : "select",
            // options: fieldInfo.unitInfo,
            // optionLabelField: "organizationName",
            // optionIdField: "partyId",
            // filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            disabled: true,
            col   : 2,
      },
      {
            name: "positions",
            label : "پست سازمانی",
            type  : "select",
            // options: fieldInfo.positionInfo,
            // optionLabelField: "description",
            // optionIdField: "emplPositionId",
            // filterOptions: (options) => formValues.unit 
            // ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            // : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            disabled: true,
            col   : 3,
      },
    ]

    const evaluatorTableCols = [
        {
            name  : "name",
            label : "نام ارزیاب",
            type  : "text",
            col   : 3,
        },
        {
            name: "unit",
            label : "واحد سازمانی",
            type  : "select",
            // options: fieldInfo.unitInfo,
            // optionLabelField: "organizationName",
            // optionIdField: "partyId",
            // filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },
        {
            name: "positions",
            label : "پست سازمانی",
            type  : "select",
            // options: fieldInfo.positionInfo,
            // optionLabelField: "description",
            // optionIdField: "emplPositionId",
            // filterOptions: (options) => formValues.unit 
            // ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            // : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            style: { minWidth: "130px" },
        },
        {
            name  : "evaluationLevelEnumId",
            label : "دسته بندی",
            type  : "select",
            col   : 3,
        },
        {
            name  : "evaluatingForm",
            label : "فرم مربوطه",
            type  : "select",
            col   : 3,
        },
    ];

    const getList = () => {
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/VerificationLevel?verificationId=${verificationId}`, axiosKey)
        .then((res) => {
            setVerificationList(res.data.result)
        })
        .catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const getEvaluatedList = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/getEvaluated?evaluationPeriodId=${evaluationPeriodId}`, axiosKey)
        .then((res) => {
            console.log("res.data.result.length" , res.data.result.length);
            if (res.data.result.length != 0){
                let tableData = []
                res.data.result.map((e,i)=>{
                    let rowData = {
                        name : e.evaluatedName , 
                        pseudoId : e.pseudoId ,
                        unit : e.unitName[0] ,
                        positions : e.emplPositionIName ,
                        status : "" ,
                        evaluationPeriodId : e.evaluationPeriodId ,
                        partyRelationshipId : e.fromPartyRelationshipId ,
                        emplpositionId : e.fromEmplpositionId
                    }
                    tableData.push(rowData)
                    if(i == res.data.result.length-1){
                        setEvaluatedTableContent(tableData)
                        setEvaluatedLoading(false)
                        setEvaluatedList(tableData)
                    }
                })

            }else{
                setEvaluatedTableContent ([])
                setEvaluatedList([])
                setEvaluatedLoading(false)
            }
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    useEffect(() => {
        getList()
        getEvaluatedList()
    }, [])

    const showEvaluator = () => {
        setAssignEvaluator(true)
    }

    const closeEvaluator = () => {
        setAssignEvaluator(false)
    }

    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i==1} setSignData={setSignData}/>
    }))

    const handleSubmit = (situation) => {
        if (situation == "accept"){
            history.push(`/evaluationsManagement`)
        }
        if (situation == "modify"){
            history.push(`/correctEvaluator`)
        }
        if (situation == "reject"){
            // history.push(`/AddedCourseList`)
        }
    }

    return(

        <Card>
            <CardContent>
                <Card>
                     <CardContent>
                        <TablePro
                            title = "لیست ارزیابی شوندگان"
                            columns={evaluatedTableCols}
                            rows={evaluatedTableContent}
                            setRows={setEvaluatedTableContent}
                            filter="external"
                            filterForm={<FilterEvaluatedList evaluatedList = {evaluatedList} evaluatedTableContent = {evaluatedTableContent} setEvaluatedTableContent={setEvaluatedTableContent} />}
                            loading={loading}
                            rowActions={[{
                                title: "مشاهده ی ارزیاب",
                                icon: VisibilityIcon,
                                onClick: (row)=>{
                                    showEvaluator(row)
                                }
                            }]}
                        />
                    </CardContent>
                </Card>
                {assignEvaluator ? 
                    <>
                        <Box m={2}/>
                        <Card>
                            <CardContent>
                                <Card>
                                    <CardContent>
                                        <CardHeader title="مشخصات ارزیابی شونده"/>
                                        <FormPro
                                            title = "مشخصات ارزیابی شونده"
                                            formValues = {formValues}
                                            setFormValues = {setFormValues}
                                            append={evaluatedInfo}
                                        /> 
                                    </CardContent>
                                </Card>
                                <Box m={2}/>
                                <Card>
                                    <CardContent>
                                        <TablePro
                                            title = "لیست ارزیابان "
                                            columns={evaluatorTableCols}
                                            rows={evaluatorTableContent}
                                            setRows={setEvaluatorTableContent}
                                            loading={loading}
                                        />
                                    </CardContent>
                                </Card>
                                <Box m={2}/>
                                <div style={{display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        style={{
                                            width: 120 ,
                                            color: "white",
                                            backgroundColor: "#039be5",
                                            marginRight: "8px",
                                        }}
                                        variant="outlined"
                                        type="submit"
                                        role="primary"
                                        onClick={closeEvaluator}
                                        >
                                        {" "} تایید{" "}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                :""}
                <Box m={2}/>
                <Card>
                    <CardContent>
                        <CardHeader title="مراتب تایید"/>
                        <TabPro orientation="vertical" tabs={tabs} initialValue={0}/>
                    </CardContent>
                </Card>
                <Box m={2}/>
                <ActionBox>
                    <Button type="button" onClick={()=>handleSubmit("accept")} role="primary">تایید</Button>
                    <Button type="button" onClick={()=>handleSubmit("modify")} role="secondary">اصلاح</Button>
                    <Button type="button" onClick={()=>handleSubmit("reject")} role="secondary">رد</Button>
                </ActionBox>
            </CardContent>
        </Card>

    )

}
export default SeniorManagersConfirmationForm;
