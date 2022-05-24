import React, {useState,useEffect} from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader} from "@material-ui/core";
import EOCForm from "./EOCForm";
import Box from "@material-ui/core/Box";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../components/ModalPro";
import EmplOrderContractPrint from "../contractsPrint/EmplOrderContractPrint";

export default function EmplOrderContract(){
    const [openModal, setOpenModal] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});
    const [agreement, setAgreement] = useState(null);
    const [userCompany, setUserCompany] = useState({});
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "code", label: "کد", type: "text", style: {width:"unset"}},
        {name: "description", label: "نوع قرارداد", type: "text", style: {width:"unset"}},
        {name: "agreementTypeEnumId", label: "نظام استخدامی", type: "select", options: "AgreementType", style: {width:"unset"}},
        {name: "statusId", label: "فعال", type: "indicator", indicator: {true: "ActiveAgr", false: "NotActiveAgr"}, style: {width:"unset"}},
    ]
    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + "/rest/s1/emplOrder/agreement/type", {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setTableContent(res.data.agreementTypes)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            });
        }
    },[userCompany])

    const handleEdit = (row)=>{
        setAgreement(row)
    }

    const handleOpenModal = (rowData)=>{
        setDataModal(rowData)
        setOpenModal(true)
    }

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف قرارداد"/>
                <CardContent>
                    <EOCForm agreement={agreement} setAgreement={setAgreement}
                             setTableContent={setTableContent}
                             userCompany={userCompany} setUserCompany={setUserCompany}
                    />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    title="لیست قراردادها"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    edit="callback"
                    editCallback={handleEdit}
                    rowActions={[
                        {
                            title: "پیش نمایش قرارداد",
                            icon: VisibilityIcon,
                            onClick: (row) => handleOpenModal(row)
                        }
                    ]}
                />
            </Card>
            <ModalPro
                title={`پیش نمایش ${dataModal.description}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <EmplOrderContractPrint type={dataModal.version} agreementTypeId={dataModal.agreementId}/>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
