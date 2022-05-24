
import React, { useEffect, useState } from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";

import { Box, Button, Card, CardContent, CardHeader, makeStyles } from '@material-ui/core'
import ActionBox from 'app/main/components/ActionBox';
import VerificationLevel from './Tab/VerificationLevel';
import CasesAllowedChange from './Tab/CasesAllowedChange';
import TabPro from 'app/main/components/TabPro';
import axios from "../../../api/axiosRest";
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { useDispatch } from 'react-redux';
import VisibilityIcon from "@material-ui/icons/Visibility";
import CommunicationForm from './CommunicationForm';
import ModalPro from "../../../components/ModalPro";


const InfoChangeTypeForm = (props) => {
    const [tableContent, setTableContent] = useState([])
    const [formValues, setFormValues] = useState([])
    const [formValidation, setFormValidation] = useState([])
    const [showTab, setShowTab] = useState(false)
    const [infoChangeTypeStatusId, setInfoChangeTypeStatusId] = useState([])
    const [unit, setUnit] = useState([])
    const [settingType, setSettingType] = useState([])
    const [loading, setLoading] = useState(true)
    const [formValuesSearch, setFormValuesSearch] = useState([])
    const [btnName, setbtnName] = useState("افزودن")
    const [infoChangeTypeId, setInfoChangeTypeId] = useState([])
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});


    const formStructure = [
        {
            name: "changeTypeIdTitle",
            label: "عنوان نوع تغییر",
            type: "text",
        }, {
            name: "infoChangeTypeEnumId",
            label: "نوع تغییر اطلاعات   ",
            type: "select",
            options: "InfoChange",
            optionLabelField: "description",
            optionIdField: "enumId",

        },
        {
            name: "infoChangeTypeStatusId",
            label: "وضعیت نوع تغییر  ",
            type: "select",
            options: infoChangeTypeStatusId,
            optionLabelField: "description",
            optionIdField: "statusId",
        },

        {
            name: "includeAnn",
            label: " وضعیت ابلاغ",
            type: "indicator",
            options: [],

        },
        {
            name: "unit",
            label: " واحد سازمانی صادر کننده ابلاغ ",
            type: "select",
            options: unit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            display: formValues.includeAnn === "Y" ? true : false,


        },
        {
            name: "emplPositionId",
            label: " پست مسئول صادرکننده ابلاغ ",
            type: "select",
            options: unit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            display: formValues.includeAnn === "Y" ? true : false,
            filterOptions: options => formValues["unit"] ? options.filter((o) => {
                let list = unit.units.find(x => x.unitPartyId == formValues["unit"])
                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :
                options,



        },
        {
            name: "printSettingId",
            label: " نوع نسخه فرم    ",
            type: "select",
            options: settingType,
            optionLabelField: "title",
            optionIdField: "settingId",
            display: formValues.includeAnn === "Y" ? true : false,



        },
        {
            name: "annTitle",
            label: " عنوان فرم ابلاغیه ",
            type: "text",
            display: formValues.includeAnn === "Y" ? true : false,



        },


    ]

    const tableCols = [
        {
            name: "changeTypeIdTitle",
            label: "عنوان نوع تغییر",
            type: "text",
        }, {
            name: "infoChangeTypeEnumId",
            label: "نوع تغییر اطلاعات   ",
            type: "select",
            options: "InfoChange",
            optionLabelField: "description",
            optionIdField: "enumId",

        },
        {
            name: "infoChangeTypeStatusId",
            label: "وضعیت نوع تغییر  ",
            type: "select",
            options: infoChangeTypeStatusId,
            optionLabelField: "description",
            optionIdField: "statusId",
        },

        {
            name: "includeAnn",
            label: " وضعیت ابلاغ",
            type: "indicator",
            options: [],

        },
    ]

    const tabs = [{
        label: "مراتب تایید",
        panel: <VerificationLevel unit={unit} infoChangeTypeId={infoChangeTypeId} />
    }, {
        label: "موارد مجاز جهت تغییر",
        panel: <CasesAllowedChange infoChangeTypeId={infoChangeTypeId} />
    }]

    const getSelect = () => {
        axios
            .get("/s1/fadak/entity/StatusItem?statusTypeId=InfoChangeType").then((res) => {
                let newList = res.data.status;
                newList = newList.sort((a, b) =>
                    a.sequenceNum > b.sequenceNum
                        ? 1
                        : a.sequenceNum < b.sequenceNum
                            ? -1
                            : 0
                );
                setInfoChangeTypeStatusId(newList)
            })
            .catch(() => {
            });

        axios
            .get("/s1/fadak/getPrintSettOfPerson").then((res) => {

                setSettingType(res.data.printSettingList)
            })
            .catch(() => {
            });


        axios
            .get("/s1/fadak/allCompaniesFilter?isLoggedInUserData=true").then((res) => {
                const orgMap = {
                    units: res.data.data.units,
                    subOrgans: res.data.data.companies,
                    positions: res.data.data.emplPositions,
                    employees: res.data.data.persons,
                };
                setUnit(orgMap);
            })
            .catch(() => {
            });
    }


    useEffect(() => {
        getSelect()
    }, []);

    useEffect(() => {
        if (formValues.infoChangeTypeEnumId === "ICPersonalInfo")
            setFormValues(prevState => ({
                ...prevState,
                includeAnn: "Y"
            }))
        else {
            setFormValues(prevState => ({
                ...prevState,
                includeAnn: "N"
            }))
        }
    }, [formValues.infoChangeTypeEnumId]);



    const getInfoChangeType = (filterParam) => {
        axios.get("/s1/communication/getInfoChangeType", {
            params: {
                changeTypeIdTitle: filterParam.changeTypeIdTitle ? filterParam.changeTypeIdTitle : "",
                infoChangeTypeEnumId: filterParam.infoChangeTypeEnumId ? filterParam.infoChangeTypeEnumId : "",
                infoChangeTypeStatusId: filterParam.infoChangeTypeStatusId ? filterParam.infoChangeTypeStatusId : "",
                includeAnn: filterParam.includeAnn ? filterParam.includeAnn : "",
            }
        }).then(res => { /* todo: rest? */
            setLoading(false)
            setTableContent(res.data.result);
        }).catch(() => {
        });


    }

    useEffect(() => {
        getInfoChangeType({})
    }, [loading]);

    const handleSubmit = () => {
        if (!formValues.includeAnn)
            setFormValues(prevState => ({
                ...prevState, includeAnn: "N"
            })

            )
        axios.post("/s1/communication/saveInfoChangeType", { data: formValues }).then((res) => {
            setInfoChangeTypeId(res.data.infoChangeTypeId)
            setLoading(true)
            setShowTab(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
            setFormValues([])
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        })
    }

    const submitSearch = () => {

        if (!formValuesSearch.includeAnn) {
            setFormValuesSearch(prevState => ({
                ...prevState, formValuesSearch: "N"
            }))
        }
        getInfoChangeType(formValuesSearch)

    }

    const handleReset = () => {
        setFormValues([])
        setShowTab(false)
        setbtnName("افزودن")
    }

    const handleResetS = () => {
        setFormValuesSearch([])
        getInfoChangeType({})
    }

    const handleEdit = (row) => {
        setInfoChangeTypeId(row.infoChangeTypeId)
        setFormValues(row)
        setbtnName("ویرایش")
        setShowTab(true)
    }
    const handleOpenModal = (rowData) => {
        rowData.title= settingType.find(item=>item.settingId===rowData.printSettingId)?.title
        
        setDataModal(rowData)
        setOpenModal(true)
    }

    return (
        <>
            <Card>
                <CardContent style={{ padding: 10 }}>
                    <FormPro
                        formValues={formValues}
                        setFormValues={setFormValues}
                        append={formStructure}
                        formValidation={formValidation}
                        setFormValidation={setFormValidation}
                        submitCallback={handleSubmit}
                        resetCallback={handleReset}
                        actionBox={
                            <ActionBox>
                                <Button type="submit" role="primary">{btnName}</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>
                        }
                    />
                    {showTab ? <TabPro tabs={tabs} /> : ""}
                </CardContent>

            </Card>
            <TablePro
                title="   لیست انواع درخواست   "
                columns={tableCols}
                rows={tableContent}
                exportCsv="خروجی اکسل"
                edit="callback"
                editCallback={handleEdit}
                filter="external"
                loading={loading}
                filterForm={<FilterForm submitSearch={submitSearch} handleResetS={handleResetS} infoChangeTypeStatusId={infoChangeTypeStatusId} formValuesSearch={formValuesSearch} setFormValuesSearch={setFormValuesSearch} />}
                rowActions={[
                    {
                        title: "پیش نمایش فرم",
                        icon: VisibilityIcon,
                        onClick: (row) => handleOpenModal(row)
                    }
                ]}

            />
            <ModalPro
                title={`پیش نمایش ${dataModal.title}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <CommunicationForm />
                }
            />

        </>
    )
}



const FilterForm = (props) => {
    const { submitSearch, handleResetS, infoChangeTypeStatusId, formValuesSearch, setFormValuesSearch } = props

    const formStructure = [
        {
            name: "changeTypeIdTitle",
            label: "عنوان نوع تغییر",
            type: "text",
        }, {
            name: "infoChangeTypeEnumId",
            label: "نوع تغییر اطلاعات   ",
            type: "select",
            options: "InfoChange",
            optionLabelField: "description",
            optionIdField: "enumId",

        },
        {
            name: "infoChangeTypeStatusId",
            label: "وضعیت نوع تغییر  ",
            type: "select",
            options: infoChangeTypeStatusId,
            optionLabelField: "description",
            optionIdField: "statusId",
        },

        {
            name: "includeAnn",
            label: " وضعیت ابلاغ",
            type: "indicator",
            options: [],

        },
    ]
    return (
        <Box p={2}>
            <Card variant="outlined">
                <CardContent>
                    <FormPro formValues={formValuesSearch} setFormValues={setFormValuesSearch}
                        append={formStructure}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">جستجو</Button>
                            <Button type="reset" role="secondary">لغو</Button>
                        </ActionBox>}
                        submitCallback={submitSearch} resetCallback={handleResetS}
                    />
                </CardContent>
            </Card>

        </Box>


    )
}


export default InfoChangeTypeForm;



// import React from "react";
// import TableProBase from "./TableProBase";
// import PropTypes from "prop-types";
// import {withStyles} from "@material-ui/styles";
// import {useStyles} from "./TablePro";
// import TablePagination from "@material-ui/core/TablePagination";
// import axios from "src/app/main/api/axiosRest";
// import TableBody from "@material-ui/core/TableBody";

// class TableProAjax extends TableProBase{
//     constructor(props) {
//         super(props);
//         // this.defaultTexts = {
//         //     removeDialog: "آیا از حذف این ردیف اطمینان دارید؟",
//         //     removeAlertSuccess: "ردیف مورد نظر با موفقیت حذف شد.",
//         //     removeAlertFailed: "خطا در عملیات حذف!",
//         //     editAlertSuccess: "تغییرات ردیف مورد نظر با موفقیت انجام شد.",
//         //     editAlertFailed: "خطا در عملیات ویرایش!",
//         //     addAlertSuccess: "ردیف مورد نظر با موفقیت اضافه شد.",
//         //     addAlertFailed: "خطا در عملیات افزودن!",
//         //     alertFormRequired: "باید تمام فیلدهای ضروری وارد شوند!",
//         // }
//         this.state = {
//             order:          "asc",
//             orderBy:        "",
//             rowsPerPage:    5,
//             page:           0,
//             rows:           [],
//             count:          0,
//             formData:       {},
//             showForm:       null,
//             showFilter:     false,
//             showAddForm:    false,
//             loading:        true,
//         }
//     }

//     static propTypes = {
//         texts:          PropTypes.objectOf(PropTypes.string),
//         className:      PropTypes.string,
//         url:            PropTypes.string,
//         title:          PropTypes.string,
//         defaultOrderBy: PropTypes.string,
//         columns:        PropTypes.arrayOf(PropTypes.object).isRequired,
//         setRows:        PropTypes.func,
//         selectedRows:   PropTypes.arrayOf(PropTypes.object),
//         setSelectedRows:PropTypes.func,
//         isSelected:     PropTypes.func,
//         size:           PropTypes.oneOf(["small","medium"]),
//         showTitleBar:   PropTypes.bool,
//         showRowNumber:  PropTypes.bool,
//         rowNumberWidth: PropTypes.string,
//         fixedLayout:    PropTypes.bool,
//         removeCallback: PropTypes.func,
//         selectable:     PropTypes.bool,
//         singleSelect:   PropTypes.bool,
//         actions:        PropTypes.arrayOf(PropTypes.object),
//         rowActions:     PropTypes.arrayOf(PropTypes.object),
//         filter:         PropTypes.oneOf([false, "external"]),
//         filterForm:     PropTypes.node,
//         // add:            PropTypes.oneOf([false, "external", "inline"]),
//         // addForm:        PropTypes.node,
//         // addCallback:    PropTypes.func,
//         // edit:           PropTypes.oneOf([false, "external", "inline", "callback"]),
//         // editForm:       PropTypes.node,
//         // editCallback:   PropTypes.func,
//         exportCsv:      PropTypes.string,
//         csvRenderer:    PropTypes.func,
//     }

//     updateRows = (pageIndex=0, pageSize=this.state.rowsPerPage) => {
//         this.setState({
//             loading: true,
//             rowsPerPage: pageSize
//         });
//         axios.get(this.props.url, {
//             params: {
//                 pageIndex: pageIndex,
//                 pageSize: pageSize,
//                 orderByField: this.state.orderBy,
//                 order: this.state.order,
//             }
//         }).then(res => {
//             this.setState({
//                 page: pageIndex,
//                 rows: res.data.rows,
//                 count: res.data.count,
//                 loading: false
//             });
//         }).catch(() => {
//             this.setState({
//                 loading: false
//             });
//         });
//     }

//     shouldComponentUpdate(nextProps, nextState, nextContext) {
//         return true
//     }
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if(prevState.order!==this.state.order || prevState.orderBy!==this.state.orderBy || prevProps.url!==this.props.url){
//             this.updateRows(this.state.page,this.state.rowsPerPage)
//         }
//     }

//     componentDidMount() {
//         this.updateRows()
//     }

//     RenderRemindRow() {
//         const { columns, pagination, selectable, showRowNumber} = this.props;
//         const { rowsPerPage, rows} = this.state;
//         const colsCount = columns.length + (showRowNumber?1:0) + (selectable?1:0)
//         const RowRem = this.RowRem.bind(this)
//         const rem = rowsPerPage - rows.length;
//         const remRowsHeight = `${53 * rem}px`;
//         if(pagination && rem>0)
//             return <RowRem colSpan={colsCount} height={remRowsHeight}/>
//         else return null
//     }
//     RenderRows ({rows}){
//         const {rowsPerPage, page} = this.state;
//         const TRow = this.TRow.bind(this)
//         return rows.map((rowData, index) => (
//                     <TRow key={index} index={page * rowsPerPage + index} rowData={rowData}/>
//                 )
//             )
//     }
//     TBody = ()=>{
//         const { columns, selectable, showRowNumber, pagination} = this.props;
//         const { rowsPerPage, rows, loading} = this.state;
//         const rowsHeight = pagination ? `${53 * rowsPerPage}px` : "53px";
//         const colsCount = columns.length + (showRowNumber?1:0) + (selectable?1:0)
//         const RowLoading = this.RowLoading.bind(this)
//         const RowEmpty = this.RowEmpty.bind(this)
//         const RenderRows = this.RenderRows.bind(this)
//         const RenderRemindRow = this.RenderRemindRow.bind(this)
//         return(
//             <TableBody>
//                 {loading ? (
//                     <RowLoading colSpan={colsCount} height={rowsHeight}/>
//                 ): rows.length>0 ?(
//                     <>
//                         <RenderRows rows={rows}/>
//                         <RenderRemindRow/>
//                     </>
//                 ):(
//                     <RowEmpty colSpan={colsCount} height={rowsHeight}/>
//                 )}
//             </TableBody>
//         )
//     }
//     Pagination = ()=>{
//         const handleChangePage = (event, newPage) => {
//             this.updateRows(newPage)
//         };
//         const handleChangeRowsPerPage = (event) => {
//             this.updateRows(0, parseInt(event.target.value, 10))
//             this.setState({
//                 page: 0,
//                 rowsPerPage: parseInt(event.target.value, 10)
//             });
//         };
//         return(
//             <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={this.state.count}
//                 rowsPerPage={this.state.rowsPerPage}
//                 page={this.state.page}
//                 onChangePage={handleChangePage}
//                 onChangeRowsPerPage={handleChangeRowsPerPage}
//                 backIconButtonText="صفحه قبلی"
//                 nextIconButtonText="صفحه بعدی"
//                 labelRowsPerPage="میزان نمایش در هر صفحه"
//                 labelDisplayedRows={({from, to, count}) => (` نمایش ${from} - ${to} از ${count} داده `)}
//             />
//         )
//     }
// }

// export default withStyles(useStyles)(TableProAjax);
