import React, { useState, useEffect } from 'react';
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import { Button, Card, Grid } from "@material-ui/core";
import ContactInfoFormCyber from "./ContactInfoFormCyber";
import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import { DeleteOutlined } from "@material-ui/icons";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../store/actions/fadak";

const ContactInfo = props => {
    const [formData, setFormData] = useState({});
    const [currentData, setCurrentData] = useState({});
    const [addressToEdit, setaddressToEdit] = useState(-1);
    const [addressToEdit1, setaddressToEdit1] = useState(false);
    const [data, setData] = useState(false);
    const addFormData = setFormDataHelper(setFormData);
    const [open, setOpen] = useState(false);
    const [idDelete, setId] = useState([]);
    const [enablecancel, stenablecancel] = useState(false);
    const [contactMechId, setsetcontactMechId] = useState(true);
    const [style, setStyle] = useState({
        description: false,
        infoString: false
    })


    const[fromDate , setFromDate] = useState();
    const [currentData2, setCurrentData2] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [enableDisableCreate, setEnableDisableCreate] = useState(false);
    const [display, setDisplay] = useState(true);

    
    const [addRows, setAddRows] = useState({
        "contact": 1,
    });
    const [addressEdit, setaddressEdit] = useState(-1);
    const [partyIdsets, setpartyIdsets] = useState(false);
    const [partyId, setpartyId] = useState(false);
    const dispatch = useDispatch();

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    // const partyId = (partyIdUser !==null) ? partyIdUser : partyIdLogin
    const partyIdLoginPerson = (partyIdUser !== null) ? partyIdUser : partyIdLogin;
    //config axios
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    


    useEffect(() => {
        const data_types = ["contact"]
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

    useEffect(() => {
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)
    }, [addressToEdit])
    useEffect(() => {
        setpartyIdsets(partyId)
        setDisplay(false);
        setTimeout(() => {
            setDisplay(true);
        }, 20);
    }, [partyIdsets])

    /**
     * 
     * set table 
     * 
     */
    useEffect(() => {
        if(partyId){
        axios.get(SERVER_URL + "/rest/s1/fadak/getelectronics1", axiosKey).then(response => {
            setData(response.data.electroniccontactList)
        })

        

        axios.get(SERVER_URL + "/rest/s1/fadak/getContactMechsrests?partyId=" + partyId, axiosKey).then(response => {
            

            setFromDate(response.data)


            response.data.ContactMechList.map((pa, index) => {

                axios.get(SERVER_URL + "/rest/s1/fadak/getContactMechsPurposeRest?contactMechPurposeId=" + pa.contactMechPurposeId, axiosKey).then(response1 => {
                    const row1 = {
                        id: pa.contactMechId,
                        description: response1.data.purposeList[0].description,
                        infoString: pa.infoString,
                        delete: <Button variant="outlined" color="secondary"
                            onClick={() => openDeleteModal(pa.contactMechId)}><DeleteOutlined /></Button>,
                        modify: <Button variant="outlined" color="secondary" id="pressUpdate"
                            onClick={() => { displayUpdateForm(pa, index) }}>ویرایش</Button>,
                    };

                    if (typeof pa.infoString != "undefined") {
                        setTableContent(rows1 => [...rows1, row1]);
                    }
                }).catch(error => {
                });
            });


        }).catch(error => {
        });

    }
    }, [partyId]);


    useEffect(() => {

        if (props.partyIdOrg) {
            setpartyId(props.partyIdOrg)
        }
        else{
            setpartyId(partyIdLoginPerson)
        }
        
    }, [])
    // useEffect(() => {

    //     if (typeof formData.person != 'undefined') {
    //         if (typeof formData.person.infoString != 'undefined') {
    //             settel(false)

    //         } else {
    //             settel(true)
    //         }
    //     }
    //     if (typeof formData.postalAddress != 'undefined') {
    //         if (typeof formData.postalAddress.description != 'undefined') {
    //             setaddrow(false)
    //         } else {
    //             setaddrow(true)
    //         }
    //     }


    // }, [tel, addrow])




    const cancelAdd = () => {
        setStyle({
            description: false,
            infoString: false
        })
        if (typeof formData != "undefined") {
            if (typeof formData.person != 'undefined') {
                if (typeof formData.person.infoString != "undefined") {
                    formData.person.infoString = ''
                }
            }

            if (typeof formData.description != "undefined") {
                formData.description = ''
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
        setStyle({
            description: false,
            infoString: false
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

    const displayUpdateForm1 = (postalAddress, index) => {
        setaddressToEdit1(true)
        setaddressEdit(100)

        axios.get(SERVER_URL + "/rest/s1/fadak/getIdContactrest?contactMechPurposeIdPostal=" + postalAddress.contactMechPurposeId, axiosKey).then(response1 => {
            let contactMechPurposeIdObj = {};

            response1.data.purposeList.map((contactMechPurposeIdList, index) => {
                contactMechPurposeIdObj = {
                    "contactMechPurposeId": contactMechPurposeIdList.description
                }
            });

            setaddressToEdit(index)
            currentData2[index] = postalAddress
            const newFormdata10 = Object.assign({}, currentData2);
            setCurrentData2(newFormdata10)


            setDisplay(false);
            setTimeout(() => {

                setDisplay(true);

            }, 20);

        });

        setEnableDisableCreate(true);
        // }
    };
    const displayUpdateForm = (postalAddress, index) => {
        setaddressToEdit1(true)
        setaddressEdit(-1)
        axios.get(SERVER_URL + "/rest/s1/fadak/getIdContactrest?contactMechPurposeIdPostal=" + postalAddress.contactMechPurposeId, axiosKey).then(response1 => {
            let contactMechPurposeIdObj = {};

            response1.data.purposeList.map((contactMechPurposeIdList, index) => {
                contactMechPurposeIdObj = {
                    "contactMechPurposeId": contactMechPurposeIdList.description
                }
            });
            setaddressToEdit(index)
            currentData[index] = postalAddress
            const newFormdata10 = Object.assign({}, currentData);
            setCurrentData(newFormdata10)


            setDisplay(false);
            setTimeout(() => {

                setDisplay(true);

            }, 20);

        });

        setEnableDisableCreate(true);
    };


    const addRow = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

        //method of check essential fields
        const person_check = ["infoString"]
        const person_filed = []
        const Address_check = ["description"]
        const Address_field = []


        person_check.map((field, index) => {
            if ((!formData.person || (formData.person && (!formData.person[field] || formData.person[field] == "")))) {
                person_filed.push(field)
            }
        })

        Address_check.map((field, index) => {

            if ((!formData || (formData && (!formData[field] || formData[field] == "")))) {
                Address_field.push(field)
            }
        })

        if (person_filed.length > 0 || Address_field.length > 0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری   وارد شوند'));



            setStyle(prevState => ({
                description: (formData && formData.description) ? false : true,
                infoString: (formData.person && formData.person.infoString) ? false : true
            }))
            return null;
        } else {

            dispatch(submitPost("/rest/s1/fadak/entity/ContactMech",
                {data : {
                    infoString: formData.person.infoString,
                    description: formData.description,
                    contactMechTypeEnumId: "CmtElectronicAddress"
                }}, "add1")).then(res => {
                    const newaddRows = Object.assign({}, { ["contact"]: 0 });
                    setAddRows(newaddRows)

                    formData.contactMechId = res.data.contactMechId
                    dispatch(submitPost("/rest/s1/fadak/entity/PartyContactMech" , { data : 
                        {
                            "contactMechId": res.data.contactMechId,
                            "contactMechPurposeId": formData.description,
                            "fromDate": Date.now(),
                            "partyId" : partyId
                        }}, "add1"
                    )).then(res2 => {
                        const newaddRows = Object.assign({}, { ["contact"]: 0 });
                        setAddRows(newaddRows)


                        data.map((qqq, index) => {
                            if (qqq.contactMechPurposeId === formData.description) {
                                formData.description = qqq.description
                            }
                        })
                        formData.fromDate1 = Date.now();
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)
                        const row = {
                            id: res.data.contactMechId,
                            description: formData.description,
                            infoString: formData.person.infoString,
                            delete: <Button variant="outlined" color="secondary"
                                onClick={() => openDeleteModal(res.data.contactMechId)}><DeleteOutlined /></Button>,
                            modify: <Button variant="outlined" color="secondary" id="pressUpdate"
                                onClick={() => { displayUpdateForm1(formData, tableContent.length) }}>ویرایش</Button>,
                        };
                        setTableContent(rows1 => [row, ...rows1]);



                        const newFormdata = Object.assign({}, formData);
                        setFormData({})
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)
                    }
                    )
                })




        }
    };

    const deleteRow1 = (id) => {
        setTableContent(preFormData => preFormData.filter(member => {
            return member.id !== id

        }))
    };

    const updateRow = (id2, data, addressEdit) => {
    
        const postalfileds = ['infoString']

        let postal_fileds = []

        let ifFilled = ((((typeof formData.person != 'undefined') && (typeof formData.person.infoString != 'undefined'
            && (formData.person.infoString) !== ''))
        ) || (

                (
                    (typeof formData.person == 'undefined')
                    ||
                    (formData.person && (typeof formData.person.infoString == 'undefined'))
                    ||
                    (formData.person && (typeof formData.person.infoString != 'undefined'
                        && (formData.person.infoString) !== ''))
                )
            )) ? true : false;
        if (!ifFilled) {
            postal_fileds.push("infoString")
        }
        if (postal_fileds.length > 0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            return false;
        } else {

            if (typeof formData.person == 'undefined') {
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

            } else {

                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));


                if (addressEdit === 100 && typeof currentData2 != 'undefined') {

               
                    if (typeof formData.person != "undefined") {
                        setsetcontactMechId(formData.contactMechId)
                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : 
                            {contactMechId : currentData2[addressToEdit].contactMechId , infoString: formData.person.infoString }}, {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response => {
                            const newaddRows = Object.assign({}, { ["contact"]: -1 });
                            setAddRows(newaddRows)

                            if (formData.person.infoString !== '') {
                                currentData2[addressToEdit].person.infoString = formData.person.infoString
                            } else {
                                currentData2[addressToEdit].infoString = currentData2[addressToEdit].infoString
                            }

                            setTimeout(() => {
                                deleteRow1(formData.contactMechId);
                            }, 2000)
                            setTimeout(() => {


                                const item =tableContent.findIndex((ele ,index) => ele.id ===  currentData2[addressToEdit].contactMechId)
                                const list = [...tableContent]
                                


                                const row2 = {
                                    id:  currentData2[addressToEdit].contactMechId,
                                    description: currentData2[addressToEdit].description,
                                    infoString: currentData2[addressToEdit].person.infoString,
                                    delete: <Button variant="outlined" color="secondary"
                                        onClick={() => openDeleteModal(formData.contactMechId)}><DeleteOutlined /></Button>,
                                    modify: <Button variant="outlined" color="secondary" id="pressUpdate"
                                        onClick={() => {
                                            displayUpdateForm1(currentData2[addressToEdit], tableContent.length)
                                        }}>ویرایش</Button>,
                                };
                                list[item]=row2


                                setTableContent(list);
                                
                            }, 2000)
                            // formData.person.infoString = ''

                            if (typeof formData != "undefined" && typeof currentData != 'undefined') {
                                if (typeof formData.person != 'undefined') {
                                    if (typeof formData.person.infoString != "undefined") {
                                        formData.person.infoString = ''
                                    }
                                }
                            }

                            const newFormdata = Object.assign({}, formData);
                            setCurrentData2(newFormdata)
                            setFormData(newFormdata)
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)


                        })
                    }



                }


                if (addressEdit !== 100 && typeof currentData != 'undefined') {
                
                    setsetcontactMechId(currentData[addressToEdit].contactMechId)

                    if (typeof formData.person != "undefined") {
                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : 
                            {contactMechId : currentData[addressToEdit].contactMechId , infoString: formData.person.infoString }}, {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response => {
                            const newaddRows = Object.assign({}, { ["contact"]: -1 });
                            setAddRows(newaddRows)

                            if (formData.person.infoString !== '') {
                                currentData[addressToEdit].infoString = formData.person.infoString
                            } else {
                                currentData[addressToEdit].infoString = currentData[addressToEdit].infoString
                            }
                            data.map((item, index) => {
                                if (item.contactMechPurposeId === currentData[addressToEdit].contactMechPurposeId) {
                                    currentData[addressToEdit].contactMechPurposeId = item.description;
                                }
                            });
                            setTimeout(() => {
                                deleteRow1(currentData[addressToEdit].contactMechId);
                            }, 2000)
                            setTimeout(() => {

                                const row2 = {
                                    id: currentData[addressToEdit].contactMechId,
                                    description: currentData[addressToEdit].contactMechPurposeId,
                                    infoString: currentData[addressToEdit].infoString,
                                    delete: <Button variant="outlined" color="secondary"
                                        onClick={() => openDeleteModal(currentData[addressToEdit].contactMechId)}><DeleteOutlined /></Button>,
                                    modify: <Button variant="outlined" color="secondary" id="pressUpdate"
                                        onClick={() => {
                                            displayUpdateForm(currentData[addressToEdit], addressToEdit)
                                        }}>ویرایش</Button>,
                                };

                                setTableContent(rows2 => [...rows2, row2]);
                            }, 2000)

                            if (typeof formData != "undefined" && typeof currentData != 'undefined') {
                                if (typeof formData.person != 'undefined') {
                                    if (typeof formData.person.infoString != "undefined") {
                                        formData.person.infoString = ''
                                    }
                                }
                            }

                            const newFormdata = Object.assign({}, formData);
                            setCurrentData(newFormdata)
                            setFormData(newFormdata)
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)


                        })
                    
                    }


                }
                setaddressToEdit1(false)
                setEnableDisableCreate(false);
            }
        }

    };



    return (

        <Grid>
            { display && data && <ContactInfoFormCyber addFormData={addFormData} setFormData={setFormData} formData={formData} addRow={addRow} addressEdit={addressEdit}
                setStyle={setStyle} style={style} fromDate={fromDate}
                addressToEdit1={addressToEdit1} addressToEdit={addressToEdit} contactMechId={contactMechId}
                data={data} tableContent={tableContent} setTableContent={setTableContent}  cancelAdd={cancelAdd} 
                setOpen={setOpen} setId={setId} idDelete={idDelete} open={open} handleClose={handleClose} currentData2={currentData2}
                currentData={currentData} cancelUpdate={cancelUpdate} updateRow={updateRow} display={display} partyIdsets={partyIdsets}
                enablecancel={enablecancel} setCurrentData={setCurrentData} setEnableDisableCreate={setEnableDisableCreate} enableDisableCreate={enableDisableCreate} />}
                
        </Grid>
    );
};

export default ContactInfo;