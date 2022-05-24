import React, {useState, useEffect} from "react";
import Card from "@material-ui/core/Card";
import TablePro from "../../../components/TablePro";
import axios from "../../../api/axiosRest";
import SurveyListFilter from "./SurveyListFilter";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import DoneIcon from '@material-ui/icons/Done';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import BlockIcon from '@material-ui/icons/Block';
import {useHistory} from "react-router-dom";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch,useSelector} from "react-redux";
import FormInput from "../../../components/formControls/FormInput";
import ConfirmDialog, {useDialogReducer} from "../../../components/ConfirmDialog";
import Grid from "@material-ui/core/Grid";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import {Button,Box} from "@material-ui/core";
import checkPermis from 'app/main/components/CheckPermision';

const formDefaultValues = {}

export default function SurveyList() {
    const history = useHistory();
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState({})
    const [dataList, set_dataList] = useState([])
    const [questionnaires, setQuestionnaires] = React.useState([]);
    const [formValidation, setFormValidation] = useState({});
    const [loading, set_loading] = useState(true);
    const dialogCancellation = useDialogReducer(handle_cancel)
    const dialogExtension = useDialogReducer(handle_extend)
    const dataCols = [
        {name: "code", label: "کد رهگیری", type: "text", style: {width:"10%"}},
        {name: "name", label: "عنوان", type: "text", style: {width:"25%"}},
        {name: "fromDate", label: "تاریخ ارسال", type: "date"},
        {name: "thruDate", label: "مهلت پاسخ", type: "date"},
        {name: "questionnaireName", label: "فرم نظرسنجی", type: "text"},
        {name: "statusId", label: "وضعیت", type: "select", options: "StaQuestionnaireApplication", optionIdField: "statusId", style: {width:"150px"}},
    ]

    function handle_cancel(row) {
        axios.put("/s1/survey/cancelSurvey?questionnaireAppId="+row.questionnaireAppId).then( (res) => {
            set_dataList(prevState=>{
                let buffer = Object.assign([],prevState)
                const ind = buffer.findIndex(i=>i.questionnaireAppId===row.questionnaireAppId)
                buffer[ind] = Object.assign({},prevState[ind],{statusId: res.data.statusId})
                return buffer
            })
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'نظرسنجی مورد نظر لغو گردید.'));
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }

    function handle_extend(row) {
        const packet = {
            questionnaireAppId: row.questionnaireAppId,
            thruDate: formValues.thruDate
        }
        axios.put("/s1/survey", packet).then( () => {
            set_dataList(prevState =>{
                let buffer = Object.assign([],prevState)
                const index = buffer.findIndex(i=>i.questionnaireAppId===row.questionnaireAppId)
                buffer[index] = {...row, thruDate: formValues.thruDate};
                return buffer
            })
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'نظرسنجی مورد نظر با موفقیت تمدید گردید.'));
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }

    const handle_search = (filter=formDefaultValues) => {
        set_loading(true)
        axios.get("/s1/survey/surveyArchive",{params: filter}).then(res => {

            let list = res.data.surveys
            // list = list.filter(x=>x.thruDate < Date.now())
            set_loading(false)
            set_dataList(list)
        }).catch(() => {
            set_loading(false)
            set_dataList([])
        });
    }

    const handle_remove = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete("/s1/survey?questionnaireAppId="+row.questionnaireAppId).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }

    const handle_approve = (row) => {
        axios.put("/s1/survey/approveSurvey?questionnaireAppId="+row.questionnaireAppId).then( (res) => {
            set_dataList(prevState=>{
                let buffer = Object.assign([],prevState)
                const ind = buffer.findIndex(i=>i.questionnaireAppId===row.questionnaireAppId)
                buffer[ind] = Object.assign({},prevState[ind],{statusId: res.data.statusId})
                return buffer
            })
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'نظرسنجی مورد نظر تایید و آماده ارسال به مخاطبان گردید.'));
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }

    useEffect(()=>{
        handle_search()
    },[])

    useEffect(()=>{
        let moment = require('moment-jalaali')
        let oldDate = dialogExtension.data.thruDate
        if(typeof oldDate !== 'string'){
            oldDate = moment(oldDate).format('YYYY-MM-DD')
        }
        if(oldDate>formValues.thruDate){
            setFormValidation(prevState => ({...prevState, thruDate: {error: true, helper: ' مهلت تعیین شده باید بعد از تاریخ قبلی باشد!'}}))
            dialogExtension.disable()
        }else{
            dialogExtension.enable()
        }
    },[formValues.thruDate])

    useEffect(()=>{
        dialogExtension.disable()
        setFormValues(prevState => ({...prevState, thruDate: dialogExtension.data.thruDate}))
        setFormValidation(prevState => ({...prevState, thruDate: {}}))
    },[dialogExtension.data])

    useEffect(()=>{
        axios.get("/s1/questionnaire/archive?subCategoryEnumId=QcSurvey").then(res => {
            setQuestionnaires(res.data.questionnaires)
        }).catch(() => {
            setQuestionnaires([])
        });
    },[])

    return (
        <FusePageSimple
        header={<CardHeader title={"نظرسنجی"}/>}
        content={
            <Box p={2}>
                <Card>
                    {console.log('dataList',dataList[0]?.thruDate)}
                    {console.log('dataList',Date.now())}
            <TablePro
                title="لیست نظرسنجی ها"
                columns={dataCols}
                rows={dataList}
                setRows={set_dataList}
                loading={loading}
                // edit="callback"
                // editCallback={handle_edit}
                // editCondition={(row) => row.statusId === "QstAppPlanning" || row.statusId === "QstAppPlanned"}
                removeCallback={handle_remove}
                removeCondition={(row) => row.statusId === "QstAppPlanning"}
                filter="external"
                filterForm={
                    <SurveyListFilter handle_search={handle_search} formDefaultValues={formDefaultValues} questionnaires={questionnaires}/>
                }
                rowActions={[
                    {
                        title: "گزارش نظرسنجی",
                        icon: EqualizerIcon,
                        onClick: (row) => history.push(`/survey/analysis?id=${row.questionnaireAppId}&code=${row.code}`),
                        display: (row) => checkPermis("survey/questionnaireArchive/analysis" , datas) && row.statusId !== "QstAppPlanning" && row.statusId !== "QstAppPlanned"
                    },
                    // {
                    //     title: "تایید نهایی",
                    //     icon: DoneIcon,
                    //     onClick: handle_approve,
                    //     display: (row) => row.statusId === "QstAppPlanning"
                    // },
                    // {
                    //     title: "تمدید مهلت",
                    //     icon: AlarmAddIcon,
                    //     onClick: dialogExtension.show,
                    //     display: (row) => checkPermis("survey/questionnaireArchive/extension" , datas) && row.thruDate < Date.now()
                    // },
                    // {
                    //     title: "لفو",
                    //     icon: BlockIcon,
                    //     onClick: dialogCancellation.show,
                    //     display: (row) => checkPermis("survey/questionnaireArchive/cancellation" , datas) && row.statusId !== "QstAppCanceled" && row.statusId !== "QstAppPlanning"
                    // },
                ]}
            />
            <ConfirmDialog
                dialogReducer={dialogCancellation}
                title="آیا از لغو این نظرسنجی اطمینان دارید؟"
            />
            <ConfirmDialog
                dialogReducer={dialogExtension}
                title="مهلت پاسخ به نظرسنجی تا چه تاریخی تمدید شود؟"
                confirmButtonText="تایید"
                cancelButtonText="انصراف"
                content={
                    <Grid container>
                        <FormInput
                            type="date"
                            label="مهلت جدید پاسخگویی"
                            name="thruDate"
                            col={12}
                            valueObject={formValues}
                            valueHandler={setFormValues}
                            validationObject={formValidation}
                            validationHandler={setFormValidation}
                        />
                    </Grid>
                }
            />
        </Card>
            </Box>
        }
    />

    )
}
