import React, { useEffect, useState } from 'react';
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";

import { Button, Grid, } from "@material-ui/core";
import ContactInfoForm from "./ContactInfoForm";

import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import { DeleteOutlined } from "@material-ui/icons";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../store/actions/fadak";


const ContactInfo = props => {
    const { CmtOrgPostalPhone } = props
    const [addressEdit, setaddressEdit] = useState(-1);

    const [formData, setFormData] = useState({});
    const [currentData, setCurrentData] = useState({});
    const [display, setDisplay] = useState(true);
    const [contactMechId, setsetcontactMechId] = useState(true);
    const [addrow, setaddrow] = useState(false);
    const [tel, settel] = useState(false);

    const [data, setData] = useState(false);
    const addFormData = setFormDataHelper(setFormData);
    const [open, setOpen] = useState(false);
    const [activeStep, setactiveStep] = useState(false);
    const [idDelete, setId] = useState([]);
    const [enablecancel, stenablecancel] = useState(false);
    const [addressToEdit, setaddressToEdit] = useState(-1);
    const [addressToEdit1, setaddressToEdit1] = useState(false);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyIdLoginPerson = (partyIdUser !== null) ? partyIdUser : partyIdLogin;
    const [partyId, setpartyId] = useState(false);

    const [tableContent, setTableContent] = useState([]);
    const [currentData2, setCurrentData2] = useState({});
    const [enableDisableCreate, setEnableDisableCreate] = useState(false);
    const [fromDate, setFromDate] = useState()
    const [addRows, setAddRows] = useState({
        "contact": 1,
    });
    const [currentData1, setCurrentData1] = useState({});
    const dispatch = useDispatch();

    const [style, setStyle] = useState({
        descriptionTel: false,
        contactNumber: false
    })

    const config = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    }
    useEffect(() => {


    }, [style])



