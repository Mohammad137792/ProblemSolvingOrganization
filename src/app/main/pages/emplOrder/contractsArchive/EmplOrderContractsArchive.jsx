import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import EOCAFilterForm from "./EOCAFilterForm";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {setUser, setUserId} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PersonIcon from '@material-ui/icons/Person';
import ModalPro from "../../../components/ModalPro";
import Box from "@material-ui/core/Box";
import EmplOrderContractPrint from "../contractsPrint/EmplOrderContractPrint";
import PrintIcon from "@material-ui/icons/Print";
import {useReactToPrint} from "react-to-print";
import PrintSheet from "../../../components/PrintSheet";

export default function EmplOrderContractsArchive (){
    const dispatch = useDispatch();
    const history = useHistory();
    const [openModal, setOpenModal] = React.useState(false);
    const [dataModal, setDataModal] = React.useState({});
    const [formDefaultValues, setFormDefaultValues] = useState({statusId: "ActiveAgr"});
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {width:"80px"}},
        {name: "firstName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text"},
        {name: "code", label: "شماره قرارداد", type: "text"},
        {name: "statusId", label: "وضعیت قرارداد", type: "indicator", indicator: {true: "ActiveAgr", false: "NotActiveAgr"}},
        {name: "agreementDate", label: "تاریخ عقد قرارداد", type: "date"},
        {name: "thruDate", label: "تاریخ اعتبار قرارداد", type: "date"},
        {name: "agreementType", label: "نوع قرارداد", type: "text"},
        {name: "emplPositionTitle", label: "پست سازمانی", type: "text"},
        {name: "jobTitle", label: "شغل", type: "text"},
        {name: "payrollFactorTotalSum", label: "جمع حقوق و مزایا", type: "text"},
    ]
    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    function search(filter=formDefaultValues) {
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/emplOrder/agreement/archive", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                ...filter,
                ...(filter.nationalId && {nationalId: filter.nationalId.toString()}),
            }
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.agreements)
        }).catch(() => {
            setLoading(false)
        });
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/party/subOrganization",{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then( res => {
            const defaultFilter = {
                agrStatusId: "ActiveAgr",
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
                    title="لیست قراردادها"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    defaultOrderBy="lastName"
                    loading={loading}
                    filter="external"
                    filterForm={
                        <EOCAFilterForm search={search} formDefaultValues={formDefaultValues}/>
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
                            title: "نمایش قرارداد",
                            icon: VisibilityIcon,
                            onClick: (row) => handleOpenModal(row)
                        }
                    ]}
                />
            </Card>
            <ModalPro
                title={`قرارداد ${dataModal.firstName||''} ${dataModal.lastName||''}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <div ref={componentRef}>
                            <EmplOrderContractPrint agreementId={dataModal.agreementId} type={dataModal.version} data={dataModal}/>
                        </div>
                    </Box>
                }
                headerActions={[{
                    title: "چاپ قرارداد",
                    icon: PrintIcon,
                    onClick: handlePrint
                }]}
            />
        </React.Fragment>
    )
}

