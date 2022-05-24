import React from 'react';
import { Button, } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ActionBox from "../../../components/ActionBox";
import FormPro from "../../../components/formControls/FormPro";
import FormButton from "../../../components/formControls/FormButton";
import FilterHistory from "../../../components/FilterHistory";
import axios from "../../../api/axiosRest";
import { useSelector } from 'react-redux';



export default function SearchPersonnelForm({ getPersonnel }) {
    // const formDefaultValues = {
    //     perStatus: 'ActiveRel',
    //      ownerPartyId: JSON.stringify(useSelector(({ auth }) => auth.user.data.ownerPartyId).toString())

    // }
    const [formValues, setFormValues] = React.useState({});
    const [formDefaultValues, setFormDefaultValuse] = React.useState({});
    const [moreFilter, setMoreFilter] = React.useState(false);
    const [userCompanyPartyId, set_userCompanyPartyId] = React.useState(null)
    const [payGroups, set_payGroups] = React.useState([])
    const [organizationUnit, setOrganizationUnit] = React.useState([]);
    const [fieldInfo, setFieldInfo] = React.useState({});
    const [jobList, setJobList] = React.useState([])
    const [settingTypeEnumId, setSettingTypeEnumId] = React.useState([]);
    const [settingType, setSettingType] = React.useState([]);
    const [organizationLevel, setOrganizationLevel] = React.useState([]);
    const [partyDisabled, setPartyDisabled] = React.useState([]);
    const [militarystateist, setMilitarystateist] = React.useState([]);

    const disableAccess = formValues["ownerPartyId"] !== userCompanyPartyId
    const formStructure = [
        {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text"
        }, {
            name: "firstName",
            label: "نام پرسنل",
            type: "text"
        },
        , {
            name: "lastName",
            label: "نام خانوادگی پرسنل",
            type: "text"
        }, , {
            name: "suffix",
            label: "پسوند نام خانوادگی پرسنل",
            type: "text"
        }, {
            name: "nationalId",
            label: "کد ملی",
            type: "number",
        }, {
            name: "perStatus",
            label: "وضعیت پرسنل",
            type: "select",
            // options: [
            //     { enumId: "N", description: "فعال" },
            //     { enumId: "Y", description: "غیر فعال" }
            // ]
            options: partyDisabled,
            optionLabelField: "description",
            optionIdField: "statusId",
        }, {
            name: "gender",
            label: "جنسیت",
            type: "select",
            options: "Gender"
        }, {
            name: "age",
            label: "سن",
            unit: "سال",
            type: "range",
            check: true
        }, {
            name: "militaryState",
            label: "وضعیت نظام وظیفه",
            type: "multiselect",
            options: militarystateist,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            noneOption: true
        }, {
            name: "maritalStatusEnumId",
            label: "وضعیت تأهل",
            type: "multiselect",
            options: "MaritalStatus",
            noneOption: true
        }, {
            name: "NumberofKids",
            label: "تعداد فرزندان",
            type: "range",
            max: 15,
            check: true
        }, {
            name: "birthProvince",
            label: "محل تولد",
            type: "text"
        }, {
            name: "residenceStatusEnumId",
            label: "وضعیت سکونت",
            type: "multiselect",
            options: "ResidenceStatus",
            noneOption: true
        },
        , {
            name: "stateProvinceGeoId",
            label: "شهر محل سکونت ",
            type: "multiselect",
            options: "Province",
            optionIdField: "geoId",
            optionLabelField: "geoName",
            filterOptions: (options) =>
            formValues["countyGeoId"] && eval(formValues["countyGeoId"]).length > 0
                ? options.filter(
                    (item) => formValues["countyGeoId"].indexOf(item.county) >= 0) : options,
        },
        {
            name: "countyGeoId",
            label: "شهرستان",
            type: "multiselect",
            options: "County",
            optionIdField: "geoId",
            optionLabelField: "geoName",
            filterOptions: (options) =>
            formValues["stateProvinceGeoId"] && eval(formValues["stateProvinceGeoId"]).length > 0
                ? options.filter(
                    (item) => formValues["stateProvinceGeoId"].indexOf(item.city) >= 0) : options,
          
        }, {
            name: "ReligionEnumID",
            label: "دین",
            type: "multiselect",
            options: "ReligionEnumId",
            noneOption: true
        }, {
            name: "sectEnumID",
            label: "مذهب",
            type: "multiselect",
            options: "SectEnumId",
            filterOptions: (options) =>
                formValues["ReligionEnumID"] && eval(formValues["ReligionEnumID"]).length > 0
                    ? options.filter(
                        (item) => formValues["ReligionEnumID"].indexOf(item.parentEnumId) >= 0) : options,
            noneOption: true
        }, {
            name: "hasPersonnelDiseaseBackground",
            label: "سوابق پزشکی",
            type: "select",
            options: [
                { enumId: "Y", description: "دارای سوابق پزشکی" },
                { enumId: "N", description: "بدون سوابق پزشکی" }
            ],
            display: moreFilter
        }, {
            name: "sacrificeState",
            label: "سوابق ایثارگری",
            type: "select",
            options: [
                { enumId: "Y", description: "دارای سوابق ایثارگری" },
                { enumId: "N", description: "بدون سوابق ایثارگری" }
            ],
            display: moreFilter
        }, {
            name: "sacrificeDuration",
            label: "مدت ایثارگری",
            unit: "ماه",
            type: "range",
            check: true,
            disabled: formValues.sacrificeState !== 'Y',
            display: moreFilter,
        },
        // {
        //     name: "SkillType",
        //     label: "مهارت",
        //     type: "multiselect",
        //     options: "SkillType",
        //     noneOption: true,
        //     display: moreFilter,

        // },
        {
            name: "fieldEnumId",
            label: "رشته تحصیلی",
            type: "multiselect",
            options: "UniversityFields",
            noneOption: true,
            display: moreFilter,
        }, {
            name: "qualificationTypeEnumId",
            label: "مقطع",
            type: "multiselect",
            options: "QualificationType",
            noneOption: true,
            filterOptions: options => options.filter(o => o.enumId !== "WorkExperience"),
            display: moreFilter,
        },
        {
            name: "ownerPartyId",
            label: "شرکت",
            type: "multiselect",
            options: "Organization",
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            display: moreFilter,
            changeCallback: () => setFormValues(prevState => ({
                ...prevState,
                activityArea: null,
                expertiseArea: null,
                employeeGroups: null,
                employeeSubGroups: null,
                costCenter: null
            }))
        },
        {
            name: "organizationUnit",
            label: "واحد سازمانی",
            type: "multiselect",
            display: moreFilter,
            options: organizationUnit?.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            filterOptions: (options) => {
                if (eval(formValues["ownerPartyId"])?.length > 0 ) {
                    let list = organizationUnit.subOrgans?.filter(ar => eval(formValues["ownerPartyId"]).find(rm => (rm === ar.companyPartyId)))
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
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "multiselect",
            display: moreFilter,
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
            name: "roleTypeId",
            label: "نقش سازمانی",
            type: "multiselect",
            options: "Role",
            optionIdField: "roleTypeId",
            display: moreFilter,
        },
        {
            name: "relationshipTypeEnumId",
            label: "نوع ارتباط",
            type: "multiselect",
            options: "PartyRelationshipType",
            optionLabelField: "description",
            optionIdField: "enumId",
            display: moreFilter,
            filterOptions: options => options.filter(o => o.parentEnumId === "PrtUserTypeRelation"),
        },
        {
            name: "organizationHistory",
            label: "سابقه درون سازمان",
            type: "range",
            max: 15,
            check: true,
            display: moreFilter,

        }
        , {
            name: "activityArea",
            label: "منطقه فعالیت",
            type: "multiselect",
            options: "ActivityArea",
            optionIdField: "partyClassificationId",
            display: moreFilter,
            disabled: disableAccess,
        }, {
            name: "expertiseArea",
            label: "حوزه کاری",
            type: "multiselect",
            options: "ExpertiseArea",
            optionIdField: "partyClassificationId",
            display: moreFilter,
            disabled: disableAccess,
        }, {
            name: "employeeGroups",
            label: "گروه پرسنلی",
            type: "multiselect",
            options: "EmployeeGroups",
            optionIdField: "partyClassificationId",
            changeCallback: () => setFormValues(prevState => ({ ...prevState, employeeSubGroups: "[]" })),
            display: moreFilter,
            disabled: disableAccess,
        }, {
            name: "employeeSubGroups",
            label: "زیرگروه پرسنلی",
            type: "multiselect",
            options: "EmployeeSubGroups",
            optionIdField: "partyClassificationId",
            filterOptions: options => options.filter((item) => formValues["employeeGroups"]?.indexOf(item.parentClassificationId) >= 0),
            display: moreFilter,
            disabled: disableAccess,
        }, {
            name: "costCenter",
            label: "مرکز هزینه",
            type: "multiselect",
            options: "CostCenter",
            optionIdField: "partyClassificationId",
            display: moreFilter,
            disabled: disableAccess,
        }, {
            name: "payGroup",
            label: "گروه حقوق و دستمزد",
            type: "multiselect",
            options: payGroups,
            optionIdField: "payGroupPartyClassificationId",
            display: moreFilter,
        }, {
            name: "childGender",
            label: "دارای فرزند",
            type: "select",
            options: [
                { enumId: "Daughter", description: "دختر" },
                { enumId: "Son", description: "پسر" }
            ],
            display: moreFilter,
        },
        // {
        //     name: "retirementType",
        //     label: "نوع بازنشستگی ",
        //     type: "multiselect",
        //     // options: "Organization",
        //     // optionLabelField: "organizationName",
        //     // optionIdField: "partyId",
        //     display: moreFilter,

        // },
        {
            name: "jobId",
            label: "کد وعنوان شغل ",
            type: "select",
            options: jobList,
            optionLabelField: "jobTitle",
            optionIdField: "jobId",
            display: moreFilter,

        },
        {
            label: "رسته شغلی",
            name: "jobCategoryEnumId",
            type: "multiselect",
            options: "JobCategory",
            filterOptions: (options) => options.filter((o) => !o["parentEnumId"]),
            display: moreFilter,

        },
        {
            label: "رسته فرعی شغلی",
            name: "jobSubCategoryEnumId",
            type: "multiselect",
            options: "JobCategory",
            filterOptions: options => options.filter((item) => formValues["jobCategoryEnumId"]?.indexOf(item.parentEnumId) >= 0),
            display: moreFilter,

        },
        {
            name: "insuranceNumberEnumId",
            label: "کد بیمه شغل",
            type: "select",
            options: "JobTitle",
            optionLabelField: "enumCode",
            hasTooManyOptions: true,
            display: moreFilter,
        },
        {
            name: "jobScore",
            label: "امتیاز شغل ",
            type: "text",
            display: moreFilter,

        },
        {
            name: "positionTypeEnumId",
            label: "نوع پست ",
            type: "multiselect",
            options: "PositionType",
            noneOption: true,
            display: moreFilter,

        },
        {
            name: "jobGradeEnumId",
            label: "طبقه شغلی ",
            type: "multiselect",
            options: "JobGrade",
            noneOption: true,
            display: moreFilter,

        },
        {
            name: "gradeTypeEnumId",
            label: "رده سازمانی ",
            type: "multiselect",
            options: "GradeType",
            noneOption: true,
            display: moreFilter,

        },
        {
            name: "payGradeId",
            label: "رتبه شغلی ",
            type: "multiselect",
            options: fieldInfo?.PayGrade,
            optionLabelField: "description",
            optionIdField: "payGradeId",
            display: moreFilter,

        },
        // {
        //     name: "OccupationalClassTitle",
        //     label: "عنوان طبقه شغلی ",
        //     type: "multiselect",
        //     display: moreFilter,

        // },
        // {
        //     name: "unitCode",
        //     label: "کد و عنوان واحد سازمانی ",
        //     type: "text",
        //     display: moreFilter,

        // },
        {
            name: "organizationalLevel",
            label: "سطح سازمانی ",
            type: "multiselect",
            options: organizationLevel,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            display: moreFilter,

        },
        , {
            name: "isPersonnelSmoker",
            label: "سیگاری",
            type: "select",
            options: [
                { enumId: "Y", description: "سیگاری است" },
                { enumId: "N", description: "سیگاری نیست" }
            ],
            display: moreFilter
        }, {
            name: "accountDisabled",
            label: "وضعیت حساب کاربری",
            type: "select",
            options: [
                { enumId: "N", description: "فعال" },
                { enumId: "Y", description: "غیر فعال" }
            ],
            display: moreFilter
        },
        // {
        //     name: "birthdateFrom",
        //     label: "تاریخ تولد از",
        //     type: "date",
        //     display: moreFilter
        // }, {
        //     name: "birthdateTo",
        //     label: "تاریخ تولد تا",
        //     type: "date",
        //     display: moreFilter
        // }
        ,
        {
            name: "InCompleteItem",
            label: "نقص اطلاعات",
            type: "select",
            options: [
                { enumId: "pseudoId", description: "کد پرسنلی" },
                { enumId: "nationalId", description: "کد ملی" },
                { enumId: "partyDisabled", description: "وضعیت پرسنل" },
                { enumId: "gender", description: "جنسیت" },
                { enumId: "militaryState", description: "وضعیت نظام وظیفه" },
                { enumId: "maritalStatusEnumId", description: "وضعیت تأهل" },
                { enumId: "NumberofKids", description: "تعداد فرزندان" },
                { enumId: "birthProvince", description: "محل تولد" },
                { enumId: "residenceStatusEnumId", description: "وضعیت سکونت" },
                { enumId: "ReligionEnumID", description: "دین" },
                { enumId: "sectEnumID", description: "مذهب" },
                { enumId: "hasPersonnelDiseaseBackground", description: "سوابق پزشکی" },
                { enumId: "sacrificeState", description: "سوابق ایثارگری" },
                { enumId: "sacrificeDuration", description: "مدت ایثارگری" },
                { enumId: "fieldEnumId", description: "رشته تحصیلی" },
                { enumId: "qualificationTypeEnumId", description: "مقطع" },
                { enumId: "ownerPartyId", description: "شرکت" },
                { enumId: "childGender", description: "دارای فرزند" },
                { enumId: "isPersonnelSmoker", description: "سیگاری" },
                { enumId: "accountDisabled", description: "وضعیت حساب کاربری" },
                { enumId: "birthdate", description: "تاریخ تولد" },
            ],
            display: moreFilter
        },
        {
            name: "partySettingTypeId",
            label: "نوع اطلاعات",
            options: settingTypeEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            display: moreFilter,


        }, {
            name: "settingValue",
            label: settingTypeEnumId.find(element => element.enumId === formValues.partySettingTypeId)?.description,
            type: settingTypeEnumId.find(element => element.enumId === formValues.partySettingTypeId)?.enumTypeId ? "select" : "text",
            options: settingType,
            optionLabelField: "description",
            optionIdField: "enumId",
            display: moreFilter,
            disabled: formValues.partySettingTypeId ? false : true,


        }
        , {
            name: "fromDate",
            label: "تاریخ استخدام از",
            type: "date",
            display: moreFilter
        }, {
            name: "thruDate",
            label: "تاریخ استخدام تا",
            type: "date",
            display: moreFilter
        }]

        

    React.useEffect(() => {
        axios.get("/s1/fadak/entity/PartyClassification?classificationTypeEnumId=Militarystate").then(response => {
            setMilitarystateist(response.data.result)
        }).catch(err => {
        });
    }, [])

    const getSettingTypeEnumId = () => {
        axios.get("/s1/fadak/getTypeOfPartySetting?settingTypeEnumId=OtherPersonalInf").then((res) => {
            setSettingTypeEnumId(res.data.result)
        }).catch(() => {
        });
    }


    React.useEffect(() => {
        let enumTypeId = settingTypeEnumId.find(element => element.enumId === formValues.partySettingTypeId)?.enumTypeId
        axios.get("/s1/fadak/entity/Enumeration?enumTypeId=" + enumTypeId).then(response => {
            setSettingType(response.data.result)
        }).catch(err => {
        });
        setFormValues(prevState => ({ ...prevState, settingValue: settingTypeEnumId.find(element => element.enumId === formValues.partySettingTypeId)?.defaultValue }))

    }, [formValues.partySettingTypeId])

    React.useEffect(() => {
        getSettingTypeEnumId()
        axios.get("/s1/fadak/party/subOrganization").then((res) => {
            set_userCompanyPartyId(JSON.stringify([res.data.organization[0].partyId]));
            setFormValues(prevState=>({
                ...prevState,
                ownerPartyId:JSON.stringify([res.data.organization[0].partyId]),
                perStatus: 'ActiveRel',
                
            }))
            setFormDefaultValuse(prevState=>({
                ...prevState,
                ownerPartyId:JSON.stringify([res.data.organization[0].partyId]),
                perStatus: 'ActiveRel',
                
            }))
            
        }).catch(() => { });
        axios.get("/s1/payroll/payGroup").then(res => {
            set_payGroups(res.data.payGroupList)

        }).catch(() => { });
        axios.get("/s1/humanres/GetPostAndJobOpt").then((res) => {
            setFieldInfo(Object.assign({}, fieldInfo, res.data?.PostAndJobInfo))
        }).catch(() => {
        });
        axios.get("/s1/fadak/getJobList").then((res) => {
            setJobList(res.data?.list)
        }).catch(() => {
        });
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

        axios
            .get("/s1/fadak/entity/PartyClassification?classificationTypeEnumId=organizationType")
            .then((res) => {
                setOrganizationLevel(res.data.result);
            })
            .catch(() => { });

        axios
            .get("/s1/fadak/entity/StatusItem?statusTypeId=PartyRelationship").then((res) => {
                let newList = res.data.status;
                newList = newList.sort((a, b) =>
                    a.sequenceNum > b.sequenceNum
                        ? 1
                        : a.sequenceNum < b.sequenceNum
                            ? -1
                            : 0
                );
                setPartyDisabled(newList)
            })
            .catch(() => {
            });
    }, [])

    return (
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
            formValues={formValues} setFormValues={setFormValues}
            submitCallback={() => getPersonnel(formValues)} resetCallback={() => getPersonnel(formDefaultValues)}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
                <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_personnel"} loadCallback={(val) => getPersonnel(val)} />
            </ActionBox>}
        >
            <FormButton onClick={() => setMoreFilter(!moreFilter)}
                startIcon={moreFilter && <ChevronRightIcon />}
                endIcon={!moreFilter && <ChevronLeftIcon />} >
                {moreFilter ? "فیلترهای کمتر" : "فیلترهای بیشتر"}
            </FormButton>
        </FormPro>
    );
}
