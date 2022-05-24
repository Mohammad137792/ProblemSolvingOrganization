import React, { useState, useEffect } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ToggleButton from "@material-ui/lab/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Dialog } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ModalPro from "app/main//components/ModalPro";
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListProAccordion from '../../../../../../../components/ListProAccordion'
import useListState from "../../../../../../../reducers/listState";
import Typography from "@material-ui/core/Typography";
import checkPermis from 'app/main/components/CheckPermision';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {CSVLink} from "react-csv";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";




const GeneralReport = (props) => {
    const { evaluationPeriodTrackingCode, isTestType, setIsTestType } = props
    const [tableContentEvaluator, setTableContentEvaluator] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [expanded, setExpanded] = useState(false)
    const [formValues, setFormValues] = useState([])
    const [formAnswerId, setFormAnswerId] = useState("")
    const [tableContent, setTableContent] = useState([])
    const [modalExpanded, setModalExpanded] = useState(false)
    const [opendialog, setOpenDialog] = useState(true)
    const apraisee = useListState("partyRelationshipId", tableContentEvaluator || [])
    const [applicationType, setApplicationType] = useState([])
    const [sumFormValues, setSumFormValues] = useState({})
    const datas = useSelector(({ fadak }) => fadak);

    const tableColS = [
        { name: "pseudoId", type: "select", disabled: true, label: "ارزیابی شونده", options: organizationUnit.employees, optionLabelField: "fullName", optionIdField: "partyRelationshipId", style: { minWidth: "150px" } },
        { name: "pseudoId", type: "select", disabled: true, label: "کد  پرسنلی", options: organizationUnit.employees, optionLabelField: "pseudoId", optionIdField: "partyRelationshipId", style: { minWidth: "150px" } },
        { name: "organizationName", type: "select", disabled: true, label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "organizationName", optionIdField: "partyId", style: { minWidth: "150px" } },
        { name: "emplPosition", type: "select", label: " پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "enumId", style: { maxWidth: "80px" } },
        { name: "pureScore", type: "text", disabled: true, label: "نمره", style: { minWidth: "80px" } }
    ]

    const formStructure = [
        {
            label: " واحد سازمانی ",
            name: "organizationPartyId",
            options: organizationUnit.units,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            type: "select",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ پست سازمانی",
            name: "emplPositionId",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ پرسنل",
            name: "partyRelationshipId",
            options: organizationUnit.employees,
            optionLabelField: "fullName",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 4
        }
    ]

    const formStructureAppraisee = [
        {
            name: "pseudoId",
            label: "کد  پرسنلی",
            type: "select",
            options: organizationUnit.employees,
            optionLabelField: "pseudoId",
            optionIdField: "partyRelationshipId",
            readOnly: true,
            col: 3
        }, {
            name: "subOrgans",
            label: " شرکت",
            options: organizationUnit.subOrgans,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            type: "select",
            col: 3,
            readOnly: true,


        }, {
            name: "organizationName",
            label: " واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            readOnly: true,
            col: 3
        }, {
            name: "emplPosition",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,
            col: 3
        }

    ]

    const sumFormStructure = [
        {
            name: "sumOfPure",
            label: " مجموع نمره خالص",
            type: "text",
            readOnly: true,
            col: 3
        },
        {
            name: "sumOfWeighted",
            label: " مجموع نمره موزون",
            type: "text",
            col: 3,
            readOnly: true,
        }

    ]

    const tableColsEvaluator = [
        { name: "appraiserPartyRelationshipId", type: "select", disabled: true, label: "نام ارزیاب", options: organizationUnit.employees, optionLabelField: "fullName", optionIdField: "partyRelationshipId", style: { minWidth: "150px" } },
        { name: "appraisalTypeEnumId", type: "select", disabled: true, label: "دسته بندی", options: applicationType, optionLabelField: "description", optionIdField: "enumId", style: { minWidth: "150px" } },
        { name: "appraiserRate", type: "float", label: " ضریب اهمیت", style: { minWidth: "80px" } },
        { name: "pureScore", type: "float", disabled: true, label: " نمره خالص", style: { minWidth: "80px" } },
        { name: "weightedScore", type: "float", disabled: true, label: " نمره موزون", style: { minWidth: "100px" } }
    ]

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    function handleAddItem(item) {
        item.pureScore = item.EvaluationParticipator[0].pureScore
        item.answerId = item.EvaluationParticipator[0].answerId
    }

    const handleFilter = () => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetails?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: formValues
            })
            .then((res) => {
                if (isTestType) {
                    let data = res.data.data.Appraisee
                    data.map((item, ind) => (
                        handleAddItem(item)
                    ))
                    setTableContent(data)
                }
                else {
                    setTableContentEvaluator(res.data.data.Appraisee)
                }
            })
            .catch(() => {
            });
    }

    const handle_resolve = (rowData) => new Promise(resolve => {
        rowData.weightedScore = rowData.pureScore * rowData.appraiserRate
        axios.put(SERVER_URL + "/rest/s1/evaluation/evalParticipatorChangeRate", rowData, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            resolve(rowData)
        }).catch(err => {
        });
    })

    const set_item_operations = (item) => (newOperations) => {
        item.EvaluationParticipator = newOperations
        apraisee.update(item)
    }

    const handle_set_Sum_FormValues = (item) => {
        let sumOfPure = 0
        for (var ep in item?.EvaluationParticipator) {
            sumOfPure += item?.EvaluationParticipator[ep].pureScore
        }


        let sumOfWeighted = 0
        for (var ep in item?.EvaluationParticipator) {
            sumOfWeighted += item?.EvaluationParticipator[ep].weightedScore
        }
        return {
            sumOfPure: sumOfPure,
            sumOfWeighted: sumOfWeighted
        }
    }

    const csvData = () =>{
        let data = [],
        init = tableContentEvaluator,
        rowCounter = 1
        for (let i = 0 ; i < init?.length ; i++){
            if(i==0){
                data.push(['ردیف','نام ارزیابی شونده','نام ارزیاب','دسته بندی','ضریب اهمیت','نمره خالص','نمره موزون',])
            }

            for (let itm of init[i].EvaluationParticipator){
                let arr = []
                arr.push(rowCounter)
                arr.push(init[i]?.fullName)
                arr.push(organizationUnit?.employees?.find(x => x?.partyRelationshipId == itm?.appraiserPartyRelationshipId)?.fullName)
                arr.push(applicationType?.find(x => x?.enumId == itm?.appraisalTypeEnumId)?.description)
                arr.push(itm?.appraiserRate)
                arr.push(itm?.pureScore)
                arr.push(itm?.weightedScore)
                data.push(arr)
                rowCounter = rowCounter + 1
            }

        }
        return data
    }

    useEffect(() => {
        apraisee.set(tableContentEvaluator)
    }, [tableContentEvaluator])

    const evaluationDetails = () => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetails?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            axiosKey)
            .then((res) => {
                if (isTestType) {
                    let data = res.data.data.Appraisee
                    data.map((item, ind) => (
                        handleAddItem(item)
                    ))
                    setTableContent(data)
                }
                else {
                    setTableContentEvaluator(res.data.data.Appraisee)
                }

            })
            .catch(() => {
            });
    }
    useEffect(() => {
        evaluationDetails()
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluatorLevel", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)
        }).catch(err => {
        });


        axios.get(
            SERVER_URL + "/rest/s1/training/getNeedsAssessments",
            axiosKey
        )
            .then((res) => {
                const orgMap = {
                    units: res.data.contacts.units,
                    subOrgans: res.data.contacts.subOrgans,
                    positions: res.data.contacts.posts,
                    employees: res.data.contacts.employees.party,
                };
                setOrganizationUnit(orgMap);
                setOpenDialog(false)
            })
            .catch(() => {
            });


    }, [evaluationPeriodTrackingCode, isTestType])
    const handleReset = () => {
        evaluationDetails()
        setExpanded(false)
        setFormValues([])

    }
    return (
        <Box style={{ margin: "1%" }}>
            {!opendialog ? <Box>
                {!isTestType ? 
                    <CardHeader style={{ justifyContent: "spaceBetween", textAlign: "spaceBetween", color: "#000", height: 45, padding: "10px 0px 0px" }}
                        actAsExpander={true}
                        title="لیست ارزیابی شونده ها"
                        showExpandableButton={true}
                        action={
                            <ToggleButtonGroup size="small" style={{leftMargin: 5}}>
                                <CSVLink filename={"لیست اطلاعات ارزیابی شونده ها.csv"} data={csvData()}>
                                    <Tooltip title="خروجی اکسل">
                                        <ToggleButton size={"small"}>
                                            <AssignmentReturnedIcon/>
                                        </ToggleButton>
                                    </Tooltip>
                                </CSVLink>
                                <Tooltip size={"small"} style={{padding: 6}}>
                                        {/* <ToggleButton size={"small"}> */}
                                            <Box/>
                                        {/* </ToggleButton> */}
                                    </Tooltip>
                                <Tooltip title="    جستجوی ارزیابی شونده ها    ">
                                    <ToggleButton
                                        value="check"
                                        selected={expanded}
                                        onChange={() => setExpanded(prevState => !prevState)}
                                    >
                                        <FilterListRoundedIcon style={{ color: 'gray', fontSize: "1.5rem", border: "1 solid gray" }} />
                                    </ToggleButton>
                                </Tooltip>
                            </ToggleButtonGroup>
                        }
                    />
                    :""}
                    {expanded ?
                        <Collapse in={expanded}>
                            <div>
                                <hr style={{ width: "100%", color: "#000", border: "1 solid black" }} />
                                <FilterForm 
                                    formStructure={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    handleFilter={handleFilter} 
                                    handleReset={handleReset} 
                                />
                            </div>
                        </Collapse>
                    : ""}
                    
            </Box> : <Box style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>

                <CircularProgress />
            </Box>}
            {isTestType && !opendialog ?
                <CardContent>

                    <TablePro
                        fixedLayout={true}
                        title="لیست ارزیابی شونده ها"
                        columns={tableColS}
                        rows={tableContent}
                        setRows={setTableContent}
                        loading={false}
                        rowActions={[
                            {
                                title: " مشاهده فرم ارزیابی",
                                icon: VisibilityIcon,
                                onClick: (row) => {
                                    setModalExpanded(true)
                                    setFormAnswerId(row.answerId)
                                }
                            },


                        ]}
                        
                        filter="external"
                        exportCsv="لیست اطلاعات ارزیابی شونده ها"
                        filterForm={
                            <FilterForm 
                                formStructure={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                handleFilter={handleFilter} 
                                handleReset={handleReset} 
                            />
                        }
                    /> </CardContent> : ""}
            {!isTestType && !opendialog ?
             <Box style={{marginTop:-40}}>
                <ListProAccordion
                    // title="لیست ارزیابی شونده ها"
                    context={apraisee}
                    renderAccordionSummary={(item) => <Typography>{`${item.pseudo} - ${item.fullName}`}</Typography>}
                    renderAccordionDetails={(item) => (
                        <Box style={{ padding: 20, width: "100%" }}>
                            <FormPro
                                formValues={item}
                                // setFormValues={setFormValuesAppraisee}
                                append={formStructureAppraisee}

                            />

                            <TablePro
                                title={`لیست ارزیاب ها `}
                                columns={tableColsEvaluator}
                                rows={item.EvaluationParticipator || []}
                                setRows={set_item_operations(item)}
                                edit={checkPermis("reports/evaluationList/evaluationReport/generalReport/changeAppraiserRate", datas) ? "inline" : ""}
                                editCallback={handle_resolve}
                                rowActions={[
                                    {
                                        title: " مشاهده فرم ارزیابی",
                                        icon: VisibilityIcon,
                                        onClick: (row) => {
                                            setModalExpanded(true)
                                            setFormAnswerId(row.answerId)
                                        }
                                    },


                                ]}
                                className="w-full"
                            />
                            <FormPro
                                formValues={handle_set_Sum_FormValues(item)}
                                // setFormValues={(item)}
                                append={sumFormStructure}
                            />

                        </Box>
                    )}
                /> </Box>: ""}





            {modalExpanded ?
                <CardContent style={{ margin: "100px" }}>
                    <ModalPro
                        title="فرم ارزیابی"
                        titleBgColor={"#3C4252"}
                        titleColor={"#dddddd"}
                        open={[]}
                        setOpen={() => setModalExpanded(false)}
                        content={
                            <Box p={2}>
                                <Card>
                                    <CardContent>
                                        <QuestionnaireResponder answerId={formAnswerId} readOnly btnShow={false} />
                                    </CardContent>
                                </Card>
                            </Box>
                        }
                    />
                </CardContent>
                : ""}


        </Box>
    );
};

function FilterForm (props){
    const {formStructure, formValues, setFormValues, handleFilter, handleReset} = props


    return (
        <FormPro
            append={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={
                handleFilter
            }
            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>

                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}

    />
    )
}

export default GeneralReport;