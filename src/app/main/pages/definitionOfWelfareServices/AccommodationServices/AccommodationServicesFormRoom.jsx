import React, { useState, useEffect } from 'react';
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../configs";
import { Button, Radio, CardContent, Box, Card, CardHeader, Collapse, Grid, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup } from "@material-ui/core";
import TablePro from 'app/main/components/TablePro';
import ActionBox from './../../../components/ActionBox';
import FormPro from './../../../components/formControls/FormPro';
import { useDispatch, useSelector } from "react-redux";
import SupplyRequest from '../ticket/SupplyRequest';
import CapacitySeparation from '../ticket/CapacitySeparation';
import { ALERT_TYPES, setAlertContent } from './../../../../store/actions/fadak'
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

import { Image } from "@material-ui/icons"

const AccommodationServicesForm = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [emplPositionId, setemplPositionId] = useState([])
    const [formValues, setFormValues] = useState([]);
    const [welfareId, setWelfareId] = useState()
    const [formValidation, setFormValidation] = React.useState({});
    const [responsibles, setResponsibles] = useState([{ id: 1, value: "زن" },
    { id: 2, value: "مرد" }]);
    const [addVerification, setAddVerification] = useState(false)
    const [tableContentAccommodation, setTableContentAccommodation] = React.useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(false)
    const [formValues3, setFormValues3] = useState([])
    const [formValues1, setFormValues1] = useState([])
    const [loading1, setLoading1] = useState(false)
    const [loadingdel, setLoadingdel] = useState(false)
    const [gender, setGender] = useState([])
    const [radioVal, setval] = useState("")
    const [welfareCostId, setWelfareCostId] = useState()
    const [value, setValue] = useState(true)
    const [partyId, setPartytId] = useState(true)


    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const dispatch = useDispatch()




    const tableCols4 = [
        { name: "welfareCode", label: " کد ", type: "number", style: { minWidth: "130px" } },
        { name: "title", label: " عنوان  ", type: "text", style: { minWidth: "130px" } },
        { name: "date", label: "تاریخ ایجاد   ", type: "date", style: { minWidth: "130px" } },
        { name: "city", label: "    شهر ", type: "text", style: { minWidth: "130px" } },
        { name: "partyRelationshipId", label: "    مرکز طرف قرارداد ", type: "text", style: { minWidth: "130px" } },
        { name: "statusId", label: "    فعال ", type: "indicator", style: { minWidth: "130px" } },

    ]



    const formStructure = [{
        label: " کد خدمت رفاهی",
        name: "welfareCode",
        type: "text",
        required: true
    }, {
        label: "عنوان خدمت رفاهی ",
        name: "title",
        type: "text",
        required: true
    }, {
        label: "تاریخ ایجاد",
        name: "date",
        type: "date",

    }, {
        label: "فعال",
        name: "statusId",
        type: "indicator",
        col: 3
    }, {
        label: "شرح خدمت",
        name: "description",
        type: "textarea",
        rows: 4,
        col: 6
    }, {
        label: " شرایط و ضوابط",
        name: "terms",
        type: "textarea",
        rows: 4,
        col: 6
    }
        //     , {
        //     name: "attach",
        //     type: "component",
        //     component: <Attachments welfareId={welfareId} />,
        //     col: 6

        // },
        , {
        name: "attach1",
        type: "component",
        component: <Attachments welfareId={welfareId} />,
        col: 12

    },
        , {
        label: " جنسیت",
        name: "gender",
        type: "select",
        options: gender,
        optionIdField: "description",
        optionLabelField: "description",
        col: 3

    }, {
        label: "سهمیه کل",
        name: "capacity",
        type: "number",
        col: 3

    }, {
        label: "سهمیه هر فرد",
        name: "capacityPerPerson",
        type: "number",
        col: 3

    }, {
        label: " تعداد همراهان مجاز  ",
        name: "accompany",
        type: "number",
        col: 3

    }]
    const roomFormStructure = [{
        label: " مرکز طرف قرارداد",
        name: "partyRelationshipId",
        type: "text",
        col: 3
    }, {
        label: "  شهر ",
        name: "city",
        type: "text",
        col: 3
    }, {
        label: "  آدرس ",
        name: "address1",
        type: "text",
    }, {
        label: "  تلفن ",
        name: "contactNumber",
        type: "text",
        col: 3
    }, {
        label: "  تعداد طبقه ",
        name: "floorNum",
        type: "number",
        col: 3
    }, {
        label: "  تعداد اتاق ",
        name: "romeNum",
        type: "number",
    }, {
        label: "   ساعت ورود ",
        name: "entranceDate",
        type: "time",
        col: 3

    }, {
        label: "    ساعت خروج ",
        name: "LeavingDate",
        type: "time",
        col: 3

    }
    ]

    const formStructure1 = [{
        type: "group",
        items: [{
            label: "حداکثر مهلت ارسال درخواست",
            name: "timeInterval",
            type: "number",
            style: { minWidth: "147px" }


        }, {
            label: "روز قبل از  تاریخ مراجعه ",
            type: "text",
            disabled: true,
            fullWidth: false,
            style: { minWidth: "137px" }
        }],
    }]

    const formStructure3 = [
        {
            label: "مدت اقامت مجاز",
            name: "residenceLimit",
            type: "number",
            col: 11
        }
    ]

    useEffect(() => {

        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/roomMealInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            setGender(response.data.resultGender)

        })

    }, [])
    useEffect(() => {
        let moment = require('moment-jalaali')
        const formDefaultValues = {
            date: moment().format("Y-MM-DD"),
            statusId: "Y"
        }
        setFormValues(formDefaultValues)
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/WelfareInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            let tableData = []
            response.data.result.map((item, index) => {
                if (item.statusId == "activeWelfare") {
                    item = { ...item, statusId: "Y" }
                    tableData.push(item)
                }
                if (item.statusId == "deactiveWelfare") {
                    item = { ...item, statusId: "N" }
                    tableData.push(item)
                }

            })
            setTableContentAccommodation(tableData);
            console.log(response, "pppp")
            setWelfareId(response.data.result[response.data.result.length - 1]?.welfareId)
            setWelfareCostId(response.data.result[response.data.result.length - 1]?.welfareCostId)

            setPartytId(response.data.result[response.data.result.length - 1]?.partyId)


            console.log(response.data.result[response.data.result.length - 1]?.welfareId, "wwww")
            console.log(response.data.result[response.data.result.length - 1]?.welfareCostId, "wwww")
            console.log(response.data.result[response.data.result.length - 1]?.partyId, "wwoww")



        })
    }, [loading1, loadingdel])
    useEffect(() => {

        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/VerificationLevelInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            setTableContent(response.data.result)
            setemplPositionId(response.data.result)
            setLoading(false)
            setAddVerification(false)
        })

    }, [loading, addVerification])



    const saveAccommodation = () => {

        // setFormValues(prevstate =>({...prevstate,formValues}))


        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'))
        console.log(formValues.welfareCode, "wl")
        let data = {
            welfareTypeEnumId: "Residential",
            welfareCode: formValues.welfareCode,
            title: formValues.title,
            date: formValues.date,
            statusId: formValues.statusId == "Y" ? "activeWelfare" : "deactiveWelfare",
            description: formValues.description,
            terms: formValues.terms,
            conditionType: formValues.gender,
            capacity: formValues.capacity,
            capacityPerPerson: formValues.capacityPerPerson,
            accompany: formValues.accompany,
            partyRelationshipId: formValues.partyRelationshipId,
            city: formValues.city,
            address1: formValues.address1,
            contactNumber: formValues.contactNumber,
            floorNum: formValues.floorNum,
            romeNum: formValues.romeNum,
            entranceDate: formValues.entranceDate,
            LeavingDate: formValues.LeavingDate,
            residenceLimit: formValues3.residenceLimit,
            timeInterval: formValues1.findIndextimeInterval,
            paymentMethodId: radioVal,

        }
        if (data.welfareCode == undefined || data.title == undefined)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, '   فیلدهای ضروری را پر کنید!'));
        else {
            axios.post(SERVER_URL + "/rest/s1/welfare/StoreWelfareInfo", { data: data }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setAddVerification(true)
                    setLoading1(!loading1)
                    setValue(false)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;

        setval(value)
    };
    const handleChange1 = e => {
        const { name, value } = e.target;

        setval(value)
    };
    //     const  onclick=()=>{
    // alert(radioVal)
    //       }
    const handleEdit = (newData, oldData) => {
        console.log(newData, "newData1")

        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/updateWelfareInfo", { data: newData }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setAddVerification(true)
                    setLoading1(!loading1)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));

                })
        })
    }
    const handleRemoveResidence = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/deleteWelfareInfo?welfareId=" + oldData.welfareId, axiosKey)
                .then((res) => {
                    console.log("testAAA", res)
                    setLoadingdel(!loadingdel)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }
    return (
        <Box>
            <Card >
                <CardHeader title={"مشخصات نیازسنجی"} />
                <CardContent>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        setFormValidation={setFormValidation}
                        formValidation={formValidation}

                    />
                </CardContent>

                <Card style={{ padding: 2, backgroundColor: "#ddd" }}>
                    <Card >

                        <Quota welfareId={welfareId} partyId={partyId} value={value} />
                    </Card>
                </Card>


                <CardContent>
                    <FormPro
                        append={roomFormStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        setFormValidation={setFormValidation}
                        formValidation={formValidation}

                    />
                </CardContent>

                <Card style={{ padding: 2, backgroundColor: "#ddd" }}>
                    <Card >

                        <RoomInfo welfareId={welfareId} welfareCostId={welfareCostId} value={value} />
                    </Card>
                </Card>

                <CardContent>
                    <Grid
                        container
                        direction="row">
                        <Grid xs={3}>
                            <FormPro
                                append={formStructure3}
                                formValues={formValues3}
                                setFormValues={setFormValues3}


                            />
                        </Grid>
                        <Grid xs={4}>

                            <FormControl component="fieldset">

                                <FormLabel component="legend">نحوه پرداخت هزینه</FormLabel>
                                <RadioGroup aria-label="cost" name="payCost">
                                    <FormControlLabel value="کسر از حقوق" control={<Radio />} label="کسر از حقوق" onChange={handleChange} />
                                    <FormControlLabel value="پرداخت هنگام مراجعه به مرکز طرف قرارداد" control={<Radio />} label="پرداخت هنگام مراجعه به مرکز طرف قرارداد" onChange={handleChange1} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid xs={5}>

                            <FormPro
                                append={formStructure1}
                                formValues={formValues1}
                                setFormValues={setFormValues1}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}

                            />
                        </Grid>
                    </Grid>


                </CardContent>

                <CardContent>
                    <DateSection welfareId={welfareId} />
                </CardContent>

                <Grid xs={12}>
                    <CardContent>
                        <RequiredDocuments />
                    </CardContent>
                </Grid>
                <Card style={{ padding: 2, backgroundColor: "#ddd" }}>
                    <Card >
                        <Supplyrequest />
                    </Card>
                </Card>
                <CardContent>
                    <Grid xs={12}
                        container justify="flex-end"
                        direction="row">
                        <Grid xs={1} >
                            <Button role="primary" style={{ width: 80, height: 40, backgroundColor: "white", border: "1px solid black", marginLef: 5 }} >
                                لغو
                            </Button>
                        </Grid>
                        <Grid xs={2} >
                            <Button onClick={saveAccommodation} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white", marginRight: 5 }} >
                                افزودن
                            </Button>
                        </Grid>
                    </Grid>
                    <TablePro
                        title="  لیست خدمات اقامتی "
                        columns={tableCols4}
                        rows={tableContentAccommodation}
                        //={setTableContent}
                        // addCallback={handleAdd}
                        edit="inline"
                        editCallback={handleEdit}
                        removeCallback={handleRemoveResidence}
                    //={loading
                    />

                </CardContent>
            </Card>
        </Box>
    )
}


