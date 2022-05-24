import React from "react";
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import HeaderOrganizationFile from "./HeaderOrganizationFile";
import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { Grid } from "@material-ui/core";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../store/actions/fadak";

const OrganizationFormHeader = props => {

    const [formData, setFormData] = React.useState({});

    const [currentData, setCurrentData] = React.useState(false);
    const [data, setData] = React.useState([]);


    const addFormData = setFormDataHelper(setFormData);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const partyRelationshispId = useSelector(({ auth }) => auth.user.data);

    console.log("partyRelationshipId", partyRelationshispId)

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const userId = useSelector(({ auth }) => auth.user.data.userId);

    const axiosConfig = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    };
    const partyIdentificationsType = [
        "idNumber", "Nationalcode", "serialnumber"
    ];


    const [partyIdOrg, setpartyIdOrg] = React.useState(false);
    const [organizationName, setorganizationName] = React.useState(false);
    const [pseudoId, setpseudoId] = React.useState(false);

    React.useEffect(() => {

        axios.get(SERVER_URL + "/rest/s1/fadak/getOrgtype", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
            console.log("getOrgtypegetOrgtype", response.data)
            setData({ ...response.data })
            // axios.get(SERVER_URL + "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=202347", {
            axios.get(SERVER_URL + "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" + partyRelationshipId, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(response1 => {



                if (response1.data.orgPartyRelationResult) {
                    if (response1.data.orgPartyRelationResult[0]) {
                        if (response1.data.orgPartyRelationResult[0].toPartyId) {
                            setpartyIdOrg(response1.data.orgPartyRelationResult[0].toPartyId)
                        }
                    }
                }

                let identificationObjEconomic = {}
                let identificationObjRegisteration = {}
                let roleObj = {}
                let roleObj1 = []

                response1.data.orgIdentificationResult.map((identification, index) => {
                    if (identification.partyIdTypeEnumId === "EconomicCode") {
                        identificationObjEconomic = {
                            "EconomicCode": identification.idValue
                        }
                    }
                });
                response1.data.orgIdentificationResult.map((identification, index) => {
                    // if(identification.partyIdTypeEnumId === "CompanyRegistrationNumber"){
                    if (identification.partyIdTypeEnumId === "CompanyRegistrationNumber") {
                        identificationObjRegisteration = {
                            "Companyregistrationnumber": identification.idValue
                        }
                        console.log("identificationObjRegisteration", identificationObjRegisteration)
                    }
                });
                console.log("identificationObjRegisteration", identificationObjRegisteration)

                response1.data.orgRoleResult.map((role, index) => {
                    roleObj1.push(role.roleTypeId)
                    roleObj = {
                        "roleTypeId": roleObj1
                    }

                });
                setorganizationName(true)
                setpseudoId(true)
                const orgInfo = Object.assign(response1.data.orgPartyRelationResult, identificationObjRegisteration, identificationObjEconomic, roleObj);

                console.log("orgInfoorgInfo", orgInfo, partyRelationshipId)

                setCurrentData(
                    orgInfo
                );
            })

        }).catch(error => {
        });

    }, []);

    const [addRows, setAddRows] = React.useState({
        "org": 1,
        "note": 1,
        "partyContent": 1,
        "party": 1,
        "role": 1,
        "identification": 1,
    });

    const updateImg = () => {

        if (typeof formData.partyContent == 'undefined') {
            //alert
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید حتما فایلی انتخاب شود'));

        } else {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

            const formData1 = new FormData();
            formData1.append("file", formData.partyContent.contentLocation)
            const config = {
                timeout: AXIOS_TIMEOUT,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    api_key: localStorage.getItem('api_key')
                }
            }

            if (currentData && currentData[0] && currentData[0].partyContentTypeEnumId) {
                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyContent?partyContentId=" + currentData[0].partyContentId, {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                })
                    .then(res => {
                        currentData[0].contentLocation = '';
                    })

                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", formData1, config)
                    .then(res11 => {
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyContent", { data : 
                            {
                                partyContentTypeEnumId: "PcntLogoImage", partyId: partyIdOrg,
                                contentLocation: res11.data.name
                            }}
                            , axiosConfig).then(response => {
                                const newaddRows = Object.assign({}, { ["partyContent"]: -1 });
                                setAddRows(newaddRows)


                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));

                                console.log("res11.data.name", res11.data.name)
                                currentData[0].contentLocation = res11.data.name;
                                formData.contentLocation = res11.data.name;

                            })
                        console.log("foffofofof", formData)
                        formData.partyContent = { ...formData.partyContent, ["contentLocation"]: '' };
                        const newFormdata = Object.assign({}, formData);
                        addFormData(newFormdata)

                        console.log("foffofofof", formData)

                    })
            }
            else if (currentData && currentData[0] && !currentData[0].partyContentTypeEnumId) {

                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", formData1, config)
                    .then(res => {
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyContent", {data : 
                            {
                                partyContentTypeEnumId: "PcntLogoImage", partyId: partyIdOrg,
                                contentLocation: res.data.name
                            }}
                            , axiosConfig).then(response => {
                                const newaddRows = Object.assign({}, { ["partyContent"]: -1 });
                                setAddRows(newaddRows)
                                // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                                currentData[0].contentLocation = res.data.name;
                                formData.contentLocation = res.data.name;

                            })
                            .catch(error => {

                            });
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                        console.log("foffofofof", formData)
                        // setFormData({})
                        formData.partyContent = { ...formData.partyContent, ["contentLocation"]: '' };
                        const newFormdata = Object.assign({}, formData);
                        addFormData(newFormdata)

                        console.log("foffofofof", formData)

                    })
                    .catch(error => {
                    });
            }

            setCurrentData(Object.assign({}, currentData))
        }
    }


    const [missingorg, setmissingorg] = React.useState([]);


    const missingcheckOrg = (field) => {
        if (typeof formData.org != "undefined") {
            if (formData.org[field] === '' || formData.org[field] === null) {
                return true
            } else {
                return false
            }
        }

        if (missingorg.indexOf(field) > -1) {
            return true
        } else {
            return false
        }
    }


    const updateRow = () => {
        const orgfields = ['pseudoId', 'organizationName']
        let org_fileds = []
        orgfields.map((field, index) => {
            let ifFilledPerson = ((typeof currentData[0][field] == 'undefined' && (formData.org && (typeof formData.org[field] != 'undefined'
                && (formData.person[field]).trim() !== ''))
            ) || (
                    typeof currentData[field] != 'undefined'
                    &&
                    (
                        (typeof formData.org == 'undefined')
                        ||
                        (formData.org && (typeof formData.org[field] == 'undefined'))
                        ||
                        (formData.org && (typeof formData.org[field] != 'undefined' && (formData.org[field]).trim() !== ''))
                    )
                )) ? true : false;
            if (!ifFilledPerson) {
                org_fileds.push(field)
            }

        })

        if (pseudoId === false || organizationName === false) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
        } else {


            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
            let deleteArr = []
            {
            }

            if (formData.org && currentData) {
                const org_obj = { partyId: partyIdOrg, organizationName: (formData.org.organizationName ? formData.org.organizationName : currentData[0].organizationName) }
                const party_obj =
                    { partyId: partyIdOrg, pseudoId: (formData.org.pseudoId ? formData.org.pseudoId : currentData[0].pseudoId), organization: org_obj }
                let PartyIdentification = [];
                let PartyRole = [];
                console.log("davkadvjadv", formData.org)

                if (formData.org.EconomicCode || formData.org.EconomicCode === '') {
                    console.log("davkadvjadv", formData.org)
                    const PartyIdentificationEconomicCode = {
                        partyId: partyIdOrg,
                        partyIdTypeEnumId: "EconomicCode",
                        idValue: formData.org.EconomicCode
                    }
                    PartyIdentification.push(PartyIdentificationEconomicCode)
                }
                if (formData.org.Companyregistrationnumber || formData.org.Companyregistrationnumber === '') {
                    const PartyIdentificationCompanyregistrationnumber = {
                        partyId: partyIdOrg,
                        partyIdTypeEnumId: "CompanyRegistrationNumber",
                        idValue: formData.org.Companyregistrationnumber

                    }
                    PartyIdentification.push(PartyIdentificationCompanyregistrationnumber)
                }
                if (PartyIdentification.length > 0) {
                    party_obj.identifications = PartyIdentification;
                }
                if (formData.org && formData.org.CompanyRole) {
                    PartyRole.push(formData.org.CompanyRole)

                }

                if (PartyRole.length > 0) {
                    party_obj.roles = PartyRole;
                }
                if (formData.org.noteText) {
                    const noteObj = {
                        partyId: partyIdOrg,
                        noteText: formData.org.noteText
                    }
                    party_obj.notes = noteObj;
                }


                let addedVals = []
                let deletedVals = []
                if (formData.org && formData.org.CompanyRoleAdded && formData.org.CompanyRoleAdded.length > 0) {
                    var data = [];
                    let arry = [];
                    formData.org.CompanyRoleAdded.map((item, index) => {
                        data.push({ roleTypeId: item })


                        arry.push({ roleTypeId: item })
                        currentData.roleTypeId = item
                        setCurrentData(Object.assign({}, currentData))
                    })
                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyRole" ,
                        {data : {...data , partyId : partyIdOrg }}
                        ,
                        {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            }
                        }
                    ).then(response78787 => {

                    })
                }

                if (formData.org && formData.org.CompanyRoleDeleted && formData.org.CompanyRoleDeleted.length > 0) {
                    var data = [];
                    formData.org.CompanyRoleDeleted.map((item, index) => {
                        data.push({ roleTypeId: item })

                    })

                    axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyRole?partyId=" + partyIdOrg,

                        {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            },
                            data: data

                        }
                        ,

                    )
                        .then(resDelete => {

                            //delete from current
                            let arry = [];

                            // if(currentData && currentData.roleTypeId.indexOf(data.roleTypeId) > -1){
                            // arry.push(data.roleTypeId)
                            // console.log("fdfdfdfd",33,arry)

                            // setDisplay(false)
                            // setTimeout(() => {
                            //     setDisplay(true)
                            // }, 20)
                            // }
                            // currentData.roleTypeId.splice(data.roleTypeId,1)
                            //     formData.org.CompanyRoleAdded.splice(index, 1);
                        })
                }
                setFormData({})
                const _currentData = Object.assign({}, currentData)
                // setCurrentData(false);
                setTimeout(() => {
                    setCurrentData(_currentData);
                }, 20)

                axios.put(SERVER_URL + "/rest/s1/fadak/entity/Party",
                    {data : party_obj}

                    ,
                    {
                        timeout: AXIOS_TIMEOUT,
                        headers: {
                            'Content-Type': 'application/json',
                            api_key: localStorage.getItem('api_key')
                        }
                    }
                ).then(response => {

                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                })

            }

            else {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, ' آپدیتی انجام نشد  '));

            }
        }
    }


    const dispatch = useDispatch();

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };



    return (
        <Grid>
            {currentData && data && <HeaderOrganizationFile addFormData={addFormData} setFormData={setFormData}
                formData={formData} currentData={currentData} updateRow={updateRow}
                data={data} updateImg={updateImg} setorganizationName={setorganizationName}
                setpseudoId={setpseudoId}


            />}
        </Grid>
    )
}


export default OrganizationFormHeader




