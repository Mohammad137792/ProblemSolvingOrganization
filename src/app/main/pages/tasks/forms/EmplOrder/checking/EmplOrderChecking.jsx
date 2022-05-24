import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AssignmentIcon from "@material-ui/icons/Assignment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ActionBox from "../../../../../components/ActionBox";
import TablePro from "../../../../../components/TablePro";
import FormInput from "../../../../../components/formControls/FormInput";
import DisplayField from "../../../../../components/DisplayField";
import TabPro from "../../../../../components/TabPro";
import CommentPanel from "./EOCommentPanel";
import ModalPro from "../../../../../components/ModalPro";
import Box from "@material-ui/core/Box";
import EOIPreviewAgreement from "../issuance/EOIPreviewAgreement";
import EmplOrderPrint from "../../../../emplOrder/ordersPrint/EmplOrderPrint";

export default function EmplOrderChecking (props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.verificationList?.value ?? []
    const index = verificationList.findIndex(i=>(i.username===username ))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);
    const [openModalOrder, setOpenModalOrder] = React.useState(false);
    const [openModalAgreement, setOpenModalAgreement] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});

    function showAgreement(rowData){
        setDataModal(rowData)
        setOpenModalAgreement(true)
    }
    function showEmplOrder(rowData){
        setDataModal(rowData)
        setOpenModalOrder(true)
    }

    const [tableContent, setTableContent] = React.useState(formVariables.personnelList?.value??[]);
    const tableCols = [
        {name: "firstName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {width:"80px"}},
        {name: "nationalId", label: "کد ملی", type: "text"},
        // {name: "lastName4", label: "شماره حکم", type: "text"},
        {name: "emplPositionTitle", label: "پست سازمانی", type: "text"},
        {name: "jobTitle", label: "شغل", type: "text"},
        {name: "payrollFactorTotalSum", label: "جمع حقوق و مزایای حکم", type: "text"},
    ]
    const formStructure = [{
        group   : "producerFullName",
        name    : "value",
        label   : "نام  و نام خانوادگی تنظیم کننده",
        type    : "text",
        readOnly: true
    },{
        group   : "producerEmplPositionId",
        name    : "value",
        label   : "پست تنظیم کننده",
        type    : "display",
        options : "EmplPosition",
        optionIdField    : "emplPositionId"
    },{
        group   : "EmplOrderType",
        name    : "value",
        label   : "نوع حکم کارگزینی",
        type    : "text",
        readOnly: true
    },{
        group   : "orderDate",
        name    : "value",
        label   : "تاریخ صدور حکم",
        type    : "display",
        options : "Date",
        readOnly: true
    },{
        group   : "fromDate",
        name    : "value",
        label   : "تاریخ اجرای حکم",
        type    : "display",
        options : "Date",
        readOnly: true
    },{
        group   : "thruDate",
        name    : "value",
        label   : "تاریخ پایان اعتبار حکم",
        type    : "display",
        options : "Date",
        readOnly: true
    },{
        group   : "description",
        name    : "value",
        label   : "شرح حکم",
        type    : "textarea",
        col     : 12,
        readOnly: true
    }]


    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i===index} setSignData={setSignData}/>
    }))

    const handleSubmit = (order) => (e)=>{
        let moment = require('moment-jalaali')
        let nextVerificationList = verificationList;
        nextVerificationList[index] = Object.assign({}, nextVerificationList[index],{
            comment: formValues.comment,
            verificationDate:  moment().format("Y-MM-DD"),
            result: order,
        })
        const packet = {
            result: order,
            verificationList: nextVerificationList
        }

        submitCallback(packet)
    }

    return(
        <Grid container spacing={2}>
            {formStructure.map((input,index)=>(
                <FormInput key={index} {...input} valueObject={formVariables}/>
            ))}

            <Grid item xs={12}>
                <Card variant="outlined">
                    <TablePro
                        title="لیست احکام کارگزینی صادر شده"
                        columns={tableCols}
                        rows={tableContent}
                        rowActions={[
                            {
                                title: "نمایش قرارداد",
                                icon: AssignmentIcon,
                                onClick: (row) => showAgreement(row)
                            },{
                                title: "نمایش حکم",
                                icon: VisibilityIcon,
                                onClick: (row) => showEmplOrder(row)
                            }
                        ]}
                    />
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined">
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index}/>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <ActionBox>
                    <Button type="button" onClick={handleSubmit("accept")} role="primary">تایید</Button>
                    {verificationList[index]?.modify==='Y' &&
                        <Button type="button" onClick={handleSubmit("modify")} role="secondary">اصلاح</Button>
                    }
                    {verificationList[index]?.reject==='Y' &&
                        <Button type="button" onClick={handleSubmit("reject")} role="secondary">رد</Button>
                    }
                    {/*<Button type="button" role="tertiary" onClick={()=>{*/}
                    {/*    console.log("formValues:",formValues)*/}
                    {/*}}>Log formValues</Button>*/}
                </ActionBox>
            </Grid>

            <ModalPro
                title={`${formVariables.newAgreement.value==="Y"?"پیش":""} نمایش قرارداد ${dataModal.firstName} ${dataModal.lastName}`}
                open={openModalAgreement}
                setOpen={setOpenModalAgreement}
                content={
                    <Box p={5}>
                        <EOIPreviewAgreement formValues={ formVariables.newAgreement.value == "Y" ? {
                            newAgreement: formVariables.newAgreement.value,
                            agreementDate: formVariables.agreementDate?.value,
                            agreementFromDate: formVariables.agreementFromDate?.value,
                            agreementThruDate: formVariables.agreementThruDate?.value,
                            AgreementTypeId: formVariables.AgreementTypeId?.value
                        }:
                        {
                            newAgreement: formVariables.newAgreement?.value,
                            agreementDate: formVariables.agreementDate?.value,
                        }
                    } rowData={dataModal}/>
                    </Box>
                }
            />
            <ModalPro
                title={`پیش نمایش حکم ${dataModal.firstName} ${dataModal.lastName}`}
                open={openModalOrder}
                setOpen={setOpenModalOrder}
                content={
                    <Box p={5}>
                        <EmplOrderPrint type={"EmplOrderPrintDefault"} data={{
                            printSettingTitle: "کارمند",
                            ...dataModal,
                            verificationList: [],
                        }}/>
                    </Box>
                }
            />
        </Grid>

    )
}
