import React, { useState, useEffect, createRef  } from 'react';
import axios from "axios";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from "../../../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from 'app/main/components/CheckPermision';
import VisibilityIcon from "@material-ui/icons/Visibility";




const CompletementDocumentation = (props) => {
    const { evaluationPeriodTrackingCode, endTask } = props
    const [formValues, setFormValues] = useState({ contentDate: Date.now() })
    const [tableContent, setTableContent] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const datas = useSelector(({ fadak }) => fadak);



    const tableCols = [
        { name: "name", type: "name", label: " نام فایل", style: { maxWidth: "60px" } },
        { name: "contentDate", type: "date", label: "تاریخ بارگذاری", style: { maxWidth: "60px" } },
        { name: "description", type: "text", label: " توضیحات", style: { minWidth: "120px" } }
    ]

    const getDocumentations = () => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationContent?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            { headers: { api_key: localStorage.getItem('api_key') } })
            .then((res) => {
                setTableContent(res.data.data)
                setLoading(false)
            })
            .catch(() => {
            })
    }

    const handleGetContent = (row) => {
        window.location.href = (SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=")+ row.contentLocation 
    }

    const handleDeleteContent = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete((SERVER_URL + "/rest/s1/evaluation/singleEvalContent?evalContentId=") + row.evalContentId,
                { headers: { api_key: localStorage.getItem('api_key') } })
                .then(res => {
                    resolve()
                    getDocumentations()
                }).catch(() => { reject() });

        })
    }

    useEffect(() => {
        getDocumentations()

    }, [])


    return (
        <Card>
            <CardContent>
                <TablePro
                    title='مستندات'
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form datas={datas} setLoading={setLoading} tableContent={tableContent} evaluationPeriodTrackingCode={evaluationPeriodTrackingCode} getDocumentations={getDocumentations} formValues={formValues} setFormValues={setFormValues} />}
                    edit={checkPermis("reports/evaluationList/evaluationReport/completementDocumentation/update", datas) ? "external" : ""}
                    editForm={<Form datas={datas} setLoading={setLoading} editing={true} tableContent={tableContent} evaluationPeriodTrackingCode={evaluationPeriodTrackingCode} getDocumentations={getDocumentations} formValues={formValues} setFormValues={setFormValues} />}
                    removeCallback={handleDeleteContent}
                    rowActions={[
                        {
                            title: " مشاهده",
                            icon: VisibilityIcon,
                            onClick: (row) => {
                                handleGetContent(row)
                            }
                        }
                    ]}
                />
            </CardContent>
        </Card>
    );
};

export default CompletementDocumentation;




function Form({ editing = false, ...restProps }) {

    const { formValues, setFormValues, handleClose, setLoading, tableContent, evaluationPeriodTrackingCode, getDocumentations,datas } = restProps;
    const [formValidation, setFormValidation] = useState({});
    const [waiting, set_waiting] = useState(false)

    const [clicked, setClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);

    const cancelRef = createRef(0);
    const submitRef = createRef(0);

    const dispatch = useDispatch();
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

    const formStructure = [
        {
            label: "نام فایل ",
            name: "name",
            required: true,
            type: "text",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ تاریخ بارگذاری",
            name: "contentDate",
            disabled: true,
            type: "date",
            col: 4
        },
        {
            label: "بارگذاری فایل",
            name: "contentLocation",
            required: true,
            type: "inputFile",
            col: 4
        },
        {
            label: " ‍‍‍‍‍‍‍‍ توضیحات",
            name: "description",
            type: "textarea",
            col: 4
        }
    ]



    React.useEffect(() => {
        if (!editing) {
            setFormValues({ contentDate: new Date() })
        }
    }, [])

    const handleSubmitFile = () => {
        setLoading(true)
        if (!editing) {
            return new Promise((resolve, reject) => {
                const attachFile = new FormData();
                attachFile.append("file", formValues?.contentLocation);

                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                    .then(res => {
                        let data = formValues
                        data.contentLocation = res.data.name
                        let finalData = {
                            data: data,
                            evaluationPeriodTrackingCode: evaluationPeriodTrackingCode
                        }
                        axios.post(SERVER_URL + "/rest/s1/evaluation/evaluationContent", finalData, axiosKey)
                            .then((res) => {
                                getDocumentations()
                                trigerHiddenCancelBtn()
                                setLoading(false)
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فایل با موفقیت ذخیره شد'));
                                resolve()
                            })
                            .catch(() => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ارسال فایل با مشکل مواجه شده است'));
                                reject()
                            });
                    }).catch(() => { reject() });

                    console.log("awdsgvv", formValues)

            })
        }
        else {
            let data = {
                data: formValues
            }
            if (typeof formValues.contentLocation !== 'string') {
                const attachFile = new FormData();
                attachFile.append("file", formValues?.contentLocation);

                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                    .then(res => {
                        data.data.contentLocation = res.data.name
                    }).catch();
            }
            axios.put(SERVER_URL + "/rest/s1/evaluation/singleEvalContent", data,
                { headers: { api_key: localStorage.getItem('api_key') } })
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات فایل با موفقیت ویرایش شد'));
                    getDocumentations()
                    handleClose()

                })
                .catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات فایل با مشکل مواجه شده است'));
                });
        }
    }

    const handleReset = () => {
        set_waiting(false)
        handleClose()
    }

    function trigerHiddenSubmitBtn() {
        setClicked(clicked + 1);
    }
      
    function trigerHiddenCancelBtn() {
        setCancelClicked(cancelClicked + 1);
    }

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
            submitRef.current.click();
        }
    }, [clicked]);

    React.useEffect(() => {
        if (cancelRef.current && cancelClicked > 0) {
          cancelRef.current.click();
        }
    }, [cancelClicked]);

    return (
        <div>
            <FormPro
                append={formStructure}
                formValues={formValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                setFormValues={setFormValues}
                formDefaultValues={{ contentDate: new Date() }}
                submitCallback={() => { handleSubmitFile() }}
                resetCallback={handleReset}
                actionBox={<ActionBox>
                    <Button
                        ref={submitRef}
                        type="submit"
                        role="primary"
                        style={{ display: "none" }}
                    />
                    {/* {checkPermis("performanceManagement/evaluationList/evaluationReport/completementDocumentation/add", datas) ? <Button type="submit" role="primary"
                        disabled={waiting}
                        endIcon={waiting ? <CircularProgress size={20} /> : null}
                    >{editing ? "ویرایش" : "افزودن"}</Button> : ""} */}
                    {/* <Button type="reset" role="secondary">لغو</Button> */}
                    <Button
                        ref={cancelRef}
                        type="reset"
                        role="secondary"
                        style={{ display: "none" }} 
                    />
                </ActionBox>}

            />
                <div
                    style={{display: "flex", justifyContent: "flex-end" }}
                >
                    <Button
                    style={{
                        width: "70px",
                        color: "secondary",
                    }}
                    variant="outlined"
                    type="reset"
                    role="secondary"
                    onClick={trigerHiddenCancelBtn}
                    >
                    {" "}لغو{" "}
                    </Button>
                    <Button
                    style={{
                        width: 120,
                        color: "white",
                        backgroundColor: "#039be5",
                        marginRight: "8px",
                    }}
                    variant="outlined"
                    type="submit"
                    role="primary"
                    onClick={trigerHiddenSubmitBtn}
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                    >
                    {" "}
                    {editing ? "ویرایش" : "افزودن"}{" "}
                    </Button>
                </div>
        </div>
        )
}