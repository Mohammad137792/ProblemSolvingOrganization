import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';


const VerficationSuggestions = (props) => {
    const { startVeriftion, formVariables, setPersonGroupedBy, verificationTableContent, setVerificationTableContent } = props
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [reviewer, setReviewer] = useState([]);
    const dispatch = useDispatch()

    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [otherOption, setOtherOption] = useState([]);
    const [expertFormValues, setExpertFormValues] = useState([]);
    const [OtherFormValues, setOtherFormValues] = useState([]);
    const [commiteeTableContent, setCommiteeTableContent] = useState([])
    const [commiteeFormValues, setCommiteeFormValues] = useState([])
    const [commiteeList, setCommiteeList] = useState([])
    const [CommitteeRole, setCommitteeRole] = useState([])
    const [disabledCommiteBtn, setDisabledCommiteBtn] = useState(false)
    const [commiteeScop, setCommiteeScop] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [reviewDeadLineDate, setReviewDeadLineDate] = useState([])
    const [questionnaireAppId, setQuestionnaireAppId] = useState("")
    const [btnName, setBtnName] = useState("افزودن به لیست")
    const [btnNameExpert, setBtnNameExpert] = useState("افزودن به لیست")
    const [btnNameOther, setBtnNameOther] = useState("افزودن به لیست")
    const [btnCommite, setBtnCommite] = useState("افزودن")
    const [verificationTableContentZapas, setVerificationTableContentZapas] = useState([])




    const formStructure = [{
        label: "عنوان بررسی کننده",
        name: "reviewer",
        type: "select",
        options: reviewer,
        optionLabelField: "description",
        optionIdField: "enumId",
        col: 6
    }

    ]




    let mergList = organizationUnit?.employees?.concat(otherOption?.employees)


    const verificationTableCols = [

        { name: "sequence", label: "   ترتیب تایید", type: "text", style: { minWidth: "130px" } },
        // { name: "commitee", label: "نام کمیته", type: "select", options: commiteeList, optionLabelField: "committeeName", optionIdField: "committeeId", style: { minWidth: "90px" } },
        { name: "reviewerTypeEnumId", label: "   عنوان بررسی کننده ", type: "select", style: { minWidth: "130px" }, options: reviewer, optionLabelField: "description", optionIdField: "enumId", disabled: true },
        { name: "companyPartyId", label: "   شرکت ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.subOrgans, optionLabelField: "companyName", optionIdField: "companyPartyId", disabled: true },
        { name: "psoudoId", label: "  کد پرسنلی  ", type: "text", style: { minWidth: "130px" } },
        { name: "partyRelationshipId", label: "  نام و نام خانوادگی  ", type: "select", style: { minWidth: "130px" }, options: mergList ? mergList : [], optionLabelField: "name", optionIdField: "partyRelationshipId", disabled: true },
        { name: "organizationPartyId", label: "   واحد سازمانی ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId", disabled: true },
        { name: "emplPositionId", label: "  پست سازمانی  ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.positions, optionLabelField: "description", optionIdField: "emplPositionId", disabled: true },
        { name: "questionnaireId", label: "  فرم ارزیابی  ", type: "select", style: { minWidth: "90px" }, options: applicationType, optionLabelField: "name", optionIdField: "questionnaireId", disabled: true },
        { name: "reviewDeadLineDate", label: "   مهلت بررسی ", type: "date", style: { minWidth: "130px" }, disabled: true },
        { name: "reject", label: "  امکان رد  ", type: "indicator", style: { minWidth: "130px" } },
        { name: "modify", label: "   امکان رد برای اصلاح ", type: "indicator", style: { minWidth: "130px" } },
        // { name: "questionnaireAppId", label: "    hjjhhjhjh   ", type: "text", style: { minWidth: "130px" } },

    ]

    useEffect(() => {
        let questionnaireId = commiteeFormValues.questionnaireId !== undefined ? commiteeFormValues.questionnaireId : expertFormValues.questionnaireId !== undefined ? expertFormValues.questionnaireId : OtherFormValues.questionnaireId !== undefined ? OtherFormValues.questionnaireId : ""
        if (questionnaireId !== "") {
            axios.post(SERVER_URL + "/rest/s1/Suggestion/questionnaireApplication", { questionnaireId }, axiosKey)
                .then((res) => {
                    setQuestionnaireAppId(res.data.questionnaireAppId)

                }).catch(() => {
                });
        }
    }, [commiteeFormValues.questionnaireId, expertFormValues.questionnaireId, OtherFormValues.questionnaireId]);



    const addCommitee = () => {
        if (btnCommite === "افزودن") {

            axios.get(SERVER_URL + "/rest/s1/Suggestion/CommitteeMember?committeeId=" + commiteeFormValues?.commitee, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {

                let verificationCommiteeList = []

                {
                    res.data.list.map((item, index) => {
                        let element = {}

                        element.committeeMemberId = item.committeeMemberId ?? item.committeeMemberId
                        element.committeeRoleEnumId = item.committeeRoleEnumId ?? item.committeeRoleEnumId
                        element.modify = item.modify !== undefined ? item.modify : "N"
                        element.reject = item.reject !== undefined ? item.reject : "N"
                        element.sequence = item.sequence ?? item.sequence
                        element.companyPartyId = item.companyPartyId ?? item.companyPartyId
                        element.emplPositionId = item.emplPositionId ?? item.emplPositionId
                        element.organizationPartyId = item.organizationPartyId ?? item.organizationPartyId
                        element.reviewDeadLineDate = commiteeFormValues.reviewDeadLineDate ?? commiteeFormValues.reviewDeadLineDate
                        element.reviewerTypeEnumId = formValues.reviewer ?? formValues.reviewer
                        element.questionnaireId = commiteeFormValues.questionnaireId ?? commiteeFormValues.questionnaireId
                        element.questionnaireAppId = questionnaireAppId === "" ? null : questionnaireAppId
                        element.commitee = commiteeFormValues.commitee
                        verificationCommiteeList.push(element)
                        // setVeriList(VerList)
                    }
                    )
                }
                setCommiteeTableContent(verificationCommiteeList)
                setDisabledCommiteBtn(true)
                setCommiteeFormValues([])
                setQuestionnaireAppId("")
            }).catch(err => {
            });
        }
        else {
            let commiteeTableContentList = [...commiteeTableContent]
            commiteeTableContentList.map((item, index) => {
                item.questionnaireId = commiteeFormValues.questionnaireId
                item.reviewDeadLineDate = commiteeFormValues.reviewDeadLineDate
            })
            setCommiteeTableContent(commiteeTableContentList)
            setBtnCommite("افزودن")
            setDisabledCommiteBtn(true)
        }

    }


    const addCommiteeToverfication = () => {
        let dontAdd = 0
        let dontAdd1 = 0
        commiteeTableContent.map((x, index) => {
            if (x.sequence === undefined) {
                dontAdd1 = dontAdd1 + 1
            }
            verificationTableContent.map((y, index) => {
                if (x.sequence === y.sequence)
                    dontAdd = dontAdd + 1
            }
            )

        }
        )
        const newArray = [];
        commiteeTableContent.forEach(obj => {
            if (!newArray.some(o => o.sequence === obj.sequence)) {
                newArray.push({ ...obj })
            }

        });



        if ((dontAdd === 0 && dontAdd1 === 0 && newArray.length === commiteeTableContent.length) || (dontAdd1 == 0 && dontAdd === 0 && newArray.length === 1)) {
            setVerificationTableContent(prevState => { return [...prevState, ...commiteeTableContent] })
            setCommiteeTableContent([])
            setDisabledCommiteBtn(false)
            setBtnNameOther("افزودن به لیست")
            setBtnName("افزودن به لیست")
            setBtnNameExpert("افزودن به لیست")

        }



        if (dontAdd1 > 0)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب های خالی را پر کنید !"));

        else if (dontAdd > 0)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب های انتخاب شده تکراری است !"));

        else if (dontAdd > 0 && dontAdd1 > 0 || dontAdd > 0 && newArray.length !== commiteeTableContent.length)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "   شماره تریب انتخاب شده تکراری است و شماره ترتیب خالی پر کنید!"))




        else if (newArray.length !== commiteeTableContent.length && newArray.length !== 1)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب های انتخاب شده تکراری است !"));

    }




    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/CommitteeMember", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setCommiteeList(res.data.list)
        }).catch(err => {
        });
    }, []);

    useEffect(() => {
        setReviewDeadLineDate(commiteeFormValues.reviewDeadLineDate)

    }, [commiteeFormValues])





    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewer", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setReviewer(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=CommitteeRole", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setCommitteeRole(res.data.result)

        }).catch(err => {
        });


        axios.get(SERVER_URL + "/rest/s1/Suggestion/filterCommittee", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setCommiteeScop(res.data.data)

        }).catch(err => {
        });
        axios.post(SERVER_URL + "/rest/s1/evaluation/getApplicationType", { categoryEnumId: "QcSuggestionModule", subCategoryEnumId: "QcSuggestionReview" }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)

        }).catch(err => {
        });

    }

    useEffect(() => {
        getEnum();
        getOrgInfo();
    }, []);



    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter",
                axiosKey
            )
            .then((res) => {
                const orgMap = {
                    units: res.data.data.units,
                    subOrgans: res.data.data.companies,
                    positions: res.data.data.emplPositions,
                    employees: res.data.data.persons,
                };
                setOrganizationUnit(orgMap);
            })
            .catch(() => {
            });

        axios
            .get(
                SERVER_URL + "/rest/s1/Suggestion/getPrtSuggReviewers",
                axiosKey
            )
            .then((res) => {

                const otherOP = {
                    subOrgans: res.data.data.companiees,
                    employees: res.data.data.persons,
                };
                setOtherOption(otherOP)
            })
            .catch(() => {
            });



    }

    const addExpert = () => {
        let array = []
        expertFormValues.reviewerTypeEnumId = formValues.reviewer
        expertFormValues.questionnaireAppId = questionnaireAppId


        if (expertFormValues.emplPositionId !== undefined && (expertFormValues.organizationPartyId === undefined || expertFormValues.companyPartyId === undefined)) {

            organizationUnit.positions.map((i, index) => {
                if (i.emplPositionId == expertFormValues.emplPositionId) {
                    expertFormValues.organizationPartyId = i.unitPartyId
                    expertFormValues.companyPartyId = i.companyPartyId
                }
            }
            )

        }

        if (expertFormValues.partyRelationshipId !== undefined) {

            organizationUnit.employees.map((i, index) => {
                if (i.partyRelationshipId == expertFormValues.partyRelationshipId) {
                    expertFormValues.psoudoId = i.pseudoId
                    expertFormValues.username = i.username

                }

            }
            )

        }

        if (expertFormValues.reject === undefined) {
            expertFormValues.reject = "N"
        }
        if (expertFormValues.modify === undefined) {
            expertFormValues.modify = "N"
        }


        array.push(expertFormValues)

        if (!verificationTableContent.find(i => i.sequence == expertFormValues.sequence)) {


            setVerificationTableContent(prevState => { return [...prevState, ...array] })
            setExpertFormValues([])
            setQuestionnaireAppId("")
            setBtnNameOther("افزودن به لیست")
            setBtnName("افزودن به لیست")
            setBtnNameExpert("افزودن به لیست")

        }
        else
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب انتخاب شده، تکراری است!"));


    }


    const addOther = () => {
        let array = []
        OtherFormValues.reviewerTypeEnumId = formValues.reviewer

        OtherFormValues.questionnaireAppId = questionnaireAppId


        if (OtherFormValues.partyRelationshipId !== undefined && (OtherFormValues.companyPartyId === undefined || OtherFormValues.companyPartyId === null)) {

            otherOption.employees.map((i, index) => {
                if (i.partyRelationshipId === OtherFormValues.partyRelationshipId) {
                    OtherFormValues.companyPartyId = i.companyPartyId
                    OtherFormValues.username = i.username


                }
            }
            )


        }
        if (OtherFormValues.reject === undefined) {
            OtherFormValues.reject = "N"
        }
        if (OtherFormValues.modify === undefined) {
            OtherFormValues.modify = "N"
        }


        array.push(OtherFormValues)

        if (!verificationTableContent.find(i => i.sequence == OtherFormValues.sequence)) {


            setVerificationTableContent(prevState => { return [...prevState, ...array] })
            setOtherFormValues([])
            setQuestionnaireAppId("")
            setBtnNameOther("افزودن به لیست")
            setBtnName("افزودن به لیست")
            setBtnNameExpert("افزودن به لیست")


        }
        else
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب انتخاب شده، تکراری است!"));

    }



    const handleEditCommiteeTable = (newData, oldData) => {
        return new Promise((resolve, reject) => {

            const listTableContentE = [...commiteeTableContent];
            let fList = listTableContentE.findIndex(ele => ele === oldData)
            let reduser = listTableContentE.splice(fList, 1)
            setCommiteeTableContent(listTableContentE)



            let array = []

            array.push(newData)
            setCommiteeTableContent(prevState => { return [...prevState, ...array] })





        })


    }


    useEffect(() => {

        const verificationList = verificationTableContent.reduce((verificationGruop, { organizationPartyId, companyPartyId, reviewerTypeEnumId, psoudoId,
            questionnaireAppId, username, sequence, emplPositionId, reject, modify, questionnaireId, reviewDeadLineDate }) => {
            if (!verificationGruop[sequence]) verificationGruop[sequence] = [];
            let element = {}
            let element1 = {}
            let arry = []
            element.sequence = sequence
            element.reject = reject === undefined ? "N" : reject
            element.modify = modify === undefined ? "N" : modify
            element.questionnaireId = questionnaireId
            element.reviewDeadLineDate = reviewDeadLineDate
            element.questionnaireAppId = questionnaireAppId
            element.emplPositionId = emplPositionId ? emplPositionId : ""
            element.assingType = username ? username : ("$" + emplPositionId)
            element.organizationPartyId = organizationPartyId ? organizationPartyId : ""
            element.companyPartyId = companyPartyId ? companyPartyId : ""
            element.reviewerTypeEnumId = reviewerTypeEnumId
            element.psoudoId = psoudoId ? psoudoId : ""
            element.username = username ? username : ""



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
                // obj.active=key===1?true:false
                verificationResult.push(obj)

            }
        }
        /////////////////////////////////////////////////////////Verrrrrrrrrrrrrrrrrrrrrrrrrrr




        setPersonGroupedBy(prevState => { return [...prevState, verificationResult] })


    }, [verificationTableContent]);

    const handleReset = () => {
        if (btnCommite === "ویرایش" || btnNameExpert === "ویرایش" || btnNameOther === "ویرایش") {
            setVerificationTableContent(verificationTableContentZapas)
            setOtherFormValues([])
            setExpertFormValues([])
            setCommiteeTableContent([])
            setDisabledCommiteBtn(false)
            setBtnName("افزودن به لیست")
            setBtnNameExpert("افزودن به لیست")
            setBtnNameOther("افزودن به لیست")
            setBtnCommite("افزودن")
        }
        else {
            setOtherFormValues([])
            setExpertFormValues([])
            setCommiteeTableContent([])
            setDisabledCommiteBtn(false)
        }

    }


    const handleRemove = (row) => {

        return new Promise((resolve, reject) => {
            let fList = 0
            const listTableContent = [...verificationTableContent];
            if (row.emplPositionId && !row.username)
                fList = listTableContent.findIndex(ele => ele.emplPositionId === row.emplPositionId && ele.reviewerTypeEnumId === row.reviewerTypeEnumId)
            if (row.username)
                fList = listTableContent.findIndex(ele => ele.username === row.username)
            let reduser = listTableContent.splice(fList, 1)
            setVerificationTableContent(listTableContent)

        })

    }

    const handleEditVerif = (row) => {
        setVerificationTableContentZapas(verificationTableContent)
        let fList = verificationTableContent.filter(item => item.sequence !== row.sequence)

        setFormValues(prevState => ({
            ...prevState,
            reviewer: row.reviewerTypeEnumId

        }))
        if (row.reviewerTypeEnumId === "SuggestionExpert") {
            setVerificationTableContent(fList)
            setBtnNameExpert("ویرایش")
            setExpertFormValues(row)

        }

        if (row.reviewerTypeEnumId === "Commitee") {
            setBtnName("ویرایش")
            let addToCommite = verificationTableContent.filter(item => item.commitee === row.commitee)
            let remaining = verificationTableContent.filter(item => item.commitee !== row.commitee)
            setVerificationTableContent(remaining)
            setCommiteeTableContent(addToCommite)
            setCommiteeFormValues(prevState => ({
                ...prevState,
                commitee: row.commitee,
                questionnaireId: row.questionnaireId,
                reviewDeadLineDate: row.reviewDeadLineDate

            }))
            setBtnCommite("ویرایش")


        }

        if (row.reviewerTypeEnumId === "OtherSuggestion") {
            setVerificationTableContent(fList)
            setBtnNameOther("ویرایش")
            setOtherFormValues(row)

        }


    }


    return (
        <Box>

            <Card >
                <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                    <Card>
                        <CardContent>
                            <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                            />
                        </CardContent>
                        <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                            <Card >
                                {formValues.reviewer == "Commitee" ?
                                    <Box>
                                        < CommiteeForm setApplicationType={setApplicationType} applicationType={applicationType} commiteeScop={commiteeScop} setCommiteeScop={setCommiteeScop} handleReset={handleReset} setCommiteeList={setCommiteeList} disabledCommiteBtn={disabledCommiteBtn} commiteeTableContent={commiteeTableContent} organizationUnit={organizationUnit} handleEditCommiteeTable={handleEditCommiteeTable}
                                            setCommiteeTableContent={setCommiteeTableContent} CommitteeRole={CommitteeRole}
                                            btnCommite={btnCommite}
                                            commiteeFormValues={commiteeFormValues} setCommiteeFormValues={setCommiteeFormValues} commiteeList={commiteeList} addCommitee={addCommitee} />
                                        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%", marginTop: 5 }}>
                                            <Button onClick={addCommiteeToverfication} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white" }} >
                                                {btnName}
                                            </Button>
                                        </Box>
                                    </Box>
                                    : formValues.reviewer == "SuggestionExpert" ? <Box>
                                        < Expert handleReset={handleReset} formVariables={formVariables} btnNameExpert={btnNameExpert} setApplicationType={setApplicationType} applicationType={applicationType} organizationUnit={organizationUnit} expertFormValues={expertFormValues} setExpertFormValues={setExpertFormValues} addExpert={addExpert} />

                                    </Box> : formValues.reviewer == "OtherSuggestion" ? <Box>
                                        < Other handleReset={handleReset} formVariables={formVariables} btnNameOther={btnNameOther} setApplicationType={setApplicationType} applicationType={applicationType} otherOption={otherOption} OtherFormValues={OtherFormValues} setOtherFormValues={setOtherFormValues} addOther={addOther} />

                                    </Box> : ""}
                            </Card>
                        </Card>
                        <CardContent>
                            <TablePro
                                fixedLayout={false}
                                title="لیست  مراتب تایید"
                                columns={verificationTableCols}
                                rows={verificationTableContent}
                                setRows={setVerificationTableContent}
                                // loading={verificationLoading}
                                edit={"callback"}
                                removeCallback={handleRemove}
                                editCallback={handleEditVerif}
                            />
                        </CardContent>

                        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%", marginTop: 5 }}>
                            <Button onClick={startVeriftion} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white" }} >
                                تایید
                            </Button>
                        </Box>

                    </Card>
                </Card>
                <Card >
                </Card>
            </Card>
        </Box>
    )
}


