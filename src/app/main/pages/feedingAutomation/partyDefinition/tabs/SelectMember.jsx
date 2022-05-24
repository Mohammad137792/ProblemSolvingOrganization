import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Tooltip } from '@material-ui/core';
import TablePro from 'app/main/components/TablePro';
import checkPermis from 'app/main/components/CheckPermision';
import { SERVER_URL } from 'configs';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';


const SelectMember = (props) => {
    const { partyClassificationId, setLoading } = props
    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [tableContent, setTableContent] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [loadingMember, setLoadingmember] = useState(true)

    const dispatch = useDispatch()
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableCols = [
        {
            label: "نام اعضا  ",
            name: "partyRelationshipId",
            type: "select",
            options: organizationUnit.employees,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            required: true,
            col: 3
        }, {
            label: "    از تاریخ ",
            name: "fromDate",
            required: true,
            type: "date",
            col: 3
        }, {
            label: "  تا تاریخ  ",
            name: "thruDate",
            type: "date",
            col: 3

        }

    ]


    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
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
            .catch(() => { });
    }

    useEffect(() => {
        getOrgInfo()
    }, [])

    const handleRemove = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/reservation/deleteMemberFoodGroup?partyClassificationId=" + oldData.partyClassificationId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoading(true)
                    setLoadingmember(true)
                }).catch(() => {
                    reject('خطا در خذف اطلاعات!')
                });
        })

    }



    const handleAdd = (formData) => {
        formData.partyClassificationId = partyClassificationId
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(rest => {
                let dateTime = rest.data.nowDateTime
                formData.fromDate = formData.fromDate + " " + dateTime.split(" ")[1]
                formData.thruDate = formData.thruDate ? (formData.thruDate + " " + dateTime.split(" ")[1]) : ""
                axios.post(SERVER_URL + "/rest/s1/reservation/addMemberFoodGroup", { data: formData }, axiosKey)
                    .then((res) => {
                        if (res.data.result === "noEmployment")
                            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'امکان اضافه شدن این فرد وجود ندارد.!'));
                        else
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.!'));
                        setLoadingmember(true)
                        setLoading(true)
                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    });
            }).catch(err => {
                reject(err)
            });


        })
    }

    const getMemberList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/getMemberFoodGroup?partyClassificationId=" + partyClassificationId, {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContent(res.data.result)
            setLoadingmember(false)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getMemberList()
    }, [loadingMember, partyClassificationId])

    return (
        <Card style={{ padding: "1vw" }}>
            <Box>
                <Card >
                    <TablePro
                        title="   لیست  اعضا   "
                        columns={tableCols}
                        rows={tableContent}
                        // editCallback={handleEdit}
                        // edit= { checkPermis("feedingAutomation/partyDefinition/addMember", datas)?"callback":false}
                        add={checkPermis("feedingAutomation/partyDefinition/addMember", datas) ? "inline" : false}
                        addCallback={handleAdd}
                        removeCallback={handleRemove}
                        setTableContent={setTableContent}
                        loading={loadingMember}
                    />
                </Card>
            </Box>
        </Card>
    )
}


export default SelectMember;











