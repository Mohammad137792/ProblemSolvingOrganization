import React, { useState, useEffect } from 'react'


import { Button, CardHeader, Card, Grid, CardContent, Box } from '@material-ui/core';

import FormPro from './../../../../../../../components/formControls/FormPro'
import TablePro from './../../../../../../../components/TablePro'

import ActionBox from './../../../../../../../components/ActionBox'

import { FusePageSimple } from "@fuse";




import axios from 'axios'
import { SERVER_URL } from '../../../../../../../../../configs'
import { useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import { CodeSharp } from '@material-ui/icons';


const formDefaultValues = { address1: '', contactNumberPhone: '', contactNumberFax: '', }

const BranchAddressList = (props) => {
    const { ALERT_TYPES, setAlertContent, orgPartyId, access } = props
    const [formValues, setFormValues] = useState(formDefaultValues);
    const [tableContent, setTableContent] = useState([]);
    const [actionObject, setActionObject] = useState({ edit: false });

    const dispatch = useDispatch()

    const formPosta = [
        { type: "component", component: (<div>موقعیت مکانی شعب و نمایندگی ها</div>), col: 12 },
        { name: "contactNumberPhone", label: "شماره  تماس ثابت ", type: "text" },
        { name: "contactNumberFax", label: "شماره فکس", type: "text" },
        { name: "address1", label: "آدرس ", type: "text", col: 12 }
    ]

    const tableCols = [
        { name: "contactNumber", label: "شماره فکس", type: "text", style: { minWidth: "90px" } },
        { name: "contactNumberPhone", label: "شماره تلفن ", type: "number", style: { minWidth: "90px" } },
        { name: "address1", label: "آدرس", type: "text", style: { minWidth: "170px" } }
    ]
    useEffect(() => {
        getData()
    }, [])

    const handlerSubmit = () => {
        if (actionObject.edit) {
            request_edit(actionObject?.editData)
        } else {
            request_postall()
        }
    }

    const getData = () => {
        const configUseEffect = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/training/addressInstitutions?partyId=${orgPartyId ?? ''}`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        };
        axios(configUseEffect).then(response_get => {

            let response = response_get.data
            console.log("alisasvavasv", response)

            let postalArry = []
            Object.keys(response).forEach((key, index) => {
                let obj = {}
                response[key].map(item => {

                    if (item.contactMechPurposeId === 'PostalInstitute') {
                        obj[item.contactMechPurposeId] = item
                    }
                    if (item.contactMechPurposeId === 'PhoneInstitute') {
                        obj[item.contactMechPurposeId] = item
                    }
                    if (item.contactMechPurposeId === 'FaxInstitute') {
                        obj[item.contactMechPurposeId] = item
                    }
                })
                if (Object.keys(obj).length !== 0) postalArry.push(obj)
            })
            let arryaList = []
            postalArry.map(item => {

                let onj = {
                    address1: item?.PostalInstitute?.address1 || '',
                    contactNumberPhone: item?.PhoneInstitute?.contactNumber || '',
                    contactNumber: item?.FaxInstitute?.contactNumber || '',
                    fax: { fromDate: item?.FaxInstitute?.fromDate, partyId: item?.FaxInstitute?.partyId, contactMechId: item?.FaxInstitute?.contactMechId },
                    phone: { fromDate: item?.PhoneInstitute?.fromDate, partyId: item?.PhoneInstitute?.partyId, contactMechId: item?.PhoneInstitute?.contactMechId },
                    postal: { fromDate: item?.PostalInstitute?.fromDate, partyId: item?.PostalInstitute?.partyId, contactMechId: item?.PostalInstitute?.contactMechIdAddress }


                }
                arryaList.push(onj)
            })
            setTableContent(arryaList)
        })
    }
    const request_postall = () => {

        if (formValues.address1 || formValues.contactNumberPhone || formValues.contactNumberFax) {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات ...'))

            let data = {
                postalAddress: [
                    {
                        contactMechTypeEnumId: 'CmtPostalAddress',
                        address1: formValues.address1,
                        type: 'PostalInstitute',
                        fromDate: Date.now(),
                        partyId: orgPartyId
                    },
                    {
                        contactMechTypeEnumId: 'CmtTelecomNumber',
                        contactNumber: formValues.contactNumberPhone,
                        type: 'PhoneInstitute',
                        fromDate: Date.now(),
                        partyId: orgPartyId
                    },
                    {
                        contactMechTypeEnumId: 'CmtTelecomNumber',
                        contactNumber: formValues.contactNumberFax,
                        type: 'FaxInstitute',
                        fromDate: Date.now(),
                        partyId: orgPartyId
                    },
                ]
            }

            const config = {
                method: 'post',
                url: `${SERVER_URL}/rest/s1/training/addressInstitutions`,
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
                data: data
            };

            axios(config)
                .then(Response => {
                    getData()
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
                    setFormValues(formDefaultValues)
                }).catch(error => dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات,لطفا دوباره سعی کنید')))
            return 0
        }
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'حداقل یک فیلد پر شود'))
    }

    const request_dropPostal = (row) => {
        const data = { listKey: [{ ...row?.fax }, { ...row?.phone }, { ...row?.postal }] }
        const config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/training/DropAddressInstitutions`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            data: access && data
        };
        return new Promise((resolve, reject) => {


            axios(config).then(res => {
                if (res.status === 200) {
                    resolve()
                }
            }).catch(err => reject("امکان حذف این مورد وجود ندارد!")
            )
        })

    }
    const handler_edit = (row) => {
        setFormValues({
            address1: row.address1, contactNumberPhone: row.contactNumberPhone, contactNumberFax: row.contactNumber
        })
        setActionObject(prevState => ({ ...prevState, edit: true, editData: row }))
    }

    const request_edit = (dataUpdate) => {
        const data = {
            inPostal: [
                { ...dataUpdate.fax, type: "fax", a: 'a', contactNumber: formValues["contactNumberFax"] },
                { ...dataUpdate.phone, type: "tel", a: 'b', contactNumber: formValues["contactNumberPhone"] },
                { ...dataUpdate.postal, type: "postal", address1: formValues["address1"] }
            ]
        }
        console.log(dataUpdate)

        const config = {
            method: 'put',
            url: `${SERVER_URL}/rest/s1/training/addressInstitutions`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            data: data
        };
        axios(config).then(response => {
            getData()
            setActionObject({ edit: false })
            setFormValues(formDefaultValues)

        })
    }

    return (
        <>
            {/* <Card>
                <CardHeader title="آدرس" />
                <CardContent>
                    <FormPro
                        style={{ marginTop: 5 }}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        append={formPosta}
                        actionBox={
                            access && <ActionBox>
                                <Button type="submit" role="primary">   {actionObject.edit ? "ویرایش" : "افزودن"} </Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                        submitCallback={handlerSubmit}
                    />
                </CardContent>

            </Card>
            <Box m={2} />
            <Card>
                <TablePro
                    title="لیست شعب"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    rowActions={[
                        {
                            title: "ویرایش",
                            icon: EditIcon,
                            onClick: (row) => {
                                handler_edit(row)
                            }
                        }
                    ]}
                    delete={access ? "inline" : null}
                    removeCallback={(row) => request_dropPostal(row)}
                />

            </Card> */}


        </>
    )
}


export default BranchAddressList;