import React from 'react';
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import BaseInformationForm from "./BaseInformationForm";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { makeStyles } from "@material-ui/core/styles/makeStyles";

import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Grid,
} from "@material-ui/core";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../store/actions/fadak";
import jalaaliMoment from "moment-jalaali";
import { DeleteOutlined, Image } from "@material-ui/icons";
import ImagePreviewDialog from "../../../../components/ImagePreviewDialog";
import { useState } from 'react';


const BaseInformation = props => {
    const [formData, setFormData] = React.useState({});
    const [dilay, setDilay] = React.useState(false);
    const [fromDateState, setfromDateState] = useState(false)
    const [currentData, setCurrentData] = React.useState(false);
    const [missingperson, setmissingperson] = React.useState([]);
    const [missingidentification, setmissingidentification] = React.useState([]);
    const [data, setData] = React.useState(false);
    const [statusIdState, setStatusIdState] = React.useState({})
    const [DataMilitary, setDataMilitary] = React.useState([])
    const [noteData, setNoteData] = React.useState(false);
    const [serialnumber, setserialnumber] = React.useState(false);
    const [idNumber, setidNumber] = React.useState(false);
    const [Nationalcode, setNationalcode] = React.useState(false);
    const [PtidPassport, setPtidPassport] = React.useState(false);
    const [boorseCode, setboorseCode] = React.useState(false);
    const [partyClassifications, setpartyClassifications] = React.useState(false);
    const [disabledpersonnel, setdisabledpersonnel] = React.useState(false);
    const [email, setemail] = React.useState(false);
    const [username, setusername] = React.useState(false);
    //state for  all Nationalcode
    const [nationalCodeId, setNationalCodeId] = React.useState()
    const addFormData = setFormDataHelper(setFormData);
    //this for  partyId
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const userId = useSelector(({ auth }) => auth.user.data.userId);


    //this for  PartyRelationship
    const partyIdLoginRelation = useSelector(({ auth }) => auth.user.data);
    const partyIdUserRelation = useSelector(({ fadak }) => fadak.baseInformationInisial);
    const partyRelationshipId = (partyIdUserRelation.user !== null) ? partyIdUserRelation : partyIdLoginRelation



    const formData2 = new FormData();
    formData2.append("file", formData.contentLocation1);



    const [open, setOpen] = React.useState(false);
    const [openPassModel, setOpenPassModel] = React.useState(false)
    const [idDelete, setId] = React.useState([]);

    const [files, setFiles] = React.useState(false);
    const [addrowFile, setaddrowFile] = React.useState(false);
    const [addrowFile1, setaddrowFile1] = React.useState(false);
    const [addrow, setaddrow] = React.useState(false);



    const axiosConfig = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    };
    const configPost = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            api_key: localStorage.getItem('api_key')
        }
    };

    const partyIdentificationsType = [
        "idNumber", "Nationalcode", "serialnumber"
    ];
    const [addRows, setAddRows] = React.useState({
        "person": 1,
        "partyIdentification": 1,
        "partyClassification": 1,
        "partyNote": 1,
        "partyContent": 1,
        "userAccount": 1,
    });

    const [style, setStyle] = React.useState({
        firstName: false,
        lastName: false,
        FatherName: false,//نام پدر
        PlaceOfBirthGeoID: false,//محل تولد
        birthDate: false,//تاریخ تولپ
        Nationalcode: false,//کدملی
        idNumber: false,//شماره شناسنامه
        serialnumber: false,//سری شناسنامه
        CountryGeoId: false,//ملیت
        residenceStatusEnumId: false,//وضعیت اسکان
        maritalStatusEnumId: false,//وضعیت تاهل
        NationalcodeId: false//چک برای کد ملی تکرای

    })

    const [fromDate, setFromDate] = useState([]);
    const [truDate, setTruDate] = useState([]);
    const [fromDateInter, setfromDateInter] = useState([]);


    React.useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=" + partyRelationshipId.partyRelationshipId, axiosConfig).then(res => {
            let from = new Date(res.data.result[0].fromDate);
            // setFromDate(from.getTime())

            setFromDate(res.data.result[0]?.fromDate)
            setTruDate(res.data?.result[0]?.thruDate)

        })
    }, [])


    React.useEffect(() => {
        const data_types = ["person", "partyIdentification", "partyNote", "partyContent", "userAccount"]
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

                }, 2000)
            }
        })
        if (is_updating === false) {

        }
    }, [addRows])


    React.useEffect(() => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Party?partyId=" + partyId, axiosConfig).then(response => {
            console.log(response,"jhjuiuh")
            if (response.data.result[0]?.disabled === "Y") {
                setdisabledpersonnel(true)

            } else if (response.data.result[0].disabled === "N" || (response.data.result[0].disabled === null || response.data.result[0].disabled === '')) {
                setdisabledpersonnel(false)
            }
        })
        // axios.get(SERVER_URL + "/rest/e1/Party?partyId=" + partyId, axiosConfig).then(response => {
        //     if (response.data[0]?.disabled === "Y") {
        //         setdisabledpersonnel(true)

        //     } else if (response.data[0]?.disabled === "N" || (response.data[0]?.disabled === null || response.data[0]?.disabled === '')) {
        //         setdisabledpersonnel(false)
        //     }
        // })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=" + partyRelationshipId.partyRelationshipId, axiosConfig).then(responsePartyRel => {
            const statusId = responsePartyRel.data.result[0].statusId
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusId=" + statusId, axiosConfig).then(responseStatusId => {

                const statusIdDescription = responseStatusId.data.status[0].description

                setStatusIdState({
                    statusIdDescription: statusIdDescription
                })
                // currentData.statusIdDescription = {statusIdDescription1}
                //   setCurrentData((prevState) =>({ ...prevState , statusIdDescription}))

            })

        })





        axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" + partyId, axiosConfig).then(response => {

            axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?" +
                "enumTypeList=PersonalTitleType,ReligionEnumId,SectEnumId,ResidenceStatus,MaritalStatus&geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE&peyvastTypeList=Attachment"
                + "&partyClassificationTypeList=MilitaryState"
                , axiosConfig).then(response1 => {
                    setData(response1.data)
                    setDataMilitary(response.data)


                    let identificationObj = {};
                    let identificationObjidNumber = {};
                    let identificationObjserialnumber = {};
                    let identificationObjNationalcode = {};
                    let identificationObjPtidPassport = {};
                    let identificationObjboorseCode = {};
                    let noteObj = {};
                    let fileObj = {};
                    let signatureObj = {};
                    let partyClassification = {};
                    let userInfo1 = {};

                    response.data.partyuserInfolist.map((identification1, index) => {
                        if (typeof identification1.username != 'undefined') {
                            setusername(true)
                            userInfo1 = {
                                'userId': identification1.userId,
                                'username': identification1.username,
                                "userInfo": identification1
                            }
                        }

                    });

                    if (typeof response.data.partyuserInfolist[0] != 'undefined') {
                        if (typeof response.data.partyuserInfolist[0].emailAddress != 'undefined') {
                            setemail(true)
                        }
                    }

                    if (typeof response.data.noteList[0] != "undefined") {
                        setNoteData(true);
                        noteObj = {
                            "noteText": response.data.noteList[0].noteText
                        };
                    }
                    if (typeof response.data.partyuserInfofileList != "undefined") {
                        fileObj = {
                            "files": response.data.partyuserInfofileList
                        }
                    }
                    if (typeof response.data.partyuserInfolistSignature != "undefined") {
                        signatureObj = {
                            "signature": response.data.partyuserInfolistSignature
                        }
                    }

                    response.data.IdentificationList.map((identification, index) => {
                        if (identification.partyIdTypeEnumId === "idNumber") {
                            setidNumber(true)
                            identificationObjidNumber = {
                                "idValue": identification.idValue
                            }
                        }
                    });
                    response.data.IdentificationList.map((identification, index) => {
                        if (identification.partyIdTypeEnumId === "serialnumber") {
                            setserialnumber(true)
                            identificationObjserialnumber = {
                                "idValue": identification.idValue
                            }
                        }
                    });
                    response.data.IdentificationList.map((identification, index) => {
                        if (identification.partyIdTypeEnumId === "Nationalcode") {
                            setNationalcode(true)
                            identificationObjNationalcode = {
                                "idValue": identification.idValue
                            }
                        }
                    });
                    response.data.IdentificationList.map((identification, index) => {
                        if (identification.partyIdTypeEnumId === "PtidPassport") {
                            setPtidPassport(true)
                            identificationObjPtidPassport = {
                                "idValue": identification.idValue,
                                "expireDate": identification.expireDate
                            }
                        }
                    });

                    response.data.IdentificationList.map((identification, index) => {
                        if (identification.partyIdTypeEnumId === "boorsCode") {
                            setboorseCode(true)
                            identificationObjboorseCode = {
                                "idValue": identification.idValue
                            }
                        }
                    });

                    response.data.IdentificationList.map((identification, index) => {
                        identificationObj[identification.partyIdTypeEnumId] = identification.idValue;
                    });

                    response.data.partyuserInfofileList.map((partyuserInfofile, index) => {
                        // if(partyuserInfofile.partyContendtTypeEnumId )
                        response1.data.peyvasts.Attachment.map((peyvastdata, index1) => {
                            if (partyuserInfofile.partyContentTypeEnumId === peyvastdata.enumId) {
                            }
                        })

                    })

                    getRowdata(response.data.partyuserInfofileList, response1.data);

                    if (typeof response.data != "undefined") {
                        if (typeof response.data.partyClassificationList != "undefined") {
                            if (typeof response.data.partyClassificationList[0] != "undefined") {
                                setpartyClassifications(true)
                                partyClassification = {
                                    "partyClassification": response.data.partyClassificationList[0].partyClassificationId,
                                    "fromDatePtyClassappl": response.data.partyClassificationList[0].fromDate
                                }
                            }
                        }
                    }
                    if (typeof response.data.partyuserInfolist[0] != "undefined") {
                        const userInfo = Object.assign(response.data.partyuserInfolist[0], identificationObjPtidPassport, partyClassification, identificationObj, noteObj, fileObj, signatureObj);
                        // const userInfo = Object.assign(  userInfo1.username , identificationObjPtidPassport,partyClassification, identificationObj,noteObj, fileObj, signatureObj);
                        setCurrentData(userInfo);
                    }
                })

            //get  all of Nationalcode in PartyIdentification for  compare  national code

            axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification?partyIdTypeEnumId=Nationalcode", axiosConfig).then(getRes => {
                setNationalCodeId(getRes.data.result)
            })

        }).catch(error => {
        });




    }, []);





    React.useEffect(() => {

        if (formData.partyContent) {

            setaddrowFile1(false)
        }
    }, [addrowFile1]);


    // const [addrow1, setaddrow1] = React.useState({
    //     ""
    // });




    const handleClose = () => {
        setOpen(false);
        setOpenPassModel(false)
    };
    const dispatch = useDispatch();
    const openDeleteModal = (id) => {
        setId(id);
        setOpen(true);
    };
    const [tableContent, setTableContent] = React.useState([]);
    const [counter, setCounter] = React.useState(0);
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };


    const addTableRow = () => {

        setFiles(true);
        if (!formData.partyContentTypeEnumId && !formData.partyContent) {
            setaddrowFile(true)
            setaddrowFile1(true)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید نوع پیوست و فایل انتخاب شوند'));
        }


        if (!formData.partyContentTypeEnumId) {
            setaddrowFile(true)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید نوع پیوست  انتخاب شود'));

        } else if (formData.partyContentTypeEnumId) {
            setaddrowFile(false)
        }
        if (!formData.partyContent) {
            setaddrowFile1(true)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فایل انتخاب شود'));

            //error
        } else if (formData.partyContent) {
            setaddrowFile1(false)
        }
        // setaddrowFile1(true)
        // if(typeof formData.partyContent.contentLocation !='undefined'){
        //     setaddrowFile1(false)
        // }

        if (formData.partyContent && typeof formData.partyContent.contentLocation != "undefined" && typeof formData.partyContentTypeEnumId != "undefined") {
            const formData1 = new FormData();
            formData1.append("file", formData.partyContent.contentLocation);
            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", formData1, config)
                .then(res => {
                    dispatch(submitPost("/rest/s1/fadak/entity/PartyContent" , {data : 
                        {
                            partyContentTypeEnumId: formData.partyContentTypeEnumId,
                            contentLocation: res.data.name ,
                            partyId : partyId
                        }}
                        , "add"))
                        .then(res => {
                            const newaddRows = Object.assign({}, { ["partyContent"]: -1 });
                            setAddRows(newaddRows)
                            data.peyvastList.map((qqq, index) => {
                                if (qqq.enumId === formData.partyContentTypeEnumId) {
                                    formData.partyContentTypeEnumId = qqq.description
                                }
                            })


                            const row = {
                                id: res.data.partyContentId.partyContentId,
                                partyContentTypeEnumId: formData.partyContentTypeEnumId,
                                contentDate: jalaaliMoment().format("jYYYY/jM/jD"),
                                viewFile: <ImagePreviewDialog file={formData.partyContent.contentLocation} />,
                                delete: <Button variant="outlined" color="secondary" onClick={() => openDeleteModal(res.data.partyContentId.partyContentId)}><DeleteOutlined /></Button>
                            };



                            setTableContent(rows1 => [...rows1, row]);
                            setCounter(counter + 1);
                            setFormData({})
                            const _currentData = Object.assign({}, currentData)
                            setCurrentData(false);
                            setTimeout(() => {
                                setCurrentData(_currentData);
                            }, 20)


                        })

                })
                .catch(error => {
                });
        } else {

            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید نوع پیوست و فایل انتخاب شوند'));
        }

    };




    const getRowdata = (data1, data) => {

        data1.map((pa, index) => {

            data.peyvastList.map((qqq, index) => {
                if (qqq.enumId === pa.partyContentTypeEnumId) {
                    pa.partyContentTypeEnumId = qqq.description
                }
            })

            var fulldate = new Date(pa.contentDate);
            let converted_date = fulldate.toLocaleDateString('fa-IR');

            const row1 = {
                id: pa.partyContentId,
                partyContentTypeEnumId: pa.partyContentTypeEnumId,
                contentDate: converted_date,
                viewFile:
                    <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + pa.contentLocation}
                        target="_blank"
                    >
                        <Image />
                    </Button>
                ,

                delete: <Button variant="outlined" color="secondary" onClick={() => {


                    openDeleteModal(pa.partyContentId)
                }}><DeleteOutlined /></Button>

            };

            if (typeof pa.partyContentTypeEnumId != "undefined") {

                setTableContent(rows1 => [...rows1, row1]);
            }
        })

    };

    const missingcheckIdentification = (field) => {
        if (typeof formData.partyIdentification != "undefined") {
            if (formData.partyIdentification[field] === '') {
                return true
            } else {
                return false
            }
        }
        if (missingidentification.indexOf(field) > -1) {
            return true
        } else {
            return false
        }
    }
    const missingcheckPerson = (field) => {
        if (typeof formData.person != "undefined") {
            if (formData.person[field] === '') {
                return true
            } else {
                return false
            }
        }

        if (missingperson.indexOf(field) > -1) {
            return true
        } else {
            return false
        }
    }


 

    const updateRow = (id) => {

        if (formData?.fromDate === "" ||
            formData?.person?.firstName === ""
            || formData?.person?.lastName === "" ||
            formData?.person?.birthDate === "" ||
            formData?.person?.FatherName === ""
            || formData?.partyIdentification?.Nationalcode === ""
            || formData?.person?.PlaceOfBirthGeoID === "" ||
            formData?.partyIdentification?.idNumber === ""
            || formData?.partyIdentification?.serialnumber === ""
            || formData?.person?.CountryGeoId === "" ||
            formData?.person?.maritalStatusEnumId === "") {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, '     فیلدهای ضروری را پر کنید را پر کنید  '));
            if (formData?.fromDate === "")
                setfromDateState(true)
            else
                setfromDateState(false)
        }


        else {
            setfromDateState(false)




            const personfields = ['residenceStatusEnumId'
                , 'maritalStatusEnumId', 'FatherName', 'firstName', 'lastName', 'PlaceOfBirthGeoID', 'birthDate', 'CountryGeoId',
            ]
            const identificationfields = ['Nationalcode', 'idNumber', 'serialnumber']

            let personmissing_fileds = []
            let identificationmissing_fileds = []
            let nationalCode_fileds = [];
            nationalCodeId.map(item => {




                if (formData.partyIdentification && formData.partyIdentification.Nationalcode && formData.partyIdentification.Nationalcode !== currentData.Nationalcode && formData.partyIdentification.Nationalcode === item.idValue) {

                    nationalCode_fileds.push(item.idValue)
                }
            })


            personfields.map((field, index) => {
                let ifFilledPerson = ((typeof currentData[field] == 'undefined' && (formData.person && (typeof formData.person[field] != 'undefined'
                    && (formData.person[field]).trim() !== ''))
                ) || (
                        typeof currentData[field] != 'undefined'
                        &&
                        (
                            (typeof formData.person == 'undefined')
                            ||
                            (formData.person && (typeof formData.person[field] == 'undefined'))
                            ||
                            (formData.person && (typeof formData.person[field] != 'undefined' && (formData.person[field]).trim() !== ''))
                        )
                    )) ? true : false;
                if (!ifFilledPerson) {
                    personmissing_fileds.push(field)
                }
            })
            identificationfields.map((field, index) => {
                let ifFilled = ((typeof currentData[field] == 'undefined' && (formData.partyIdentification && (typeof formData.partyIdentification[field] != 'undefined'
                    && (formData.partyIdentification[field]).trim() !== ''))
                ) || (
                        typeof currentData[field] != 'undefined'
                        &&
                        (
                            (typeof formData.partyIdentification == 'undefined')
                            ||
                            (formData.partyIdentification && (typeof formData.partyIdentification[field] == 'undefined'))
                            ||
                            (formData.partyIdentification && (typeof formData.partyIdentification[field] != 'undefined' && (formData.partyIdentification[field]).trim() !== ''))
                        )
                    )) ? true : false;
                if (!ifFilled) {
                    identificationmissing_fileds.push(field)
                }

            })

            setmissingperson(personmissing_fileds)
            setmissingidentification(identificationmissing_fileds)
            if (nationalCode_fileds.length > 0) {

                setStyle(prevState => ({
                    ...prevState,
                    NationalcodeId: true
                }))
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'کد ملی وارده شده تکراری میباشید '),                setDilay(true)
                );
                setDilay(false)

                return null

            }
            else{
                setDilay(false)

            }

            
            const postdate = {
                partyRelationshipId: partyRelationshipId.partyRelationshipId,
                fromDate: formData?.fromDate?.fromDate == undefined ? fromDate : formData?.fromDate,
                thruDate: formData?.thruDate?.thruDate == undefined ? truDate : formData?.thruDate

            }
            if (dilay === false) {
                axios.post(SERVER_URL + "/rest/s1/fadak/saveDate", { data: postdate }, axiosConfig).then(responsePty => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت به روزرسانی شد'));

                }).catch(() => {
                });
            }


            if (personmissing_fileds.length > 0 || identificationmissing_fileds.length > 0) {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));





                var s = {
                    firstName: true,
                    lastName: true,
                    FatherName: false, //نام پدر
                    PlaceOfBirthGeoID: false,//محل تولد
                    birthDate: (formData.person && formData.person.birthDate === "") ? true : false,//تاریخ تولپ
                    Nationalcode: false,//کدملی
                    idNumber: (formData.partyIdentification && formData.partyIdentification.idNumber === "") ? true : false,//شماره شناسنامه
                    serialnumber: (formData.partyIdentification && formData.partyIdentification.serialnumber === "") ? true : false,//سری شناسنامه
                    CountryGeoId: (formData.person && formData.person.CountryGeoId === "") ? true : false,//ملیت
                    residenceStatusEnumId: (formData.person && formData.person.residenceStatusEnumId === "") ? true : false,//وضعیت اسکان
                    maritalStatusEnumId: (formData.person && formData.person.maritalStatusEnumId === "") ? true : false,//وضعیت تاهل
                }
                if (formData.person && formData.person.FatherName === "") {
                    s.FatherName = true;
                } else if (!currentData.FatherName) {
                    if (!formData.person || !formData.person.FatherName) {
                        s.FatherName = true;
                    }
                }
                if (formData.person && formData.person.PlaceOfBirthGeoID === "") {

                    s.PlaceOfBirthGeoID = true;
                } else if (!currentData.PlaceOfBirthGeoID) {
                    if (!formData.person || !formData.person.PlaceOfBirthGeoID) {
                        s.PlaceOfBirthGeoID = true;

                    }
                }
                if (formData.person && formData.person.birthDate === "") {
                    s.birthDate = true;
                } else if (!currentData.birthDate) {
                    if (!formData.person || !formData.person.birthDate) {
                        s.birthDate = true;
                    }
                }
                if (formData.partyIdentification && formData.partyIdentification.Nationalcode === "") {
                    s.Nationalcode = true;
                } else if (!currentData.Nationalcode) {
                    if (!formData.partyIdentification || !formData.partyIdentification.Nationalcode) {
                        s.Nationalcode = true;
                    }
                }
                if (formData.partyIdentification && formData.partyIdentification.idNumber === "") {
                    s.idNumber = true;
                } else if (!currentData.idNumber) {
                    if (!formData.partyIdentification || !formData.partyIdentification.idNumber) {
                        s.idNumber = true;
                    }
                }
                if (formData.partyIdentification && formData.partyIdentification.serialnumber === "") {
                    s.serialnumber = true;
                } else if (!currentData.serialnumber) {
                    if (!formData.partyIdentification || !formData.partyIdentification.serialnumber) {
                        s.serialnumber = true;
                    }
                }
                if (formData.person && formData.person.CountryGeoId === "") {
                    s.CountryGeoId = true;
                } else if (!currentData.CountryGeoId) {
                    if (!formData.person || !formData.person.CountryGeoId) {
                        s.CountryGeoId = true;
                    }
                }
                if (formData.person && formData.person.residenceStatusEnumId === "") {
                    s.residenceStatusEnumId = true;
                } else if (!currentData.residenceStatusEnumId) {
                    if (!formData.person || !formData.person.residenceStatusEnumId) {
                        s.residenceStatusEnumId = true;
                    }
                }
                if (formData.person && formData.person.maritalStatusEnumId === "") {
                    s.maritalStatusEnumId = true;
                } else if (!currentData.maritalStatusEnumId) {
                    if (!formData.person || !formData.person.maritalStatusEnumId) {
                        s.maritalStatusEnumId = true;
                    }
                }
                // }else if(!formData.person && !formData.person.FatherName && (currentData.person){
                //     s.FatherName = false;
                // }else{
                //     if(){

                //     }

                // }
                setStyle(prevState => (s))

                return;
            } else {
                if (files === false && typeof formData.contentLocation != "undefined") {
                    alert("لطفا دکمه افزودن را برای اضافه کردن فایل کلیک کنید")
                } else if (typeof formData.contentLocation == "undefined") {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال به روزرسانی اطلاعات '));

                    if (typeof formData.person != "undefined") {


                        if (formData.person.criminalRecord === true) {
                            formData.person.criminalRecord = "Y"
                        } else if (formData.person.criminalRecord === false) {
                            formData.person.criminalRecord = "N"
                        }
                        const personData = {
                            personalTitle: formData.person.personalTitle,
                            gender: formData.person.gender,
                            firstName: formData.person.firstName,
                            lastName: formData.person.lastName,
                            suffix: formData.person.suffix,
                            FatherName: formData.person.FatherName,
                            PlaceOfBirthGeoID: formData.person.PlaceOfBirthGeoID,
                            birthDate: formData.person.birthDate,
                            CountryGeoId: formData.person.CountryGeoId,
                            Cityplaceofissue: formData.person.Cityplaceofissue,
                            Regionplaceofissue: formData.person.Regionplaceofissue,
                            ReligionEnumID: formData.person.ReligionEnumID,
                            sectEnumID: formData.person.sectEnumID,
                            residenceStatusEnumId: formData.person.residenceStatusEnumId,
                            criminalRecord: formData.person.criminalRecord,
                            maritalStatusEnumId: formData.person.maritalStatusEnumId,
                            NumberofKids: formData.person.NumberofKids,
                            MilitaryCode: formData.person.MilitaryCode


                        }



                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Person" , {data : {...personData , partyId : partyId }}, axiosConfig).then(res => {

                            const newaddRows = Object.assign({}, { ["person"]: -1 });
                            setAddRows(newaddRows)
                        })



                        //  axios.patch(SERVER_URL + "/rest/e1/PartyRelationship?partyRelationshipId=" + partyRelationshipId.partyRelationshipId, postdate, axiosConfig).then(res => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })










                        // if (typeof formData.person.personalTitle != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             personalTitle: formData.person.personalTitle
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        //         .catch(error => {

                        //         })
                        // }
                        // if (typeof formData.person.gender != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             gender: formData.person.gender
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        //         .catch(error => {

                        //         })
                        // }
                        // if (typeof formData.person.firstName != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             firstName: formData.person.firstName
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        //         .catch(error => {

                        //         })
                        // }
                        // if (typeof formData.person.lastName != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             lastName: formData.person.lastName
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        //         .catch(error => {

                        //         })
                        // }
                        // if (typeof formData.person.suffix != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             suffix: formData.person.suffix
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        //         .catch(error => {

                        //         })
                        // }
                        // if (typeof formData.person != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             FatherName: formData.person.FatherName
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {
                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.PlaceOfBirthGeoID != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             PlaceOfBirthGeoID: formData.person.PlaceOfBirthGeoID
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.PlaceOfBirthGeoID != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             PlaceOfBirthGeoID: formData.person.PlaceOfBirthGeoID
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.birthDate != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             birthDate: formData.person.birthDate
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.CountryGeoId != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             CountryGeoId: formData.person.CountryGeoId
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.Cityplaceofissue != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             Cityplaceofissue: formData.person.Cityplaceofissue
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.Regionplaceofissue != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             Regionplaceofissue: formData.person.Regionplaceofissue
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.ReligionEnumID != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             ReligionEnumID: formData.person.ReligionEnumID
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.sectEnumID != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             sectEnumID: formData.person.sectEnumID
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.residenceStatusEnumId != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             residenceStatusEnumId: formData.person.residenceStatusEnumId
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.criminalRecord != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             criminalRecord: formData.person.criminalRecord
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.maritalStatusEnumId != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             maritalStatusEnumId: formData.person.maritalStatusEnumId
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person.NumberofKids != "undefined") {
                        //     axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //         {
                        //             NumberofKids: formData.person.NumberofKids
                        //         }
                        //         ,
                        //         axiosConfig
                        //     ).then(response => {

                        //         const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //         setAddRows(newaddRows)
                        //     })
                        // }
                        // if (typeof formData.person != "undefined") {
                        //     if (typeof formData.person.MilitaryCode != "undefined") {
                        //         axios.patch(SERVER_URL + "/rest/e1/Person?partyId=" + partyId,
                        //             {
                        //                 MilitaryCode: formData.person.MilitaryCode
                        //             }
                        //             ,
                        //             axiosConfig
                        //         ).then(response => {

                        //             const newaddRows = Object.assign({}, { ["person"]: -1 });
                        //             setAddRows(newaddRows)
                        //         })
                        //     }

                        // }
                    }

                    if (typeof formData.userAccount != "undefined") {
                        if (email === false && typeof formData.userAccount.emailAddress != "undefined") {
                            //post
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/UserAccount", {data : 
                                {
                                    resetPassword: formData.userAccount.resetPassword,
                                    disabled: "N", partyId: partyId, userId: currentData.userId,
                                    emailAddress: formData.userAccount.emailAddress,
                                    currentPassword: formData.userAccount.currentPassword,
                                }}

                                , {
                                    headers: {
                                        'api_key': localStorage.getItem('api_key')
                                    },
                                }).then(response => {

                                    const newaddRows = Object.assign({}, { ["userAccount"]: -1 });
                                    setAddRows(newaddRows)
                                })
                        } else if (email === true && typeof formData.userAccount.emailAddress != "undefined") {
                            //patch
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/UserAccount" , {data : 
                                {

                                    emailAddress: formData.userAccount.emailAddress,
                                    userId : currentData.userId

                                }}

                                , {
                                    headers: {
                                        'api_key': localStorage.getItem('api_key')
                                    },
                                }).then(response => {

                                    const newaddRows = Object.assign({}, { ["userAccount"]: -1 });
                                    setAddRows(newaddRows)
                                })
                        }
                    }



                    if (typeof formData.partyNote != "undefined" && noteData === false) {
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyNote",
                            {data : { noteText: formData.partyNote.noteText, partyId: partyId }}
                            , configPost)
                            .then(res => {
                                const newaddRows = Object.assign({}, { ["partyNote"]: -1 });
                                setAddRows(newaddRows)
                            }).catch(error => {

                            });
                    } else if (typeof formData.partyNote != "undefined" && noteData === true) {
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyNote" ,
                            {data : {...formData.partyNote ,partyId : id }}
                            , {
                                headers: {
                                    'api_key': localStorage.getItem('api_key')
                                },
                            }).then(response => {

                                const newaddRows = Object.assign({}, { ["partyNote"]: -1 });
                                setAddRows(newaddRows)
                            })
                            .catch(error => {

                            });
                    }

                    if (typeof formData.partyIdentification != "undefined") {
                        if (typeof formData.partyIdentification.boorsCode != 'undefined' && boorseCode === false) {
                            //post
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification", {data : {
                                idValue: formData.partyIdentification.boorsCode,
                                partyIdTypeEnumId: "boorsCode",
                                partyId: id,
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        } else if (typeof formData.partyIdentification.boorsCode != 'undefined' && boorseCode === true) {
                            //patch
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                idValue: formData.partyIdentification.boorsCode,
                                partyId : id ,
                                partyIdTypeEnumId : "boorsCode"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if (typeof formData.partyIdentification.expireDate != "undefined" && PtidPassport === true) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                expireDate: formData.partyIdentification.expireDate,
                                partyId : id , 
                                partyIdTypeEnumId : "PtidPassport"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if (typeof formData.partyIdentification.PtidPassport != "undefined" && PtidPassport === true) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                idValue: formData.partyIdentification.PtidPassport,
                                partyId : id , 
                                partyIdTypeEnumId : "PtidPassport"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        } else if (typeof formData.partyIdentification.PtidPassport != "undefined" && PtidPassport !== true) {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification", { data : {
                                idValue: formData.partyIdentification.PtidPassport,
                                partyIdTypeEnumId: "PtidPassport",
                                partyId: id,
                                expireDate: formData.partyIdentification.expireDate
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if (typeof formData.partyIdentification.idNumber != "undefined" && idNumber === true) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                idValue: formData.partyIdentification.idNumber , 
                                partyId : id ,
                                partyIdTypeEnumId : "idNumber"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if ((typeof formData.partyIdentification.idNumber != "undefined" || formData.partyIdentification.idNumber !== '')
                            && idNumber === false) {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification", { data : {
                                idValue: formData.partyIdentification.idNumber,
                                partyIdTypeEnumId: "idNumber",
                                partyId: id
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if ((typeof formData.partyIdentification.serialnumber != "undefined" || formData.partyIdentification.serialnumber !== '')
                            && serialnumber === false) {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification", { data : {
                                idValue: formData.partyIdentification.serialnumber,
                                partyIdTypeEnumId: "serialnumber",
                                partyId: id
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }
                        if ((typeof formData.partyIdentification.Nationalcode != "undefined" || formData.partyIdentification.Nationalcode !== '')
                            && Nationalcode === false) {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification", { data : {
                                idValue: formData.partyIdentification.Nationalcode,
                                partyIdTypeEnumId: "Nationalcode",
                                partyId: id
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }

                        if (typeof formData.partyIdentification.serialnumber != "undefined" && serialnumber === true) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                idValue: formData.partyIdentification.serialnumber ,
                                partyId : id ,
                                partyIdTypeEnumId : "serialnumber"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }

                        if (typeof formData.partyIdentification.Nationalcode != "undefined" && Nationalcode === true) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyIdentification" , { data : {
                                idValue: formData.partyIdentification.Nationalcode , 
                                partyId : id ,
                                partyIdTypeEnumId : "Nationalcode"
                            }}
                                , axiosConfig).then(response => {
                                    const newaddRows = Object.assign({}, { ["partyIdentification"]: -1 });
                                    setAddRows(newaddRows)
                                })
                                .catch(error => {

                                });
                        }

                    }


                    if (typeof formData.person != 'undefined' && (formData.person.gender === "N" || (currentData && currentData.gender === "N"))) {
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Person" , {data : 
                            {
                                MilitaryCode: '' , 
                                partyId : partyId
                            }}
                            ,
                            axiosConfig
                        ).then(response => {

                            const newaddRows = Object.assign({}, { ["person"]: -1 });
                            setAddRows(newaddRows)
                        })
                    } else if (typeof formData.person != 'undefined' && (formData.gender !== "N" || (currentData && currentData.gender !== "N"))) {

                        if (formData.person.MilitaryCode !== '') {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Person" , {data : 
                                {
                                    MilitaryCode: formData.person.MilitaryCode , 
                                    partyId : partyId
                                }}
                                ,
                                axiosConfig
                            ).then(response => {

                                const newaddRows = Object.assign({}, { ["person"]: -1 });
                                setAddRows(newaddRows)
                            })
                        }

                    }

                    if (typeof formData.partyClassification != "undefined" || (formData.person && formData.person.gender === "N")) {

                        let partyClassification = { partyId: partyId };
                        if ((currentData.gender === "N") || (formData.person && formData.person.gender === "N")) {
                            partyClassification["partyClassificationId"] = "NotIncluded";

                        } else {
                            partyClassification["partyClassificationId"] = formData.partyClassification.partyClassificationId;
                        }
                        if (typeof currentData.partyClassificationId == "undefined") {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyClassificationAppl", {data : partyClassification}, configPost)
                                .then(res => {
                                    const newaddRows = Object.assign({}, { ["partyClassification"]: -1 });
                                    setAddRows(newaddRows)
                                    setCurrentData(Object.assign({}, currentData, { partyClassificationId: partyClassification["partyClassificationId"] }))

                                })
                        } else {


                            let dataParmas = {
                                'partyId': partyClassification.partyId,
                                "partyClassificationId": currentData.partyClassificationId,
                                "fromDate": currentData.fromDatePtyClassappl
                            }
                            // var config = {
                            //     method: 'delete',
                            //     url: `${SERVER_URL}/rest/e1/PartyClassificationAppl`,
                            //     headers: {
                            //         'api_key': localStorage.getItem('api_key')
                            //     },
                            //     data: dataParmas
                            // }
                            if (dilay === false) {
                                axios.post(SERVER_URL + "/rest/s1/fadak/saveLastPartyClassificationBase", { data: partyClassification }, axiosConfig).then(responsePty => {

                                    const newaddRows = Object.assign({}, { ["partyClassification"]: -1 });
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت به روزرسانی شد'));
                                    setAddRows(newaddRows)
                                    setCurrentData(Object.assign({}, currentData, { partyClassificationId: partyClassification["partyClassificationId"] }))




                                })
                            }
                        }

                        //     axios(config).then(response => {
                        //             axios.post(SERVER_URL + "/rest/e1/PartyClassificationAppl", { ...partyClassification, fromDate: currentData.fromDatePtyClassappl }, axiosConfig).then(responsePty => {

                        //                 const newaddRows = Object.assign({}, { ["partyClassification"]: -1 });
                        //                 dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  به روزرسانی شد'));
                        //                 setAddRows(newaddRows)
                        //                 setCurrentData(Object.assign({}, currentData, { partyClassificationId: partyClassification["partyClassificationId"] }))
                        //             })




                        //         })
                        // }

                    }


                    if (currentData.gender === "Y" && formData.partyClassification && formData.partyClassification.partyClassificationId) {
                        let partyClassification = { partyId: partyId, partyClassificationId: formData.partyClassification.partyClassificationId };
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PartyClassificationAppl",
                            {data : partyClassification}, axiosConfig).then(response => {

                                const newaddRows = Object.assign({}, { ["partyClassification"]: -1 });
                                setAddRows(newaddRows)
                                setCurrentData(Object.assign({}, currentData, { partyClassificationId: partyClassification["partyClassificationId"] }))
                            })
                    }



                    if (typeof formData.person != "undefined") {
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Person" , {data : 
                            {
                                sectEnumID: formData.person.sectEnumID ,
                                partyId : partyId
                            }}
                            ,
                            axiosConfig
                        ).then(response => {

                            const newaddRows = Object.assign({}, { ["person"]: -1 });
                            setAddRows(newaddRows)
                        })
                    }
                    if (typeof formData.partyClassification != "undefined" && ((typeof formData.person == "undefined") || typeof currentData.gender == "undefined")) {
                        if (formData.partyClassification.partyClassificationId === "" && typeof currentData.partyClassificationId != "undefined") {
                            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyClassificationAppl?partyId=" + partyId, {
                                headers: {
                                    'api_key': localStorage.getItem('api_key')
                                },
                            })
                                .then(res => {
                                    const newaddRows = Object.assign({}, { ["partyClassification"]: -1 });
                                    setAddRows(newaddRows)
                                })


                        }
                    }




                    // if (typeof formData.partyClassification != "undefined" && currentData.partyClassification === "undefined" && (currentData.gender !== "N" || formData.person.gender !== "N")) {
                    // if (typeof formData.partyClassification != "undefined" && partyClassifications !== true && (currentData.gender !== "N" || formData.person.gender !== "N")) {
                    //     axios.post(SERVER_URL + "/rest/e1/PartyClassificationAppl",
                    //         {partyClassificationId: formData.partyClassification.partyClassificationId, partyId: partyId}
                    //         , configPost)
                    //         .then(res => {
                    //         }).catch(error => {
                    //
                    //     });
                    //     // } else if (typeof formData.partyClassification != "undefined" && (currentData.partyClassification !== formData.partyClassification ) && (currentData.gender !== "N" || formData.person.gender !== "N")) {
                    // } else if (typeof formData.partyClassification != "undefined" && partyClassifications === true && (currentData.gender !== "N" || formData.person.gender !== "N")) {
                    //     axios.patch(SERVER_URL + "/rest/e1/PartyClassificationAppl?partyId=" + id,
                    //         formData.partyClassification
                    //         , {
                    //             headers: {
                    //                 'api_key': localStorage.getItem('api_key')
                    //             },
                    //         }).then(response => {
                    //     })
                    //         .catch(error => {
                    //
                    //         });
                    // }
                    // if (typeof formData.partyClassification != "undefined" && partyClassifications !== true && (currentData.gender === "N" || formData.person.gender === "N")) {
                    //     axios.post(SERVER_URL + "/rest/e1/PartyClassificationAppl",
                    //         {partyClassificationId: "NotIncluded", partyId: partyId}
                    //         , configPost)
                    //         .then(res => {
                    //         }).catch(error => {
                    //
                    //     });
                    // } else if (typeof formData.partyClassification != "undefined" && partyClassifications === true && (currentData.gender === "N" || formData.person.gender === "N")) {
                    //     axios.patch(SERVER_URL + "/rest/e1/PartyClassificationAppl?partyId=" + id,
                    //         {partyClassificationId: "NotIncluded"}
                    //         , {
                    //             headers: {
                    //                 'api_key': localStorage.getItem('api_key')
                    //             },
                    //         }).then(response => {
                    //     })
                    //         .catch(error => {
                    //
                    //         });
                    // }

                }



            }

        }




    }


    return (
        <Grid>
            {currentData && data && <BaseInformationForm addFormData={addFormData} disabledpersonnel={disabledpersonnel} style={style} setStyle={setStyle}
                setaddrowFile1={setaddrowFile1} setaddrowFile={setaddrowFile} openPassModel={openPassModel} statusIdState={statusIdState}
                addrowFile1={addrowFile1} addrowFile={addrowFile} setFormData={setFormData} setCurrentData={setCurrentData}
                formData={formData} currentData={currentData} setOpenPassModel={setOpenPassModel} setFromDate={setFromDate} setTruDate={setTruDate}
                data={data} tableContent={tableContent} missingcheckPerson={missingcheckPerson} DataMilitary={DataMilitary} fromDateState={fromDateState}
                updateRow={updateRow} addrow={addrow} missingcheckIdentification={missingcheckIdentification} fromDateInter={fromDateInter} setfromDateInter={setfromDateInter}
                addTableRow={addTableRow} getRowdata={getRowdata} setTableContent={setTableContent} truDate={truDate} fromDate={fromDate}
                setOpen={setOpen} setId={setId} idDelete={idDelete} open={open} handleClose={handleClose} setfromDateState={setfromDateState}



            />}
        </Grid>
    );
};

export default BaseInformation;
