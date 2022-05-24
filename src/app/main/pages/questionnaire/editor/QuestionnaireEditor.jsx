import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import FusePageCarded from "../../../../../@fuse/components/FusePageLayouts/carded/FusePageCarded";
import {Button, Tab, Tabs} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import EditorToolbar from "./EditorToolbar";
import EditorTabSettings from "./EditorTabSettings";
import EditorTabQuestions from "./EditorTabQuestions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import EditorTabPage, {makeEmptyPage} from "./EditorTabPage";
import EditorTabPreview from "./EditorTabPreview";
import axios from "../../../api/axiosRest";
import Typography from "@material-ui/core/Typography";
import {render_version} from "../archive/QATable";
import {closeDialog, openDialog} from "../../../../store/actions/fuse";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {requiredAlert} from "../../../components/formControls/FormPro";
import checkPermis from "../../../components/CheckPermision";
import FeedbackIcon from '@material-ui/icons/Feedback';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: "100%"
    },
    tabItem: {
        minWidth: "110px"
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>{children}</Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const makeQuestionnaireDefault = () => {
    return {
        completedDialog: "از وقتی که برای پاسخ گویی به پرسشنامه گذاشتید، صمیمانه سپاسگزاریم!",
        pagesArrangementEnumId: "ArrSequence",
        elementsArrangementEnumId: "ArrSequence",
        itemsArrangementEnumId: "ArrSequence",
        backButtonDisplayEnumId: "DispHide",
        pages: [
            {...makeEmptyPage(), name: "صفحه یک"},
        ]
    }
}

export default function QuestionnaireEditor({questionnaireId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const [tabValue, set_tabValue] = React.useState(0);
    const [saveFlag, set_saveFlag] = React.useState(2);
    const [questionnaire, set_questionnaire] = React.useState(makeQuestionnaireDefault());
    const [questionnaireBackup, set_questionnaireBackup] = React.useState(makeQuestionnaireDefault());
    const [removedObjects, set_removedObjects] = React.useState({page: [], element: [], item: []});
    const datas = useSelector(({ fadak }) => fadak);

    const add_removedObjects = (entity, id) => {
        let buffer = Object.assign({}, removedObjects)
        if(typeof id==="object")
            buffer[entity].push(...id)
        else
            buffer[entity].push(id)
        set_removedObjects(buffer)
    }
    const saved_callback = (newQuestionnaire) => {
        set_saveFlag(2)
        set_questionnaire(newQuestionnaire)
        set_questionnaireBackup(JSON.parse(JSON.stringify(newQuestionnaire)))
    }
    const handle_save = () => {
        // #1-Check the questionnaire name and category enum id!
        if(!questionnaire.name || !questionnaire.categoryEnumId) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, requiredAlert));
            set_tabValue(0)
            return
        }
        // #2-Check for no question!
        let numberOfQuestions = 0;
        questionnaire.pages.forEach(page => {
            numberOfQuestions += page.elements?.length||0
        })
        if(numberOfQuestions===0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'هیچ سوالی برای پرسشنامه تعریف نشده است!'));
            set_tabValue(2)
            return
        }
        // #3-Check for items with empty label!
        let numberOfEmptyItems = 0;
        questionnaire.pages.forEach(page => {
            page.elements.filter(i => i.type==="check" || i.type==="radio").forEach(element => {
                element.items.forEach(item => {
                    if(!item.label) {
                        numberOfEmptyItems += 1;
                    }
                })
            })
        })
        if(numberOfEmptyItems>0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'عنوان هیچ گزینه ای نباید خالی باشد!'));
            set_tabValue(2)
            return
        }
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        axios.put("/s1/questionnaire/editor",{questionnaire, removedObjects}).then( res => {
            const newQuestionnaire = res.data.questionnaire
            saved_callback(newQuestionnaire)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'پرسشنامه با موفقیت ذخیره شد.'));
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }
    const handle_load = (questionnaireId) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال دریافت اطلاعات...'));
        axios.get("/s1/questionnaire/editor?questionnaireId="+questionnaireId).then( res => {
            let newQuestionnaire = res.data.questionnaire
            let offset = 1
            for (let i in newQuestionnaire.pages) {
                newQuestionnaire.pages[i].startNumber = offset
                offset += newQuestionnaire.pages[i].elements.length
            }
            if(res.data.isUsed)
                ask_version(newQuestionnaire)
            else{
                saved_callback(newQuestionnaire)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'پرسشنامه آماده ویرایش است.'));
            }
            history.replace("/questionnaire/editor")
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
        });
    }
    const ask_version = (newQuestionnaire) => {
        const nextMinor = {version: newQuestionnaire.version+1}
        const nextMajor = {version: (Number.parseInt(newQuestionnaire.version/10)+1)*10}
        const confirm_version = (newVersion) => {
            newQuestionnaire.version = newVersion
            saved_callback(newQuestionnaire)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'پرسشنامه آماده ویرایش است.'));
        }
        dispatch(openDialog({
            children: (
                <React.Fragment>
                    <DialogTitle id="alert-dialog-title">این نسخه از پرسشنامه قبلا مورد استفاده قرار گرفته است و امکان تغییر آن وجود ندارد!</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            در صورت اعمال تغییرات جزئی، پرسشنامه با شماره {render_version(nextMinor)} و در صورت داشتن تغییرات اساسی، پرسشنامه در فایل جدیدی با شماره نسخه {render_version(nextMajor)} ذخیره می شود.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> {dispatch(closeDialog());confirm_version(nextMinor.version)}} color="primary" fullWidth>
                            مایلم اصلاحات جزئی انجام دهم
                        </Button>
                        <Button onClick={()=> {dispatch(closeDialog());confirm_version(nextMajor.version)}} color="primary" fullWidth autoFocus>
                            نسخه جدیدی ایجاد می کنم
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )
        }))
    }
    const handle_restore = () => {
        set_questionnaire(questionnaireBackup)
        set_saveFlag(2)
    }
    const handle_new = () => {
        set_questionnaire(makeQuestionnaireDefault())
    }
    const update_pages_question_numbers = () => {
        let updatedPages = questionnaire.pages
        let offset = 1
        for (let i in updatedPages) {
            updatedPages[i].startNumber = offset
            offset += updatedPages[i].elements.length
        }
        set_questionnaire(prevState=>({
            ...prevState,
            pages: updatedPages
        }))
    }

    React.useEffect(() => {
        set_saveFlag(prevState => prevState-1)
    }, [questionnaire])

    React.useEffect(()=>{
        if(questionnaireId){
            // if(questionnaireId==="test"){
            //     const defaultOptions = {
            //         display: "Y",
            //         required: "N",
            //         weight: 1,
            //         title: ""
            //     }
            //     const questionnaireDefaultTest = {
            //         questionnaireKey: "keyTest",
            //         name: "رضایت‌سنجی 1399",
            //         title: "پرسشنامه رضایت‌سنجی کارکنان",
            //         description: "نمونه پرسشنامه رضایت‌سنجی کارکنان شغل، تعاملات کاری، فرصت‌های رشد و توسعه کارکنان، اطلاع از ماموریت و اهداف شرکت، نظرسنجی از کارکنان در خصوص مزایا و نهایتا میزان احترام و تقدیر از کارکنان در محیط کاری را ارزیابی می‌کند.",
            //         completedDialog: "از وقتی که برای پاسخ گویی به پرسشنامه گذاشتید، صمیمانه سپاسگزاریم!",
            //         pagesArrangement: "ArrSequence",
            //         elementsArrangement: "ArrSequence",
            //         itemsArrangement: "ArrSequence",
            //         backButton: "DispShow",
            //         pages: [
            //             {...makeEmptyPage(),
            //                 name: "صفحه یک",
            //                 title: "سوالات شغلی",
            //                 description: "گروه اول سوال‌ها: در مورد شغل",
            //                 elements: [
            //                     {...defaultOptions, name: "q1", type: "text", title: "از نظر شما، کاری که مشغول به انجام آن هستید، چقدر معنادار هست؟", },
            //                     {...defaultOptions, name: "q2", type: "radio", title: "چقدر شغل شما براتون چالش‌بر‌انگیز هست؟", required: true, items: [
            //                             {value: "0", label: "کم"},
            //                             {value: "1", label: "متوسط"},
            //                             {value: "2", label: "زیاد"},
            //                         ]},
            //                     {...defaultOptions, name: "q3", type: "radio", title: "چقدر مسئولیت‌های شما شفاف هستند؟", items: [
            //                             {value: "0", label: "کم"},
            //                             {value: "1", label: "متوسط"},
            //                             {value: "2", label: "زیاد"},
            //                         ]},
            //                     {...defaultOptions, name: "q4", type: "check", title: "چه عواملی برای شما استرس زا هستند؟", items: [
            //                             {value: "", label: "عامل یک"},
            //                             {value: "", label: "عامل دو"},
            //                             {value: "", label: "عامل سه"},
            //                             {value: "", label: "عامل چهار"},
            //                         ]},
            //                 ]
            //             },
            //             {...makeEmptyPage(),
            //                 name: "صفحه دو",
            //                 title: "تعاملات کاری",
            //                 backButton: "DispHide",
            //                 elements: [
            //                     {...defaultOptions, name: "q5", type: "radio", title: "در سطح شرکت، اطلاعات و دانش به اشتراک گذاشته می‌شود؟", items: [
            //                             {value: "T", label: "بلی"},
            //                             {value: "N", label: "تاحدودی"},
            //                             {value: "F", label: "خیر"},
            //                         ]},
            //                     {...defaultOptions, name: "q6", type: "radio", title: "ساز و کار ارزیابی عملکرد شرکت عادلانه است؟", items: [
            //                             {value: "T", label: "بلی"},
            //                             {value: "N", label: "تاحدودی"},
            //                             {value: "F", label: "خیر"},
            //                         ]},
            //                     {...defaultOptions, name: "q7", type: "textarea", title: "نظر شما در مورد تعاملات کاری چیست؟", }
            //                 ]
            //             },
            //             {...makeEmptyPage(),
            //                 name: "صفحه سه",
            //                 title: "فرصت‌های رشد",
            //                 description: "گروه سوم سوال‌ها: فرصت‌هایی برای رشد و توسعه",
            //                 display: "Y",
            //                 elementsArrangement: "ArrSequence",
            //                 elements: [
            //                     {...defaultOptions, name: "q8", type: "radio", title: "مدیر من به توسعه و رشد حرفه‌ای من علاقه‌مند است؟", items: [
            //                             {value: "0", label: "اصلا اینطور نیست"},
            //                             {value: "1", label: "کمی اینطور است"},
            //                             {value: "2", label: "تاحدودی اینطور است"},
            //                             {value: "3", label: "کاملا اینطور است"},
            //                         ]},
            //                     {...defaultOptions, display: "N", name: "q9", type: "radio", title: "معمولا آموزش‌هایی برای بهتر کار کردن دریافت می‌کنم.", items: [
            //                             {value: "0", label: "اصلا اینطور نیست"},
            //                             {value: "1", label: "کمی اینطور است"},
            //                             {value: "2", label: "تاحدودی اینطور است"},
            //                             {value: "3", label: "کاملا اینطور است"},
            //                         ]},
            //                     {...defaultOptions, name: "q10", type: "textarea", title: "در پایان اگر نظری یا دغدغه‌ای دارید، لطفا ثبت کنید.", }
            //                 ]
            //             }
            //         ]
            //     }
            //     set_questionnaire(questionnaireDefaultTest)
            //     return
            // }
            handle_load(questionnaireId)
        }
    },[questionnaireId])

    const questionnaireProps = {questionnaire, set_questionnaire, update_pages_question_numbers, add_removedObjects}

    return checkPermis("questionnaire/editor", datas) && (
        <FusePageCarded
            header={
                <CardHeader title="ویرایشگر پرسشنامه" style={{paddingRight:0}}/>
            }
            contentToolbar={
                <Box display="flex" style={{width:"100%"}}>
                    <Box flexGrow={1}>
                        <Tabs indicatorColor="secondary" textColor="secondary"
                              variant="scrollable" scrollButtons="on"
                              value={tabValue} onChange={(e,newValue)=>set_tabValue(newValue)}
                              className={classes.tabs}
                        >
                            <Tab {...a11yProps(0)} className={classes.tabItem} label="تنظیمات" />
                            <Tab {...a11yProps(1)} className={classes.tabItem} label="مدیریت صفحات" />
                            <Tab {...a11yProps(2)} className={classes.tabItem} label="سوالات" />
                            <Tab {...a11yProps(3)} className={classes.tabItem} label="پیش نمایش" />
                        </Tabs>
                    </Box>
                    <Box style={{maxWidth: "150px", margin: "14px 8px"}}>
                        <Typography noWrap>{questionnaire.name||"بدون نام"}</Typography>
                    </Box>
                    <Box style={{margin: "14px 0 14px 8px"}}>
                        {`─ ${questionnaire.version ? "نسخه "+render_version(questionnaire) : "جدید "} `}
                    </Box>
                    {/*<IconButton onClick={()=>{*/}
                    {/*    console.log("questionnaire", questionnaire)*/}
                    {/*    console.log("backup", questionnaireBackup)*/}
                    {/*    console.log("saveFlag", saveFlag)*/}
                    {/*    console.log("removed", removedObjects)*/}
                    {/*}} title="log">*/}
                    {/*    <FeedbackIcon/>*/}
                    {/*</IconButton>*/}
                    <EditorToolbar handle_save={handle_save} handle_restore={handle_restore} handle_new={handle_new} saveFlag={saveFlag>0}/>
                </Box>
            }
            content={
                <Box p={2} className="questionnaire-editor">
                    <TabPanel value={tabValue} index={0}>
                        <EditorTabSettings {...questionnaireProps}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <EditorTabPage {...questionnaireProps}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <EditorTabQuestions {...questionnaireProps}/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <EditorTabPreview {...questionnaireProps}/>
                    </TabPanel>
                </Box>
            }
        />
    )
}
