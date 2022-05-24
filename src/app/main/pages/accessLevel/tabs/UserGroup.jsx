
import React, { useEffect, useState , createRef} from 'react'
import TablePro from "../../../components/TablePro";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
// import FilterHistory from "../../../components/FilterHistory";
import { Box, Card, CardHeader, CardContent, Button } from '@material-ui/core'
import User from './Users'
import { SERVER_URL } from '../../../../../configs';
import axios from 'axios'


import { useDispatch } from "react-redux";

import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";



const UserGroupList = ({ getData, tableContent, handleEdit }) => {
    const tableCols = [
        { name: "description", label: " عنوان گروه", type: "text" },
        {
            name: "groupTypeEnumId", label: "نوع گروه کاربری", type: "select",
            options: "userGroupType",
        },
    ]


    useEffect(() => {
        getData()

    }, [])


    return (
        <>
            <Box p={2}>
                <Card>
                    <TablePro
                        title='لیست گروه کاربران'
                        columns={tableCols}
                        rows={tableContent}
                        edit="callback"
                        editCallback={handleEdit}

                    />
                </Card>
            </Box>
        </>
    )
}



function UserGroup() {
    const [formValues, setFormValues] = useState();
    const [moreFilter, setMoreFilter] = useState(false);
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [edit, setEdit] = useState(false)
    const [selectPersonal, setSelectPersonal] = useState([]);
    const myElement = createRef(0);

    const dispatch = useDispatch()
    const [formValidation, setFormValidation] = React.useState({});

    const formStructure = [
        {
            name: "description",
            label: "عنوان گروه کاربری",
            type: "text",
            required:true,
            col: 3
        },
        // {
        //     name: "groupTypeEnumId",
        //     label: "نوع گروه کاربری",
        //     type: "select",
        //     options: "userGroupType", col: 3
        // },


    ]

    const getData = () => {
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/security/userGroup`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        return axios(config).then(response => {
            setTableContent(response.data.group)
            setLoading(false)
        }).catch(err => { })
    }

    const handleReset = () => {
        setEdit(false)
        setFormValues({})
        setSelectPersonal([])
    }

    const handleSubmit = (e) => {

        if(formValues?.description?.length>0){
            let config = {
                method: 'post',
                url: `${SERVER_URL}/rest/s1/security/userGroupAndUserGroupMember`,
                headers: { 'api_key': localStorage.getItem('api_key') },
                data: { user: [...selectPersonal], group: formValues }
            }
    
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات ...'))
    
            axios(config).then(response => {
    
                getData();
                setFormValues({})
                setSelectPersonal([])
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
            }).catch(err => dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات,لطفا دوباره سعی کنید')))
    
    
        }
        else{
            myElement.current.click();
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فیلد عنوان گروه کاربری اجباری می باشد.'))
        }

    }


    const handleSubmitEdit = () => {
        if(formValues?.description?.length>0){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات ...'))

            const data = {
                "userGroupId": formValues.userGroupId,
                "userList": selectPersonal,
                "formGroup": formValues
            }

            let config = {
                method: 'put',
                url: `${SERVER_URL}/rest/s1/security/userGroupAndUserGroupMember`,
                headers: { 'api_key': localStorage.getItem('api_key') },
                data: data
            }



            axios(config).then(response => {
                getData();
                setFormValues({})
                setSelectPersonal([])
                setEdit(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
            })
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فیلد عنوان گروه کاربری اجباری می باشد.'))

        }
    }

    const handleEdit = (row) => {
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/security/userGroupAndUserGroupMember?userGroupId=${row.userGroupId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios(config).then(response => {
            setFormValues(row)
            setData(response.data.DataUser)
            setEdit(true)

        })
    }

    return (
        <>
            <Box p={2}>
                <Card>
                    <CardHeader title="تعریف گروه کاربران" />
                    <CardContent>
                        <FormPro prepend={formStructure}
                            formValues={formValues} setFormValues={setFormValues}
                            formValidation={formValidation} setFormValidation={setFormValidation}
                            actionBox={<ActionBox style={{display:"none"}}>
                                <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                                {/* <Button type="reset" role="secondary">لغو</Button> */}
                            </ActionBox>}
                        />
                    </CardContent>

                    <Box p={2} />
                    <Box p={2} />

                    <User setSelectPersonal={setSelectPersonal} data={data} selectPersonal={selectPersonal} select={true} />
                    {/* <form onSubmit={edit ? handleSubmitEdit : handleSubmit} onReset={handleReset} noValidate autoComplete="off"> */}

                    <ActionBox style={{ padding: '16px' }}>
                        <Button type="submit" role="primary" onClick={edit ? handleSubmitEdit : handleSubmit} >   {edit ? "ویرایش" : "افزودن"} </Button>
                        <Button type="reset" role="secondary" onClick={handleReset}>لغو</Button>
                    </ActionBox>
                    {/* </form> */}

                    <Box p={2} />
                </Card>
            </Box>
            <Box p={2} />
            <UserGroupList loading={loading} setLoading={setLoading} tableContent={tableContent}
                setTableContent={setTableContent} getData={getData} dispatch={dispatch}
                handleEdit={handleEdit} setEdit={setEdit} />


        </>
    )
}

export default UserGroup