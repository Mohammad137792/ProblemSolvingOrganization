import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import FormInput from "../../../components/formControls/FormInput";
import TablePro from "../../../components/TablePro";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import ModalPro from "../../../components/ModalPro";
import Box from "@material-ui/core/Box";
import EmplOrderPrint from "../../emplOrder/ordersPrint/EmplOrderPrint";
// import EOIPreviewAgreement from "./EOIPreviewAgreement";

export default function MEOFinalize(props){
    const [openModalOrder, setOpenModalOrder] = React.useState(false);
    const [openModalAgreement, setOpenModalAgreement] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});
    const {formValues, setFormValues, personnel, personnelOrders} = props;
    const [table1Content, setTable1Content] = React.useState([]);
    const table1Cols = [
        {name: "sequence", label: "ترتیب", type: "number"},
        {name: "emplPositionId", label: "پست سازمانی", type: "select", options: "EmplPosition", optionIdField: "emplPositionId", style: {width:"unset"}},
        {name: "firstName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''} ${row.suffix||''}`;}, style: {width:"170px"}},
        {name: "reject", label: "امکان رد", type: "indicator", style: {width:"unset"}},
        {name: "modify", label: "امکان رد برای اصلاح", type: "indicator", style: {width:"unset"}},
    ]
    const table2Cols = [
        {name: "fullName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {width:"80px"}},
        {name: "nationalId", label: "کد ملی", type: "text"},
        {name: "emplPositionTitle", label: "پست سازمانی", type: "text"},
        {name: "jobTitle", label: "شغل", type: "text"},
        {name: "payrollFactorTotalSum", label: "جمع حقوق و مزایای حکم", type: "text"},
    ]

    const formStructure = [{
        name    : "sendingPathEnumId",
        label   : "راه های ارسال نسخه به کارمند",
        type    : "select",
        options : "EmplOrderSendingPath",
        disableClearable: true
    },{
        name    : "noticeEnumId",
        label   : "راه های اطلاع رسانی",
        type    : "select",
        options : "EmplOrderNotice",
        disabled: true
    }]

    function showAgreement(rowData){
        setDataModal(rowData)
        setOpenModalAgreement(true)
    }
    function showEmplOrder(rowData){
        setDataModal(rowData)
        setOpenModalOrder(true)
    }

    return(
        <>
            <Grid container spacing={2}>
                {formStructure.map((input,index)=>(
                    <FormInput key={index} {...input} valueObject={formValues} valueHandler={setFormValues}/>
                ))}
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <TablePro
                            title="لیست رده های تایید"
                            columns={table1Cols}
                            rows={table1Content}
                            setRows={setTable1Content}
                            showRowNumber={false}
                            defaultOrderBy="sequence"
                        />
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <TablePro
                            title="لیست احکام کارگزینی صادر شده"
                            columns={table2Cols}
                            rows={personnelOrders}
                            // loading={personnelOrders.length===0}
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
            </Grid>

            {/* <ModalPro
                title={`${formValues.newAgreement==="Y"?"پیش":""} نمایش قرارداد ${dataModal.firstName} ${dataModal.lastName}`}
                open={openModalAgreement}
                setOpen={setOpenModalAgreement}
                content={
                    <Box p={5}>
                         <EOIPreviewAgreement formValues={formValues} rowData={dataModal}/> 
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
            /> */}
        </>
    )
}