const getData=(partyIdToSet = partyId)=>{
    axios.get(SERVER_URL + "/rest/s1/fadak/getContactMechsrest?partyId=" + partyIdToSet, config).then(response => {
        setFromDate(response.data)
        response.data.ContactMechList.map((pa, index) => {
            response.data.ContactMechList.map((pa, index) => {
                if (pa.contactMechPurposeId === "PhoneMobile") {
                    setactiveStep(true)
                }
            });

            let telephone1;
            if (typeof pa.areaCode == 'undefined') {
                telephone1 = pa.contactNumber
            } else {
                telephone1 = pa.areaCode + '-' + pa.contactNumber
            }

            axios.get(SERVER_URL + "/rest/s1/fadak/getContactMechsPurposeRest?contactMechPurposeId=" + pa.contactMechPurposeId, config).then(response1 => {



                const row1 = {
                    id: pa.contactMechId,
                    descriptionTel: response1.data.purposeList[0].description,
                    contactNumber: telephone1,
                    delete: <Button variant="outlined" color="secondary"
                        onClick={() => openDeleteModal(pa.contactMechId)}><DeleteOutlined /></Button>,
                    modify: <Button variant="outlined" color="secondary"
                        onClick={() => displayUpdateForm1(pa, index)}>ویرایش</Button>,
                };
                setTableContent(rows1 => [...rows1, row1]);
            })

        });

    }).catch(error => {
    });
}




    useEffect(() => {
        let partyIdToSet 

        if (props.partyIdOrg) {
            partyIdToSet = props.partyIdOrg
        }
        else{
            partyIdToSet = partyIdLoginPerson
        }
        setpartyId(partyIdToSet)

        axios.get(SERVER_URL + "/rest/s1/fadak/gettelecomenumber", config).then(response12 => {
            setData(response12.data.telecomcontactList);
        });


        // ------------------------------------------------------------------------//
        getData(partyIdToSet)


    }, []);












    const cancelAdd = () => {
        settel(false)
        setaddrow(false)

        setStyle({
            descriptionTel: false,
            contactNumber: false
        })
        if (typeof formData.postalAddress != "undefined") {
            if (typeof formData.postalAddress.descriptionTel != "undefined") {
                formData.postalAddress.descriptionTel = ''
            }
            if (typeof formData.postalAddress.areaCode != "undefined") {
                formData.postalAddress.areaCode = ''
            }
            if (typeof formData.postalAddress.contactNumber != "undefined") {
                formData.postalAddress.contactNumber = ''
            }
        }

        const newFormdata = Object.assign({}, formData);
        setFormData(newFormdata)
        setaddressToEdit1(false)
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)

    }

    const cancelUpdate = () => {
        settel(false)
        setaddrow(false)
        setStyle({
            descriptionTel: false,
            contactNumber: false
        })
        if (typeof currentData != 'undefined' && addressEdit !== 100) {
            setaddressToEdit(-1)
            setaddressToEdit1(false)
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
        }
        if (typeof currentData2 != 'undefined' && addressEdit === 100) {
            setaddressToEdit(-1)
            setaddressToEdit1(false)
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
        }
        setEnableDisableCreate(false);
        stenablecancel(false)


    };


    const handleClose = () => {
        setOpen(false);
    };
    const openDeleteModal = (id) => {
        setId(id);
        setOpen(true);
    };

    const displayUpdateForm = (postalAddress, index) => {

        setaddressToEdit1(true)

        setaddressEdit(100)
        setaddressToEdit(index)
        currentData2[index] = postalAddress
        const newFormdata10 = Object.assign({}, currentData2);
        setCurrentData2(newFormdata10)


        setDisplay(false);
        setTimeout(() => {

            setDisplay(true);

        }, 20);

        setEnableDisableCreate(true);
    };


    const displayUpdateForm1 = (postalAddress, index) => {


        setaddressToEdit1(true)

        setaddressEdit(-1)

        setaddressToEdit(index)
        currentData[index] = postalAddress
        const newFormdata10 = Object.assign({}, currentData);
        setCurrentData(newFormdata10)
        setEnableDisableCreate(true);
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)

    };




    useEffect(() => {

        if (typeof formData.postalAddress != 'undefined') {
            if (typeof formData.postalAddress.contactNumber != 'undefined') {
                settel(false)

            } else {
                settel(true)
            }
            if (typeof formData.postalAddress.descriptionTel != 'undefined') {
                setaddrow(false)

            } else {
                setaddrow(true)
            }

        }


    }, [tel, addrow])






    const addRow = () => {




        //method of check essential fields
        const postalAddress_check = ["descriptionTel", "contactNumber"]
        const postalAddress_field = []




        postalAddress_check.map((field, index) => {
            if ((!formData.postalAddress || (formData.postalAddress && (!formData.postalAddress[field] || formData.postalAddress[field] == "")))) {
                postalAddress_field.push(field)
            }
        })
        if (postalAddress_field.length > 0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری   وارد شوند'));


            setStyle(prevState => ({
                descriptionTel: (formData.postalAddress && formData.postalAddress.descriptionTel) ? false : true,
                contactNumber: (formData.postalAddress && formData.postalAddress.contactNumber) ? false : true
            }))
            return null;


        } else {


            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

            dispatch(submitPost("/rest/s1/mantle/parties/contactMechs/telecomNumbers",
                {
                    contactNumber: formData.postalAddress.contactNumber,
                    areaCode: formData.postalAddress.areaCode,
                    partyId: partyId,
                    contactMechPurposeId: formData.postalAddress.descriptionTel
                }, "add")).then(res => {
                    setTableContent([])
                    getData()
                    const newFormdata = Object.assign({}, formData);
                    setFormData({})
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)


                }
                )

               

                

        }

    };

    const deleteRow1 = (id) => {
        setTableContent(preFormData => preFormData.filter(member => {
            return member.id !== id

        }))
    };

    const updateRow = (id11, data, addressEdit) => {


        const postalfileds = ['descriptionTel', 'contactNumber']

        let postal_fileds = []

        postalfileds.map((field, index) => {
            let ifFilled = (((formData.postalAddress && (typeof formData.postalAddress[field] != 'undefined'
                && (formData.postalAddress[field]).trim() !== ''))
            ) || (

                    (
                        (typeof formData.postalAddress == 'undefined')
                        ||
                        (formData.postalAddress && (typeof formData.postalAddress[field] == 'undefined'))
                        ||
                        (formData.postalAddress && (typeof formData.postalAddress[field] != 'undefined' && (formData.postalAddress[field]).trim() !== ''))
                    )
                )) ? true : false;
            if (!ifFilled) {
                postal_fileds.push(field)
            }

        })
        if (postal_fileds.length > 0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            // setaddrow(true)
            return false;
            // setcheckmissings(true)
        } else {

            if (typeof formData.postalAddress == 'undefined') {
                setaddressToEdit1(false)
                setEnableDisableCreate(false);
                setCurrentData2({})
                setaddressToEdit(-1)
                setDisplay(false)
                setTimeout(() => {
                    setDisplay(true)
                }, 20)
                // setFormData({})
                // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));
            } else {

                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));

                if (addressEdit === 100 && typeof currentData2 != 'undefined') {
                    if (typeof formData.postalAddress != "undefined") {
                        setsetcontactMechId(currentData2[addressToEdit].contactMechId)
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber" , {data :
                            {
                                areaCode: formData.postalAddress.areaCode,
                                contactNumber: formData.postalAddress.contactNumber,
                                contactMechId : currentData2[addressToEdit].contactMechId
                            }}, {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response => {
                            const newaddRows = Object.assign({}, { ["contact"]: -1 });
                            setAddRows(newaddRows)
                            if (typeof formData.postalAddress.descriptionTel != 'undefined') {
                                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech?contactMechId=" + currentData2[addressToEdit].contactMechId + "&partyId="
                                    + partyId + "&fromDate=" + "*",
                                    {
                                        headers: {
                                            'api_key': localStorage.getItem('api_key')
                                        },
                                    }).then(res => {
                                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech", {data : 
                                            {
                                                contactMechPurposeId: formData.postalAddress.descriptionTel,
                                                contactMechId: currentData2[addressToEdit].contactMechId,
                                                fromDate: Date.now(),
                                                partyId: partyId
                                            }}
                                            , {
                                                headers: {
                                                    'api_key': localStorage.getItem('api_key')
                                                },
                                            }).then(response => {
                                                const newaddRows = Object.assign({}, { ["contact"]: -1 });
                                                setAddRows(newaddRows)
                                            })

                                    })
                            }

                            if (typeof formData.postalAddress.areaCode != 'undefined') {
                                if (currentData2[addressToEdit].areaCode !== '') {
                                    currentData2[addressToEdit].areaCode = formData.postalAddress.areaCode
                                }
                                // else {
                                //     currentData2[addressToEdit].areaCode = formData.postalAddress.areaCode
                                // }
                            } else {
                                if (currentData2[addressToEdit].areaCode !== '') {
                                    currentData2[addressToEdit].areaCode = currentData2[addressToEdit].areaCode
                                }
                            }
                            if (typeof formData.postalAddress.contactNumber != 'undefined') {
                                if (currentData2[addressToEdit].contactNumber !== '') {
                                    currentData2[addressToEdit].contactNumber = formData.postalAddress.contactNumber;
                                }
                            } else {
                                currentData2[addressToEdit].contactNumber = currentData2[addressToEdit].contactNumber;
                            }
                            if (typeof formData.postalAddress.descriptionTel != 'undefined') {
                                if (currentData2[addressToEdit].descriptionTel !== '') {
                                    currentData2[addressToEdit].descriptionTel = formData.postalAddress.descriptionTel
                                }
                            }

                            data.map((qqq, index) => {
                                if (qqq.contactMechPurposeId === currentData2[addressToEdit].descriptionTel) {
                                    currentData2[addressToEdit].descriptionTel = qqq.description
                                }
                            })


                            let telephone1;
                            if (currentData2[addressToEdit].areaCode !== '' || currentData2[addressToEdit].areaCode !== null) {
                                telephone1 = currentData2[addressToEdit].contactNumber
                            } else {
                                telephone1 = currentData2[addressToEdit].areaCode + '-' + currentData2[addressToEdit].contactNumber
                            }


                            setTimeout(() => {
                                deleteRow1(currentData2[addressToEdit].contactMechId)
                            }, 200)

                            setTimeout(() => {
                                const row2 = {
                                    id: currentData2[addressToEdit].contactMechId,
                                    descriptionTel: currentData2[addressToEdit].descriptionTel,
                                    contactNumber: telephone1,
                                    delete: <Button variant="outlined" color="secondary"
                                        onClick={() => openDeleteModal(currentData2[addressToEdit].contactMechId)}><DeleteOutlined /></Button>,
                                    modify: <Button variant="outlined" color="secondary"
                                        onClick={() => displayUpdateForm(currentData2[addressToEdit], tableContent.length)}>ویرایش</Button>,
                                };
                                setTableContent(rows2 => [...rows2, row2]);
                            }, 2000)

                            const newFormdata = Object.assign({}, formData);
                            setCurrentData2({})
                            setFormData({})
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)

                        });
                    }

                }

                if (addressEdit !== 100 && typeof currentData != 'undefined') {
                    if (typeof formData.postalAddress != "undefined") {
                        setsetcontactMechId(currentData[addressToEdit].contactMechId)
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber" , {data : 
                            {
                                areaCode: formData.postalAddress.areaCode,
                                contactNumber: formData.postalAddress.contactNumber,
                                contactMechId : currentData[addressToEdit].contactMechId
                            }}, {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response => {
                            const newaddRows = Object.assign({}, { ["contact"]: -1 });
                            setAddRows(newaddRows)

                            if (typeof formData.postalAddress.descriptionTel != 'undefined') {
                                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech?contactMechId=" + currentData[addressToEdit].contactMechId + "&partyId="
                                    + partyId + "&fromDate=" + "*",
                                    {
                                        headers: {
                                            'api_key': localStorage.getItem('api_key')
                                        },
                                    }).then(res => {
                                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech", {data : 
                                            {
                                                contactMechPurposeId: formData.postalAddress.descriptionTel,
                                                contactMechId: currentData[addressToEdit].contactMechId,
                                                fromDate: Date.now(),
                                                partyId: partyId
                                            }}
                                            , {
                                                headers: {
                                                    'api_key': localStorage.getItem('api_key')
                                                },
                                            }).then(response => {
                                                const newaddRows = Object.assign({}, { ["contact"]: -1 });
                                                setAddRows(newaddRows)
                                            })

                                    })
                            }

                            if (typeof formData.postalAddress.areaCode != 'undefined') {
                                if (currentData[addressToEdit].areaCode !== '') {
                                    currentData[addressToEdit].areaCode = formData.postalAddress.areaCode
                                } else {
                                    currentData[addressToEdit].areaCode = ''
                                }
                            }
                            if (typeof formData.postalAddress.contactNumber != 'undefined') {
                                if (currentData[addressToEdit].contactNumber !== '') {
                                    currentData[addressToEdit].contactNumber = formData.postalAddress.contactNumber
                                } else {
                                    currentData[addressToEdit].contactNumber = ''
                                }
                            }
                            if (typeof formData.postalAddress.descriptionTel != 'undefined') {
                                if (currentData[addressToEdit].contactMechPurposeId !== '') {
                                    currentData[addressToEdit].contactMechPurposeId = formData.postalAddress.descriptionTel
                                }
                            }

                            let telephone1;
                            if (typeof formData.postalAddress.areaCode == 'undefined') {
                                telephone1 = currentData[addressToEdit].contactNumber
                            } else {
                                telephone1 = currentData[addressToEdit].areaCode + '-' + currentData[addressToEdit].contactNumber
                            }


                            data.map((qqq, index) => {
                                if (qqq.contactMechPurposeId === currentData[addressToEdit].contactMechPurposeId) {
                                    currentData[addressToEdit].contactMechPurposeId = qqq.description
                                }
                            })

                            setTimeout(() => {
                                deleteRow1(currentData[addressToEdit].contactMechId)
                            }, 2000)

                            setTimeout(() => {
                                const row2 = {
                                    id: currentData[addressToEdit].contactMechId,
                                    descriptionTel: currentData[addressToEdit].contactMechPurposeId,
                                    contactNumber: telephone1,
                                    delete: <Button variant="outlined" color="secondary"
                                        onClick={() => openDeleteModal(currentData[addressToEdit].contactMechId)}><DeleteOutlined /></Button>,
                                    modify: <Button variant="outlined" color="secondary"
                                        onClick={() => displayUpdateForm(currentData[addressEdit], addressEdit)}>ویرایش</Button>,
                                };
                                setTableContent(rows2 => [...rows2, row2]);
                            }, 2000)

                            if (typeof formData.postalAddress != "undefined") {
                                if (typeof formData.postalAddress.contactNumber != "undefined") {
                                    formData.postalAddress.contactNumber = ''
                                }
                                if (typeof formData.postalAddress.areaCode != "undefined") {
                                    formData.postalAddress.areaCode = ''
                                }
                                if (typeof formData.postalAddress.descriptionTel != "undefined") {
                                    formData.postalAddress.descriptionTel = ''
                                }
                            }

                            const newFormdata = Object.assign({}, formData);
                            setCurrentData(newFormdata)
                            setFormData(newFormdata)
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)

                        });
                    }
                }
                setaddressToEdit1(false)
                setEnableDisableCreate(false);
            }
        }

    };

    useEffect(() => {
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)
    }, [addressToEdit])

    return (
        <Grid>
            {  data && display && <ContactInfoForm addFormData={addFormData} setStyle={setStyle} CmtOrgPostalPhone={CmtOrgPostalPhone} style={style} setFormData={setFormData} formData={formData} addRow={addRow} partyId={partyId}
                tel={tel} settel={settel} addressToEdit1={addressToEdit1} contactMechId={contactMechId} addressToEdit={addressToEdit} data={data} tableContent={tableContent} setTableContent={setTableContent} addrow={addrow} currentData1={currentData1}
                setOpen={setOpen} setId={setId} idDelete={idDelete} open={open} handleClose={handleClose} addressEdit={addressEdit}
                currentData={currentData} cancelUpdate={cancelUpdate} updateRow={updateRow} activeStep={activeStep} cancelAdd={cancelAdd} fromDate={fromDate}
                currentData2={currentData2} enablecancel={enablecancel} setCurrentData={setCurrentData} setEnableDisableCreate={setEnableDisableCreate} enableDisableCreate={enableDisableCreate} />}
              
        </Grid>
    );
};

export default ContactInfo;