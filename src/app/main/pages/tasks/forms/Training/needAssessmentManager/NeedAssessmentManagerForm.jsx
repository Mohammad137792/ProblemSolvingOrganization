import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from '@material-ui/icons/Check';
import { SERVER_URL } from "../../../../../../../configs";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Grid } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom';
import RecordCoursesListForm from '../../../../educationModule/BasicInformation/needAssessmentManager/RecordCoursesListForm';
import FormInput from "../../../../../components/formControls/FormInput";
import CircularProgress from "@material-ui/core/CircularProgress";

const NeedAssessmentManagerForm = (props) => {
    const { submitCallback, formVariables } = props
    const [tableContent, setTableContent] = React.useState([]);
    const [curriculumId, setCurriculumId] = useState(props.formVariables.assessment.value.curriculumId);
    const [category, setCategory] = useState([]);
    const [title, setTitle] = useState([]);
    const [loadingdel, setLoadingdel] = useState(false)
    const [value, setValue] = useState({})
    const [dilay, setDilay] = useState("Y")
    const [selectPersonal, setSelectPersonal] = useState([])
    const [tableContentCourseEmp, settableContentCourseEmp] = React.useState([]);
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});
    const [tableContentCourse, settableContentCourse] = React.useState([]);
    const [loading, setLoading] = useState(false)
    const [add, setAdd] = useState(false)
    const [buttonName, setButtonName] = useState("افزودن")
    const [InstitutionsList, setInstitutionsList] = useState([])

    const [person, setPerson] = useState([])
    const [holdTypeList, setHoldTypeList] = useState([])
    const [expanded, setExpanded] = useState(false);
    const [name, setName] = useState([])
    const [titleTemp, settitleTemp] = useState("");
    const [wTitle, setwTitle] = useState("");
    const [item, setItem] = useState({})
    const [isApproved, setIsApproved] = useState(false)
    const [loadTable, setloadTable] = useState(true)
    const [loadTableCourse, setloadTableCourse] = useState(true)
    const [disableTitle, setdisableTitle] = useState([])
    const [disable, setdisable] = useState(false)
    const [waiting, set_waiting] = useState({ value: false, target: 0 })

    const [InstructorPartyId, setInstructorPartyId] = useState([])

    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);
    const userName = useSelector(({ auth }) => auth?.user?.data?.username);
    const myRef = useRef(null)

    const history = useHistory();

    let moment = require('moment-jalaali')

    const assessment = formVariables.assessment?.value ?? []

    const profileValues = {
        title: assessment?.title,
        code: assessment?.code,
        resp: assessment?.emplPosition,
        fromDate: moment(assessment?.fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
    }

    const topFormStructure = [{
        name: "title",
        label: "عنوان نیازسنجی ",
    }, {
        name: "code",
        label: "کد نیازسنجی",
    }, {
        name: "fromDate",
        label: "تاریخ شروع",
    }, {
        name: "resp",
        label: "مسئول نیازسنجی",
    }]


    const dispatch = useDispatch()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableCols = [
        { name: "pseudoId", label: " شماره پرسنلی ", type: "number", style: { minWidth: "130px" } },
        { name: "firstName", label: " نام", type: "text", style: { minWidth: "130px" } },
        { name: "lastName", label: "  نام خانوادگی", type: "text", style: { minWidth: "130px" } },
        // { name: "nationalId", label: "  کد ملی ", type: "number", style: { minWidth: "130px" } },
        { name: "emplPosition", label: "  پست سازمانی ", type: "text", style: { minWidth: "130px" } },
        { name: "organizationName", label: "  واحد سازمانی ", type: "text", style: { minWidth: "130px" } },
    ]
    const tableCols1 = [
        // { name: "toPartyId", label: "   (TO) ", type: "text", style: { minWidth: "60px" } },
        // { name: "fromPartyId", label: "   (From) ", type: "text", style: { minWidth: "60px" } },
        { name: "title", label: "عنوان دوره آموزشی", type: "text", style: { minWidth: "100px" } },
        { name: "priority", label: " الویت ", type: "number", style: { minWidth: "100px" } },
        { name: "CourseTypeName", label: " نوع دوره آموزشی", type: "text", style: { minWidth: "100px" } },
        { name: "fromDate", label: " زمان شروع ", type: "date", style: { minWidth: "100px" } },
        { name: "thruDate", label: " زمان پایان ", type: "date", style: { minWidth: "100px" } },
        { name: "offer", label: " پیشنهاد دهندگان ", type: "text", style: { minWidth: "250px" } },
        { name: "goals", label: " اهداف دوره آموزشی ", type: "text", style: { minWidth: "100px" } },
        { name: "accept", label: "  تایید ", type: "text", style: { width: "fit-content" }, },



    ]

    const tableCols2 = [
        { name: "title", label: "عنوان دوره ", type: "text", style: { minWidth: "100px" } },
        { name: "courseCode", label: " کد دوره ", type: "number", style: { minWidth: "100px" } },
        { name: "CourseTypeName", label: " نوع دوره ", type: "text", style: { minWidth: "100px" } },
        { name: "fromDate", label: "    زمان شروع ", type: "date", style: { minWidth: "100px" } },
        { name: "thruDate", label: "  زمان پایان ", type: "date", style: { minWidth: "100px" } },
        { name: "institute", label: "موسسه ارایه دهنده ", type: "text", style: { minWidth: "100px" } },
        { name: "cost", label: "  هزینه دوره ", type: "number", style: { minWidth: "100px" } },
        { name: "duration", label: "  مدت زمان(ساعت) ", type: "number", style: { minWidth: "60px" } },
    ]
    const formStructure = [{
        label: " نوع دوره آموزشی",
        name: "category",
        type: "select",
        options: category,
        optionIdField: "CourseTypeId",
        optionLabelField: "CourseTypeName",
        required: !disable,
        disabled: disable,
        filterOptions: options => formValues["title"] ? options.filter(o => o["CourseTitles"].indexOf(formValues["title"]) >= 0) : options,
        col: 4
    }, {
        label: "  زمان پیشنهادی شروع دوره ",
        name: "fromDate",
        type: "date",
        required: !disable,
        disabled: disable,
        // maxDate:formValues.thruDate ?? "",
        col: 4
    }, {
        label: " زمان پیشنهادی پایان دوره",
        name: "thruDate",
        type: "date",
        required: !disable,
        disabled: disable,
        // minDate:formValues.fromDate ?? "",
        col: 4

    }, {
        // label: "عنوان دوره آموزشی",
        // name: wTitle,
        // type: "text",
        // disabled:tableContentCourseEmp.length==0?false: true,
        // col: 4

        label: "عنوان دوره آموزشی",
        name: wTitle,
        // name: formValues.checkBox ? "" : "title",
        // name: name,
        type: "select",
        options: title,
        // disabled: formValues.checkBox || tableContentCourseEmp.length !== 0 ? true : false,
        optionIdField: "title",
        optionLabelField: "title",
        // required: formValues.checkBox || tableContentCourseEmp.length !== 0 ? false : true,


        required: formValues.checkBox || disable === true ? false : true,
        disabled: formValues.checkBox || disable === true ? true : false,
        col: 4,

        // filterOptions: options => formValues["InstructorPartyId"] ? eval(formValues["InstructorPartyId"]).map(x=>{}): options,

        filterOptions: (options) => {
            if (formValues.InstructorPartyId?.length > 2 || formValues["institutePartyId"]) {
                let options1 = []
                options1 = options.filter((obj) => {
                    var exist = false
                    var exist1 = false

                    if (formValues.InstructorPartyId?.length > 2 && obj["insPartyId"]) {

                        for (let item of obj["insPartyId"]) {

                            if (eval(formValues["InstructorPartyId"])?.length > 0 && eval(formValues["InstructorPartyId"]).indexOf(item) >= 0) {
                                exist = true
                            }
                        }
                        return exist

                    }




                    if (formValues["institutePartyId"] && obj["insPartyId"]) {
                        for (let item of obj["insPartyId"]) {
                            if (formValues["institutePartyId"].indexOf(item) >= 0) {
                                exist1 = true
                            }
                        }
                        return exist1
                    }





                })
                let options3 = []
                var exist2 = false

                options1 = options1.filter((obj) => {
                    if (formValues["institutePartyId"] && formValues.InstructorPartyId?.length > 2 && obj["insPartyId"]) {

                        for (let item of obj["insPartyId"]) {
                            if (formValues["institutePartyId"].indexOf(item) >= 0) {
                                exist2 = true
                            }
                        }
                        return exist2


                    }
                    return options1

                })


                return options1
            }
            if (formValues["category"]) {
                let options2 = []
                options2 = options.filter(o => o["category"] == formValues["category"])
                return options2


            }
            else
                return options
        }
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o => o["insPartyId"].indexOf(formValues["institutePartyId"]) >= 0) : options,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o => o["institutePartyId"] == formValues["institutePartyId"]) :formValues["category"] ? options.filter(o => o["category"] == formValues["category"]): options,
        // filterOptions: options => formValues["institutePartyId"]||formValues["category"] ? options.filter(o => o["institutePartyId"] == formValues["institutePartyId"]&&o["category"] == formValues["category"]): options,
        // filterOptions: options => formValues["institutePartyId"] ? options.filter(o => o["institutePartyId"] == formValues["institutePartyId"]) : formValues["category"] ? o["category"] == formValues["category"]): options,
        // filterOptions:filterList()
    }, {
        label: " الویت",
        name: "priority",
        type: "number",
        // disabled: tableContentCourseEmp.length == 0 ? false : true,

        disabled: disable,
        col: 4,
    },
    {
        label: "سایرموارد",
        name: "checkBox",
        type: "check",
        // disabled: tableContentCourseEmp.length == 0 ? false : true,
        disabled: disable,
        col: 1,

    },
    formValues.checkBox ? {
        label: "سایرموارد",
        name: titleTemp,
        type: "text",
        disabled: disable,

        required: !disable && formValues.checkBox ? true : false,
        col: 3,
        style: { width: "95%", marginRight: 10 }
    } : {
        name: "empty",
        label: "",
        type: "text",
        disabled: true,
        // visibility: "hidden"
        style: { visibility: "hidden" }
        // component: <Box style={{ borderWidth: 0, width: 0, height: 0 }} />

    },
    {
        label: "هزینه",
        name: "cost",
        type: "number",
        col: 4
    },
    {
        label: "موسسه",
        options: InstitutionsList,
        // optionIdField: "partyId",
        // optionLabelField: "organizationName",
        optionIdField: "enumId",
        optionLabelField: "description",
        name: "institutePartyId",
        type: "select",
        required: true,
        col: 4,
        // filterOptions: options => !disableTitle && formValues["title"] ? options.filter(o => o["CourseTitle"].indexOf(formValues["title"]) >= 0) : options,
        filterOptions: options => formValues["title"] ? options.filter(o => o["CourseTitle"].indexOf(formValues["title"]) >= 0) : options,

        // filterOptions: options =>formValues.checkBox &&formValues["titleTemp"]?options.filter(o => o["CourseTitle"].indexOf(formValues["titleTemp"]) >= 0):
        // !disableTitle && formValues["title"] ? options.filter(o => o["CourseTitle"].indexOf(formValues["title"]) >= 0) 
        // : options,

    },
    {
        label: "مدرسین مجاز",
        options: person,
        optionIdField: "partyIdInstructor",
        optionLabelField: "lastNameInstructor",
        name: "InstructorPartyId",
        type: "multiselect",
        required: true,
        col: 4,
        // filterOptions: options => !disableTitle && formValues["title"] ? options.filter(o => o["CourseTitles"].indexOf(formValues["title"]) >= 0) : options,
        filterOptions: options => formValues["title"] ? options.filter(o => o["CourseTitles"].indexOf(formValues["title"]) >= 0) : options,



    },

    {
        label: "مدت زمان دوره",
        name: "duration",
        type: "number",
        col: 4
    },
    {
        label: "نحوه برگزاری دوره",
        name: "holdType",
        type: "select",
        options: holdTypeList,
        optionIdField: "enumId",
        optionLabelField: "description",

        col: 4
    },
    {
        label: "  اهداف دوره درخواستی ",
        name: "goals",
        type: "textarea",
        rows: 4,
        disabled: disable,
        col: 4
    },
    ]

    useEffect(() => {


        if (InstructorPartyId && InstructorPartyId[0] === "")
            setInstructorPartyId([])

    }, [formValues.InstructorPartyId, InstructorPartyId])
    useEffect(() => {
        let str = formValues.InstructorPartyId?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setInstructorPartyId(array)

    }, [formValues.InstructorPartyId]);



    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/coursesInfo", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setTitle(res.data.courseTitles)
            setCategory(res.data.courseType)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }, []);

    useEffect(() => {
        if (formValues.checkBox)
            setdisableTitle(true)
        else
            setdisableTitle(false)

    }, [formValues.checkBox]);
    // useEffect(() => {
    //     axios.get(SERVER_URL + "/rest/s1/training/getCoursesInfo", {
    //         headers: { 'api_key': localStorage.getItem('api_key') }
    //     }).then(res => {

    //     }).catch(() => {
    //         dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
    //     });
    // }, []);


    useEffect(() => {
        // if (formValues.checkBox && dilay === "Y") {
        //     let result = ""
        //     setFormValues(prevstate => ({ ...prevstate, title: result }))
        // }
        if (formValues.checkBox === true) {
            settitleTemp("title")
            setwTitle("noTitle")
            let result = ""
            setFormValues(prevstate => ({ ...prevstate, noTitle: result }))
            if (tableContentCourseEmp.length === 0 && buttonName !== "ویرایش")

                setFormValues(prevstate => ({ ...prevstate, title: result }))

        }
        else {
            setwTitle("title")
            settitleTemp("noTitle")

            let result = ""
            setFormValues(prevstate => ({ ...prevstate, noTitle: result }))
        }
    }, [formValues.checkBox]);



    useEffect(() => {
        settableContentCourseEmp([])
        setFormValues([])
        setdisable(false)
        let emplPositionId = props.formVariables.managerList?.value?.find(x => x.username = userName).emplPositionId

        if (selectPersonal.length != 0) {
            axios.post(SERVER_URL + "/rest/s1/training/PostCoursesInfo", { data: selectPersonal, curriculumId: props.formVariables.assessment.value.curriculumId }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت دریافت شد'));
                    setButtonName("افزودن")
                    settableContentCourse(res.data.resultAccept)
                    // settableContentCourseEmp(res.data.result)
                    // let result=res.data.result.filter(item=>item.offer.includes(emplPositionId))
                    settableContentCourseEmp(res.data.result)


                    // if (res.data.result.length > 0) {
                    //     let list = []
                    //     res.data.result.map((item, index) => {

                    //         if (item.offer.split(',').length === 1)
                    //             list.push(item)

                    //     })
                    //     settableContentCourseEmp(list)

                    // }


                    setName(" دوره های درخواست شده برای" + " " + selectPersonal[0].lastName)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات موجود نیست!'));
                });
        }


    }, [selectPersonal, loadTableCourse])

    const scrollToRef1 = () => myRef.current.scrollIntoView()

    const handleEdit = (row) => {
        setdisable(true)
        scrollToRef1()
        setButtonName("افزودن")
        setItem(row)
        setExpanded(true)
        // setDilay("N")
        row.checkBox = row.type === "temporarily" ? true : false
        setValue(row)

        setFormValues(prevState => ({
            ...prevState,
            courseId: row.courseId,
            curriculumCourseId: row.curriculumCourseId,
            courseCode: row.courseCode,
            toPartyId: row.toPartyId,
            type: row.type,
            offer: row.offer,
            fromPartyId: row.fromPartyId,
            cost: row.cost,
            checkBox: row.checkBox,
            CourseTypeName: row.CourseTypeName,
            companyPartyId: row.companyPartyId,
            fromDate: row.fromDate,
            thruDate: row.thruDate,
            category: row.category,
            title: row.title,
            priority: row.priority,
            institutePartyId: row.institutePartyId,
            InstructorPartyId: JSON.stringify(row.InstructorPartyId?.toString()),
            duration: row.duration,
            holdType: row.holdType,
            goals: row.goals
        }))
        // setAdd(true)

    }

    const addCourseEmp = () => {


        set_waiting({ value: true, target: 1 })

        let data = {
            title: formValues.title,
            category: formValues.category,
            fromDate: formValues.fromDate,
            thruDate: formValues.thruDate,
            priority: formValues.priority,
            type: formValues.checkBox ? "temporarily" : "",
            goals: formValues.goals,
            partyId: selectPersonal[0].partyId,
            cost: formValues.cost,
            institutePartyId: formValues.institutePartyId,
            duration: formValues.duration,
            holdType: formValues.holdType,
            InstructorPartyId: formValues.InstructorPartyId.charAt(0) === "[" ? formValues.InstructorPartyId : InstructorPartyId,
            courseId: formValues.courseId ? formValues.courseId : "",
            curriculumCourseId: formValues.curriculumCourseId ? formValues.curriculumCourseId : "",
            curriculumId: props.formVariables.assessment.value.curriculumId


        }

        let emplPositionId = props.formVariables.contactsManager?.value?.emplPositionId

        axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfoByManager", { data: data, emplPositionId: selectPersonal[0].emplPositionId, managerEmplPostitionId: emplPositionId }, axiosKey)
            .then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setLoading(!loading)
                if (buttonName === "ویرایش")
                    setloadTableCourse(!loadTableCourse)
                setFormValues([])


                setButtonName("افزودن")
                setFormValues([])

                let listTableContent = [...tableContentCourse]
                let filterList = []
                filterList = listTableContent.filter(el => el.courseId == formValues.courseId)
                filterList = listTableContent.findIndex(ele => ele === filterList[0])
                if (filterList !== -1) {
                    listTableContent[filterList] = formValues
                    settableContentCourse(listTableContent)
                } else if (filterList === -1) {
                    settableContentCourse(prevState => { return [...prevState, ...res.data.result] })
                }

                set_waiting({ value: false, target: 0 })

                // if (buttonName === "افزودن") {
                //     const listTableContentE = [...tableContentCourseEmp];
                //     let fList = listTableContentE.findIndex(ele => ele === item)
                //     let reduser = listTableContentE.splice(fList, 1)
                //     settableContentCourseEmp(listTableContentE)
                //     setdisable(false)

                // }

            }).catch(() => {
                set_waiting({ value: false, target: 0 })

                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }


    const addCourse = (index) => {
        formValues.courseCode = value.courseCode;
        if (formValues.InstructorPartyId?.length > 2 || formValues.InstructorPartyId?.length === undefined) {
            // if (tableContentCourseEmp.length == 0 && value.length !== 0) {
            if (!disable) {

                addCourseEmp()
            }
            else {
                let emplPositionId = props.formVariables.managerList.value.find(x => x.username = userName).emplPositionId

                axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfoManager", { data: formValues, InstructorPartyId: InstructorPartyId, emplPositionId: selectPersonal[0].emplPositionId, managerEmplPostitionId: emplPositionId }, axiosKey)
                    .then(() => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                        setLoading(!loading)
                        if (buttonName === "ویرایش")
                            setButtonName("افزودن")
                        else
                            setButtonName("افزودن")
                        setFormValues([])



                        axios.post(SERVER_URL + "/rest/s1/training/getCourseEmployee", { data: formValues, curriculumId: props.formVariables.assessment.value.curriculumId }, axiosKey)
                            .then((res) => {
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت دریافت شد'));

                                let listTableContent = [...tableContentCourse]
                                let filterList = []
                                filterList = listTableContent.filter(el => el.courseId == formValues.courseId)
                                filterList = listTableContent.findIndex(ele => ele === filterList[0])
                                if (filterList !== -1) {
                                    listTableContent[filterList] = formValues
                                    settableContentCourse(listTableContent)
                                } else if (filterList === -1) {
                                    settableContentCourse(prevState => { return [...prevState, ...res.data.courseList] })
                                }
                                // const uniqList=Array.from(new Set(res.data.party))

                                //     settableContentCourse(prevState=>{
                                //     return [
                                //         ...prevState,
                                //         ...res.data.courseList,
                                //     ]
                                // })

                                if (buttonName === "افزودن") {
                                    const listTableContentE = [...tableContentCourseEmp];
                                    let fList = listTableContentE.findIndex(ele => ele === item)
                                    let reduser = listTableContentE.splice(fList, 1)
                                    settableContentCourseEmp(listTableContentE)
                                    setdisable(false)
                                }

                            }).catch(() => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
                            });

                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    });
            }
        }
        else

            dispatch(setAlertContent(ALERT_TYPES.ERROR, "باید تمام فیلدهای ضروری وارد شوند!"));

    }

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/training/deleteCourseEmployee?curriculumCourseId=" + oldData.curriculumCourseId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoadingdel(!loadingdel)

                    const listTableContentE = [...tableContentCourse];
                    let ind = listTableContentE.indexOf(oldData)
                    let reduser = listTableContentE.splice(ind, 1)
                    settableContentCourse(listTableContentE)

                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
            setdisable(false)
            setExpanded(true)
            setFormValues([])
        })
    }
    const handleReset = () => {
        setdisable(false)

        setFormValues([])
        if (buttonName === "ویرایش")
            setButtonName("افزودن")
        else
            setButtonName("افزودن")

    }


    const scrollToRef = () => myRef.current.scrollIntoView()

    const handleEditTable = (row) => {
        console.log("rowwwwwwwwwwwwwww", row)

        setdisable(false)
        scrollToRef()
        setExpanded(true)
        setDilay("N")
        setButtonName("ویرایش")
        row.checkBox = row.type === "temporarily" ? true : false
        setValue(row)

        setFormValues(prevState => ({
            ...prevState,
            courseId: row.courseId,
            curriculumCourseId: row.curriculumCourseId,
            courseCode: row.courseCode,
            toPartyId: row.toPartyId,
            type: row.type,
            offer: row.offer,
            fromPartyId: row.fromPartyId,
            cost: row.cost,
            checkBox: row.checkBox,
            CourseTypeName: row.CourseTypeName,
            companyPartyId: row.companyPartyId,
            fromDate: row.fromDate,
            thruDate: row.thruDate,
            category: row.category,
            title: row.title,
            priority: row.priority,
            institutePartyId: row.institutePartyId,
            InstructorPartyId: JSON.stringify(row.InstructorPartyId?.toString()),
            duration: row.duration,
            holdType: row.holdType,
            goals: row.goals
        }))

    }
    useEffect(() => {
        let emplPositionId = props.formVariables.contactsManager.value.emplPositionId

        // axios.get(SERVER_URL + "/rest/s1/training/getPerson", {
        //     headers: { 'api_key': localStorage.getItem('api_key') }
        // }).then(res => {
        //     // setTableContent(res.data.result)
        //     // const uniqList=Array.from(new Set(res.data.party))
        //     setTableContent(res.data.party)
        //     setloadTable(false)

        // }).catch(() => {
        //     dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        // });


        axios.post(SERVER_URL + "/rest/s1/training/getPersonOfManager", { emplPositionId: emplPositionId }, axiosKey)
            .then((res) => {
                setloadTable(false)
                setTableContent(res.data.result)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));

            });



    }, []);

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/InstitutionsList", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setHoldTypeList(res.data.holdTypeList)

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }, []);

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/getInstructorInstitute", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setInstitutionsList(res.data.institutesList)
            setPerson(res.data.instructorsList)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }, []);
    const route = () => {
        setIsApproved(true)
    }
  
    const onChange = () => {
        if (formValues.curriculumCourseId|| disable === true) {
            setExpanded(true)
            setdisable(false)
            setFormValues([])
            setButtonName("افزودن")
        }

        else
            setExpanded(prevState => !prevState)



    }
    return (
        <Box>
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{ width: "auto" }}>
                    {topFormStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {!isApproved && <Card >
                <CardContent>
                    <CardHeader title={" دوره های آموزشی درخواستی مدیران"} />
                    <CardContent>
                        <Card >
                            <TablePro
                                title=" لیست کارمندان واحد "
                                columns={tableCols}
                                rows={tableContent}
                                loading={loadTable}
                                selectable
                                selectedRows={selectPersonal}
                                setSelectedRows={setSelectPersonal}
                                singleSelect
                            // isSelected={(row, selectedRows) => selectedRows.map(i => i.partyId).indexOf(row.partyId) !== -1}
                            />
                        </Card>
                    </CardContent>

                </CardContent>
                <CardContent>
                    <CardContent>
                        <Card >
                            <TablePro
                                title={name}
                                columns={tableCols1}
                                rows={tableContentCourseEmp}
                                // editCallback={handleEdit}
                                // edit={"callback"}
                                rowActions={[
                                    {
                                        title: "تایید",
                                        icon: CheckIcon,
                                        onClick: handleEdit,
                                        style: { width: "70px" }
                                    }
                                ]}
                            />
                        </Card>
                    </CardContent>
                </CardContent>
                <CardContent>
                    <CardContent>
                        <CardHeader title={name} style={{ justifyContent: "center", textAlign: "center", margin: 10, color: "gray" }} ref={myRef}
                            action={
                                <Tooltip title="    افزودن دوره      ">
                                    <ToggleButton
                                        value="check"
                                        selected={expanded}
                                        // onChange={() => setExpanded(prevState => !prevState)}
                                        onChange={onChange}
                                    >

                                        <AddBoxIcon style={{ color: 'gray' }} />
                                    </ToggleButton>
                                </Tooltip>
                            } />
                        {expanded ?
                            <CardContent >
                                <Collapse in={expanded}>
                                    <CardContent >
                                        <FormPro
                                            append={formStructure}
                                            formValues={formValues}
                                            setFormValues={setFormValues}
                                            setFormValidation={setFormValidation}
                                            formValidation={formValidation}
                                            submitCallback={addCourse}
                                            resetCallback={handleReset}
                                            actionBox={<ActionBox>
                                                <Button type="submit" role="primary" disabled={waiting.value || selectPersonal.length === 0} endIcon={waiting.target == 1 ? <CircularProgress size={20} /> : null} >{buttonName}</Button>
                                                <Button type="reset" role="secondary">لغو</Button>
                                            </ActionBox>}

                                        />
                                    </CardContent>


                                </Collapse>
                            </CardContent>
                            : ""}
                    </CardContent>
                    <CardContent>
                        <Card>
                            <TablePro
                                title="  دوره های بررسی شده "
                                columns={tableCols2}
                                rows={tableContentCourse}
                                editCallback={handleEditTable}
                                edit={"callback"}
                                removeCallback={handleRemove}
                            />
                        </Card>
                    </CardContent>
                </CardContent>
                {/* <Grid xs={10}> */}
                <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>

                    <Button onClick={route} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white", marginRight: "86%" }} >
                        تایید
                    </Button>
                </Box>
                {/* </Grid> */}
            </Card>
            }
            {isApproved && <RecordCoursesListForm curriculumId={curriculumId} submitCallback={submitCallback} setIsApproved={setIsApproved} managerList={formVariables.managerList?.value} priorities={formVariables.priorities?.value} contactsManager={formVariables.contactsManager?.value} />}

        </Box>
    )
}


export default NeedAssessmentManagerForm;





