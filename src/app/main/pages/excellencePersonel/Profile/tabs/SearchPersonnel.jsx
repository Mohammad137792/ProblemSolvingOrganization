import React from 'react';
import { FusePageSimple } from "@fuse";
import SearchPersonnelForm from "./SearchPersonnelForm";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import Card from "@material-ui/core/Card";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserId,getWorkEffotr } from "../../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import TablePro from "../../../../components/TablePro";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import MoneyIcon from '@material-ui/icons/Money';
import checkPermis from 'app/main/components/CheckPermision';

const formDefaultValues = {
    partyDisabled: "N",
}

const SearchPersonnel = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const datas = useSelector(({ fadak }) => fadak);
    const tableCols = [
        { name: "pseudoId", label: "عنوان پرسشنامه", type: "text", },
        { name: "firstName", label: "نوع پرسشنامه", type: "render" },
        { name: "nationalId", label: "تاریخ سررسید", type: "date" },
        { name: "birthDate", label: "توضیحات", type: "text" },
        { name: "maritalStatusEnumId", label: "وضعیت", type: "text" },
        
    ]
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    function getPersonnel(filter = formDefaultValues) {
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=addressInfo", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...filter,
                ...(filter.nationalId && { nationalId: filter.nationalId.toString() }),
                ...(filter.InCompleteItem && { InCompletePerson: true }),
            }
        }).then(res => {
            setLoading(false)
            // setTableContent(res.data.party)
        }).catch(err => {
            console.log('get person error..', err);
        });
    }

    React.useEffect(() => {
        getPersonnel()
    }, []);

    return (
        <FusePageSimple
            // header={<CardHeader title={"جستجوی لیست پرسنل"} />}
            content={
                <Box p={2}>
                    <Card>
                        <TablePro
                            title="فیلتر پرسشنامه"
                            columns={tableCols}
                            rows={tableContent}
                            loading={loading}
                            defaultOrderBy="lastName"
                            // rowActions={checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel" ,datas) ? [
                            //     {
                            //         title: "ویرایش",
                            //         icon: EditIcon,
                            //         onClick: (row)=>{
                            //             dispatch(setUser(row.partyId))
                            //             dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                            //             history.push(`/personnelBaseInformation`);
                            //         }
                            //     },
                            //     {
                            //         title: "پروفایل جبران خدمت",
                            //         icon: MoneyIcon,
                            //         onClick: (row) => {
                            //             dispatch(getWorkEffotr(row))
                            //             history.push(`/Compensation`);
                            //         }
                            //     }
                            // ]
                            // :[]}

                            // rowActions={[
                            //     {
                            //         title: "ویرایش",
                            //         icon: EditIcon,
                            //         onClick: (row) => {
                            //             dispatch(setUser(row.partyId))
                            //             dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                            //             history.push(`/personnelBaseInformation`);
                            //         }
                            //     },

                            //     {
                            //         title: "پروفایل جبران خدمت",
                            //         icon: MoneyIcon,
                            //         onClick: (row) => {
                            //             dispatch(getWorkEffotr(row))
                            //             history.push(`/Compensation`);
                            //         }
                            //     }

                            // ]}

                            filter="external"
                            filterForm={
                                <SearchPersonnelForm getPersonnel={getPersonnel} />
                            }
                            exportCsv="لیست پرسنل"
                        />
                    </Card>
                </Box>
            }
        />
    );
}

export default SearchPersonnel;
