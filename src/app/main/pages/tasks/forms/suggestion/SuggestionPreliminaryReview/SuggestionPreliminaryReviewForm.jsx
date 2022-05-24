import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Card from "@material-ui/core/Card";
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { Box, Button, Tab, Tabs } from "@material-ui/core";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
import { Image } from "@material-ui/icons"
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import RecommenderInfo from './tabs/RecommenderInfo';
import TabPro from 'app/main/components/TabPro';
import PrimeryReview from './tabs/PrimeryReview';
import VerficationSuggestions from './tabs/VerficationSuggestions';
import InfoSuggestion from '../resultSuggestions/tabs/InfoSuggestion';
import { useSelector, useDispatch } from "react-redux";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={6}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useTabStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        // background: "#fff",
        top: 0,
        // borderRadius: "5px 5px 0 0px",
        justifyContent: "center",
        // backgroundColor: theme.palette.background.paper,

    },
    tabs: {
        width: "100%"
    },
    tabItem: {
        // minWidth: "80px"
    },
    scroller: {
        flexGrow: "0"
    }
}));

const SuggestionPreliminaryReviewForm = (props) => {
    const partyRelationship = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const userName = useSelector(({ auth }) => auth.user.data.username);
    const { formVariables, submitCallback = true } = props;
    const [formValues, setFormValues] = useState([]);
    const [basicInformationFormValues, setBasicInformationFormValues] = useState({})
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [formValuesPrimery, setFormValuesPrimery] = useState([]);
    const [personGroupedBy, setPersonGroupedBy] = useState([])
    const [verificationTableContent, setVerificationTableContent] = useState([]);
    const [handleCheckBox, setHandleCheckBox] = useState({ group: false, individual: false })
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([])
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState({})
    const [showTab, setShowTab] = useState(false)
    const [opendialog, setOpenDialog] = useState(true)
    const [value, setValue] = React.useState(0);
    const classes = useTabStyles();
    const theme = useTheme();



    const handleChange = (event, newValue) => {

        setValue(newValue);

    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    const dispatch = useDispatch();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const startVeriftion = (type) => {

        let VerList = []

        {
            personGroupedBy[personGroupedBy.length - 1].map((item, index) => {
                item.active = index === 0 ? true : false

                item.VerficationItem.map((i, j) => {
                    let element = {}
                    element.modify = i.modify === undefined ? "N" : i.modify
                    element.reject = i.reject === undefined ? "N" : i.reject
                    element.sequence = i.sequence ?? i.sequence
                    element.questionnaireId = i.questionnaireId
                    element.questionnaireAppId = i.questionnaireAppId
                    element.reviewDeadLineDate = i.reviewDeadLineDate
                    element.verificationDate = i.verificationDate
                    element.emplPositionId = i.emplPositionId
                    element.assingType = i.assingType
                    element.organizationPartyId = i.organizationPartyId
                    element.companyPartyId = i.companyPartyId
                    element.reviewerTypeEnumId = i.reviewerTypeEnumId
                    element.psoudoId = i.psoudoId
                    element.username = i.username
                    VerList.push(element)

                })

            }
            )
        }

        const verificationList = VerList.reduce((verificationGruop, { questionnaireAppId, sequence, emplPositionId, reject,
            modify, questionnaireId, assingType,
            organizationPartyId, companyPartyId, reviewerTypeEnumId, psoudoId, username,
            reviewDeadLineDate, active }) => {
            if (!verificationGruop[sequence]) verificationGruop[sequence] = [];
            let element = {}
            let element1 = {}
            let arry = []
            element.sequence = sequence
            element.reject = reject === undefined ? "N" : reject
            element.modify = modify === undefined ? "N" : modify
            element.questionnaireId = questionnaireId
            element.reviewDeadLineDate = reviewDeadLineDate
            // element.active = active
            element.questionnaireAppId = questionnaireAppId
            element.emplPositionId = emplPositionId
            element.assingType = assingType
            element.organizationPartyId = organizationPartyId
            element.companyPartyId = companyPartyId
            element.reviewerTypeEnumId = reviewerTypeEnumId
            element.psoudoId = psoudoId
            element.username = username



            arry.push(element)

            element1.item = arry
            element1.sequence = sequence

            verificationGruop[sequence].push(element);
            return verificationGruop;
        }, {});

        /////////////////////////////////////////////////////////Verrrrrrrrrrrrrrrrrrrrrrrrrrr
        let verificationResult = []

        for (let key in verificationList) {
            var obj = {}
            if (verificationList.hasOwnProperty(key)) {
                obj.VerficationItem = verificationList[key]



                obj.sequence = verificationList[key][0].sequence
                verificationResult.push(obj)

            }
        }
        /////////////////////////////////////////////////////////Verrrrrrrrrrrrrrrrrrrrrrrrrrr


        let VerifList = []
        let moment = require('moment-jalaali')


        {
            verificationResult.map((item, index) => {
                let element = {}

                element.VerficationItem = item.VerficationItem ?? item.VerficationItem
                element.sequence = item.sequence ?? item.sequence
                element.active = index == 0 ? true : false
                element.backDate = index == 0 ? moment().format("Y-MM-DD") : ""

                VerifList.push(element)
                // setVeriList(VerList)
            }
            )
        }



        // let suggestionSystemCler = formVariables.suggestionSystemCler.value.filter(item => item === userName)

        type = "accept"
        let data = {
            primeryResult: type,
            verificationList: VerifList,
            verificationListZapas: VerifList,
            // verificationList1: VerifList,
            verificationTableContent: verificationTableContent,
        }
        submitCallback(data)

    }
    const handleSubmitModify = (type) => {
        type = "modify"
        let data = {
            primeryResult: type,
            fixingDefects: {
                rewieDate: formValuesPrimery.reviewDate,
                discription: formValuesPrimery.discription
            }
        }
        submitCallback(data)
    }


    const handleSubmitReject = (type) => {

        type = "reject"
        let data = {
            primeryResult: type,
            status: "رد شده",
            RejectionReasons: {
                rejectionReasonEnumID: formValuesPrimery.rejectionReasonEnumID,
                other: formValuesPrimery.other,
                rewieDate: formValuesPrimery.reviewDate,
                discription: formValuesPrimery.discription,
            }
        }

        if (formValuesPrimery.rejectionReasonEnumID === undefined || formValuesPrimery.rejectionReasonEnumID === "[]") {

            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید   !'));
        }
        else {
            formVariables.Suggestion.value.suggestionStatusId = "SuggRejected"
            formVariables.Suggestion.value.suggestionCode = formVariables.trackingCode?.value
            let saveData = {
                Suggestion: formVariables.Suggestion.value,
                SuggestionKeyWords: formVariables.SuggestionKeyWords.value,
                SuggestionParticipant: formVariables.SuggestionParticipant.value,
                SuggestionContent: formVariables.SuggestionContent.value,
                RejectionReasons: {
                    rejectionReasonEnum: formValuesPrimery.rejectionReasonEnumID,
                    partyRelationshipId: partyRelationship,
                    other: formValuesPrimery.other


                }


            }
            axios.post(SERVER_URL + "/rest/s1/Suggestion/suggestionProcess", { data: saveData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    submitCallback(data)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });

        }

    }


    const handleAccept = () => {
        setShowTab(true)
        setValue(3)
    }



    const tabs = [
        {
            label: "اطلاعات   پیشنهاد دهنده",
            panel: <RecommenderInfo formValues={formValues} setFormValues={setFormValues} />
        },
        {
            label: "       مشاهده پیشنهاد",
            panel: <InfoSuggestion basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
                setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
                setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                setBasicInformationFormValues={setBasicInformationFormValues}
                keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
                tableContent={tableContent} setTableContent={setTableContent}
                formValuseDiscriptionStructure={formValuseDiscriptionStructure}
                setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure} />
        },
        {
            label: "بررسی اولیه",
            panel: <PrimeryReview handleSubmitModify={handleSubmitModify} handleSubmitReject={handleSubmitReject}
                formValuesPrimery={formValuesPrimery} setFormValuesPrimery={setFormValuesPrimery} handleAccept={handleAccept} />
        },



    ]



    const tabs1 = [
        {
            label: "اطلاعات   پیشنهاد دهنده",
            panel: <RecommenderInfo formValues={formValues} setFormValues={setFormValues} />
        },
        {
            label: "مشاهده پیشنهاد",
            panel: <InfoSuggestion basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
                setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
                setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                setBasicInformationFormValues={setBasicInformationFormValues}
                keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
                tableContent={tableContent} setTableContent={setTableContent}
                formValuseDiscriptionStructure={formValuseDiscriptionStructure} opendialog={opendialog} setOpenDialog={setOpenDialog}
                setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure} />
        },
        {
            label: "بررسی اولیه",
            panel: <PrimeryReview handleSubmitModify={handleSubmitModify} handleSubmitReject={handleSubmitReject}
                formValuesPrimery={formValuesPrimery} setFormValuesPrimery={setFormValuesPrimery} handleAccept={handleAccept} />
        },
        {
            label: " تعیین مراتب بررسی پیشنهاد",
            panel: <VerficationSuggestions startVeriftion={startVeriftion}
                verificationTableContent={verificationTableContent}
                setVerificationTableContent={setVerificationTableContent}
                setPersonGroupedBy={setPersonGroupedBy}
                personGroupedBy={personGroupedBy} />
        },

    ]


    const listOfTabContetnt = [
        { component: <RecommenderInfo formValues={formValues} setFormValues={setFormValues} /> },
        {
            component: <InfoSuggestion basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
                setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
                setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                setBasicInformationFormValues={setBasicInformationFormValues}
                keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
                tableContent={tableContent} setTableContent={setTableContent}
                formValuseDiscriptionStructure={formValuseDiscriptionStructure} opendialog={opendialog} setOpenDialog={setOpenDialog}
                setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure} />
        },
        {
            component: <PrimeryReview handleAccept={handleAccept} handleSubmitModify={handleSubmitModify} handleSubmitReject={handleSubmitReject}
                formValuesPrimery={formValuesPrimery} setFormValuesPrimery={setFormValuesPrimery} />
        },
        {
            component: <VerficationSuggestions startVeriftion={startVeriftion}
                formVariables={formVariables}
                verificationTableContent={verificationTableContent}
                setVerificationTableContent={setVerificationTableContent}
                setPersonGroupedBy={setPersonGroupedBy}
                personGroupedBy={personGroupedBy} />
        },
    ]



    useEffect(() => {
        if (formVariables)
            setOpenDialog(false)
        setFormValues(formVariables?.Recommender?.value[0])
        setFormValuseDiscriptionStructure(formVariables?.Suggestion?.value)
        setBasicInformationFormValues(formVariables?.Suggestion?.value)
        setBasicInformationFormValues(prevState => ({
            ...prevState,
            suggestionCode: formVariables?.trackingCode?.value

        }))

        setKeyWordTableContent(formVariables.SuggestionKeyWords.value)

        setHandleCheckBox(prevState => ({
            ...prevState,
            individual: formVariables?.Suggestion?.value?.suggestionPresentationType === "Y" ? false : true,
            group: formVariables?.Suggestion?.value?.suggestionPresentationType === "N" ? false : true,

        }))

        setSuggestingGroupTableContent(formVariables?.groupList?.value)



        let tableData = []
        if (formVariables.SuggestionContent?.value.length > 0) {
            formVariables.SuggestionContent.value.map((item, index) => {
                let data = {
                    observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                        target="_blank" >  <Image />  </Button>,

                }

                tableData.push(data)
                setTimeout(() => {

                }, 50)
            })

            setTableContent(prevState => { return [...prevState, ...tableData] })

        }


        let moment = require('moment-jalaali')
        const formDefaultValues = {
            reviewDate: moment().format("Y-MM-DD")
        }
        setFormValuesPrimery(formDefaultValues)


    }, []);








    // return (
    //     <Card>
    //         <TabPro tabs={showTab ? tabs1 : tabs} />
    //     </Card>
    // )




    return (
        <>
            <FusePageSimple

                contentToolbar={
                    <MuiThemeProvider>
                        <Tabs
                            variant="scrollable" scrollButtons="on"
                            value={value}
                            onChange={handleChange}
                        // classes={{ root: classes.root, scroller: classes.scroller }}
                        >
                            <Tab label="اطلاعات پیشنهاد دهنده" {...a11yProps(0)} />
                            <Tab label=" مشاهده پیشنهاد" {...a11yProps(1)} />
                            <Tab label=" بررسی اولیه" {...a11yProps(2)} />
                            {showTab ? <Tab label=" تعیین مراتب بررسی پیشنهاد" {...a11yProps(3)} /> : ""}
                        </Tabs>
                    </MuiThemeProvider>

                }
                content={

                    <Box width="100%" display="flex" alignItems="center" justifyContent="center">
                        <Box width="100%" alignItems="center" justifyContent="center">

                            <Box className={classes.root} style={{ width: "100%" }}>
                                {
                                    listOfTabContetnt.map((ele, ind) => ((
                                        <TabPanel value={value} index={ind} dir={theme.direction}>
                                            {ele.component}
                                        </TabPanel>
                                    )))
                                }

                                {/* <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={value}
                                    onChangeIndex={handleChangeIndex}
                                >
                                    {
                                        listOfTabContetnt.map((ele, ind) => ((
                                            <TabPanel value={value} index={ind} dir={theme.direction}>
                                                {ele.component}
                                            </TabPanel>
                                        )))
                                    }
                                </SwipeableViews> */}
                            </Box>
                        </Box>
                    </Box>
                }
            />
        </>
    );

}



export default SuggestionPreliminaryReviewForm;
