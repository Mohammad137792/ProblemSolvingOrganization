import React from 'react';
import { FusePageSimple } from "@fuse";
import SearchPersonnelForm from "./SearchPersonnelForm";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import Card from "@material-ui/core/Card";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserId, getWorkEffotr } from "../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import TablePro from "../../../components/TablePro";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import MoneyIcon from '@material-ui/icons/Money';
import checkPermis from 'app/main/components/CheckPermision';
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../components/ModalPro";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
import ProfileInfo from './ProfileInfo';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BallotIcon from '@material-ui/icons/Ballot';
import WorkIcon from '@material-ui/icons/Work';
import HealingIcon from '@material-ui/icons/Healing';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import TableProAjax from 'app/main/components/TableProAjax';


const SearchPersonnel = () => {
    // const DefaultValues = {
    //     perStatus: 'ActiveRel',
    //     ownerPartyId: JSON.stringify(useSelector(({ auth }) => auth.user.data.ownerPartyId).toString())
    // }
   const deafultOwnerPartyId= JSON.stringify(useSelector(({ auth }) => auth.user.data.ownerPartyId)?.toString())
    const dispatch = useDispatch();
    const history = useHistory();
    const datas = useSelector(({ fadak }) => fadak);
    const tableCols = [
        { name: "pseudoId", label: "کد پرسنلی", type: "text", style: { width: "80px" } },
        { name: "firstName", label: "نام", type: "render", render: (row) => { return `${row.firstName || ''} ${row.lastName || ''} ${row.suffix || ''}`; }, style: { width: "170px" } },
        { name: "nationalId", label: "کد ملی", type: "text" },
        { name: "birthDate", label: "تاریخ تولد", type: "date" },
        { name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus" },
        { name: "residenceStatusEnumId", label: "وضعیت سکونت", type: "select", options: "ResidenceStatus" },
        { name: "organizationName", label: "شرکت", type: "text" },
    ]
    const [tableContent, setTableContent] = React.useState([]);
    const [printSeting, setPrintSeting] = React.useState([]);
    const [sendData, setSendData] = React.useState({});
    const [sendOwner, setSendOwner] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [modalPreview, set_modalPreview] = React.useState({
        display: false,
        data: null,
    });
    const componentRef = React.useRef();

    function getPersonnel(formDefaultValues) {
        setSendOwner(true)
        setSendData(formDefaultValues)
        // setLoading(true)
        // axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=addressInfo", {
        //     headers: {
        //         'api_key': localStorage.getItem('api_key')
        //     },
        //     params: {
        //         ...filter,
        //         ...(filter.nationalId && { nationalId: filter.nationalId.toString() }),
        //         ...(filter.InCompleteItem && { InCompletePerson: true }),
        //     }
        // }).then(res => {
        //     console.log("ggggggggggggg",res.data.party)
        //     setLoading(false)
        //     setTableContent(res.data.party)
        // }).catch(err => {
        // });
    }


    React.useEffect(() => {
        axios.get(SERVER_URL +"/rest/s1/fadak/party/subOrganization", { headers: {
            'api_key': localStorage.getItem('api_key')
        }}).then((res) => {
            setSendData(prevState=>({
                ...prevState,
                ownerPartyId:JSON.stringify([res.data.organization[0].partyId]),
                perStatus: 'ActiveRel',  
            }))
        }).catch(() => { });
        printList()
    }, []);

    const show_preview = (row) => {
        set_modalPreview({
            display: true,
            data: row,
        });
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onClick = (row) => {
        show_preview(row)
    }

    const printList = () => {
        const obj = {}
        const listP = []
        axios.get(SERVER_URL + "/rest/s1/fadak/getPrintSettOfPerson", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            let data = []
            res.data.printSettingList.map((item, index) => {
                let newItem = Object.assign({}, item, { title: `${item.title}`, icon: { VisibilityIcon }, onClick: { onClick } })
                const obj = { title: item.title, icon: VisibilityIcon, onClick: onClick };
                data.push(obj)
                if (index == res.data.printSettingList.length - 1) {
                    setPrintSeting(data)
                }
            })


        }).catch(err => {
        });
    }

    return (
        <FusePageSimple
            header={<CardHeader title={"جستجوی لیست پرسنل"} />}
            content={
                <Box p={2}>
                    <Card>
                        {/* <TableProAjax
                        columns={tableCols}
                        url={"/s1/fadak/party/search?addressInfo=addressInfo"}
                        showTitleBar={false}
                        fixedLayout={true}
                        filter="external"
                        filterForm={
                            <SearchPersonnelForm getPersonnel={getPersonnel} />
                        }
                        rowActionsDrop={[
                            {
                                IconComponent: PrintIcon,
                                value: printSeting
                                // value: [
                                //     {
                                //         title: "چاپ قوه ",
                                //         icon: VisibilityIcon,
                                //         onClick: (row) => show_preview(row)

                                //     }
                                // ]

                            },
                            {
                                IconComponent: MoreHorizIcon,
                                value: [

                                    checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel", datas) ? {

                                        title: "ویرایش",
                                        icon: EditIcon,
                                        onClick: (row) => {
                                            dispatch(setUser(row.partyId))
                                            dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                                            // history.push(`/personnelBaseInformation`);
                                            history.push({
                                                pathname: "/personnel/profile",
                                                state: {
                                                    partyId: row.partyId,
                                                    partyRelationshipId: row.partyRelationshipId,
                                                    from: "search"
                                                }
                                            });

                                        }
                                    } : {}
                                    ,
                                    {
                                        title: "پروفایل جبران خدمت",
                                        icon: MoneyIcon,
                                        onClick: (row) => {
                                            dispatch(getWorkEffotr(row))
                                            history.push(`/Compensation`);
                                        }
                                    },
                                    {
                                        title: "پروفایل استعدادها",
                                        icon: WbIncandescentIcon,
                                        onClick: (row) => {
                                            dispatch(getWorkEffotr(row))
                                            history.push(`/talentProfile`);
                                        }
                                    },
                                    {
                                        title: "پروفایل کارکرد",
                                        icon: WorkIcon,
                                        onClick: (row) => {
                                            dispatch(getWorkEffotr(row))
                                            history.push(`/performanceProfileForm`);
                                        }
                                    },
                                    {
                                        title: "پروفایل نظرسنجی",
                                        icon: BallotIcon,
                                        onClick: (row) => {
                                            // dispatch(getWorkEffotr(row))
                                            // history.push(`/Compensation`);
                                        }
                                    },
                                    {
                                        title: "پروفایل سلامت وایمنی شغلی",
                                        icon: HealingIcon,
                                        onClick: (row) => {
                                            // dispatch(getWorkEffotr(row))
                                            // history.push(`/Compensation`);
                                        }
                                    }

                                ]

                            }
                        ]}
                    /> */}

{Object.keys(sendData).length !== 0? <TableProAjax
                            columns={tableCols}
                            url={`/s1/fadak/personList?&sendData=${JSON.stringify(sendData)}`}
                            title="لیست پرسنل"
                            rows={tableContent}
                            // setRows={setTableContent}
                            loading={loading}
                            defaultOrderBy="lastName"
                            // rowActions={[
                            //     {
                            //         title: "پیش نمایش",
                            //         icon: VisibilityIcon,
                            //         onClick: (row) => show_preview(row)
                            //     },
                            //     ...(
                            //         checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel", datas) ? [
                            //             {
                            //                 title: "ویرایش",
                            //                 icon: EditIcon,
                            //                 onClick: (row) => {
                            //                     dispatch(setUser(row.partyId))
                            //                     dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                            //                     // history.push(`/personnelBaseInformation`);
                            //                     history.push({
                            //                         pathname: "/personnel/profile",
                            //                         state: {
                            //                             partyId: row.partyId,
                            //                             partyRelationshipId: row.partyRelationshipId,
                            //                             from: "search"
                            //                         }
                            //                     });
                            //                 }
                            //             }
                            //         ] : []
                            //     ),
                            //     {
                            //         title: "پروفایل جبران خدمت",
                            //         icon: MoneyIcon,
                            //         onClick: (row) => {
                            //             dispatch(getWorkEffotr(row))
                            //             history.push(`/Compensation`);
                            //         }
                            //     },
                            // ]}

                            rowActionsDrop={[
                                {
                                    IconComponent: PrintIcon,
                                    value: printSeting
                                    // value: [
                                    //     {
                                    //         title: "چاپ قوه ",
                                    //         icon: VisibilityIcon,
                                    //         onClick: (row) => show_preview(row)

                                    //     }
                                    // ]

                                },
                                {
                                    IconComponent: MoreHorizIcon,
                                    value: [

                                        checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel", datas) ? {

                                            title: "ویرایش",
                                            icon: EditIcon,
                                            onClick: (row) => {
                                                dispatch(setUser(row.partyId))
                                                dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                                                // history.push(`/personnelBaseInformation`);
                                                history.push({
                                                    pathname: "/personnel/profile",
                                                    state: {
                                                        partyId: row.partyId,
                                                        partyRelationshipId: row.partyRelationshipId,
                                                        from: "search"
                                                    }
                                                });

                                            }
                                        } : {}
                                        ,
                                        {
                                            title: "پروفایل جبران خدمت",
                                            icon: MoneyIcon,
                                            onClick: (row) => {
                                                dispatch(getWorkEffotr(row))
                                                history.push(`/Compensation`);
                                            }
                                        },
                                        {
                                            title: "پروفایل استعدادها",
                                            icon: WbIncandescentIcon,
                                            onClick: (row) => {
                                                dispatch(getWorkEffotr(row))
                                                history.push(`/talentProfile`);
                                            }
                                        },
                                        {
                                            title: "پروفایل کارکرد",
                                            icon: WorkIcon,
                                            onClick: (row) => {
                                                dispatch(getWorkEffotr(row))
                                                history.push(`/performanceProfileForm`);
                                            }
                                        },
                                        {
                                            title: "پروفایل نظرسنجی",
                                            icon: BallotIcon,
                                            onClick: (row) => {
                                                // dispatch(getWorkEffotr(row))
                                                // history.push(`/Compensation`);
                                            }
                                        },
                                        {
                                            title: "پروفایل سلامت وایمنی شغلی",
                                            icon: HealingIcon,
                                            onClick: (row) => {
                                                // dispatch(getWorkEffotr(row))
                                                // history.push(`/Compensation`);
                                            }
                                        }

                                    ]

                                }
                            ]}

                            filter="external"
                            filterForm={
                                <SearchPersonnelForm getPersonnel={getPersonnel} />
                            }
                            exportCsv="لیست پرسنل"
                        />:""}
                    </Card>


                    <ModalPro
                        title={`اطلاعات پرسنلی`}
                        // title={`پیش نمایش ${modalPreview.data?.title}`}
                        open={modalPreview.display}
                        setOpen={(val) =>
                            set_modalPreview((prevState) => ({ ...prevState, display: val }))
                        }
                        content={
                            <Box p={5}>
                                <div ref={componentRef}>
                                    <ProfileInfo loadData={modalPreview.data} />
                                </div>
                            </Box>
                        }
                        headerActions={[{
                            title: "چاپ",
                            icon: PrintIcon,
                            onClick: handlePrint
                        }]}
                    />
                </Box>
            }
        />
    );
}

export default SearchPersonnel;
