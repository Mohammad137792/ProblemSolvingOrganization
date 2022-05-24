import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import axios from "../../../api/axiosRest";
import Card from "@material-ui/core/Card";
import TablePro from "../../../components/TablePro";
import FilterForm from "./QAFilter";
import PersonIcon from "@material-ui/icons/Person";
import {setUser, setUserId} from "../../../../store/actions/fadak";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../components/ModalPro";
import Box from "@material-ui/core/Box";
import EmplOrderPrint from "../../emplOrder/ordersPrint/EmplOrderPrint";
import EditIcon from '@material-ui/icons/Edit';
import PostAddIcon from "@material-ui/icons/PostAdd";
import checkPermis from "../../../components/CheckPermision";

const formDefaultValues = {}

export const render_version = (row) => {
    if(!row.version) return "-"
    const version = row.version.toString()
    const major = version.slice(0,-1)||"0"
    const minor = version.slice(-1)
    return `${major}.${minor}`
}

export default function QATable() {
    // const dispatch = useDispatch();
    const datas = useSelector(({ fadak }) => fadak);
    const history = useHistory();
    // const [openModal, setOpenModal] = React.useState(false);
    // const [dataModal, setDataModal] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const tableCols = [
        {name: "name", label: "نام پرسشنامه", type: "text", style: {width: "35%"}},
        {name: "categoryEnumId", label: "گروه", type: "select", options: "QuestionnaireCategory"},
        {name: "subCategoryEnumId", label: "زیرگروه", type: "select", options: "QuestionnaireCategory"},
        {name: "version", label: "نسخه", type: "render", render: render_version},
        {name: "lastUpdatedStamp", label: "تاریخ آخرین بروزرسانی", type: "date", style: {width: "120px"}},
    ]

    const delete_questionnaire = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete("/s1/questionnaire/"+row.questionnaireKey).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    function search(filter=formDefaultValues) {
        setLoading(true)
        axios.get("/s1/questionnaire/archive", {
            params: filter
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.questionnaires)
        }).catch(() => {
            setLoading(false)
        });
    }

    React.useEffect(()=>{
        search()
    },[]);

    // const handleOpenModal = (rowData)=>{
    //     setDataModal(rowData)
    //     setOpenModal(true)
    // }

    return (
        <React.Fragment>
            <Card>
                <TablePro
                    title="لیست پرسشنامه ها"
                    columns={tableCols}
                    defaultOrderBy="lastUpdatedStamp"
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    removeCallback={checkPermis("questionnaire/archive/delete", datas) ? delete_questionnaire : null}
                    filter="external"
                    filterForm={
                        <FilterForm search={search} formDefaultValues={formDefaultValues}/>
                    }
                    actions={[
                        ...checkPermis("questionnaire/editor/create", datas) && [{
                            title: "طراحی پرسشنامه جدید",
                            icon: PostAddIcon,
                            onClick: ()=> {
                                history.push(`/questionnaire/editor`);
                            }
                        }] || []
                    ]}
                    rowActions={[
                        ...checkPermis("questionnaire/archive/edit", datas) && [{
                            title: "ویرایش",
                            icon: EditIcon,
                            onClick: (row)=>{
                                history.push(`/questionnaire/editor?id=${row.questionnaireId}`);
                            }
                        }] || []
                        //     , {
                    //         title: "نمایش حکم",
                    //         icon: VisibilityIcon,
                    //         onClick: (row) => handleOpenModal(row)
                    //     }
                    ]}
                />
            </Card>
            {/*<ModalPro*/}
            {/*    title={`حکم کارگزینی ${dataModal.firstName} ${dataModal.lastName}`}*/}
            {/*    open={openModal}*/}
            {/*    setOpen={setOpenModal}*/}
            {/*    content={*/}
            {/*        <Box p={5}>*/}
            {/*            <EmplOrderPrint type={"EmplOrderPrintDefault"} data={{*/}
            {/*                printSettingTitle: "نسخه کارمند",*/}
            {/*                ...dataModal*/}
            {/*            }}/>*/}
            {/*        </Box>*/}
            {/*    }*/}
            {/*/>*/}
        </React.Fragment>
    )
}