export default AccommodationServicesForm;





function Quota(props) {
    const [expanded, setExpanded] = useState(false);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const [formValidation, setFormValidation] = useState({});
    const [companyPartyId, setCompanyPartyId] = useState([])
    const [load, setLaod] = useState(false)
    const [tableContentQuota, setTableContentQuota] = useState([]);
    const [organization, setOrgInfo] = useState([])
    const [EmplPosition, setEmplPosition] = useState([])

    const [formValuesQ, setFormValuesQ] = useState([])
    const [role, setRole] = useState([])
    const tableColseQuota = [
        { name: "companyName", label: " نام شرکت ", type: "select", style: { minWidth: "130px" } },
        { name: "portion", label: " سهمیه ", type: "number", style: { minWidth: "130px" } },
        { name: "organizationName", label: " واحد سازمانی ", type: "select", style: { minWidth: "130px" }, },
        { name: "des", label: " پست سازمانی ", type: "select", style: { minWidth: "130px" } },
        // { label: " پست سازمانی ", name:   "emplPositionId", type:   "select", options : "EmplPosition", optionIdField: "emplPositionId",},
        { name: "description", label: " نقش ", type: "select", style: { minWidth: "130px" } },

    ]
    const dispatch = useDispatch()

    const formStructureQuota = [
        {
            label: "شرکت",
            name: "companyPartyId",
            type: "select",
            optionLabelField: 'organizationName',
            optionIdField: 'partyId',
            options: companyPartyId,

            col: 4
        }, {
            label: "  سهمیه ",
            name: "portion",
            type: "number",
            col: 4
        }, {
            label: "  واحد سازمانی ",
            name: "organizationName",
            type: "select",
            options: organization,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            filterOptions: options => formValuesQ["companyPartyId"] ? options.filter(o => o["parentOrgId"] == formValuesQ["companyPartyId"])

                //    :formValuesQ["emplPositionId"] ? options.filter(o => o["parentOrgId"].indexOf(formValuesQ["emplPositionId"]) >= 0)
                : options,
            col: 4
        }, {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: EmplPosition,
            optionIdField: "emplPositionId",
            optionLabelField: "description",
            col: 4,
            filterOptions: options => formValuesQ["organizationName"] ? options.filter((item) =>
                formValuesQ["organizationName"] == item.organizationPartyId
            ) :
                options
        }, {
            label: "نقش",
            name: "roleTypeId",
            type: "select",
            options: role,
            optionLabelField: "description",
            optionIdField: "roleTypeId",
            col: 4
        }
    ]
    useEffect(() => {
        // getOrganizations()
        getCompanys()
        // getEmpPositin()
    }, [])
    const getEmpPositin = () => {
        // /rest/s1/training/getNeedsAssessments
        // /rest/s1/fadak/party/subOrganization

        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessments", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            console.log(res.data.contacts, "res")
            setEmplPosition(res.data.contacts.positions)



        }).catch(err => {
        });
    }
    const getCompanys = () => {
        // /rest/s1/training/getNeedsAssessments
        // /rest/s1/fadak/party/subOrganization

        axios.post(SERVER_URL + "/rest/s1/fadak/getKindOfParties", { listMap: ["unit", "employees", "roles", "positions"] }, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            // setOrgInfo(es.data.subOrganization)
            // let orgList = res.data.organization.concat(res.data.organizationUnit);
            // setOrgInfo(orgList);
            // setCompanyPartyId(res.data.subOrganization);
            setCompanyPartyId(res.data.contacts.orgs);
            setEmplPosition(res.data.contacts.positions)

            setOrgInfo(res.data.contacts.unit)
            setRole(res.data.contacts.roles)
            // setEmplPosition(res.data.contacts.positions)



        }).catch(err => {
        });
    }
    // const getOrganizations = () => {
    //     axios.get(SERVER_URL + "/rest/s1/welfare/needsWelfareCapacity", {
    //         headers: {
    //             'api_key': localStorage.getItem('api_key')
    //         },
    //     }).then(res => {
    //         console.log(res, "orgList")

    //         let orgList = res.data.subOrganization;
    //         setOrgInfo(res.data.subOrganization);
    //     }).catch(err => {
    //     });
    // }
    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/welfare/WelfareCapacityInfo", axiosKey)
            .then((info) => {
                console.log(info, "info")
                console.log(info.data.resultC, "cccc")
                setTableContentQuota(info.data.result)

            })
    }, [load])
    // useEffect(() => {
    //     axios.get(SERVER_URL + "/rest/s1/welfare/RoleTypeInfo", axiosKey)
    //         .then((info) => {
    //             setRole(info.data.result)

    //         })
    // }, [])

    const submitPortion = () => {
        let data = {
            partyId: props.partyId,
            welfareId: props.welfareId,
            companyPartyId: formValuesQ.companyPartyId,
            portion: formValuesQ.portion,
            emplPositionId: formValuesQ.emplPositionId,
            organizationName: formValuesQ.organizationName,
            roleTypeId: formValuesQ.roleTypeId

        }

        console.log("dataCheck", data)

        axios.post(SERVER_URL + "/rest/s1/welfare/StoreWelfareCapacityInfo", { data: data }, axiosKey)
            .then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setLaod(!load)
                console.log(data, "ddda")
                // setValue(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }
    return (


        <Box>
            {console.log(organization, "llllll")}
            <CardHeader title={"تفکیک  سهمیه"} style={{ justifyContent: "center", textAlign: "center", backgroundColor: "#3C4252", margin: 10, color: "white" }}
                action={
                    <Tooltip title="تفکیک  سهمیه">
                        <ToggleButton
                            value="check"
                            selected={expanded}
                            onChange={() => setExpanded(prevState => !prevState)}
                        >
                            <FilterListRoundedIcon style={{ color: 'white' }} />
                        </ToggleButton>
                    </Tooltip>
                } />
            {expanded ?
                <CardContent >
                    <Collapse in={expanded}>
                        <CardContent>
                            <FormPro
                                append={formStructureQuota}
                                formValues={formValuesQ}
                                setFormValues={setFormValuesQ}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                                submitCallback={submitPortion}
                                actionBox={

                                    <ActionBox>
                                        <Button type="submit" role="primary" disabled={props.value}>
                                            افزودن
                                        </Button>
                                    </ActionBox>

                                }

                            />
                        </CardContent>
                        <CardContent>
                            <TablePro
                                title="جدول تفکیک  سهمیه"
                                columns={tableColseQuota}
                                rows={tableContentQuota}
                                //={setTableContent}
                                add="inline"
                            // addCallback={handleAdd}
                            // edit="inline"
                            // editCallback={handleEdit}
                            // removeCallback={handleRemove}
                            //={loading}
                            />
                        </CardContent>

                    </Collapse>
                </CardContent>
                : ""}
        </Box>
    )
}

