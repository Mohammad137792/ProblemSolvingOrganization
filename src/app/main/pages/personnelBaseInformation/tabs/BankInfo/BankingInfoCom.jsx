import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import BankingInfo from "./BankingInfo"
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import { Button, Grid } from "@material-ui/core";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { DeleteOutlined } from "@material-ui/icons";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";


const BankingInfoCom = props => {
    const [formData, setFormData] = useState({});
    const [currentData, setCurrentData] = useState({});
    const [currentData1, setCurrentData1] = useState({});
    const [partyId, setpartyId] = useState(false);





    // const partyId = useSelector(({auth}) => auth.user.data.partyId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    // const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const partyIdLoginPerson = (partyIdUser !== null) ? partyIdUser : partyIdLogin;
   
    const [tableContent, setTableContent] = React.useState([]);
    const dispatch = useDispatch();

    const [enableDisableCreate, setEnableDisableCreate] = React.useState(false);
    const [display, setDisplay] = React.useState(true);
    const [BankToEdit, setBankToEdit] = React.useState(-1);
    const [BankEdit, setBankEdit] = React.useState(-1);
    const [data, setData] = useState(false);
    const [addData, setAddData] = useState(false);
    const [addCredit, setaddCredit] = useState(false);
    const addFormData = setFormDataHelper(setFormData);
    const [open, setOpen] = useState(false);
    const [idDelete, setId] = useState([]);
    const [enablecancel, stenablecancel] = useState(false);
    const [name, setName] = useState(false);
    const [family, setFamily] = useState(false);

    const [missingpayment, setmissingpayment] = React.useState([]);
    const [missingbank, setmissingbank] = React.useState([]);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const [style, setStyle] = useState({
        paymentMethodTypeEnumId: false,// 
        bankName: false,//عنوان بانک
        firstNameOnAccount: false,//
        lastNameOnAccount: false,
        routingNumber: false,//
        shebaNumber: false,//
    })

    const [countryGeoId, setcountryGeoId] = React.useState(false);

    const cancelUpdate = () => {





        setStyle({
            paymentMethodTypeEnumId: false,// 
            bankName: false,//عنوان بانک
            firstNameOnAccount: false,//
            lastNameOnAccount: false,
            routingNumber: false,//
            shebaNumber: false,//
        })
        formData.telecom = undefined
        formData.Bankaccount = undefined
        formData.credit = undefined
        formData.payment = undefined
        formData.postalAddress = undefined
        setFormData(Object.assign(formData))
        setBankToEdit(-1)
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)

        setEnableDisableCreate(false);
        stenablecancel(false)
        // setBankToEdit(-1)
    }
    const cancelAdd = () => {

        setStyle({
            paymentMethodTypeEnumId: false,// 
            bankName: false,//عنوان بانک
            firstNameOnAccount: false,//
            lastNameOnAccount: false,
            routingNumber: false,//
            shebaNumber: false,//
        })
        //sarmadi cancel
        formData.telecom = undefined
        formData.Bankaccount = undefined
        formData.credit = undefined
        formData.payment = undefined
        formData.postalAddress = undefined
        setFormData(Object.assign(formData))
        setBankToEdit(-1)
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)
        }, 20)
    }

    const [addRows, setAddRows] = React.useState({
        "credit": 1,
        "payment": 1,
        "postalAddress": 1,
        "telecom": 1,
        "Bankaccount": 1,
    });

    const getData = (partyIdToSet = partyId) => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=PaymentMethodPurposeEnumId,PaymentMethodPurpose" +
        "&geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE" +
        "&typeAddressList=CmtPostalAddress", axiosKey).then(response => {
            setData(
                response.data
            )
            axios.get(SERVER_URL + "/rest/s1/fadak/getPaymentBankaccountRest?partyId=" + partyIdToSet, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(response1 => {
                setCurrentData(response1.data)
            })
        }).catch(error => {
        });

    }


    React.useEffect(() => {
        if (typeof formData.payment != "undefined") {
            if (typeof formData.payment.firstNameOnAccount != "undefined") {
                setName(true)
            }
            if (typeof formData.payment.lastNameOnAccount != "undefined") {
                setFamily(true)
            }
        }
    }, [family, name])


    React.useEffect(() => {
        const data_types = ["credit", "payment", "postalAddress", "telecom", "Bankaccount"]
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



    // set table
    React.useEffect(() => {
        let rows = []

        if (currentData && data) {
            if (typeof currentData != "undefined") {
                if (typeof currentData.PersonPaymentDetails != 'undefined') {

                    currentData.PersonPaymentDetails.map((Bank, index) => {
                        data.enums.PaymentMethodPurpose.map((pmethod, index) => {
                            if (typeof Bank != 'undefined') {
                                if (pmethod.enumId === Bank.purposeEnumId) {

                                    Bank.purposeEnumId = pmethod.description;
                                }
                            }

                        })
                        const row1 = {
                            id: index,
                            paymentMethodTypeEnumId: Bank.purposeEnumId,
                            bankingInformationAccountOwnerName: ` ${Bank.firstNameOnAccount ?? ""}   ${Bank.lastNameOnAccount ?? ""} ${Bank.suffixOnAccount ?? ""}`,
                            bankName: Bank.bankName,
                            routingNumber: Bank.routingNumber,
                            accountNumber: Bank.accountNumber,
                            shebaNumber: Bank.shebaNumber,
                            cardNumber: Bank.cardNumber,
                            delete: <Button variant="outlined" color="secondary"
                                onClick={() => openDeleteModal(index)}><DeleteOutlined /></Button>,
                            modify: <Button variant="outlined" color="secondary"
                                onClick={() => displayUpdateForm2(index)}>ویرایش</Button>,
                        }
                        rows.push(row1);
                    })

                    setTableContent(rows);
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)

                    }, 20)
                }

            }
        }

    }, [currentData, data])

    React.useEffect(() => {
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)

        }, 20)
    }, [BankToEdit])

    React.useEffect(() => {
        let partyIdToSet 

        if (props.partyIdOrg) {
            partyIdToSet = props.partyIdOrg
        }
        else{
            partyIdToSet = partyIdLoginPerson
        }
        setpartyId(partyIdToSet)

        getData(partyIdToSet)
    }, [])

    const handleClose = () => {
        setOpen(false);
    }
    const openDeleteModal = (id) => {

        setBankToEdit(id)
        setId(id);
        setOpen(true);
    }



    const missingcheckPayment = (field) => {
        if (typeof formData.payment != "undefined") {
            if (formData.payment[field] === '') {
                return true
            } else {
                return false
            }
        }

        if (missingpayment.indexOf(field) > -1) {
            return true
        } else {
            return false
        }
    }

    const missingcheckBankaccount = (field) => {
        if (typeof formData.Bankaccount != "undefined") {
            if (formData.Bankaccount[field] === '') {
                return true
            } else {
                return false
            }
        }

        if (missingbank.indexOf(field) > -1) {
            return true
        } else {
            return false
        }
    }

    const addRow = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

        const paymentfields = ['paymentMethodTypeEnumId', 'firstNameOnAccount', 'lastNameOnAccount'
        ]
        const bankfileds = ['bankName', 'routingNumber', 'shebaNumber']

        let payment_fileds = []
        let bank_fileds = []

        paymentfields.map((field, index) => {
            if (typeof currentData[field] == 'undefined' && (typeof formData.payment == 'undefined'
                || (formData.payment && (typeof formData.payment[field] == 'undefined'
                    || formData.payment[field] === '')))) {
                payment_fileds.push(field)
            }
        })
        bankfileds.map((field, index) => {
            if (typeof currentData[field] == 'undefined' && (typeof formData.Bankaccount == 'undefined'
                || (formData.Bankaccount && (typeof formData.Bankaccount[field] == 'undefined'
                    || formData.Bankaccount[field] === '')))) {
                bank_fileds.push(field)
            }
        })

        setmissingpayment(payment_fileds)
        setmissingbank(bank_fileds)


        if (payment_fileds.length > 0 || bank_fileds.length > 0) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            setStyle({
                paymentMethodTypeEnumId: (formData.payment && formData.payment.paymentMethodTypeEnumId) ? false : true,// 
                bankName: (formData.Bankaccount && formData.Bankaccount.bankName) ? false : true,//عنوان بانک
                routingNumber: (formData.Bankaccount && formData.Bankaccount.routingNumber) ? false : true,//
                firstNameOnAccount: (formData.payment && formData.payment.firstNameOnAccount) ? false : true,//
                lastNameOnAccount: (formData.payment && formData.payment.lastNameOnAccount) ? false : true,
                shebaNumber: (formData.Bankaccount && formData.Bankaccount.shebaNumber) ? false : true,//
            })

            return null;

        } else {


            let payment_obj = {}
            let post_data = {}

            let credit_obj;
            if (typeof formData.credit != 'undefined') {
                credit_obj = {
                    cardNumber: formData.credit.cardNumber,
                }
                payment_obj.creditCard = credit_obj;
            }
            let banck_obj = {
                bankName: formData.Bankaccount.bankName,
                accountNumber: formData.Bankaccount.accountNumber,
                routingNumber: formData.Bankaccount.routingNumber,
                shebaNumber: formData.Bankaccount.shebaNumber,
            }
            payment_obj.bankAccount = banck_obj;
            payment_obj.purposeEnumId = formData.payment.paymentMethodTypeEnumId;
            payment_obj.paymentMethodTypeEnumId = "PmtBankAccount";
            payment_obj.ownerPartyId = partyId;
            payment_obj.firstNameOnAccount = formData.payment.firstNameOnAccount;
            payment_obj.lastNameOnAccount = formData.payment.lastNameOnAccount;
            payment_obj.suffixOnAccount = formData.payment.suffixOnAccount;
            payment_obj.description = formData.payment.description;
            post_data.payment_obj = payment_obj;
            post_data.partyId = partyId;

            axios.put(SERVER_URL + "/rest/s1/fadak/paymentDetails",
                post_data
                , {
                    timeout: AXIOS_TIMEOUT,
                    headers: {
                        'Content-Type': 'application/json',
                        api_key: localStorage.getItem('api_key')
                    }
                })
                .then(res => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'با موفقیت ثبت شد'));

                    data.enums.PaymentMethodPurpose.map((pmethod, index) => {
                        if (pmethod.enumId == formData.payment.paymentMethodTypeEnumId) {
                            // payment = pmethod;
                            formData.payment.purposeEnumId = pmethod.enumId;
                        }
                    })
                    formData.payment.paymentMethodId = res.data.result.paymentMethodId;

                    currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["paymentMethodId"]: formData.payment.paymentMethodId };
                    currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["purposeEnumId"]: formData.payment.paymentMethodTypeEnumId };
                    currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["firstNameOnAccount"]: formData.payment.firstNameOnAccount };
                    currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["lastNameOnAccount"]: formData.payment.lastNameOnAccount };

                    if (typeof formData.Bankaccount != 'undefined') {
                        if (typeof formData.Bankaccount.shebaNumber != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["shebaNumber"]: formData.Bankaccount.shebaNumber };
                        }
                        if (typeof formData.Bankaccount.accountNumber != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["accountNumber"]: formData.Bankaccount.accountNumber };
                        }
                        if (typeof formData.Bankaccount.routingNumber != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["routingNumber"]: formData.Bankaccount.routingNumber };
                        }
                        if (typeof formData.Bankaccount.bankName != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["bankName"]: formData.Bankaccount.bankName };
                        }
                    }

                    if (typeof formData.payment != 'undefined') {
                        if (typeof formData.payment.suffixOnAccount != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = {
                                ...currentData.PersonPaymentDetails[tableContent.length],
                                ["suffixOnAccount"]: formData.payment.suffixOnAccount
                            };
                        }
                        if (typeof formData.payment.description != 'undefined') {
                            currentData.PersonPaymentDetails[tableContent.length] = {
                                ...currentData.PersonPaymentDetails[tableContent.length],
                                ["description"]: formData.payment.description
                            };
                        }
                    }


                    if (typeof formData.credit != 'undefined') {

                        currentData.PersonPaymentDetails[tableContent.length] = { ...currentData.PersonPaymentDetails[tableContent.length], ["cardNumber"]: formData.credit.cardNumber };
                    }

                    //edited by ali sarmadi
                    formData.Bankaccount = undefined
                    formData.payment = undefined
                    setFormData(Object.assign(formData))
                    if (formData.telecom) {
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/ContactMech", {data : {}}, axiosKey).then(response => {
                            const ContactMechID = response.data.contactMechId.contactMechId
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber", {data : { contactMechId: ContactMechID }}, axiosKey).then(response1 => {
                                axios.patch(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : {contactMechId : ContactMechID ,  contactMechTypeEnumId: "CmtTelecomNumber" }}, axiosKey).then(response => {
                                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod" , {data : {paymentMethodId : res.data.result.paymentMethodId , telecomContactMechId: ContactMechID }}, axiosKey).then(response111 => {
                                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber" , {data : {...formData.telecom , contactMechId : ContactMechID}}, axiosKey).then(response11 => {
                                            if (formData.telecom && formData.telecom.areaCode) {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["areaCode"]: formData.telecom.areaCode
                                                };
                                            }
                                            if (formData.telecom && typeof formData.telecom.contactNumber != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["contactNumber"]: formData.telecom.contactNumber
                                                };
                                            }
                                            formData.telecom = undefined
                                            setFormData(Object.assign(formData))
                                        })
                                    })
                                })
                            })

                        })

                    }
                    if (formData.postalAddress) {


                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/ContactMech", {data : {}}, axiosKey).then(response => {
                            const ContactMechID = response.data.contactMechId.contactMechId
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/PostalAddress", {data : { contactMechId: ContactMechID }}, axiosKey).then(response1 => {
                                axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod" , {data : {paymentMethodId : res.data.result.paymentMethodId ,  postalContactMechId: ContactMechID }}, axiosKey).then(response111 => {
                                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PostalAddress" , {data : {...formData.postalAddress , contactMechId : ContactMechID}}, axiosKey).then(response11 => {
                                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : {contactMechId : ContactMechID , contactMechTypeEnumId: "CmtPostalAddress" }}, axiosKey).then(response => {
                                            if (formData.postalAddress && typeof formData.postalAddress.countryGeoId != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalCountryGeoId"]: formData.postalAddress.countryGeoId
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.stateProvinceGeoId != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalStateProvinceGeoId"]: formData.postalAddress.stateProvinceGeoId
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.countyGeoId != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalCountyGeoId"]: formData.postalAddress.countyGeoId
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.district != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalDistrict"]: formData.postalAddress.district
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.street != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalStreet"]: formData.postalAddress.street
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.alley != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalAlley"]: formData.postalAddress.alley
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.plate != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalPlate"]: formData.postalAddress.plate
                                                };
                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.floor != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalFloor"]: formData.postalAddress.floor
                                                };

                                            }

                                            if (formData.postalAddress && typeof formData.postalAddress.postalCode != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalPostalCode"]: formData.postalAddress.postalCode
                                                };


                                            }
                                            if (formData.postalAddress && typeof formData.postalAddress.unitNumber != 'undefined') {
                                                currentData.PersonPaymentDetails[tableContent.length] = {
                                                    ...currentData.PersonPaymentDetails[tableContent.length],
                                                    ["postalUnitNumber"]: formData.postalAddress.unitNumber
                                                };

                                            }


                                            formData.postalAddress = undefined
                                            formData.Bankaccount = undefined
                                            formData.payment = undefined
                                            setFormData(Object.assign(formData))


                                        })


                                    })


                                })

                            })
                        })





                    }

                    setCurrentData(Object.assign({}, currentData))





                });



            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
        }

    };

    const displayUpdateForm2 = (index) => {
        // setBankEdit(-1)
        setBankToEdit(index)
        setDisplay(false)
        setTimeout(() => {
            setDisplay(true)

        }, 20)

        setEnableDisableCreate(true);
    }




    const updateRow = () => {
        // if (checkmissing()) {

        if (typeof currentData != 'undefined') {

            const paymentfields = ['paymentMethodTypeEnumId', 'firstNameOnAccount', 'lastNameOnAccount']
            const bankfileds = ['bankName', 'routingNumber', 'shebaNumber']

            let payment_fileds = []
            let bank_fileds = []

            paymentfields.map((field, index) => {
                let ifFilled = (((formData.payment && (typeof formData.payment[field] != 'undefined'
                    && (formData.payment[field]).trim() !== ''))
                ) || (

                        (
                            (typeof formData.payment == 'undefined')
                            ||
                            (formData.payment && (typeof formData.payment[field] == 'undefined'))
                            ||
                            (formData.payment && (typeof formData.payment[field] != 'undefined' && (formData.payment[field]).trim() !== ''))
                        )
                    )) ? true : false;
                if (!ifFilled) {
                    payment_fileds.push(field)
                }

            })

            bankfileds.map((field, index) => {
                let ifFilled = (((formData.Bankaccount && (typeof formData.Bankaccount[field] != 'undefined'
                    && (formData.Bankaccount[field]).trim() !== ''))
                ) || (

                        (
                            (typeof formData.Bankaccount == 'undefined')
                            ||
                            (formData.Bankaccount && (typeof formData.Bankaccount[field] == 'undefined'))
                            ||
                            (formData.Bankaccount && (typeof formData.Bankaccount[field] != 'undefined' && (formData.Bankaccount[field]).trim() !== ''))
                        )
                    )) ? true : false;
                if (!ifFilled) {
                    bank_fileds.push(field)
                }

            })

            setmissingpayment(payment_fileds)
            setmissingbank(bank_fileds)


            if (payment_fileds.length > 0 || bank_fileds.length > 0) {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));

                setStyle({
                    paymentMethodTypeEnumId: (formData?.payment?.paymentMethodTypeEnumId === "") ? true : false,
                    bankName: (formData?.Bankaccount?.bankName === "") ? true : false,
                    routingNumber: (formData?.Bankaccount?.routingNumber === "") ? true : false,
                    firstNameOnAccount: (formData?.payment?.firstNameOnAccount === "") ? false : false,
                    lastNameOnAccount: (formData?.payment?.lastNameOnAccount === "") ? true : false,
                    shebaNumber: (formData?.Bankaccount?.shebaNumber === "") ? true : false,
                })




                return false;

            } else {
                if (!formData.payment && !formData.Bankaccount && !formData.credit && !formData.postalAddress && !formData.telecom) {

                    setBankToEdit(-1)
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)

                    setEnableDisableCreate(false);
                    stenablecancel(false)

                } else {


                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));
                    const paymentMethodId = currentData.PersonPaymentDetails[BankToEdit].paymentMethodId

                    //patch
                    if (formData.payment) {

                        let dataPyament = {
                            purposeEnumId: formData.payment.paymentMethodTypeEnumId,
                            firstNameOnAccount: formData.payment.firstNameOnAccount,
                            lastNameOnAccount: formData.payment.lastNameOnAccount,
                            suffixOnAccount: formData.payment.suffixOnAccount,
                            description: formData.payment.description,
                        }
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod" , {data : {...dataPyament ,paymentMethodId : paymentMethodId }}, axiosKey).then(response => {

                            const newaddRows = Object.assign({}, { ["payment"]: -1 });
                            setAddRows(newaddRows)


                            currentData.PersonPaymentDetails[BankToEdit] = {
                                ...currentData.PersonPaymentDetails[BankToEdit],
                                ["purposeEnumId"]: formData.payment.paymentMethodTypeEnumId ?? currentData.PersonPaymentDetails[BankToEdit].purposeEnumId,
                                ["firstNameOnAccount"]: formData.payment.firstNameOnAccount ?? currentData.PersonPaymentDetails[BankToEdit].firstNameOnAccount,
                                ["lastNameOnAccount"]: formData.payment.lastNameOnAccount ?? currentData.PersonPaymentDetails[BankToEdit].lastNameOnAccount,
                                ["suffixOnAccount"]: formData.payment.suffixOnAccount ?? currentData.PersonPaymentDetails[BankToEdit].suffixOnAccount,
                                ["description"]: formData.payment.description ?? currentData.PersonPaymentDetails[BankToEdit].description,
                            };

                            setCurrentData(Object.assign({}, currentData))

                        })
                    }



                    if (typeof formData.Bankaccount != 'undefined') {
                        let dataBankaccount = {
                            bankName: formData.Bankaccount.bankName,
                            routingNumber: formData.Bankaccount.routingNumber,
                            accountNumber: formData.Bankaccount.accountNumber,
                            shebaNumber: formData.Bankaccount.shebaNumber
                        }
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/BankAccount" , {data : {...dataBankaccount , paymentMethodId : paymentMethodId}}, axiosKey).then(response => {


                            const newaddRows = Object.assign({}, { ["Bankaccount"]: -1 });
                            setAddRows(newaddRows)

                            currentData.PersonPaymentDetails[BankToEdit] = {
                                ...currentData.PersonPaymentDetails[BankToEdit],
                                ["bankName"]: formData.Bankaccount.bankName ?? currentData.PersonPaymentDetails[BankToEdit].bankName,
                                ["routingNumber"]: formData.Bankaccount.routingNumber ?? currentData.PersonPaymentDetails[BankToEdit].routingNumber,
                                ["accountNumber"]: formData.Bankaccount.accountNumber ?? currentData.PersonPaymentDetails[BankToEdit].accountNumber,
                                ["shebaNumber"]: formData.Bankaccount.shebaNumber ?? currentData.PersonPaymentDetails[BankToEdit].shebaNumber,

                            };

                            setCurrentData(Object.assign({}, currentData))
                        })




                    }
                    if (typeof formData.credit != 'undefined') {
                        if (formData.credit.cardNumber !== '' && typeof currentData.PersonPaymentDetails[BankToEdit].cardNumber != 'undefined') {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/CreditCard" , {data : {paymentMethodId : paymentMethodId , cardNumber: formData.credit.cardNumber }}, axiosKey).then(response => {
                                const newaddRows = Object.assign({}, { ["credit"]: -1 });
                                setAddRows(newaddRows)
                                currentData.PersonPaymentDetails[BankToEdit] = {
                                    ...currentData.PersonPaymentDetails[BankToEdit]
                                    , ["cardNumber"]: formData.credit.cardNumber
                                };
                                setCurrentData(Object.assign({}, currentData))

                            })
                        } else {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/CreditCard", {data :{ cardNumber: formData.credit.cardNumber, paymentMethodId: paymentMethodId }}, axiosKey).then(response => {
                                const newaddRows = Object.assign({}, { ["credit"]: -1 });
                                setAddRows(newaddRows)
                                currentData.PersonPaymentDetails[BankToEdit] = {
                                    ...currentData.PersonPaymentDetails[BankToEdit],
                                    ["cardNumber"]: formData.credit.cardNumber
                                };
                                setCurrentData(Object.assign({}, currentData))

                            })
                        }


                    }



                    //edited by ali sarmmadi







                    if (formData.telecom) {
                        if (currentData.PersonPaymentDetails[BankToEdit].telecomContactMechId) {


                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber" , {data : {...formData.telecom , contactMechId : currentData.PersonPaymentDetails[BankToEdit].telecomContactMechId }}, axiosKey).then(response => {
                                const newaddRows = Object.assign({}, { ["telecom"]: -1 })
                                setAddRows(newaddRows)


                                currentData.PersonPaymentDetails[BankToEdit] = {
                                    ...currentData.PersonPaymentDetails[BankToEdit],
                                    ["contactNumber"]: (formData.telecom.contactNumber) ? formData.telecom.contactNumber : (currentData.PersonPaymentDetails[BankToEdit].contactNumber) ? (currentData.PersonPaymentDetails[BankToEdit].contactNumber) : '',
                                    ["areaCode"]: formData.telecom.areaCode ? formData.telecom.areaCode : (currentData.PersonPaymentDetails[BankToEdit].areaCode) ? (currentData.PersonPaymentDetails[BankToEdit].areaCode) : ''
                                }


                                if (formData.telecom.contactNumber === "") {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["contactNumber"]: ""
                                    }
                                }
                                if (formData.telecom.areaCode == "") {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["areaCode"]: ""
                                    }
                                }

                                setCurrentData(Object.assign({}, currentData))
                                formData.telecom = undefined
                                setFormData(Object.assign(formData))
                                setDisplay(false)
                                setTimeout(() => {
                                    setDisplay(true)
                                }, 20)

                            })




                        } else {
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/ContactMech", {data : {}}, axiosKey).then(response => {
                                const ContactMechID = response.data.contactMechId.contactMechId
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber", {data : { contactMechId: response.data.contactMechId.contactMechId }}, axiosKey).then(response1 => {
                                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : {contactMechId : ContactMechID ,  contactMechTypeEnumId: "CmtTelecomNumber" }}, axiosKey).then(response => {
                                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod" , {data : {paymentMethodId : paymentMethodId , telecomContactMechId: ContactMechID }}, axiosKey).then(response111 => {
                                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber" , {data : {...formData.telecom , contactMechId : ContactMechID }}, axiosKey).then(response11 => {

                                                currentData.PersonPaymentDetails[BankToEdit] = {
                                                    ...currentData.PersonPaymentDetails[BankToEdit],
                                                    ["contactNumber"]: (formData.telecom.contactNumber) ? formData.telecom.contactNumber : (currentData.PersonPaymentDetails[BankToEdit].contactNumber) ? (currentData.PersonPaymentDetails[BankToEdit].contactNumber) : '',
                                                    ["areaCode"]: formData.telecom.areaCode ? formData.telecom.areaCode : (currentData.PersonPaymentDetails[BankToEdit].areaCode) ? (currentData.PersonPaymentDetails[BankToEdit].areaCode) : ''
                                                }


                                                setCurrentData(Object.assign({}, currentData))
                                                formData.telecom = undefined
                                                setFormData(Object.assign(formData))
                                                setDisplay(false)
                                                setTimeout(() => {
                                                    setDisplay(true)
                                                }, 20)
                                            })
                                        })
                                    })
                                })

                            })


                        }

                    }

                    if (typeof formData.postalAddress != 'undefined') {
                        if (currentData.PersonPaymentDetails[BankToEdit].postalContactMechId) {
                            //patch
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PostalAddress" , {data : {...formData.postalAddress , contactMechId : currentData.PersonPaymentDetails[BankToEdit].postalContactMechId }}, axiosKey).then(response => {
                                const newaddRows = Object.assign({}, { ["postalAddress"]: -1 });
                                setAddRows(newaddRows)
                                if (typeof formData.postalAddress.countryGeoId != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalCountryGeoId"]: formData.postalAddress.countryGeoId
                                    };

                                }
                                if (typeof formData.postalAddress.stateProvinceGeoId != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalStateProvinceGeoId"]: formData.postalAddress.stateProvinceGeoId
                                    };

                                }
                                if (typeof formData.postalAddress.countyGeoId != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalCountyGeoId"]: formData.postalAddress.countyGeoId
                                    };

                                }
                                if (typeof formData.postalAddress.district != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalDistrict"]: formData.postalAddress.district
                                    };

                                }
                                if (typeof formData.postalAddress.street != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalStreet"]: formData.postalAddress.street
                                    };

                                }
                                if (typeof formData.postalAddress.alley != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalAlley"]: formData.postalAddress.alley
                                    };

                                }
                                if (typeof formData.postalAddress.plate != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalPlate"]: formData.postalAddress.plate
                                    };

                                }
                                if (typeof formData.postalAddress.floor != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalFloor"]: formData.postalAddress.floor
                                    };

                                }
                                if (typeof formData.postalAddress.unitNumber != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalUnitNumber"]: formData.postalAddress.unitNumber
                                    };

                                }
                                if (typeof formData.postalAddress.postalCode != 'undefined') {
                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                        ["postalPostalCode"]: formData.postalAddress.postalCode
                                    };


                                }

                                setCurrentData(Object.assign({}, currentData))
                                formData.postalAddress = undefined
                                setFormData(Object.assign(formData))
                                setDisplay(false)
                                setTimeout(() => {
                                    setDisplay(true)
                                }, 20)


                            })



                        } else if (typeof currentData.PersonPaymentDetails[BankToEdit].postalContactMechId == 'undefined') {
                            //post

                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/ContactMech", {data : formData.postalAddress}, axiosKey).then(response1 => {
                                axios.patch(SERVER_URL + "/rest/s1/fadak/entity/ContactMech" , {data : {contactMechId : response1.data.contactMechId.contactMechId ,  contactMechTypeEnumId: "CmtPostalAddress" }}, axiosKey).then(responwse => {
                                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/PostalAddress",{data : { contactMechId: response1.data.contactMechId.contactMechId }}, axiosKey).then(response18989 => {
                                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PostalAddress" , {data : {...formData.postalAddress ,contactMechId : response1.data.contactMechId.contactMechId  }}, axiosKey).then(response112 => {
                                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod" , {data : {paymentMethodId : paymentMethodId , postalContactMechId: response1.data.contactMechId.contactMechId }}, axiosKey).then(response => {
                                                currentData.PersonPaymentDetails[BankToEdit] = {
                                                    ...currentData.PersonPaymentDetails[BankToEdit],
                                                    ["postalContactMechId"]: response1.data.contactMechId
                                                };
                                                const newaddRows = Object.assign({}, { ["postalAddress"]: -1 });
                                                setAddRows(newaddRows)
                                                if (typeof formData.postalAddress.countryGeoId != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalCountryGeoId"]: formData.postalAddress.countryGeoId
                                                    };

                                                }
                                                if (typeof formData.postalAddress.stateProvinceGeoId != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalStateProvinceGeoId"]: formData.postalAddress.stateProvinceGeoId
                                                    };


                                                }
                                                if (typeof formData.postalAddress.countyGeoId != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalCountyGeoId"]: formData.postalAddress.countyGeoId
                                                    };

                                                }
                                                if (typeof formData.postalAddress.district != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalDistrict"]: formData.postalAddress.district
                                                    };

                                                }
                                                if (typeof formData.postalAddress.street != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalStreet"]: formData.postalAddress.street
                                                    };

                                                }
                                                if (typeof formData.postalAddress.alley != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalAlley"]: formData.postalAddress.alley
                                                    };

                                                }
                                                if (typeof formData.postalAddress.plate != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalPlate"]: formData.postalAddress.plate
                                                    };

                                                }
                                                if (typeof formData.postalAddress.floor != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalFloor"]: formData.postalAddress.floor
                                                    };

                                                }
                                                if (typeof formData.postalAddress.unitNumber != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalUnitNumber"]: formData.postalAddress.unitNumber
                                                    };

                                                }
                                                if (typeof formData.postalAddress.postalCode != 'undefined') {
                                                    currentData.PersonPaymentDetails[BankToEdit] = {
                                                        ...currentData.PersonPaymentDetails[BankToEdit],
                                                        ["postalPostalCode"]: formData.postalAddress.postalCode
                                                    };

                                                }
                                                setCurrentData(Object.assign({}, currentData))
                                                formData.postalAddress = undefined
                                                setFormData(Object.assign(formData))
                                                setDisplay(false)
                                                setTimeout(() => {
                                                    setDisplay(true)
                                                }, 20)

                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }
                    setEnableDisableCreate(false);

                }


                setBankToEdit(-1)
            }
        }
    }

    return (
        <Grid>
            {display && data &&
                <BankingInfo addFormData={addFormData} currentData1={currentData1}
                    BankEdit={BankEdit} setFormData={setFormData} formData={formData} family={family} name={name}
                    missingcheckBankaccount={missingcheckBankaccount} missingcheckPayment={missingcheckPayment}
                    data={data} tableContent={tableContent} setTableContent={setTableContent}
                    setDisplay={setDisplay}
                    addData={addData} setCurrdeventData1={setCurrentData1} addCredit={addCredit}
                    setOpen={setOpen} setId={setId} idDelete={idDelete} open={open} handleClose={handleClose}
                    currentData={currentData} cancelUpdate={cancelUpdate} BankToEdit={BankToEdit}
                    cancelAdd={cancelAdd}

                    countryGeoId={countryGeoId} style={style} setStyle={setStyle}
                    enablecancel={enablecancel} setCurrentData={setCurrentData}
                    setEnableDisableCreate={setEnableDisableCreate}
                    enableDisableCreate={enableDisableCreate} addRow={addRow} updateRow={updateRow} />}
        </Grid>

    );
}

export default BankingInfoCom;