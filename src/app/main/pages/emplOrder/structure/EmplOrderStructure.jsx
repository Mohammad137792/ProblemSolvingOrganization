import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader} from "@material-ui/core";
import EOSForm from "./EOSForm";
import Box from "@material-ui/core/Box";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EmplOrderPrint from "../ordersPrint/EmplOrderPrint";
import ModalPro from "../../../components/ModalPro";

export default function EmplOrderStructure(){
    const [openModal, setOpenModal] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});
    const [userCompany, setUserCompany] = useState({});
    const [actionObject, setActionObject] = React.useState(null); //settingId
    const [loading, setLoading] = useState(true);
    const [printSettings, setPrintSettings] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "title", label: "عنوان نسخه", type: "text"},
        {name: "emplPositionId", label: "نسخه مربوط به", type: "select", options: "EmplPosition", optionIdField: "emplPositionId",
            appendOptions: [{emplPositionId: "employee", description: "کارمند"}]},
        {name: "printSettingId", label: "نوع نسخه", type: "select", options: printSettings, optionIdField: "settingId", optionLabelField: "title"},
    ]
    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${userCompany.userCompanyId}&typeEnumId=EostEmplOrderPrint`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setTableContent(res.data.result)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            });
        }
    },[userCompany])
    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + "/rest/s1/fadak/PrintSetting/EmplOrder", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    companyPartyId: userCompany.userCompanyId
                }
            }).then(res => {
                setPrintSettings(res.data.copies)
            }).catch(() => {
            });
        }
    },[userCompany])
    const handleEdit = (row)=>{
        setActionObject(row.settingId)
    }
    const handleDelete = (row)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/EmplOrderSetting?settingId="+row.settingId,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then((res) => {
                if(res.status===200){
                    resolve()
                }else{
                    reject("امکان حذف این مورد وجود ندارد!")
                }
            }).catch(err => {
                console.log('Error while deleting EmplOrderSetting..', err);
                reject()
            });
        })
    }

    const handleOpenModal = (rowData)=>{
        setDataModal(rowData)
        setOpenModal(true)
    }

    return (
        <React.Fragment>
            <Card>
                <CardHeader title="تعریف نسخه احکام کارگزینی"/>
                <CardContent>
                    <EOSForm
                        actionObject={actionObject} setActionObject={setActionObject}
                        tableContent={tableContent} setTableContent={setTableContent}
                        userCompany={userCompany} setUserCompany={setUserCompany}
                        printSettings={printSettings}
                    />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    title="لیست نسخه های احکام کارگزینی"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    edit="callback"
                    editCallback={handleEdit}
                    removeCallback={handleDelete}
                    rowActions={[
                        {
                            title: "پیش نمایش",
                            icon: VisibilityIcon,
                            onClick: row => handleOpenModal(row)
                        }
                    ]}
                />
            </Card>
            <ModalPro
                title={`پیش نمایش ${dataModal.title}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <EmplOrderPrint type={dataModal.printSettingId} data={{
                            printSettingId: dataModal.printSettingId,
                            printSettingTitle: dataModal.title,
                            organizationPartyId: userCompany.userCompanyId
                        }}/>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
