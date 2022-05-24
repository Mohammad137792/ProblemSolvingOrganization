
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../configs";
import { Button, Radio, CardContent, Box, Card, CardHeader, Collapse, Grid, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup } from "@material-ui/core";
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';

const CreatAssessment = (props) => {
    const { CurriculumCourseId, tableContentList, setTableContentList } = props
    const [formValuesAssesment, setFormValuesAssesment] = useState({});
    const [FormValidationAsssement, setFormValidationAssesment] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [asesmentType, setAsesmentType] = useState([]);
    const [assesmentTitle, setAssesmentTitle] = useState([]);
    const [selectPersonal, setSelectPersonal] = useState([])
    const [buttonName, setButtonName] = useState("افزودن")
    const [authorType, setauthorType] = useState("")
    const [checkedManagerAuthor, setCheckedManagerAuthor] = useState(false)
    const [checkedEmployeeAuthor, setCheckedEmployeeAuthor] = useState(false)
    const [reload, setReload] = useState(false)

    const myElement = React.createRef(0);

    // const myScrollElement =  createRef(0);
    const myRef = useRef(null)


    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };
    const dispatch = useDispatch();



    const FormStructureAssesment = [


        {
            label: " نوع ارزیابی",
            name: "subCategoryEnumId",
            options: asesmentType,
            optionIdField: "enumId",
            optionLabelField: "description",
            type: "select",
            col: 3,
            required: true,
            filterOptions: options => formValuesAssesment["title"] ? options.filter(o => o["title"].indexOf(formValuesAssesment["title"]) >= 0) : options,

        },

        {
            label: "  عناوین فرم ارزیابی",
            name: "title",
            options: assesmentTitle,
            optionIdField: "questionnaireId",
            optionLabelField: "name",
            type: "select",
            col: 3,
            required: true,
            filterOptions: options => formValuesAssesment["subCategoryEnumId"] ? options.filter(o => o["subCategoryEnumId"] == formValuesAssesment["subCategoryEnumId"]) : options,

        },

        {
            label: "  تاریخ شروع",
            name: "fromDate",
            type: "date",
            col: 3,
            required: true,
            // maxDate:formValuesAssesment.thruDate ?? ""
        },
        {
            label: "      تاریخ پایان",
            name: "thruDate",
            type: "date",
            col: 3,
            required: true,
            // minDate:formValuesAssesment.fromDate ?? "",

        },

    ]



    const tableCols = [
        { name: "firstName", label: " نام", type: "text", style: { minWidth: "130px" } },
        { name: "lastName", label: "  نام خانوادگی", type: "text", style: { minWidth: "130px" } },
        { name: "pseudoId", label: " شماره پرسنلی ", type: "number", style: { minWidth: "130px" } },
        { name: "emplPosition", label: "  پست سازمانی ", type: "text", style: { minWidth: "130px" } },
        { name: "unitOrganization", label: "  واحد سازمانی ", type: "text", style: { minWidth: "130px" } },
    ]

    const tableColsList = [
        { name: "subCategoryEnumId", label: " نوع ارزیابی", type: "text", style: { minWidth: "130px" } },
        { name: "title", label: "   عنوان ارزیابی", type: "text", style: { minWidth: "130px" } },
        { name: "fromDate", label: "  تاریخ شروع ", type: "date", style: { minWidth: "130px" } },
        { name: "thruDate", label: "   تاریخ پایان ", type: "date", style: { minWidth: "130px" } },
        { name: "participantCount", label: "   تعداد شرکت کنندگان ", type: "text", style: { minWidth: "130px" } },
        { name: "numberAssesment", label: "   تعداد ارزیابی تکمیل شده ", type: "text", style: { minWidth: "130px" } },

    ]



    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/getTypeAssessmentLearning", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

            setAsesmentType(res.data.typeAssessment)
            setAssesmentTitle(res.data.titleAssessment)
        }).catch(() => {
        });

    }, []);

    let curriculumCourseId = CurriculumCourseId[0]?.curriculumCourseId


    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/getEducationalProfileList?curriculumCourseId=" + curriculumCourseId, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

            setTableContent(res.data.result)
            setTableContentList(res.data.resultASS)
        }).catch(() => {
        });

    }, [reload]);



    const handleChange = e => {
        const { name, value } = e.target;
        if (checkedEmployeeAuthor == false) {
            setCheckedEmployeeAuthor(true)
            setCheckedManagerAuthor(false)
        }
        else {
            setCheckedEmployeeAuthor(false)

        }

        console.log(e.target, "rrrr8")


        setauthorType(e.target.value)
    };
    const handleChange1 = e => {
        const { name, value } = e.target;
        if (checkedManagerAuthor === false) {
            setCheckedManagerAuthor(true)
            setCheckedEmployeeAuthor(false)
        }
        else
            setCheckedManagerAuthor(false)


        setauthorType(e.target.value)
        console.log(authorType, "rrrr1")

    };


    const saveAssessment = () => {
        myElement.current.click();

        const data = {
            curriculumCourseId: CurriculumCourseId[0]?.curriculumCourseId,
            fromDate: formValuesAssesment.fromDate,
            thruDate: formValuesAssesment.thruDate,
            title: formValuesAssesment.title,
            subCategoryEnumId: formValuesAssesment.subCategoryEnumId,
            authorType: authorType,
            selectPersonal: selectPersonal


        }
        console.log(CurriculumCourseId[0]?.curriculumCourseId, "tttttt")

        if ((formValuesAssesment.subCategoryEnumId !== undefined || null)
            && (formValuesAssesment.fromDate !== undefined || null)
            && (formValuesAssesment.thruDate !== undefined || null)
            && (formValuesAssesment.title !== undefined || null)
            && (checkedManagerAuthor === true || checkedEmployeeAuthor === true)
            && selectPersonal.length > 0) {

            axios.post(SERVER_URL + "/rest/s1/training/storeAssessment", { data: data }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    console.log(res.data.result, "result")


                    let listTableContent = [...tableContentList]
                    let filterList = []
                    filterList = listTableContent.filter(el => el.questionnaireAppId == res.data.result[0].questionnaireAppId)
                    filterList = listTableContent.findIndex(ele => ele === filterList[0])
                    if (filterList !== -1) {
                        listTableContent[filterList] = res.data.result[0]
                        setTableContentList(listTableContent)
                    } else if (filterList === -1) {
                        setTableContentList(prevState => { return [...prevState, ...res.data.result] })
                    }
                    setButtonName("افزودن")
                    setCheckedEmployeeAuthor(false)
                    setCheckedManagerAuthor(false)
                    setSelectPersonal([])
                    setReload(!reload)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات ذخیره نشد!'));
                });
            setFormValuesAssesment([])
        }
        else
            dispatch(setAlertContent(ALERT_TYPES.ERROR, '    تکمیل کننده ارزیابی و مخاطبین ارزیابی را انتخاب کنید'));



    }
    const scrollToRef = () => myRef.current.scrollIntoView()
    const handleEditTable = (row) => {
        scrollToRef()
        console.log(row, "row***")
        console.log(row.participant, "1row***")

        setSelectPersonal(row.participant)

        setFormValuesAssesment(row)
        setButtonName("ویرایش")
        if (row.authorType === "EmployeeAuthor") {
            setCheckedEmployeeAuthor(true)
            setCheckedManagerAuthor(false)
        }

        if (row.authorType === "ManagerAuthor") {
            setCheckedManagerAuthor(true)
            setCheckedEmployeeAuthor(false)
        }

    }
    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/training/deleteAssessmentLearning?questionnaireAppId=" + oldData.questionnaireAppId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                    const listTableContentE = [...tableContentList];
                    let ind = listTableContentE.indexOf(oldData)
                    let reduser = listTableContentE.splice(ind, 1)
                    setTableContentList(listTableContentE)

                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }
    const handle_submit = () => {
    }
    return (
        <Box >

            <Card style={{ backgroundColor: "#d9d9d9", padding: 2 }}>
                <Card style={{ padding: 8 }}>


                    <CardHeader title={"ایجاد ارزیابی"} ref={myRef} />
                    <FormPro
                        append={FormStructureAssesment}
                        formValues={formValuesAssesment}
                        setFormValues={setFormValuesAssesment}
                        setFormValidation={setFormValidationAssesment}
                        formValidation={FormValidationAsssement}
                        actionBox={<ActionBox style={{ display: "none" }}>
                            <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                        </ActionBox>}
                        submitCallback={handle_submit}


                    />
                    <Box>
                        <FormControl component="fieldset" style={{ width: "100%" }}>
                            <CardHeader title={" تکمیل کننده ارزیابی"} />
                            <RadioGroup aria-label="assesment" name="assesment" style={{ width: "100%" }}>
                                <Grid container direction="row" style={{ width: "100%" }}>
                                    <Grid item md="6" xs="6">
                                        <FormControlLabel value="EmployeeAuthor" control={<Radio checked={checkedEmployeeAuthor} />} label="  تکمیل توسط فراگیران دوره آموزشی" onChange={handleChange} />
                                    </Grid>
                                    <Grid item md="6" xs="6">
                                        <FormControlLabel value="ManagerAuthor" control={<Radio checked={checkedManagerAuthor} />} label="   تکمیل توسط مدیر مستقیم فرد" onChange={handleChange1} />
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                    </Box>
                    <Box>
                        <TablePro
                            title={"مخاطبین ارزیابی"}
                            columns={tableCols}
                            rows={tableContent}
                            selectable
                            selectedRows={selectPersonal}
                            setSelectedRows={setSelectPersonal}

                        />

                    </Box>

                </Card>
            </Card>
            <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%", marginTop: 8 }}>
                <Button type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white" }} onClick={saveAssessment}>
                    {buttonName}
                </Button>
            </Box>
            <Card style={{ padding: 2 }}>
                <TablePro
                    title={" لیست ارزیابی ها"}
                    columns={tableColsList}
                    rows={tableContentList}
                    editCallback={handleEditTable}
                    edit={"callback"}
                    removeCallback={handleRemove}

                />
            </Card>


        </Box>
    )
}


export default CreatAssessment;