function CommiteeForm(props) {

    const { setApplicationType, applicationType, handleReset, commiteeScop, btnCommite, setCommiteeList, disabledCommiteBtn, setCommiteeFormValues, commiteeFormValues, commiteeTableContent, setCommiteeTableContent, commiteeList, addCommitee, CommitteeRole, organizationUnit, handleEditCommiteeTable } = props

    const [FormValidationCommitee, setFormValidationCommitee] = useState([])
    const commiteeFormStructure = [
        {
            name: "scop",
            label: "حوزه پیشنهاد",
            type: "select",
            options: commiteeScop,
            optionLabelField: "description",
            optionIdField: "scopeTypeEnumId",
            col: 3,
        }, {
            name: "commitee",
            label: "کمیته",
            type: "select",
            options: commiteeList,
            optionLabelField: "committeeName",
            optionIdField: "committeeId",
            col: 3,

            filterOptions: options =>

                commiteeFormValues["scop"] ? options.filter((o) => {
                    let list = commiteeScop.find(x => x.scopeTypeEnumId == commiteeFormValues["scop"])

                    return list.committeeList.indexOf(o["committeeId"]) >= 0
                }) : options
        }
        , {
            name: "questionnaireId",
            label: "عنوان فرم ارزیابی",
            type: "select",
            options: applicationType,
            optionLabelField: "name",
            optionIdField: "questionnaireId",
            col: 3,
        }, {
            name: "reviewDeadLineDate",
            label: "مهلت بررسی",
            type: "date",
            required: "true",
            col: 3,
        }

    ]



    const commiteeTableCols = [
        { name: "commitee", label: "نام کمیته", type: "select", options: commiteeList, optionLabelField: "committeeName", optionIdField: "committeeId", style: { minWidth: "90px" } },
        { name: "companyPartyId", label: "   شرکت ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.subOrgans, optionLabelField: "companyName", optionIdField: "companyPartyId", disabled: true },
        { name: "organizationPartyId", label: "   واحد سازمانی ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId", disabled: true },
        { name: "emplPositionId", label: "  پست سازمانی  ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.positions, optionLabelField: "description", optionIdField: "emplPositionId", disabled: true },
        { name: "committeeRoleEnumId", label: "   نقش در کمیته  ", type: "select", style: { minWidth: "90px" }, options: CommitteeRole, optionLabelField: "description", optionIdField: "enumId", disabled: true },
        { name: "reject", label: "  امکان رد  ", type: "indicator", style: { minWidth: "90px" } },
        { name: "modify", label: "   امکان رد برای اصلاح ", type: "indicator", style: { minWidth: "90px" } },
        { name: "sequence", label: "    مرتبه تایید   ", type: "number", style: { minWidth: "90px" }, required: true },
        // { name: "questionnaireId", label: "  فرم ارزیابی  ", type: "select", style: { minWidth: "90px" }, options: applicationType, optionLabelField: "name", optionIdField: "questionnaireId", disabled: true },
        // { name: "reviewDeadLineDate", label: "   مهلت بررسی ", type: "date", style: { minWidth: "130px" }, required: true, disabled: true },
    ]


    useEffect(() => {


        axios.get(SERVER_URL + "/rest/s1/Suggestion/Committee", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setCommiteeList(res.data.list)
        }).catch(err => {
        });

    }, []);





    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={commiteeFormStructure}
                    formValues={commiteeFormValues}
                    setFormValues={setCommiteeFormValues}
                    setFormValidation={setFormValidationCommitee}
                    formValidation={FormValidationCommitee}
                    submitCallback={
                        addCommitee
                    }
                    resetCallback={handleReset}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary" disabled={disabledCommiteBtn}>{btnCommite}</Button>

                        <Button type="reset" role="secondary">لغو</Button>
                    </ActionBox>}

                />
            </CardContent>
            <CardContent>
                <TablePro
                    title="     لیست اعضای کمیته "
                    columns={commiteeTableCols}
                    rows={commiteeTableContent}
                    setTableContent={setCommiteeTableContent}
                    editCallback={handleEditCommiteeTable}

                    edit="inline"
                />
            </CardContent>
        </Card>
    )
}



