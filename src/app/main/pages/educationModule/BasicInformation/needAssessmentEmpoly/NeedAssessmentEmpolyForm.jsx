import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { SERVER_URL } from "../../../../../../configs";

import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';

const NeedAssessmentEmpolyForm = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState([]);
    const [title, setTitle] = useState([]);
    const [titleTemp, settitleTemp] = useState("lastTempTitle");
    const [name, setname] = useState("lastTitle");

    const [add, setAdd] = useState(false)
    const [loadingdel, setLoadingdel] = useState(false)
    const [value, setValue] = useState(false)
    const [dilay, setDilay] = useState("Y")

    const [buttonName, setButtonName] = useState("افزودن")

    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);




    const dispatch = useDispatch()




    const tableCols = [
        { name: "priority", label: " الویت ", type: "number", style: { minWidth: "130px" } },
        { name: "CourseTypeName", label: " نوع دوره آموزشی", type: "text", style: { minWidth: "130px" } },
        { name: "title", label: "عنوان دوره آموزشی", type: "text", style: { minWidth: "130px" } },
        { name: "fromDate", label: "    زمان شروع ", type: "date", style: { minWidth: "130px" } },
        { name: "thruDate", label: "  زمان پایان ", type: "date", style: { minWidth: "130px" } },

    ]



    const formStructure = [{
        label: " نوع دوره آموزشی",
        name: "category",
        type: "select",
        options: category,
        optionIdField: "CourseTypeId",
        optionLabelField: "CourseTypeName",
        required: true,
        filterOptions: options => formValues["title"] ? options.filter(o => o["CourseTitles"].indexOf(formValues["title"]) >= 0) : options,
        col: 4
    }, {
        label: "  زمان پیشنهادی شروع دوره ",
        name: "fromDate",
        type: "date",
        required: true,
        maxDate: formValues.thruDate ?? "",
        col: 4
    }, {
        label: " زمان پیشنهادی پایان دوره",
        name: "thruDate",
        type: "date",
        required: true,
        minDate: formValues.fromDate ?? "",
        col: 4

    }, {
        label: "عنوان دوره آموزشی",
        name: formValues.checkBox ? "" : "title",
        // name: name,
        type: "select",
        options: title,
        disabled: formValues.checkBox ? "true" : false,
        optionIdField: "title",
        optionLabelField: "title",
        required: formValues.checkBox ? false : true,
        filterOptions: options => formValues["category"] ? options.filter(o => o["category"] == formValues["category"]) : options,

        col: 4
    }, {
        label: " الویت",
        name: "priority",
        type: "number",
        col: 4
    },
    {
        label: "سایرموارد",
        name: "checkBox",
        type: "check",
        col: 1
    },
    formValues.checkBox ? {
        label: "سایرموارد",
        name: formValues.checkBox ? "title" : "",
        required: formValues.checkBox ? true : false,
        // name: titleTemp,
        type: "text",
        col: 3
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
        label: "  اهداف دوره درخواستی ",
        name: "goals",
        type: "textarea",
        rows: 4,
        col: 6
    }
    ]
    useEffect(() => {
        setDilay("Y")
        if (formValues.checkBox === true && dilay === "Y") {
            setname("lastTitle")
            settitleTemp("title")
            let result = ""
            setFormValues(prevstate => ({ ...prevstate, lastTitle: result }))
            setFormValues(prevstate => ({ ...prevstate, title: result }))

        }
        else if (formValues.checkBox === false) {
            settitleTemp("lastTempTitle")
            setname("title")
            let result = ""
            setFormValues(prevstate => ({ ...prevstate, lastTempTitle: result }))

        }
        console.log(formValues.checkBox, "rrrrr1")

    }, [formValues.checkBox]);
    useEffect(() => {
        console.log(partyRelationshipId, "party")
        getAssessments()
    }, [loading, loadingdel]);

    function getAssessments() {
        axios.get(SERVER_URL + "/rest/s1/training/coursesInfo", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setTableContent(res.data.result)
            setTitle(res.data.courseTitles)
            setCategory(res.data.courseType)
            console.log(res.data, "ffff")
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }
    const handleEdit = (row) => {
        setDilay("N")
        let tableContentE = [...tableContent]
        setTableContent(tableContentE.filter(item => item.priority !== row.priority))
        console.log(row, "rrrrrow")
        row.checkBox = row.type === "temporarily" ? true : false

        console.log(row.checkBox, "rrrrrow")

        if (row.checkBox === true) {
            settitleTemp("title")
            setname("lastTitle")
            let result = ""
            setFormValues(prevstate => ({ ...prevstate, title: result }))

        }
        else {
            settitleTemp("lastTempTitle")
            setname("title")
            let result = ""
            setFormValues(prevstate => ({ ...prevstate, title: result }))

        }
        console.log(formValues.checkBox, "rrrrr1")


        setButtonName("ویرایش")
        setFormValues(row)

        // if(row.type==="temporarily")
        // formValues.checkBox='Y'
        // else
        // formValues.checkBox='N'


        setValue(row)
        console.log(row, "rrrrrrrr")
        console.log(formValues.checkBox, "rrrrrrrr")

        setAdd(true)

    }
    const submit = () => {
        console.log(add, "add")
        if (buttonName === "افزودن")
            addCourse()
        else
            editCourse()


    }

    const addCourse = () => {
        let data = {
            partyRelationshipId: partyRelationshipId,
            title: formValues.title,
            category: formValues.category,
            fromDate: formValues.fromDate,
            thruDate: formValues.thruDate,
            priority: formValues.priority,
            type: formValues.checkBox ? "temporarily" : "",
            goals: formValues.goals

        }

        console.log("tableContent", tableContent)
        if (tableContent.length > 0 && tableContent.find(item => item.priority === data.priority))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت وارد شده تکراری است!'));

        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' دوره وارد شده تکراری است!'));


        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title) && tableContent.find(item => item.priority === data.priority))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت و دوره وارد شده تکراری است!'));

        if (tableContent.length === 0 || (tableContent.filter(item => item.priority === data.priority).length <= 0 && tableContent.filter(item => item.title === data.title).length <= 0)) {

            axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfo", { data: data }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoading(!loading)
                    setFormValues([])

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }


    }
    const editCourse = () => {
        console.log(value, "courseId")
        formValues.courseId = value.courseId
        console.log(formValues, "formValues")
        let data = {
            courseCode: value.courseCode,
            partyRelationshipId: partyRelationshipId,
            courseId: formValues.courseId,
            curriculumCourseId: formValues.curriculumCourseId,
            title: formValues.title,
            category: formValues.category,
            fromDate: formValues.fromDate,
            thruDate: formValues.thruDate,
            priority: formValues.priority,
            type: formValues.checkBox ? "temporarily" : "",
            goals: formValues.goals

        }
        if (tableContent.length > 0 && tableContent.find(item => item.priority === data.priority))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت وارد شده تکراری است!'));

        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' دوره وارد شده تکراری است!'));


        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title) && tableContent.find(item => item.priority === data.priority))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت و دوره وارد شده تکراری است!'));
        if (tableContent.length === 0 || (tableContent.filter(item => item.priority === data.priority).length <= 0 && tableContent.filter(item => item.title === data.title).length <= 0)) {
            return new Promise((resolve, reject) => {
                axios.post(SERVER_URL + "/rest/s1/training/updateCoursesInfo", { data: data }, axiosKey)
                    .then(() => {
                        if (buttonName === "ویرایش")
                            setButtonName("افزودن")
                        else
                            setButtonName("افزودن")
                        setFormValues([])
                        setLoading(!loading)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));

                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));

                    })
            })
        }
    }
    const handleRemove = (oldData) => {
        if (buttonName === "ویرایش")
            setButtonName("افزودن")
        else
            setButtonName("افزودن")
        setFormValues([])

        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/training/deleteCoursesInfo?curriculumCourseId=" + oldData.curriculumCourseId, axiosKey)
                .then((res) => {
                    console.log("testAAA", res)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoadingdel(!loadingdel)

                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }
    const handleReset = () => {
        setFormValues([])
        setLoading(!loading)
        setButtonName("افزودن")
    }

    return (
        <Box>
            <Card >
                <CardHeader title={" دوره های آموزشی درخواستی کارمندان"} />
                <CardContent>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        setFormValidation={setFormValidation}
                        formValidation={formValidation}
                        submitCallback={
                            submit
                        }
                        resetCallback={handleReset}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">{buttonName}</Button>

                            <Button type="reset" role="secondary">لغو</Button>
                        </ActionBox>}

                    />
                </CardContent>
                <CardContent>
                    <TablePro
                        title="  دوره های درخواست شده "
                        columns={tableCols}
                        rows={tableContent}
                        editCallback={handleEdit}
                        edit={"callback"}
                        removeCallback={handleRemove}

                    //={setTableContent}
                    // addCallback={handleAdd}
                    // edit="inline"
                    // editCallback={handleEdit}
                    // removeCallback={handleRemoveResidence}
                    //={loading
                    />
                </CardContent>
                <Button type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white", marginRight: "86%", marginBottom: "2%" }} >
                    تایید
                </Button>

            </Card>
        </Box>
    )
}


export default NeedAssessmentEmpolyForm;











