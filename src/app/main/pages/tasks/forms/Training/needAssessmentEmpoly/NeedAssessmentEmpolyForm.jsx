import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../../../configs";
import { Box, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import Grid from "@material-ui/core/Grid";
import FormInput from "../../../../../components/formControls/FormInput";
import CircularProgress from "@material-ui/core/CircularProgress";


const NeedAssessmentEmpolyForm = (props) => {
    const { submitCallback, formVariables } = props
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    let moment = require('moment-jalaali')
    const [waiting, set_waiting] = useState({ value: false, target: 0 })

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
    const userName = useSelector(({ auth }) => auth?.user?.data?.username);

    const dispatch = useDispatch()

    const tableCols = [
        { name: "priority", label: " الویت ", type: "number", style: { minWidth: "130px" } },
        { name: "CourseTypeName", label: " نوع دوره آموزشی", type: "text", style: { minWidth: "130px" } },
        { name: "title", label: "عنوان دوره آموزشی", type: "text", style: { minWidth: "130px" } },
        { name: "fromDate", label: "    زمان شروع ", type: "date", style: { minWidth: "130px" } },
        { name: "thruDate", label: "  زمان پایان ", type: "date", style: { minWidth: "130px" } },

    ]


    const submitform = () => {
        const packet = {
            result: "accept",
        }
        set_waiting({ value: true, target: 2 })
        submitCallback(packet)
    }

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
        // maxDate:formValues.thruDate ?? "",
        col: 4
    }, {
        label: " زمان پیشنهادی پایان دوره",
        name: "thruDate",
        type: "date",
        required: true,
        // minDate:formValues.fromDate ?? "",
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
        required: true,
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

    }, [formValues.checkBox]);
    useEffect(() => {
        getAssessments()
    }, [loading, loadingdel]);

    function getAssessments() {
        axios.get(SERVER_URL + "/rest/s1/training/coursesInfo?curriculumId=" + props.formVariables.assessment.value.curriculumId, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setTableContent(res.data.result)
            setTitle(res.data.courseTitles)
            setCategory(res.data.courseType)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }
    const handleEdit = (row) => {
        setDilay("N")
        let tableContentE = [...tableContent]
        setTableContent(tableContentE.filter(item => item.priority !== row.priority))
        row.checkBox = row.type === "temporarily" ? true : false

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

        setButtonName("ویرایش")
        setFormValues(row)

        setValue(row)

        setAdd(true)

    }
    const submit = () => {
        set_waiting({ value: true, target: 1 })

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
            priority: parseInt(formValues.priority),
            type: formValues.checkBox ? "temporarily" : "",
            goals: formValues.goals,
            curriculumId: props.formVariables.assessment.value.curriculumId,
            emplPositionId: props.formVariables.contact.value.emplPositionId
        }
        if(data.priority <= 0){
            return
        }
        
        if (tableContent.length > 0 && tableContent.find(item => item.priority === data.priority)){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت وارد شده تکراری است!'));
            set_waiting({ value: false, target: 0 }) 
        }


        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title)){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' دوره وارد شده تکراری است!'));
            set_waiting({ value: false, target: 0 })
    }

        if (tableContent.length > 0 && tableContent.find(item => item.title === data.title) && tableContent.find(item => item.priority === data.priority)){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' الویت و دوره وارد شده تکراری است!'));
            set_waiting({ value: false, target: 0 })}

        if (tableContent.length === 0 || (tableContent.filter(item => item.priority === data.priority).length <= 0 && tableContent.filter(item => item.title === data.title).length <= 0)) {

            axios.post(SERVER_URL + "/rest/s1/training/storeCoursesInfo", { data: data }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoading(!loading)
                    setFormValues([])
                    set_waiting({ value: false, target: 0 })

                }).catch(() => {
                    set_waiting({ value: false, target: 0 })

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }

    }
    const editCourse = () => {
        formValues.courseId = value.courseId
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
            goals: formValues.goals,
            curriculumId: formValues.curriculumId


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
                        set_waiting({ value: false, target: 0 })

                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                        set_waiting({ value: false, target: 0 })

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
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{ width: "auto" }}>
                    {topFormStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
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
                            <Button type="submit" disabled={waiting.value} endIcon={waiting.target == 1 ? <CircularProgress size={20} /> : null} role="primary">{buttonName}</Button>

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
                    <ActionBox>
                        <Button onClick={submitform} disabled={waiting.value} endIcon={waiting.target == 2 ? <CircularProgress size={20} /> : null} type="submit" role="primary" >
                            تایید
                        </Button>
                    </ActionBox>

                </CardContent>


            </Card>
        </Box>
    )
}


export default NeedAssessmentEmpolyForm;






