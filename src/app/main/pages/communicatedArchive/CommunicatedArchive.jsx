
import React, { useEffect, useState } from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";

import { Box, Button, Card, CardContent } from '@material-ui/core'
import ActionBox from 'app/main/components/ActionBox';
import axios from "../../api/axiosRest";


const CommunicatedArchive = (props) => {
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValues, setFormValues] = useState({})
    const [empStatus, setEmpStatus] = useState([])
    const [settingType, setSettingType] = useState([])
    
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
            label: "تاریخ تولد",
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
                                filterForm={<FilterForm tableCols={tableCols} formValues={formValues} setFormValues={setFormValues} />}

                            />
                        </Card>

                    </Box>

                </>
            } />
    )
}


const FilterForm = (props) => {
    const { formValues, setFormValues } = props
    const formStructure = [
        ...props.tableCols,
    ]
    return (
        <Box p={2}>
            <Card variant="outlined">
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={setFormValues}
                        append={formStructure}
                        actionBox={
                            <ActionBox>
                                <Button type="submit" role="primary">جستجو</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>
                        }
                    />
                </CardContent>
            </Card>

        </Box>


    )
}
export default CommunicatedArchive;