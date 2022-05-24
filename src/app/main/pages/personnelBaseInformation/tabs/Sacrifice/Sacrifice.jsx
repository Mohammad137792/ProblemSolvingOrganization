import React, { useState, useEffect } from 'react';
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import SacrificeForm from "./SacrificeForm";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { useDispatch, useSelector } from "react-redux";
import { submitPost } from "../../../../../store/actions/fadak";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";




const Sacrifice = props => {

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin

    const [tableContent, setTableContent] = useState(false);
    const [tableExperimentDate, setTableExperimentDate] = useState(false);
    const [editBtn, setEditBtn] = useState(false)
    const [editExperiment, setEditExperiment] = useState(true);
    const [formData, setFormData] = useState({});
    const addFormData = setFormDataHelper(setFormData);
    const dispatch = useDispatch();
    const [currentData, setCurrentData] = useState({ "diseaseId": -1, "experimentId": -1, "deleteDiseaseId": -1, "deleteExperimentId": -1 });
    const [data, setData] = useState()
    const [sacrificeDoc, setSacrificeDoc] = useState();
    const [val, setVal] = useState('')
    const [edit, setEdit] = useState(true)
    const [diseaseId, setDiseaseId] = useState(-1)
    const [openModel, setOpenModel] = useState(false)
    const [display, setDisplay] = useState()
    const [styleBorder, setStyleBorder] = useState({
        "diseaseTypeEnumId": true,
        "testType": true
    })
    const sacrificeAttachmentFormData = new FormData()
    const LocationContactFormData = new FormData()



    //config axios
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }

    const handlerCloseModel = () => {
        setOpenModel(false)
    }
    const handerDelete = (idRow) => {
        setOpenModel(true)
        currentData.deleteDiseaseId = idRow
        setCurrentData(Object.assign({}, currentData))


    }
    const handerDeleteExperiment = (idRow) => {
        setOpenModel(true)
        currentData.deleteExperimentId = idRow
        setCurrentData(Object.assign({}, currentData))

    }
    const [addRows, setAddRows] = React.useState({
        "setDiseaseHistory": 1,
        "setExperimentHistory": 1,
        "editDiseaseHistory": 1,
        "editExperimentHander": 1
    })


    //start REQUEST
    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=DiseaseType,ExperimentType,SacrificeType,SacrificeDocument ",
            axiosKey).then(res => {
                setData(res.data.enums)
                setDisplay(false);
                setTimeout(() => {
                    setDisplay(true);
                }, 100)
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/DiseaseHistory?partyId=" + partyId, axiosKey).then(response => {

                    setCurrentData(prevState => ({
                        ...prevState,
                        DiseaseHistory: response.data.result
                    })
                    )
                    getRowDisease(response.data.result)
                })
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/ExperimentHistory?partyId=" + partyId, axiosKey).then(responseExperiment => {

                    setCurrentData(prevState => ({
                        ...prevState,
                        ExperimentHistory: responseExperiment.data.result
                    })
                    )
                    getRowExperiment(responseExperiment.data.result)
                })
            })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Person?partyId=" + partyId, axiosKey).then(res => setCurrentData(prevState => ({ ...prevState, getPerson: res.data.result })))
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyContent?partyContentTypeEnumId=SacrificeDocument&partyId=" + partyId, axiosKey)
            .then(res => {
                setCurrentData(prevState => { return { ...prevState, pContent: res.data.result[res.data.result.length - 1] } })
            })



    }, [])

    useEffect(() => {
        const data_types = ["setDiseaseHistory", "setExperimentHistory", "editDiseaseHistory", "editExperimentHander"]
        let is_updating = false;
        data_types.map((item, index) => {
            if (typeof addRows[item] != "undefined" && addRows[item] === 0) {
                is_updating = true;
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
            }
        })
        data_types.map((item, index) => {


            if (typeof addRows[item] != "undefined" && addRows[item] === -1) {
                // is_updating = true;

                setTimeout(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  به روزرسانی شد'));

                }, 1000)
            }
        })
    }, [addRows])



    const getRowDisease = (dataReast) => {
        //set value table row in ScarificeForm Page
        setTableContent(rows => {
            return {
                ...rows,
                Disease: dataReast
            }
        });
    }
    const getRowExperiment = (dataReast) => {
        //set value table row in ScarificeForm Page
        setTableContent(rows => {
            return {
                ...rows,
                Experiment: dataReast
            }
        });
    }


    const addToPerson = e => {



        // value for formDataPerson
        if (formData.person !== undefined) {

            const { sacrificeId, sacrificeOperationArea, sacrificeTypeEnumId, } = formData.person;
            const sacrificePercentage = (formData.person.sacrificePercentage) ? parseInt(formData.person.sacrificePercentage) : (formData.person.sacrificePercentage === "") ? 0 : currentData.getPerson.sacrificePercentage;
            const sacrificeDuration = (formData.person.sacrificeDuration) ? parseInt(formData.person.sacrificeDuration) : (formData.person.sacrificeDuration === "") ? 0 : currentData.getPerson.sacrificeDuration;
            console.log("sacrificePercentage", sacrificePercentage)


            let isPersonnelSmoker = ((formData.person.isPersonnelSmoker) ? 'Y' : 'N')
            let hasPersonnelDiseaseBackground = ((formData.person.hasPersonnelDiseaseBackground) ? 'Y' : 'N')
            if (formData.person.isPersonnelSmoker === undefined) {
                isPersonnelSmoker = currentData.getPerson.isPersonnelSmoker
            }
            if (formData.person.hasPersonnelDiseaseBackground === undefined) {
                hasPersonnelDiseaseBackground = currentData.getPerson.hasPersonnelDiseaseBackground
            }
            const formDataPerson = {
                sacrificeId, sacrificePercentage, sacrificeDuration, sacrificeOperationArea,
                isPersonnelSmoker, hasPersonnelDiseaseBackground, sacrificeTypeEnumId
            }
            let dataForPut = {partyId : partyId , ...formDataPerson }
            axios.put(SERVER_URL + "/rest/s1/fadak/entity/Person" , {data : dataForPut}
                , axiosKey).then(res => {

                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت به روز شد'));
                })

        }

        if (formData.partycontetnt !== undefined) {
            sacrificeAttachmentFormData.append("file", formData.partycontetnt.sacrificeAttachment)
            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", sacrificeAttachmentFormData, config)
                .then(res => {

                    setSacrificeDoc(res.data.name)

                    dispatch(submitPost("/rest/s1/fadak/entity/PartyContent" , {data : 
                        {
                            partyContentTypeEnumId: "SacrificeDocument",
                            contentLocation: res.data.name , 
                            partyId : partyId
                        }}
                        , "add"))
                })
                .catch(error => {
                });
        }

    }
    {
        console.log("salkcakvsc", formData)
    }

    // set frist part of page(سوابق بیماری)
    const setDiseaseHistory = e => {
        let { DiseaseHistory } = currentData;
        const { diseaseHistory } = formData
        if (formData.diseaseHistory && formData.diseaseHistory.diseaseTypeEnumId !== "" && formData.diseaseHistory.diseaseTypeEnumId) {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));
            const newaddRows = Object.assign({}, { ["setDiseaseHistory"]: -1 });
            setAddRows(newaddRows)

            axios.post(SERVER_URL + "/rest/s1/fadak/entity/DiseaseHistory" , {data : {...diseaseHistory , partyId : partyId }},
                axiosKey).then(res => {

                    const row = {
                        diseaseHistoryId: res.data.diseaseHistoryId,
                        partyId,
                        diseaseTypeEnumId: formData.diseaseHistory.diseaseTypeEnumId,
                        medicalName: diseaseHistory.medicalName,
                        fromDate: (formData.diseaseHistory.fromDate) ? Math.round(new Date(formData.diseaseHistory.fromDate).getTime()) : null,
                        toDate: (formData.diseaseHistory.toDate) ? Math.round(new Date(formData.diseaseHistory.toDate).getTime()) : null,

                    }



                    setTableContent(rows => {
                        return {
                            ...rows,
                            Disease: [...rows.Disease, row]
                        }
                    });
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)
                    currentData.DiseaseHistory = [...currentData.DiseaseHistory, row]
                    setCurrentData(Object.assign({}, currentData))
                    formData.diseaseHistory = undefined;
                    setFormData(Object.assign({}, formData))
                })

        }
        setStyleBorder(preState => ({
            ...preState,
            diseaseTypeEnumId: (formData.diseaseHistory && formData.diseaseHistory.diseaseTypeEnumId && formData.diseaseHistory.diseaseTypeEnumId !== "") ? true : false
        }))
    }


    const editDiseaseHistory = () => {


        if (formData.diseaseHistory !== undefined && formData.diseaseHistory.diseaseTypeEnumId !== "") {
            const id = currentData.DiseaseHistory[currentData.diseaseId].diseaseHistoryId
            const row = {

                diseaseTypeEnumId: (formData.diseaseHistory.diseaseTypeEnumId) ? (formData.diseaseHistory.diseaseTypeEnumId) : (formData.diseaseHistory.diseaseTypeEnumId === "") ? "" : currentData.DiseaseHistory[currentData.diseaseId].diseaseTypeEnumId,
                medicalName: (formData.diseaseHistory.medicalName) ? (formData.diseaseHistory.medicalName) : (formData.diseaseHistory.medicalName === "") ? "" : currentData.DiseaseHistory[currentData.diseaseId].medicalName,
                fromDate: (formData.diseaseHistory.fromDate) ? Math.round(new Date(formData.diseaseHistory.fromDate).getTime()) : currentData.DiseaseHistory[currentData.diseaseId].fromDate,
                toDate: (formData.diseaseHistory.toDate) ? Math.round(new Date(formData.diseaseHistory.toDate).getTime()) : currentData.DiseaseHistory[currentData.diseaseId].toDate,
            }
            const newaddRows = Object.assign({}, { ["editDiseaseHistory"]: -1 });
            setAddRows(newaddRows)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));

            axios.put(SERVER_URL + "/rest/s1/fadak/entity/DiseaseHistory" , {data : {...row , diseaseHistoryId : id}}, axiosKey)
                .then(res => {

                    let diseaseHistory = Object.assign({}, currentData.DiseaseHistory[currentData.diseaseId], row)
                    currentData.DiseaseHistory[currentData.diseaseId] = diseaseHistory

                    let diseaseTable = Object.assign({}, tableContent.Disease[currentData.diseaseId], row)
                    tableContent.Disease[currentData.diseaseId] = diseaseTable


                    setTableContent(Object.assign({}, tableContent))

                    currentData.diseaseId = -1
                    setCurrentData(Object.assign({}, currentData))
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 30)

                    setStyleBorder(preState => ({
                        ...preState,
                        diseaseTypeEnumId: true
                    }))

                    formData.diseaseHistory = undefined;
                    setFormData(Object.assign({}, formData))


                })


            return null


        }
        setStyleBorder(preState => ({
            ...preState,
            diseaseTypeEnumId: (formData.diseaseHistory && formData.diseaseHistory.diseaseTypeEnumId && formData.diseaseHistory.diseaseTypeEnumId === "") ? true : false
        }))




    }



    const ExperimentHistory = res => {
        const { experimentHistory } = formData
        axios.post(SERVER_URL + "/rest/s1/fadak/entity/ExperimentHistory" , { data : {
            ...experimentHistory,
            locationContact: (res !== null) ? (res.data.name) : null , 
            partyId : partyId

        }},
            axiosKey).then(response => {

                const converted = (date) => {
                    let d = new Date(date);
                    let converte = d.toLocaleDateString('fa-IR');
                    return converte
                }


                const row = {
                    experimentHistoryId: response.data.experimentHistoryId,
                    partyId,
                    experimentTypeEnumId: formData.experimentHistory.experimentTypeEnumId,
                    resultExperiment: experimentHistory.resultExperiment,
                    locationContact: (res !== null) ? (res.data.name) : '',
                    diagnose: formData.experimentHistory.diagnose,
                    experimentDate: (formData.experimentHistory) ? Math.round(new Date(formData.experimentHistory.experimentDate).getTime()) : null,
                    nextExperimentDate: (formData.experimentHistory) ? Math.round(new Date(formData.experimentHistory.nextExperimentDate).getTime()) : null,

                }

                setTableContent(rows => {
                    return {
                        ...rows,
                        Experiment: [...rows.Experiment, row]
                    }
                })

                currentData.ExperimentHistory = [...currentData.ExperimentHistory, row]
                setCurrentData(Object.assign({}, currentData))
                formData.experimentHistory = undefined;
                setFormData(Object.assign({}, formData))
                setDisplay(false)
                setTimeout(() => {
                    setDisplay(true)
                }, 20)



            })
    }

    const setExperimentHistory = () => {
        const { experimentHistory } = formData
        if (formData.experimentHistory !== undefined && formData.experimentHistory.experimentTypeEnumId && formData.experimentHistory.experimentTypeEnumId !== "") {
            const newaddRows = Object.assign({}, { ["setExperimentHistory"]: -1 });
            setAddRows(newaddRows)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));
            if (formData.experimentHistory.locationContact !== undefined) {
                LocationContactFormData.append("file", formData.experimentHistory.locationContact)
                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", LocationContactFormData, config)
                    .then(res => {


                        ExperimentHistory(res)

                    })
                return null

            } else {
                ExperimentHistory(null)

            }

        }
        setStyleBorder(preState => ({
            ...preState,
            testType: (formData.experimentHistory && formData.experimentHistory.experimentTypeEnumId && formData.experimentHistory.experimentTypeEnumId !== "") ? true : false
        }))

    }




    const ExperimentHistoryPut = (responc, rowExpr) => {

        axios.put(SERVER_URL + "/rest/s1/fadak/entity/ExperimentHistory" , { data : {
            ...rowExpr,
            locationContact: (responc !== null) ? (responc.data.name) : null , 
            experimentHistoryId : currentData.ExperimentHistory[currentData.experimentId].experimentHistoryId

        }},
            axiosKey).then(res => {


                let experimentHistory = Object.assign({}, currentData.ExperimentHistory[currentData.experimentId], rowExpr)
                currentData.ExperimentHistory[currentData.experimentId] = experimentHistory

                let experimenttable = Object.assign({}, tableContent.Experiment[currentData.experimentId], rowExpr)
                tableContent.Experiment[currentData.experimentId] = experimenttable
                setTableContent(Object.assign({}, tableContent))



                currentData.experimentId = -1;
                setCurrentData(Object.assign({}, currentData))
                setDisplay(false)
                setTimeout(() => {
                    setDisplay(true)
                }, 20)
                setStyleBorder(preState => ({
                    ...preState,
                    testType: true
                }))
                formData.diseaseHistory = undefined;
                setFormData(Object.assign({}, formData))


            })
    }




    const editExperimentHander = () => {




        if (formData.experimentHistory !== undefined && formData.experimentHistory.experimentTypeEnumId !== "") {

            const idEX = currentData.ExperimentHistory[currentData.experimentId].experimentHistoryId
            const newaddRows = Object.assign({}, { ["editExperimentHander"]: -1 });
            setAddRows(newaddRows)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));



            if (formData.experimentHistory.locationContact !== undefined) {
                LocationContactFormData.append("file", formData.experimentHistory.locationContact)
                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", LocationContactFormData, config)
                    .then(res => {



                        let rowExpr = {

                            experimentTypeEnumId: (formData.experimentHistory.experimentTypeEnumId) ? (formData.experimentHistory.experimentTypeEnumId) :
                                (formData.experimentHistory.experimentTypeEnumId === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].experimentTypeEnumId,
                            resultExperiment: (formData.experimentHistory.resultExperiment) ? (formData.experimentHistory.resultExperiment) :
                                (formData.experimentHistory.resultExperiment === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].resultExperiment,
                            diagnose: (formData.experimentHistory.diagnose) ? (formData.experimentHistory.diagnose) :
                                (formData.experimentHistory.diagnose === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].diagnose,
                            nextExperimentDate: (formData.experimentHistory.nextExperimentDate) ? Math.round(new Date(formData.experimentHistory.nextExperimentDate).getTime()) : currentData.ExperimentHistory[currentData.experimentId].nextExperimentDate,
                            experimentDate: (formData.experimentHistory.experimentDate) ? Math.round(new Date(formData.experimentHistory.experimentDate).getTime()) : currentData.ExperimentHistory[currentData.experimentId].experimentDate,
                            locationContact: res.data.name

                        }

                        ExperimentHistoryPut(res, rowExpr)
                    })
                return null

            } else {
                let rowExpr1 = {

                    experimentTypeEnumId: (formData.experimentHistory.experimentTypeEnumId) ? (formData.experimentHistory.experimentTypeEnumId) :
                        (formData.experimentHistory.experimentTypeEnumId === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].experimentTypeEnumId,
                    resultExperiment: (formData.experimentHistory.resultExperiment) ? (formData.experimentHistory.resultExperiment) :
                        (formData.experimentHistory.resultExperiment === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].resultExperiment,
                    diagnose: (formData.experimentHistory.diagnose) ? (formData.experimentHistory.diagnose) :
                        (formData.experimentHistory.diagnose === "") ? "" : currentData.ExperimentHistory[currentData.experimentId].diagnose,
                    nextExperimentDate: (formData.experimentHistory.nextExperimentDate) ? Math.round(new Date(formData.experimentHistory.nextExperimentDate).getTime()) : currentData.ExperimentHistory[currentData.experimentId].nextExperimentDate,
                    experimentDate: (formData.experimentHistory.experimentDate) ? Math.round(new Date(formData.experimentHistory.experimentDate).getTime()) : currentData.ExperimentHistory[currentData.experimentId].experimentDate,
                    locationContact: currentData.ExperimentHistory[currentData.experimentId].locationContact


                }

                ExperimentHistoryPut(null, rowExpr1)
                return null
            }
        }
        setStyleBorder(preState => ({
            ...preState,
            testType: (formData.experimentHistory && formData.experimentHistory.experimentTypeEnumId && formData.experimentHistory.experimentTypeEnumId === "") ? true : false
        }))

    }

    const handlerEditExperiment = (idRow) => {
        setCurrentData(Object.assign({}, currentData, { "experimentId": idRow }));
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 30)



    }


    const cancelHandler = (valide) => {


        if (valide === "disease") {
            currentData.diseaseId = -1;
            setCurrentData(Object.assign({}, currentData))
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
            formData.diseaseHistory = undefined;
            setFormData(Object.assign({}, formData))
            setStyleBorder(preState => ({
                diseaseTypeEnumId: true,
                testType: true
            }))

            return
        }


        currentData.experimentId = -1;
        setCurrentData(Object.assign({}, currentData))
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)
        setStyleBorder(preState => ({
            diseaseTypeEnumId: true,
            testType: true
        }))
        formData.experimentHistory = undefined;
        setFormData(Object.assign({}, formData))


    }


    const handlerEdit = idRow => {

        setCurrentData(Object.assign({}, currentData, { "diseaseId": idRow }));

        setDisplay(true)
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 30)



    }

    return (
        <>

            {currentData && display && data && tableContent && <SacrificeForm
                formValues={formData} currentData={currentData} setCurrentData={setCurrentData}
                setEditExperiment={setEditExperiment} cancelHandler={cancelHandler} handlerEdit={handlerEdit}
                editExperiment={editExperiment} setTableContent={setTableContent}
                edit={edit} setEditBtn={setEditBtn} editBtn={editBtn} styleBorder={styleBorder} setStyleBorder={setStyleBorder}
                setEdit={setEdit} openModel={openModel} setOpenModel={setOpenModel} handlerCloseModel={handlerCloseModel}
                editDiseaseHistory={editDiseaseHistory} editExperimentHander={editExperimentHander}
                setExperimentHistory={setExperimentHistory}
                data={data} addToPerson={addToPerson} handlerEditExperiment={handlerEditExperiment} setDisplay={setDisplay}
                tableExperimentDate={tableExperimentDate} handerDeleteExperiment={handerDeleteExperiment}
                addFormValue={addFormData} setDiseaseHistory={setDiseaseHistory} val={val}
                handerDelete={handerDelete} setFormData={setFormData} setVal={setVal} tableContent={tableContent} sacrificeDoc={sacrificeDoc} />}
        </>
    );
}

export default Sacrifice;