function RoomInfo(props) {
    const [expanded, setExpanded] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [meal, setMeal] = useState([])
    const [roomType, setRoomType] = useState([])
    const [loding, setLoding] = useState(false)
    const [loadingdel, setLoadingdel] = useState(false)
    // const [value, setValue] = useState(true)

    const tableCols = [
        { name: "roomType", label: " نوع اتاق", type: "select", optionLabelField: "description", options: roomType, style: { minWidth: "20px" } },
        { name: "capacity", label: " ظرفیت", type: "number", style: { minWidth: "20px" } },
        { name: "extraAccompanyNum", label: " نفر اضافه", type: "number", style: { minWidth: "20px" } },
        { name: "mealTypeEnumId", label: " وعده های غذایی رایگان", type: "select", optionLabelField: "description", options: meal, style: { minWidth: "20px" } },
        { name: "services", label: " سایر امکانات", type: "text", style: { minWidth: "20px" } },
        { name: "roomNum", label: " تعداد اتاق", type: "number", style: { minWidth: "20px" } },
        { name: "discount", label: " تخفیف", type: "number", style: { minWidth: "20px" } },
        { name: "amount", label: " هزینه", type: "number", style: { minWidth: "100px" } },


    ]
    const roomFormInfo = [{
        label: "   نوع اتاق",
        name: "roomType",
        type: "select",
        options: roomType,
        optionIdField: "enumId",
        optionLabelField: "description",
        col: 2
    }, {
        label: "  ظرفیت ",
        name: "capacitRoom",
        type: "number",
        col: 2
    }, {
        label: " نفر اضافه",
        name: "extraAccompanyNum",
        type: "number",
        col: 2
    }, {
        label: "وعده غذایی رایگان",
        name: "mealTypeEnumId",
        type: "select",
        options: meal,
        optionIdField: "mealTypeEnumId",
        optionLabelField: "description",
        col: 2
    }, {
        label: " سایر امکانات",
        name: "services",
        type: "text",
        col: 2
    }, {
        label: "  تعداد اتاق ",
        name: "roomNum",
        type: "number",
        col: 2
    }, {
        type: "group",
        items: [{
            name: "amount",
            label: "هزینه",
            type: "number",
            group: "cost",
            // onChange:{handleChange}
        }, {
            name: "uomId",
            type: "select",
            options: [{ enumId: "irs", description: "ریال" }, { enumId: "its", description: "تومان" }],
            disableClearable: true,
            group: "cost1"
        }],
        col: 4
    }
        , {
        type: "group",
        items: [{
            name: "discount",
            label: "تخفیف",
            type: "number",
            group: "cost"
        }, {
            name: "discountUomId",
            type: "select",
            options: [{ enumId: "irs", description: "ریال" }, { enumId: "prc", description: "%" }, { enumId: "its", description: "تومان" }],
            disableClearable: true,
            group: "cost"
        }],
        col: 4
    },
    // {
    //     type: "group",
    //     items: [{
    //         name: "finalCost",
    //         label: "هزینه نهایی ",
    //         type: "number",
    //         group: "cost"
    //     }, {
    //         name: "unit",
    //         type: "select",
    //         options: [{ enumId: "irs", description: "ریال" }, { enumId: "prc", description: "%" }, { enumId: "its", description: "تومان" }],
    //         disableClearable: true,
    //         group: "cost"
    //     }],
    //     col: 4
    // }
    {
        name: "finalCost",
        label: "هزینه نهایی ",
        type: "text",
        col: 4
    },

    ]

    const dispatch = useDispatch()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    function handleChange(e) {
        console.log(e.target.value, "lllll");
    }

    //this is the result of the  ./...
    useEffect(() => {
        console.log(formValues?.cost1?.uomId, "ggggg")
        if (formValues?.cost1?.uomId == "irs" && formValues?.cost?.discountUomId == "irs") {

            let amount = eval(formValues?.cost?.amount) ?? 0
            let discount = eval(formValues?.cost?.discount) ?? 0
            let result = amount - discount
            setFormValues(prevstate => ({ ...prevstate, finalCost: result + "ریال" }))
        }
        else if (formValues?.cost1?.uomId == "its" && formValues?.cost?.discountUomId == "its") {

            let amount = eval(formValues?.cost?.amount) ?? 0
            let discount = eval(formValues?.cost?.discount) ?? 0
            let result = amount - discount
            setFormValues(prevstate => ({ ...prevstate, finalCost: result + "تومان" }))
        }
        else if (formValues?.cost1?.uomId == "its" && formValues?.cost?.discountUomId == "prc") {

            let amount = eval(formValues?.cost?.amount) ?? 0
            let discount = eval(formValues?.cost?.discount) ?? 0
            let result = amount - amount * discount / 100
            setFormValues(prevstate => ({ ...prevstate, finalCost: result + "تومان" }))
        }
        else if (formValues?.cost1?.uomId == "irs" && formValues?.cost?.discountUomId == "prc") {

            let amount = eval(formValues?.cost?.amount) ?? 0
            let discount = eval(formValues?.cost?.discount) ?? 0
            let result = amount - amount * discount / 100
            setFormValues(prevstate => ({ ...prevstate, finalCost: result + "ریال" }))
        }
    }, [formValues?.cost?.discount, formValues?.cost?.amount, formValues?.cost?.discountUomId, formValues?.cost1?.uomId])


    useEffect(() => {
        console.log("formValues test", formValues);
        console.log("formValues test", formValues?.cost?.discount);
    }, [formValues])
    const postRoomData = () => {
        let data = {
            welfareId: props.welfareId,
            welfareCostId: props.welfareCostId,
            roomType: formValues.roomType,
            roomNum: formValues.roomNum,
            mealTypeEnumId: formValues.mealTypeEnumId,
            capacity: formValues.capacitRoom,
            services: formValues.services,
            extraAccompanyNum: formValues.extraAccompanyNum,
            amount: formValues?.cost?.amount,
            uomId: formValues?.cost?.uomId,
            discount: formValues?.cost?.discount,
            discountUomId: formValues?.cost?.discountUomId

        }

        console.log("dataCheck", data)

        axios.post(SERVER_URL + "/rest/s1/welfare/storeRoomInfo", { data: data }, axiosKey)
            .then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setLoding(!loding)
                console.log(data, "ddda")
                // setValue(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }
    const handleRemoveRoom = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/deleteRoomInfo?welfareId=" + oldData.welfareId, axiosKey)
                .then((res) => {
                    console.log("testAAA", res)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoadingdel(!loadingdel)


                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }
    useEffect(() => {

        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/roomInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            console.log(response.data.result, "room")
            setTableContent(response.data.result)
            // setMeal(response.data.resultMeal)
            // setRoomType(response.data.resultRoom)

        })

    }, [loding, loadingdel])
    useEffect(() => {

        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/roomMealInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            // setTableContent(response.data.result)
            setMeal(response.data.resultMeal)
            setRoomType(response.data.resultRoom)
            console.log(response.data.resultMeal, "meal")

        })

    }, [])
    const handleEdit = (newData, oldData) => {
        console.log(newData, "newData")
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/storeRoomInfo", { data: newData }, axiosKey)
                .then(() => {
                    // setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }

    return (
        <Box>
            <CardHeader title={"اطلاعات  اتاق ها"} style={{ justifyContent: "center", textAlign: "center", backgroundColor: "#3C4252", margin: 10, color: "white" }}
                action={
                    <Tooltip title="اطلاعات  اتاق ها">
                        <ToggleButton
                            value="check"
                            selected={expanded}
                            onChange={() => setExpanded(prevState => !prevState)}
                        >
                            <FilterListRoundedIcon style={{ color: 'white' }} />
                        </ToggleButton>
                    </Tooltip>
                } />
            {expanded ?
                <CardContent >
                    <Collapse in={expanded}>
                        <CardContent>
                            <FormPro
                                append={roomFormInfo}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                                submitCallback={postRoomData}
                                actionBox={
                                    <ActionBox>
                                        <Button type="submit" role="primary" disabled={props.value} >
                                            افزودن
                                        </Button>
                                    </ActionBox>
                                }

                            />
                        </CardContent>

                        <CardContent>
                            <TablePro
                                title="لیست   اتاق ها"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                add="inline"
                                edit="inline"
                                editCallback={handleEdit}
                                removeCallback={handleRemoveRoom}
                            // loading={loading}

                            //={loading}
                            />
                        </CardContent>

                    </Collapse>
                </CardContent>
                : ""}
        </Box>
    )
}



function Supplyrequest() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const [addVerification, setAddVerification] = useState(false)

    const [expanded, setExpanded] = useState(false);
    const [formValues2, setFormValues2] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [emplPositionId, setemplPositionId] = useState([])

    const tableCols3 = [
        { name: "sequence", label: " ترتیب ", type: "number", style: { minWidth: "130px" } },
        // { name: "emplPositionId", label: " عنوان رده تایید ", type: "select", options:emplPositionId,style: { minWidth: "130px" } },
        { label: " عنوان رده تایید ", name: "emplPositionId", type: "select", options: "EmplPosition", optionIdField: "emplPositionId", },
        { name: "reject", label: "امکان  رد ", type: "indicator", style: { minWidth: "130px" } },
        { name: "modify", label: "امکان رد  برای اصلاح ", type: "indicator", style: { minWidth: "130px" } },

    ]
    const formStructure2 = [{
        name: "emplPositionId",
        label: "پست سازمانی",
        optionLabelField: "description",

        type: "select",
        options: "EmplPosition",
        optionIdField: "emplPositionId",
        col: 3
    }
        , {
        label: " ترتیب تایید   ",
        name: "sequence",
        type: "number",
        col: 3

    }, {
        label: " امکان رد کردن   ",
        name: "reject",
        type: "indicator",
        col: 3
    }, {
        label: "امکان رد برای اصلاح",
        name: "modify",
        type: "indicator",
        col: 3
    }
    ]
    useEffect(() => {

        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/welfare/VerificationLevelInfo`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            console.log(response, "mmmm")
            setTableContent(response.data.result)
            setemplPositionId(response.data.result)
            setLoading(false)
            setAddVerification(false)
        })

    }, [loading, addVerification])
    const submitApproval = () => {
        let data = {
            emplPositionId: formValues2.emplPositionId,
            sequence: formValues2.sequence,
            reject: formValues2.reject ? "Y" : "N",
            modify: formValues2.modify ? "Y" : "N"

        }
        axios.post(SERVER_URL + "/rest/s1/welfare/createVerificationLevelInfo", { data: data }, axiosKey)
            .then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setAddVerification(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }
    const handleRemoveApproval = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/deleteVerificationLevelInfo?levelId=" + oldData.levelId, axiosKey)
                .then((res) => {
                    console.log("testAAA", res)
                    setLoading(true)

                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }
    return (
        <Box>

            <CardHeader title={"ایجاد مراحل تامین درخواست   "} style={{ justifyContent: "center", textAlign: "center", backgroundColor: "#3C4252", margin: 10, color: "white" }}
                action={
                    <Tooltip title="ایجاد مراحل تامین درخواست   ">
                        <ToggleButton
                            value="check"
                            selected={expanded}
                            onChange={() => setExpanded(prevState => !prevState)}
                        >
                            <FilterListRoundedIcon style={{ color: 'white' }} />
                        </ToggleButton>
                    </Tooltip>
                } />
            {expanded ?
                <CardContent >
                    <Collapse in={expanded}>
                        <CardContent >
                            <FormPro
                                append={formStructure2}
                                formValues={formValues2}
                                setFormValues={setFormValues2}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                                submitCallback={submitApproval}
                                //resetCallback={resetForm}
                                actionBox={<ActionBox>
                                    <Button type="submit" role="primary">افزودن</Button>
                                    <Button type="reset" role="secondary">لغو</Button>

                                </ActionBox>}


                            />
                        </CardContent>
                        <CardContent>
                            <TablePro
                                title="  لیست مراحل "
                                columns={tableCols3}
                                rows={tableContent}
                                removeCallback={handleRemoveApproval}

                            />
                        </CardContent>

                    </Collapse>
                </CardContent>
                : ""}

        </Box>
    )
}

function RequiredDocuments() {
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        { name: "fromDate", label: "نام مدرک", type: "select", options: "PartyContentType" },
    ]
    const handleAdd = (newData) => {
        console.log('table added:', newData)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const id = Math.floor(Math.random() * 1000)
                resolve({ ...newData, ...id })
            }, 200)
        })
    }
    const handleRemove = (oldData) => {
        console.log('table removed:', oldData)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 200)
        })
    }
    return (
        <TablePro
            title="مدارک مورد نیاز"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            removeCallback={handleRemove}
        />
    )
}

function AttachmentsForm({ welfareId, loading, setLoading, ...restProps }) {
    const { formValues, setFormValues, successCallback, failedCallback, handleClose } = restProps;
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label: "نوع پیوست",
        name: "attachmentsType",
        type: "select",
        options: "WelfareContent",
        col: 6
    }, {
        label: "پیوست",
        name: "contentLocation",
        type: "inputFile",
        col: 6
    }]

    const handleCreate = (formData) => {
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValues.contentLocation);
            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                .then(res => {
                    const postData = {
                        welfareId: welfareId,
                        contentLocation: res.data.name,
                        welfareContentTypeEnumId: formValues.attachmentsType
                    }
                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent", postData, axiosKey)
                        .then(() => {
                            setLoading(true)
                            handleClose()
                            resolve(formData)
                        })
                })
        })
    }
    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={() => {
                handleCreate(formValues).then((data) => {
                    successCallback(data)
                })
            }}
            resetCallback={() => {
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}



function Attachments({ formValues, setFormValues, welfareId }) {
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        { name: "attachmentsType", label: "نوع پیوست", type: "select", options: "WelfareContent", style: { width: "40%" } },
        { name: "observeFile", label: "دانلود فایل", style: { width: "40%" } }
    ]
    React.useEffect(() => {
        if (loading) {
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/WelfareContent?welfareId=${welfareId}`, axiosKey)
                .then((getData) => {
                    let tableData = []
                    if (getData.data.length > 0) {
                        getData.data.map((item, index) => {
                            console.log("item.contentLocation", item.contentLocation);
                            let data = {
                                observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.contentLocation}
                                    target="_blank" >  <Image />  </Button>,
                                welfareContentId: item.welfareContentId,
                                attachmentsType: item.welfareContentTypeEnumId
                            }
                            tableData.push(data)
                            if (index == getData.data.length - 1) {
                                setTimeout(() => {
                                    setTableContent(tableData)
                                    setLoading(false)
                                }, 50)
                            }
                        })
                    }
                    if (getData.data.length == 0) {
                        setTableContent(tableData)
                        setLoading(false)
                    }
                })
        }
    }, [loading])
    const handleRemove = (data) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent?welfareContentId=" + data.welfareContentId, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    return (
        <TablePro
            title="پیوست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="external"
            addForm={<AttachmentsForm welfareId={welfareId} loading={loading} setLoading={setLoading} />}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}
