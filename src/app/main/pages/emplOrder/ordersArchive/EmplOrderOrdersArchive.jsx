import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import FilterForm from "./EOOAFilterForm";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import {ALERT_TYPES, setAlertContent, setUser, setUserId} from "../../../../store/actions/fadak";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Box from "@material-ui/core/Box";
import EmplOrderPrint from "../ordersPrint/EmplOrderPrint";
import ModalPro from "../../../components/ModalPro";

export default function EmplOrderContractsArchive (){
    const dispatch = useDispatch();
    const history = useHistory();
    const [openModal, setOpenModal] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});
    const [formDefaultValues, setFormDefaultValues] = useState({statusId: "Y"});
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {width:"80px"}},
        {name: "firstName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text"},
        {name: "emplOrderCode", label: "شماره حکم", type: "text"},
        {name: "statusId", label: "وضعیت حکم", type: "indicator", indicator: {true: "ActiveEmplOrder", false: "NotActiveEmplOrder"}},
        {name: "orderDate", label: "تاریخ صدور", type: "date"},
        {name: "fromDate", label: "تاریخ اجرا", type: "date"},
        {name: "thruDate", label: "تاریخ اعتبار حکم", type: "date"},
        {name: "AgreementType", label: "نوع قرارداد", type: "text"},
        {name: "employmentDate", label: "تاریخ استخدام", type: "date"},
        {name: "emplPositionTitle", label: "پست سازمانی", type: "text"},
        {name: "jobTitle", label: "شغل", type: "text"},
        {name: "oldPayrollFactorTotalSum", label: "جمع حقوق و مزایا حکم قبلی", type: "text",},
        {name: "payrollFactorTotalSum", label: "جمع حقوق و مزایا", type: "text"},
    ]
    function search(filter=formDefaultValues) {
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/fadak/emplOrder/archive", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                ...filter,
                ...(filter.nationalId && {nationalId: filter.nationalId.toString()}),
            }
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.orders)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
            setLoading(false)
            setTableContent([])
        });
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/party/subOrganization",{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then( res => {
            const defaultFilter = {
                statusId: "ActiveEmplOrder",
                organizationPartyId: JSON.stringify([res.data.organization[0].partyId])
            }
            setFormDefaultValues(defaultFilter);
            search(defaultFilter)
        }).catch(() => {
        });
    },[]);

    const handleOpenModal = (rowData)=>{
        setDataModal(rowData)
        setOpenModal(true)
    }

    return (
        <React.Fragment>
            <Card>
                <TablePro
                    title="لیست احکام کارگزینی"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    defaultOrderBy="lastName"
                    loading={loading}
                    filter="external"
                    filterForm={
                        <FilterForm search={search} formDefaultValues={formDefaultValues}/>
                    }
                    rowActions={[
                        {
                            title: "نمایش کاربر",
                            icon: PersonIcon,
                            onClick: (row)=>{
                                dispatch(setUser(row.partyId))
                                dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                                history.push(`/personnelBaseInformation`);
                            }
                        }, {
                            title: "نمایش حکم",
                            icon: VisibilityIcon,
                            onClick: (row) => handleOpenModal(row)
                        }
                    ]}
                    exportCsv="لیست احکام کارگزینی"
                />
            </Card>
            <ModalPro
                title={`حکم کارگزینی ${dataModal.firstName} ${dataModal.lastName}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <EmplOrderPrint type={"EmplOrderPrintDefault"} data={{
                            printSettingTitle: "نسخه کارمند",
                            ...dataModal
                        }}/>
                    </Box>
                }
            />
        </React.Fragment>
    )
}