function Expert(props) {

    const { expertFormValues, setExpertFormValues, organizationUnit, addExpert, applicationType, btnNameExpert, formVariables, handleReset } = props
    const [FormValidationExpert, setFormValidationExpert] = useState([])

    // useEffect(() => {
    //     if (expertFormValues.organizationPartyId !== undefined && expertFormValues.organizationPartyId !== null) {
    //         setExpertFormValues(prevState => ({
    //             ...prevState,
    //             companyPartyId: organizationUnit?.units?.find(item => item?.unitPartyId === expertFormValues["organizationPartyId"])?.companyPartyId,
    //         }))
    //     }
    // }, [expertFormValues.organizationPartyId])

    useEffect(() => {
        if (expertFormValues.emplPositionId !== undefined && expertFormValues.emplPositionId !== null) {
            setExpertFormValues(prevState => ({
                ...prevState,
                companyPartyId: organizationUnit.positions?.find(item => item.emplPositionId === expertFormValues["emplPositionId"]).companyPartyId,
                organizationPartyId: organizationUnit.positions?.find(item => item?.emplPositionId === expertFormValues["emplPositionId"]).unitPartyId,
            }))
        }
    }, [expertFormValues.emplPositionId])
    const expertFormStructure = [
        // {
        //     name: "companyPartyId",
        //     label: "شرکت",
        //     type: "select",
        //     options: organizationUnit.subOrgans,
        //     optionLabelField: "companyName",
        //     optionIdField: "companyPartyId",
        //     col: 4,

        //     filterOptions: options =>

        //         expertFormValues["organizationPartyId"] ? options.filter((o) => {
        //             let list = organizationUnit.units.find(x => x.unitPartyId == expertFormValues["organizationPartyId"])


        //             return list.companyPartyId.indexOf(o["companyPartyId"]) >= 0
        //         }) : options

        // },
        {
            name: "organizationPartyId",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            col: 4,
            filterOptions: options => options.filter((o) => {
                let list = organizationUnit.subOrgans.find(x => x.companyPartyId == formVariables?.Suggestion?.value?.companyPartyId)
                return list?.units.indexOf(o["unitPartyId"]) >= 0
            }),

        },
        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col: 4,
            required: true,

            filterOptions: options => expertFormValues["organizationPartyId"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == expertFormValues["organizationPartyId"])

                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :

                formVariables?.Suggestion?.value?.companyPartyId ? options.filter((o) => {
                    let list = organizationUnit.subOrgans.find(x => x.companyPartyId == formVariables?.Suggestion?.value?.companyPartyId)

                    return list?.emplPosition.indexOf(o["emplPositionId"]) >= 0
                }) :

                    options,
        },
        {
            name: "partyRelationshipId",
            label: " پرسنل",
            type: "select",
            options: organizationUnit.employees
                ? organizationUnit.employees.filter((a) => a.name)
                : [],
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",

            col: 4,


            filterOptions: options =>

                expertFormValues["emplPositionId"] ? options.filter((o) => {
                    let list = organizationUnit.positions.find(x => x.emplPositionId == expertFormValues["emplPositionId"])


                    return list.person.indexOf(o["fromPartyId"]) >= 0
                }) :


                    expertFormValues["organizationPartyId"] ? options.filter((o) => {
                        let list = organizationUnit.units.find(x => x.unitPartyId == expertFormValues["organizationPartyId"])


                        return list.person.indexOf(o["fromPartyId"]) >= 0
                    }) :

                        formVariables?.Suggestion?.value?.companyPartyId ? options.filter((o) => {
                            let list = organizationUnit.subOrgans.find(x => x.companyPartyId == formVariables?.Suggestion?.value?.companyPartyId)


                            return list?.person.indexOf(o["fromPartyId"]) >= 0
                        }) :


                            options,
        },
        {
            name: "questionnaireId",
            label: "عنوان فرم ارزیابی",
            type: "select",
            options: applicationType,
            optionLabelField: "name",
            optionIdField: "questionnaireId",
            col: 4
        }
        , {
            name: "sequence",
            label: " مرتبه تایید",
            type: "number",
            required: "true",
            col: 4,
        },
        , {
            name: "reviewDeadLineDate",
            label: "مهلت بررسی",
            type: "date",
            required: "true",
            col: 3,
        }, {
            name: "modify",
            label: "   امکان رد برای اصلاح ",
            type: "indicator"
        }, {
            name: "reject",
            label: "امکان رد ",
            type: "indicator"
        }
    ]



    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={expertFormStructure}
                    formValues={expertFormValues}
                    setFormValues={setExpertFormValues}
                    setFormValidation={setFormValidationExpert}
                    formValidation={FormValidationExpert}
                    submitCallback={() => {

                        addExpert()

                    }}
                    resetCallback={handleReset}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">{btnNameExpert}</Button>
                        <Button type="reset" role="secondary">لغو</Button>

                    </ActionBox>}


                />
            </CardContent>

        </Card>
    )
}


