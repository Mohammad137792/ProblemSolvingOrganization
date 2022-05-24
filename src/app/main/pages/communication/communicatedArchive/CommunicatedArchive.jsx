
import React, { useEffect, useRef, useState } from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";

import { Box, Button, Card, CardContent } from '@material-ui/core'
import ActionBox from 'app/main/components/ActionBox';
import axios from "../../../api/axiosRest";
import FilterHistory from 'app/main/components/FilterHistory';
import VisibilityIcon from "@material-ui/icons/Visibility";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { SERVER_URL } from 'configs';
import ModalPro from "../../../components/ModalPro";
import CommunicatedForms from '../communicationForm/CommunicatedForms';
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";


const CommunicatedArchive = (props) => {
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValues, setFormValues] = useState({})
    const [empStatus, setEmpStatus] = useState([])
    const [settingType, setSettingType] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const componentRef =useRef();

    const tableCols = [
        {
            name: "pseudoId",
            label: " کد پرسنلی ",
            type: "text",

        },
        {
            name: "firstName",
            label: " نام ",
            type: "text",

        },
        {
            name: "lastName",
            label: " نام خانوادگی    ",
            type: "text",

        },
        {
            name: "nationalCode",
            label: " کد ملی ",
            type: "number",

        },
        {
            name: "birthDate",
            label: "سن",
            type: "date",

        },
        {
            name: "maritalStatusEnumId",
            label: "وضعیت تأهل",
            type: "select",
            options: "MaritalStatus",
            noneOption: true

        },
        {
            name: "qualificationTypeEnumId",
            label: " مدرک تحصیلی ",
            type: "select",
            options: "QualificationType",
            noneOption: true

        },
        {
            name: "organizationPartyId",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit?.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            filterOptions: (options) => {
                if (eval(formValues["ownerPartyId"])?.length > 0) {
                    let list = organizationUnit.subOrgans.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i].units.find(rm => (rm === ar.unitPartyId))).concat(options1)
                    }
                    return options1
                }
                else
                    return options
            }

        },

        {
            name: "statusId",
            label: " وضعیت پست",
            type: "select",
            options: empStatus,
            optionLabelField: "description",
            optionIdField: "statusId",

        },
        {
            name: "fromEmplPositionId",
            label: "پست صادر کننده ابلاغ ",
            type: "select",
            options: organizationUnit?.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => {
                if (eval(formValues["organizationUnit"])?.length > 0) {
                    let list = organizationUnit.units.filter(ar => eval(formValues["organizationUnit"]).find(rm => (rm === ar.unitPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else if ((!formValues["organizationUnit"] || eval(formValues["organizationUnit"])?.length === 0) && eval(formValues["ownerPartyId"])?.length > 0) {
                    let list = organizationUnit.subOrgans.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else
                    return options
            }
        },
        {
            name: "insuranceNumberEnumId",
            label: "موقعیت شعبه ",
            type: "select",
            options: [],

        },



        {
            name: "printSettingId",
            label: "نوع ابلاغ",
            type: "select",
            options: settingType,
            optionLabelField: "title",
            optionIdField: "settingId",

        },
        {
            name: "approveDate",
            label: "تاریخ صدور ابلاغ ",
            type: "date",

        },

    ]

    const [tableContent, setTableContent] = useState([])

    const getInfoChangeType = (filterParam) => {
        axios.get("/s1/communication/getRequestInfoChange", {
            params: {
                age: filterParam.age ? filterParam.age : "",
                maritalStatusEnumId: filterParam.maritalStatusEnumId ? filterParam.maritalStatusEnumId : "",
                qualificationTypeEnumId: filterParam.qualificationTypeEnumId ? filterParam.qualificationTypeEnumId : "",
                toPartyRelationshipId: filterParam.toPartyRelationshipId ? filterParam.toPartyRelationshipId : "",
                fromEmplPositionId: filterParam.fromEmplPositionId ? filterParam.fromEmplPositionId : "",
                post: filterParam.post ? filterParam.post : "",
                nationalCode: filterParam.nationalCode ? filterParam.nationalCode : "",
                statusId: filterParam.statusId ? filterParam.statusId : "",
                fromDate: filterParam.fromDate ? filterParam.fromDate : "",
                thruDate: filterParam.thruDate ? filterParam.thruDate : "",
            }

        }).then(res => {
            setTableContent(res.data.result);
        }).catch(() => {
        });


    }



    useEffect(() => {
        getInfoChangeType({})
    }, []);

    useEffect(() => {
        axios
            .get("/s1/fadak/allCompaniesFilter?isLoggedInUserData=true")
            .then((res) => {
                const orgMap = {
                    units: res.data.data.units,
                    subOrgans: res.data.data.companies,
                    positions: res.data.data.emplPositions,
                    employees: res.data.data.persons,
                };
                setOrganizationUnit(orgMap);

            })
            .catch(() => { });
        axios.get("/s1/fadak/entity/StatusItem?statusTypeId=EmplPosition").then(res => {
            setEmpStatus(res.data.status)


        }).catch(err => {
        });
        axios
            .get("/s1/fadak/getPrintSettOfPerson").then((res) => {

                setSettingType(res.data.printSettingList)
            })
            .catch(() => {
            });

    }, []);

    const submitFilter = () => {
        console.log("formValues", formValues)
        getInfoChangeType(formValues)
    }

    const handleGetContent = (row) => {
        console.log("rowwwwwwwwwwwwwwwwww", row)
        window.location.href = (SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=") + row.fileLocation
    }

    const handleOpenModal = (rowData) => {
        rowData.title = settingType.find(item => item.settingId === rowData.printSettingId)?.title

        setDataModal(rowData)
        setOpenModal(true)
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    return (
        <FusePageSimple
            header={
                <h1>
                    صدور احکام بایگانی ابلاغیه‌ها
                </h1>
            }
            content={
                <>
                    <Box p={2}>

                        <Card variant="outlined">
                            <TablePro
                                title=" لیست ابلاغیه‌ها"
                                columns={tableCols}
                                rows={tableContent}
                                exportCsv="خروجی اکسل"
                                filter="external"
                                filterForm={<FilterForm tableCols={tableCols} formValues={formValues} setFormValues={setFormValues} organizationUnit={organizationUnit} settingType={settingType} empStatus={empStatus} submitFilter={submitFilter} />}
                                rowActions={[
                                    {
                                        title: " مشاهده",
                                        icon: VisibilityIcon,
                                        onClick: (row) => handleOpenModal(row)
                                    },
                                    {
                                        title: " دانلود مستندات",
                                        icon: CloudDownloadIcon,
                                        onClick: (row) => {
                                            handleGetContent(row)
                                        }
                                    }
                                ]}

                            />
                        </Card>
                        <ModalPro
                            title={`پیش نمایش ${dataModal.title}`}
                            open={openModal}
                            setOpen={setOpenModal}
                            content={
                                // <CommunicationForm />
                                <div  ref={componentRef}>
                                <CommunicatedForms  />
                                </div>
                            }
                            // headerActions={[{
                            //     title: "چاپ",
                            //     icon: PrintIcon,
                            //     onClick: handlePrint
                            // }]}
                        />
                    </Box>

                </>
            } />
    )
}


const FilterForm = (props) => {
    const { formValues, setFormValues, organizationUnit, settingType, empStatus, submitFilter } = props
    console.log("ppppppppppppppppppppp", organizationUnit?.employees)
    const formStructure = [
        {
            name: "organizationPartyId",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit?.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            filterOptions: (options) => {
                if (eval(formValues["ownerPartyId"])?.length > 0) {
                    let list = organizationUnit.subOrgans.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i].units.find(rm => (rm === ar.unitPartyId))).concat(options1)
                    }
                    return options1
                }
                else
                    return options
            }

        },
        {
            name: "fromEmplPositionId",
            label: "پست صادر کننده ابلاغ ",
            type: "multiselect",
            options: organizationUnit?.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => {
                if (eval(formValues["organizationUnit"])?.length > 0) {
                    let list = organizationUnit.units.filter(ar => eval(formValues["organizationUnit"]).find(rm => (rm === ar.unitPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else if ((!formValues["organizationUnit"] || eval(formValues["organizationUnit"])?.length === 0) && eval(formValues["ownerPartyId"])?.length > 0) {
                    let list = organizationUnit.subOrgans.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else
                    return options
            }
        },
        {
            name: "post",
            label: "عنوان پست",
            type: "multiselect",
            options: organizationUnit?.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => {
                if (eval(formValues["organizationUnit"])?.length > 0) {
                    let list = organizationUnit.units.filter(ar => eval(formValues["organizationUnit"]).find(rm => (rm === ar.unitPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else if ((!formValues["organizationUnit"] || eval(formValues["organizationUnit"])?.length === 0) && eval(formValues["ownerPartyId"])?.length > 0) {
                    let list = organizationUnit.subOrgans.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
                    let options1 = []
                    for (let i = 0; i < list?.length; i++) {
                        options1 = options.filter(ar => list[i]?.emplPosition.find(rm => (rm === ar.emplPositionId))).concat(options1)
                    }
                    return options1
                }
                else
                    return options
            }
        },
        {
            name: "statusId",
            label: " وضعیت پست",
            type: "multiselect",
            options: empStatus,
            optionLabelField: "description",
            optionIdField: "statusId",

        },
        {
            name: "age",
            label: "محدوده سنی",
            unit: "سال",
            type: "range",
            check: true

        },
        {
            name: "toPartyRelationshipId",
            label: " نام و نام خانوادگی    ",
            type: "multiselect",
            options: organizationUnit?.employees,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",

        },
        {
            name: "nationalCode",
            label: " کد ملی ",
            type: "number",

        },

        {
            name: "maritalStatusEnumId",
            label: "وضعیت تأهل",
            type: "multiselect",
            options: "MaritalStatus",
            noneOption: true

        },
        {
            name: "qualificationTypeEnumId",
            label: " مدرک تحصیلی ",
            type: "multiselect",
            options: "QualificationType",
            noneOption: true

        },
        {
            name: "fromDate",
            label: "تاریخ ابلاغ از تاریخ",
            type: "date",

        },
        {
            name: "thruDate",
            label: "تاریخ ابلاغ تا تاریخ",
            type: "date",

        },
    ]
    return (
        <Box p={2}>
            <Card variant="outlined">
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={setFormValues}
                        append={formStructure}
                        submitCallback={
                            submitFilter
                        }
                        actionBox={
                            <ActionBox>
                                <Button type="submit" role="primary">اعمال فیلتر</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                                <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_personnel"} loadCallback={(val) => submitFilter(val)} />
                            </ActionBox>
                        }
                    />
                </CardContent>
            </Card>

        </Box>


    )
}
export default CommunicatedArchive;