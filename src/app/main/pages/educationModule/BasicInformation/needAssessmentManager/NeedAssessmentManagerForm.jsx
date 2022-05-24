import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from '@material-ui/icons/Check';
import { SERVER_URL } from "../../../../../../configs";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Grid } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import { useHistory } from 'react-router-dom';

const NeedAssessmentManagerForm = (props) => {
    const [tableContent, setTableContent] = React.useState([]);
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
    const [loadTableCourse, setloadTableCourse] = useState(true)
    const [loadTable, setloadTable] = useState(true)

    const [disableTitle, setdisableTitle] = useState([])

    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);
    const myRef = useRef(null)

    const history = useHistory();


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
        { name: "priority", label: " الویت ", type: "number", style: { minWidth: "100px" } },
        { name: "CourseTypeName", label: " نوع دوره آموزشی", type: "text", style: { minWidth: "100px" } },
        { name: "title", label: "عنوان دوره آموزشی", type: "text", style: { minWidth: "100px" } },
        { name: "fromDate", label: " زمان شروع ", type: "date", style: { minWidth: "100px" } },
        { name: "thruDate", label: " زمان پایان ", type: "date", style: { minWidth: "100px" } },
        { name: "offer", label: " پیشنهاد دهندگان ", type: "text", style: { minWidth: "250px" } },
        { name: "goals", label: " اهداف دوره آموزشی ", type: "text", style: { minWidth: "100px" } },
        { name: "accept", label: "  تایید ", type: "text", style: { width: "fit-content"},},

        // { name: "InstructorPartyId", label: "  معلم ", type: "select", style: { minWidth: "100px" } },



    ]

    const tableCols2 = [
        { name: "courseCode", label: " کد دوره ", type: "number", style: { minWidth: "100px" } },
        { name: "CourseTypeName", label: " نوع دوره ", type: "text", style: { minWidth: "100px" } },
        { name: "title", label: "عنوان دوره ", type: "text", style: { minWidth: "100px" } },
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
        required: tableContentCourseEmp.length == 0 ? true : false,
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        // filterOptions: options => formValues["title"] ? options.filter(o => o["CourseTitles"].indexOf(formValues["title"]) >= 0) : options,


        filterOptions: (options) => {
            if (formValues["title"] || formValues["institutePartyId"] || formValues.InstructorPartyId?.length > 2) {
                let options1 = []
                options1 = options.filter((obj) => {
                    var exist = false
                    var exist1 = false
                    var exist2 = false

                    if (formValues["title"] && obj["CourseTitles"]) {

                        for (let item of obj["CourseTitles"]) {
                            if (formValues["title"].indexOf(item) >= 0) {
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

                    if (formValues.InstructorPartyId?.length > 2 && obj["insPartyId"]) {
                        for (let item of obj["insPartyId"]) {
                            if (formValues["InstructorPartyId"].indexOf(item) >= 0) {
                                exist2 = true
                            }
                        }
                        return exist2
                    }




                })

                return options1
            }

            else
                return options
        },
        col: 4
    }, {
        label: "  زمان پیشنهادی شروع دوره ",
        name: "fromDate",
        type: "date",
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        required: tableContentCourseEmp.length == 0 ? true : false,
        maxDate: formValues.thruDate ?? "",
        col: 4
    }, {
        label: " زمان پیشنهادی پایان دوره",
        name: "thruDate",
        type: "date",
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        required: tableContentCourseEmp.length == 0 ? true : false,
        minDate: formValues.fromDate ?? "",
        col: 4

    }, {


        label: "عنوان دوره آموزشی",
        name: wTitle,
        type: "select",
        options: title,
        disabled: formValues.checkBox || tableContentCourseEmp.length !== 0 ? true : false,
        optionIdField: "title",
        optionLabelField: "title",
        required: formValues.checkBox || tableContentCourseEmp.length !== 0 ? false : true,
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
                var exist2 = false
                var exist3 = false


                options1 = options1.filter((obj) => {
                    if (formValues["institutePartyId"] && obj["insPartyId"]) {

                        for (let item of obj["insPartyId"]) {
                            if (formValues["institutePartyId"].indexOf(item) >= 0) {
                                exist2 = true
                            }
                        }
                        return exist2


                    }
                    return options1

                })
                options1 = options1.filter((obj) => {
                    if (formValues.InstructorPartyId?.length > 2 && obj["insPartyId"]) {

                        for (let item of obj["insPartyId"]) {
                            if (eval(formValues["InstructorPartyId"])?.length > 0 && eval(formValues["InstructorPartyId"]).indexOf(item) >= 0) {

                                exist3 = true
                            }
                        }
                        return exist3


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

    }, {
        label: " الویت",
        name: "priority",
        type: "number",
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        col: 4,
    },
    {
        label: "سایرموارد",
        name: "checkBox",
        type: "check",
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        col: 1,

    },
    formValues.checkBox ? {
        label: "سایرموارد",
        name: titleTemp,
        type: "text",
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        required: tableContentCourseEmp.length === 0 && formValues.checkBox ? true : false,
        col: 3,
        style: { width: "95%", marginRight: 10 }
    } : {
        name: "empty",
        label: "",
        type: "text",
        disabled: true,
        style: { visibility: "hidden" }
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
        optionIdField: "enumId",
        optionLabelField: "description",
        name: "institutePartyId",
        type: "select",
        // required: true,
        disabled: formValues.checkBox ? true : false,
        // required: formValues.checkBox ? false : true,
        col: 4,
        // filterOptions: (options) => {
        //     if (formValues["title"] || formValues["category"] || formValues.InstructorPartyId?.length > 2) {
        //         let options1 = []
        //         options1 = options.filter((obj) => {
        //             var exist = false
        //             var exist1 = false
        //             var exist2 = false

        //             if (formValues["title"] && obj["CourseTitle"]) {

        //                 for (let item of obj["CourseTitle"]) {
        //                     if (formValues["title"].indexOf(item) >= 0) {
        //                         exist = true
        //                     }
        //                 }
        //                 return exist

        //             }

        //             if (formValues["category"] && obj["category"]) {
        //                 for (let item of obj["category"]) {
        //                     if (formValues["category"].indexOf(item) >= 0) {
        //                         exist1 = true
        //                     }
        //                 }
        //                 return exist1
        //             }
        //             if (formValues.InstructorPartyId?.length > 2 && obj["insParty"]) {

        //                 for (let item of obj["insParty"]) {
        //                     if (eval(formValues["InstructorPartyId"])?.length > 0 && eval(formValues["InstructorPartyId"]).indexOf(item) >= 0) {

        //                         exist2 = true
        //                     }
        //                 }
        //                 return exist2


        //             }


        //         })

        //         return options1
        //     }
        //     else
        //         return options
        // }
    },
    {
        label: "مدرسین مجاز",
        options: person,
        optionIdField: "partyIdInstructor",
        optionLabelField: "lastNameInstructor",
        name: "InstructorPartyId",
        type: "multiselect",
        // required: true,
        disabled: formValues.checkBox ? true : false,
        // required: formValues.checkBox ? false : true,
        col: 4,



        // filterOptions: (options) => {
        //     if (formValues["title"] || formValues["category"] || formValues["institutePartyId"]) {
        //         let options1 = []
        //         options1 = options.filter((obj) => {
        //             var exist = false
        //             var exist1 = false
        //             var exist2 = false

        //             if (formValues["title"] && obj["CourseTitles"]) {

        //                 for (let item of obj["CourseTitles"]) {
        //                     if (formValues["title"].indexOf(item) >= 0) {
        //                         exist = true
        //                     }
        //                 }
        //                 return exist

        //             }

        //             if (formValues["category"] && obj["category"]) {
        //                 for (let item of obj["category"]) {
        //                     if (formValues["category"].indexOf(item) >= 0) {
        //                         exist1 = true
        //                     }
        //                 }
        //                 return exist1
        //             }
        //             if (formValues["institutePartyId"] && obj["insPartyId"]) {
        //                 for (let item of obj["insPartyId"]) {
        //                     if (formValues["institutePartyId"].indexOf(item) >= 0) {
        //                         exist2 = true
        //                     }
        //                 }
        //                 return exist2
        //             }
        //         })
        //         return options1
        //     }

        //     else
        //         return options
        // }

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
        disabled: tableContentCourseEmp.length == 0 ? false : true,
        col: 4
    },
    ]

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/coursesInfo", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setTitle(res.data.courseTitles)
            setCategory(res.data.courseType)
            console.log(res.data.courseTitles, "hhh1")
            console.log(res.data.courseType, "hhh2")

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
    useEffect(() => {
        console.log(formValues?.thruDate?.length, "lle1")
        console.log(formValues?.thruDate, "lle1")

        console.log(formValues?.fromDate?.length, "lle2")
        console.log(formValues?.fromDate, "lle2")


    }, [formValues]);



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
        // setExpanded(false)
        if (selectPersonal.length != 0) {
            axios.post(SERVER_URL + "/rest/s1/training/PostCoursesInfo", { data: selectPersonal }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت دریافت شد'));
                    // const uniqList = Array.from(new Set(res.data.result))
                    setButtonName("افزودن")
                    settableContentCourse(res.data.resultAccept)
                    console.log(res.data.result,"res.data.result............")
                    let filterList = []
                    filterList = res.data.result.filter(item => eval(item.offer).length===1)

                    // filterList = res.data.result.filter(item => !item.toPartyId)
                res.data.result.filter(item =>    console.log(eval(item.offer).length,"length............"))
                    console.log(filterList,"filterListOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

                    settableContentCourseEmp(res.data.result)
                 

                    // settableContentCourseEmp(prevstate =>({...prevstate ,title :result }))

                    setName(" دوره های درخواست شده برای" + " " + selectPersonal[0].lastName)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات موجود نیست!'));
                });
        }


    }, [selectPersonal, loadTableCourse])

    const scrollToRef1 = () => myRef.current.scrollIntoView()

    const handleEdit = (row) => {
        scrollToRef1()
        setButtonName("افزودن")
        setItem(row)
        setExpanded(true)
        // setDilay("N")
        row.checkBox = row.type === "temporarily" ? true : false
        setValue(row)
        // setFormValues(row)

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

    const addCourseEmp = () => {
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
            InstructorPartyId: formValues.InstructorPartyId,
            courseId: formValues.courseId ? formValues.courseId : "",
            curriculumCourseId: formValues.curriculumCourseId ? formValues.curriculumCourseId : ""

        }


        axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfoByManager", { data: data }, axiosKey)
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
                }

            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }


    const addCourse = (index) => {
        formValues.courseCode = value.courseCode;
        console.log(formValues, "ffffppp")
        // if (formValues.InstructorPartyId?.length > 2 || formValues.InstructorPartyId?.length === undefined) {
            if (tableContentCourseEmp.length == 0 && value.length !== 0) {

                addCourseEmp()
            }
            else {
                axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfoManager", { data: formValues }, axiosKey)
                    .then(() => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                        setLoading(!loading)
                        if (buttonName === "ویرایش")
                            setButtonName("افزودن")
                        else
                            setButtonName("افزودن")
                        setFormValues([])



                        axios.post(SERVER_URL + "/rest/s1/training/getCourseEmployee", { data: formValues }, axiosKey)
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
                                }

                            }).catch(() => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
                            });

                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    });
            }
        // }
        // else

            // dispatch(setAlertContent(ALERT_TYPES.ERROR, "باید تمام فیلدهای ضروری وارد شوند!"));

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
        setFormValues([])

        })
    }
    const handleReset = () => {
        setFormValues([])
        if (buttonName === "ویرایش")
            setButtonName("افزودن")
        else
            setButtonName("افزودن")

    }
    const scrollToRef = () => myRef.current.scrollIntoView()

    const handleEditTable = (row) => {
        scrollToRef()
console.log("rowwwwwwwwwwwwwww",row)
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
        // /rest/s1/training/personInformation
        // "/rest/s1/fadak/searchPersonnelAndEmplOrder"
        // /rest/s1/fadak/party/search
        // axios.get(SERVER_URL + "/rest/s1/training/personInformation", {

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


        axios.post(SERVER_URL + "/rest/s1/training/getPersonOfManager", { emplPositionId: "101137" }, axiosKey)
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
            setInstitutionsList(res.data.orgResult)
            setPerson(res.data.personResult)
            setHoldTypeList(res.data.holdTypeList)
            console.log(res.data.institutesList, "jjjj")

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
        history.push(`/recordCoursesList`);

    }
    return (
        <Box>
            <Card >
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
                        {console.log(tableContentCourseEmp, "tableContentCourseEmp")}
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
                                        style : {width : "70px"}
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
                                <Tooltip title="   دوره های درخواست شده    ">
                                    <ToggleButton
                                        value="check"
                                        selected={expanded}
                                        onChange={() => setExpanded(prevState => !prevState)}
                                    >
                                        <FilterListRoundedIcon style={{ color: 'gray' }} />
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
                                                <Button type="submit" role="primary" disabled={selectPersonal.length === 0 ? true : false}>{buttonName}</Button>
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
                            {console.log(tableContentCourse, "tableContentCourse.............")}

                            <TablePro
                                title="  دوره های درخواست شده "
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
                    <Button onClick={route} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white" }} >
                        تایید
                    </Button>
                </Box>
                {/* </Grid> */}
            </Card>



        </Box>
    )
}


export default NeedAssessmentManagerForm;





