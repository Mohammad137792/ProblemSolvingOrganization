import React, { useState, useEffect } from 'react';
import axios from "axios";

// import { useDispatch, useSelector } from "react-redux";

// import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Collapse } from '@material-ui/core';
// import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ModalPro from "../../../../components/ModalPro";
// import ActionBox from 'app/main/components/ActionBox';
// import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';
// import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
// import Tooltip from "@material-ui/core/Tooltip";
// import ToggleButton from "@material-ui/lab/ToggleButton";
// import AddBoxIcon from '@material-ui/icons/AddBox';
// import CheckSuggestion from 'app/main/pages/tasks/forms/suggestion/rewierSuggestion/tabs/CheckSuggestion';
import ReviewerInfo from './ReviewerInfo';
import checkPermis from 'app/main/components/CheckPermision';
import { useSelector } from 'react-redux';



const ReviewResults = (props) => {
    const {
        tableContent, setTableContent, loading
    } = props
    

    const [expanded, setExpanded] = useState(false);
    const [reviewerType, setReviewerType] = useState([])
    const [rowData, setRowData] = useState([])
    // const [modalFormValues, setModalFormValues] = useState([]);
    // const [formValuesScore, setFormValuesScore] = useState([]);
    // const [formValuesChecker, setFormValuesCheker] = useState([]);
    // const [oldVerificationTableContent, setOldVerificationTableContent] = useState([]);
    // const [formValidation, setFormValidation] = useState([]);
    // const [reviewer, setReviewer] = useState([{ id: "1", description: "کمیته" }, { id: "2", description: "کارشناس" }, { id: "3", description: "سایر" }]);
    // const dispatch = useDispatch()

    // const [verificationTableContent, setVerificationTableContent] = useState([]);
    // const [organizationUnit, setOrganizationUnit] = useState([]);
    // const [expertFormValues, setExpertFormValues] = useState([]);
    // const [OtherFormValues, setOtherFormValues] = useState([]);
    // const [showAddVerificationList, setShowAddVerificationList] = useState(false);
    const datas = useSelector(({ fadak }) => fadak);



    
    
    const tableCols = [
        { name: "sequence", label: "   ترتیب تایید", type: "text", style: { minWidth: "130px" , "text-align": "center"} },
        { name: "reviewerTypeEnumId", label: "   عنوان بررسی کننده ", type: "select", style: { minWidth: "130px", "text-align": "center" }, options: reviewerType, optionLabelField: "description", optionIdField: "enumId"},
        checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab/company", datas)? { name: "companyName", label: "   شرکت ", type: "text", style: { minWidth: "130px", "text-align": "center" } }:{ style: {display:"none" } },
        checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab/pseudoId", datas)?{ name: "pseudoId", label: "  کد پرسنلی  ", type: "text", style: { minWidth: "130px", "text-align": "center" } }:{ style: {display:"none" } },
        checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab/fullName", datas)?{ name: "userFullName", label: "  نام و نام خانوادگی  ", type: "text", style: { minWidth: "130px", "text-align": "center" } }:{ style: {display:"none" } },
        checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab/unit", datas)?{ name: "unitName", label: "   واحد سازمانی ", type: "text", style: { minWidth: "130px", "text-align": "center" } }:{ style: {display:"none" } },
        checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab/position", datas)? { name: "emplPositionDescription", label: "  پست سازمانی  ", type: "text", style: { minWidth: "130px", "text-align": "center" } }:{ style: {display:"none" } },
        { name: "reviewDeadLineDate", label: "   مهلت بررسی ", type: "date", style: { minWidth: "130px", "text-align": "center" } },
        { name: "actualReviewDate", label: "   تاریخ بررسی ", type: "date", style: { minWidth: "160px", "text-align": "center" } },
    ]





    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewer", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setReviewerType(res.data.result)
        }).catch(err => {
        });


    }



    useEffect(() => {
        getEnum();

    }, []);


    // const getOrgInfo = () => {
    //     let listMap = ["unit", "positions", "employees", "roles"]
    //     axios
    //         .get(
    //             SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap,
    //             axiosKey
    //         )
    //         .then((res) => {
    //             const orgMap = {
    //                 units: res.data.contacts.unit,
    //                 subOrgans: res.data.contacts.orgs,
    //                 roles: res.data.contacts.roles,
    //                 positions: res.data.contacts.positions,
    //                 employees: res.data.contacts.employees,
    //             };
    //             setOrganizationUnit(orgMap);
    //         })
    //         .catch(() => {
    //             dispatch(
    //                 setAlertContent(
    //                     ALERT_TYPES.WARNING,
    //                     "مشکلی در دریافت اطلاعات رخ داده است."
    //                 )
    //             );
    //         });
    // }



    return (
        <Card>
            <CardContent>
                    <TablePro
                        title="   جدول نتایج بررسی کنندگان پیشنهاد   "
                        columns={tableCols}
                        // rows={tableContent}
                        rows = {tableContent}
                        setTableContent={setTableContent}
                        loading={loading}
                        rowActions={[
                            {
                                title: "مشاهده",
                                icon: VisibilityIcon,
                                onClick: (row)=> {
                                    setExpanded(prevState => !prevState)
                                    setRowData(row)
                                }
                            }
                        ]}
                    />
                </CardContent>

                {expanded ?
                    <CardContent style={{margin: "100px"}}>
                        <ModalPro
                            title="مشاهده نتیجه ارزیابی"
                            titleBgColor={"#3C4252"}
                            titleColor={"#dddddd"}
                            open={[]}
                            setOpen={() => setExpanded(false)}
                            content={
                                <Box p={2}>
                                    <Card>
                                        <CardContent>
                                            <ReviewerInfo
                                                formsData={rowData}
                                            />
                                        </CardContent>
                                    </Card>
                                </Box>
                            }
                        />
                    </CardContent>
                : ""}
        </Card>
    )
}








export default ReviewResults;