function Other(props) {

    const { OtherFormValues, setOtherFormValues, otherOption, addOther, applicationType, btnNameOther, formVariables, handleReset } = props
    const [FormValidationOther, setFormValidationOther] = useState([])
    const OtherFormStructure = [
        // {
        //     name: "companyPartyId",
        //     label: "شرکت",
        //     type: "select",
        //     options: otherOption?.subOrgans,
        //     optionLabelField: "companyName",
        //     optionIdField: "companyPartyId",
        //     col: 4
        // },
        {
            name: "partyRelationshipId",
            label: " پرسنل",
            type: "select",
            options: otherOption?.employees,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            required: true,
            col: 4,

            filterOptions: options => formVariables?.Suggestion?.value?.companyPartyId ? options.filter((o) => {
                let list = otherOption.subOrgans.find(x => x.companyPartyId == formVariables?.Suggestion?.value?.companyPartyId)
                return list.person.indexOf(o["partyId"]) >= 0
            }) : options,
        }
        , {
            name: "reviewDeadLineDate",
            label: "مهلت بررسی",
            type: "date",
            required: "true",
            col: 3,
        },
        {
            name: "questionnaireId",
            label: "عنوان فرم ارزیابی",
            type: "select",
            options: applicationType,
            optionLabelField: "name",
            optionIdField: "questionnaireId",
            col: 4
        }
        , {
            name: "sequence",
            label: " مرتبه تایید",
            type: "number",
            required: "true",
            col: 4,
        }, {
            name: "modify",
            label: "   امکان رد برای اصلاح ",
            type: "indicator"
        }, {
            name: "reject",
            label: "امکان رد ",
            type: "indicator"
        }
    ]

    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={OtherFormStructure}
                    formValues={OtherFormValues}
                    setFormValues={setOtherFormValues}
                    setFormValidation={setFormValidationOther}
                    formValidation={FormValidationOther}
                    submitCallback={() => {

                        addOther()

                    }}
                    resetCallback={handleReset}

                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">{btnNameOther}</Button>
                        <Button type="reset" role="secondary">لغو</Button>

                    </ActionBox>}


                />
            </CardContent>

        </Card>
    )
}

export default VerficationSuggestions;