function DateSection(welfareId) {
    return (
        <Grid container spacing={2} >
            <Grid item xs={12} md={6}>
                <AdmittableUseDate welfareInfo={welfareId} />
            </Grid>
            <Grid item xs={12} md={6}>
                <AdmittableRequestDate welfareInfo={welfareId} />
            </Grid>
        </Grid>
    )
}


function AdmittableUseDate(props) {
    const { welfareInfo } = props
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)
    const tableCols = [
        { name: "fromDate", label: "از تاریخ", type: "date", style: { minWidth: "130px" } },
        { name: "thruDate", label: "تا تاریخ", type: "date", style: { minWidth: "130px" } },
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    React.useEffect(() => {
        if (loading) {
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/Time?welfareId=${welfareInfo.welfareId}&timeTypeId=${"ResidentialDate"}`, axiosKey)
                .then((getData) => {
                    setTableContent(getData.data)
                    setLoading(false)
                })
        }
    }, [loading])
    const handleAdd = (newData) => {
        let postData = Object.assign({}, newData, { timeTypeId: "ResidentialDate" }, welfareInfo)
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/Time", postData, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    const handleEdit = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/entity/Time", newData, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/Time?timeId=" + oldData.timeId, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    return (
        <TablePro
            title="تاریخ مجاز استفاده"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            loading={loading}
        />
    )
}


function AdmittableRequestDate(props) {
    const { welfareInfo } = props
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)
    const tableCols = [
        { name: "fromDate", label: "از تاریخ", type: "date", style: { minWidth: "130px" } },
        { name: "thruDate", label: "تا تاریخ", type: "date", style: { minWidth: "130px" } },
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    React.useEffect(() => {
        if (loading) {
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/Time?welfareId=${welfareInfo.welfareId}&timeTypeId=${"AuthorizedDate"}`, axiosKey)
                .then((getData) => {
                    setTableContent(getData.data)
                    setLoading(false)
                })
        }
    }, [loading])
    const handleAdd = (newData) => {
        let postData = Object.assign({}, newData, { timeTypeId: "AuthorizedDate" }, welfareInfo)
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/Time", postData, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    const handleEdit = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/entity/Time", newData, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/Time?timeId=" + oldData.timeId, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    return (
        <TablePro
            title="تاریخ مجاز درخواست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            loading={loading}
        />
    )
}