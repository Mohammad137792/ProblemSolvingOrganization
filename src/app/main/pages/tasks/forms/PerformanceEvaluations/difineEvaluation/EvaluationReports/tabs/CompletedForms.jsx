import React, { useState, useEffect } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ToggleButton from "@material-ui/lab/ToggleButton";
import { useDispatch } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import ListProAccordion from '../../../../../../../components/ListProAccordion'
import useListState from "../../../../../../../reducers/listState";
import Typography from "@material-ui/core/Typography";
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ModalPro from "app/main//components/ModalPro";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {CSVLink} from "react-csv";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";



const CompletedForms = (props) => {
    const { evaluationPeriodTrackingCode } = props
    const [accordionContent, setAccordionContent] = useState([])
    const [expanded, setExpanded] = useState(false)
    const [formValues, setFormValues] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [modalExpanded, setModalExpanded] = useState(false)
    const [applicationType, setApplicationType] = useState([])
    const [formStatus, setFormStatus] = useState([])
    const [formAnswerId, setFormAnswerId] = useState("")
    const allForms = useListState("questionnaireId", accordionContent || [])


    const formStructure = [
        {
            label: " ارزیابی شونده ",
            name: "partyRelationshipId",
            options: organizationUnit.employees,
            optionLabelField: "fullName",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ ارزیاب",
            name: "appraiserPartyRelationshipId",
            options: organizationUnit.employees,
            optionLabelField: "fullName",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ دسته ارزیابی",
            name: "appraisalTypeEnumId",
            options: applicationType,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 4
        }
    ]

    const tableColsEvaluator = [
        { name: "partyRelationshipId", type: "select", disabled: true, label: "ارزیابی شونده", options: organizationUnit.employees, optionLabelField: "fullName", optionIdField: "partyRelationshipId", style: { minWidth: "150px" } },
        { name: "appraiserPartyRelationshipId", type: "select", disabled: true, label: "ارزیاب", options: organizationUnit.employees, optionLabelField: "fullName", optionIdField: "partyRelationshipId", style: { minWidth: "150px" } },
        { name: "appraisalTypeEnumId", type: "select", disabled: true, label: "دسته بندی", options: applicationType, optionLabelField: "description", optionIdField: "enumId", style: { minWidth: "150px" } },
        { name: "statusId", type: "select", label: " وضعیت", options: formStatus, optionLabelField: "description", optionIdField: "statusId", style: { maxWidth: "80px" } },
        { name: "fromDate", type: "date", disabled: true, label: "تاریخ ارسال", style: { minWidth: "80px" } },
        { name: "thruDate", type: "date", disabled: true, label: " تاریخ تکمیل", style: { minWidth: "100px" } }
    ]

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const handleFilter = () => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetailsByForms?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: formValues
            })
            .then((res) => {
                setAccordionContent(res.data.data)
            })
            .catch(() => {
            });
    }

    const set_item_operations = (item) => (newOperations) => {
        item.participants = newOperations
        allForms.update(item)
    }

    const getAllForms = () => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetailsByForms?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            axiosKey)
            .then((res) => {
                setAccordionContent(res.data.data)
            })
            .catch(() => {
            });
    }

    const csvData = () =>{
        let data = [],
        init = accordionContent,
        rowCounter = 1
        
        
        for (let i = 0 ; i < init?.length ; i++){
            if(i==0){
                data.push(['ردیف','نام فرم','نام ارزیابی شونده','نام ارزیاب','دسته بندی',' وضعیت','تاریخ ارسال','تاریخ تکمیل',])
            }

            for (let itm of init[i].participants){
                console.log("awdsxv", itm)
                let arr = []
                arr.push(rowCounter)
                arr.push(init[i]?.title)
                arr.push(organizationUnit?.employees?.find(x => x?.partyRelationshipId == itm?.partyRelationshipId)?.fullName)
                arr.push(organizationUnit?.employees?.find(x => x?.partyRelationshipId == itm?.appraiserPartyRelationshipId)?.fullName)
                arr.push(applicationType?.find(x => x?.enumId == itm?.appraisalTypeEnumId)?.description)
                arr.push(formStatus?.find(x => x?.statusId == itm?.statusId)?.description)
                arr.push(itm?.fromDate? new Date(itm?.fromDate): "")
                arr.push(itm?.thruDate? new Date(itm?.thruDate): "")
                data.push(arr)
                rowCounter = rowCounter + 1
            }

        }
        return data
    }

    useEffect(() => {
        getAllForms()
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluatorLevel", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=QuestionnaireAnswer", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setFormStatus(res.data.status)
        }).catch(err => {
        });


        axios
            .get(
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
            })
            .catch(() => {
            });


    }, [evaluationPeriodTrackingCode])

    useEffect(() => {
        allForms.set(accordionContent)
    }, [accordionContent])


    return (
        <Box style={{ margin: "1%" }}>
            <CardHeader style={{ justifyContent: "spaceBetween", textAlign: "spaceBetween", color: "#000", height: 45, padding: "10px 0px 0px" }}
                actAsExpander={true}
                title="لیست فرم های تکمیل شده"
                showExpandableButton={true}
                action={
                    <ToggleButtonGroup size="small" style={{leftMargin: 5}}>
                        <CSVLink filename={"لیست فرم های تکمیل شده.csv"} data={csvData()}>
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
                        <Tooltip title="    جستجوی فرم ها    ">
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
            {expanded ?
                <CardContent >
                    <Collapse in={expanded}>
                        <div>
                            <hr style={{ width: "100%", color: "#000", border: "1 solid black" }} />
                            <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                submitCallback={
                                    handleFilter
                                }
                                resetCallback={() => {
                                    getAllForms()
                                }}
                                actionBox={<ActionBox>
                                    <Button type="submit" role="primary">اعمال فیلتر</Button>

                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>}

                            />
                        </div>

                    </Collapse>
                </CardContent>
                : ""}
            <Box style={{marginTop:-20}}>
                <CardContent>
                    <ListProAccordion
                        context={allForms}
                        renderAccordionSummary={(item) => <Typography>{` ${item.title}`}</Typography>}
                        renderAccordionDetails={(item) => (
                            <Box style={{ padding: 20, width: "100%" }}>
                                <TablePro
                                    // title={`لیست ارزیابان ${item.fullName}`}
                                    columns={tableColsEvaluator}
                                    rows={item.participants || []}
                                    setRows={set_item_operations(item)}
                                    // edit="inline"
                                    // editCallback={handle_resolve}
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
                            </Box>
                        )}
                    />
                </CardContent>
            </Box>
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

export default CompletedForms;