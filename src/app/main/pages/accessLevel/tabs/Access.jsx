import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { SERVER_URL } from "../../../../../configs";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import { Box, Card, Button, CardHeader, CardContent } from '@material-ui/core';
import AccessCollapseTable from '../tables/accessCollapseTable';
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";

function Access() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [selectPersonal, setSelectPersonal] = useState([])
    const [formValues, setFormValues] = useState()
    const [tableContent, setTableContent] = useState({});
    const [artifactGroup, setArtifactGroup] = useState({});
    const [dataDelete, setDataDelete] = useState({});
    const [members, setMembers] = useState({});
    const [isOpen, setIsOpen] = useState([]);
    const [changed, setchanged] = useState(false);
    const [initData, setInitData] = useState([]);
    const dispatch = useDispatch()

    const keyData = {
        headers: { 'api_key': localStorage.getItem('api_key') }
    }

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/security/accessPageData", keyData).then(response => {
            setLoading(false)
            setData(response.data.data.userGroup.group)
            setMembers(response.data.data.artifactMember)
            setTableContent(response.data.data.user)
            setArtifactGroup(response.data.data.artifactGroup)
        })
    }, [])


    const formStructure = [
        { name: "userGroupId", label: " گروه کاربران", type: "select", options: data, optionIdField: "userGroupId", optionLabelField: "description" },
    ]


    useEffect(() => {

        
        if (formValues?.userGroupId?.length) {
            axios.post(`${SERVER_URL}/rest/s1/security/artifactAuth/artifactAuthList`, { userGroupId: formValues?.userGroupId }, keyData).then(response => {
                let listOfData = response.data.data
                let atr = new Set(listOfData.map(d => d?.userPermissionId))
                let List = []
                let keysList = Object.keys(tableContent)
                keysList.filter(ele => { List[ele] = [...List, ...tableContent[ele].filter(d => atr.has(d?.userPermissionId))] })

                let nMembers = JSON.parse(JSON.stringify(members)),//members.slice(),
                membersView = []

                for (let i=0;i<nMembers.length;i++){
                    let permit = listOfData.find(x => x.userPermissionId==nMembers[i].userPermissionId)
                    if(permit){
                        nMembers[i].viewAccess = true
                        nMembers[i].fromDate = permit.fromDate
                    }
                    else{
                        nMembers[i].viewAccess = false
                    }
                    nMembers[i].userGroupId = formValues?.userGroupId
                    membersView[i] = false

                    if(i == nMembers.length-1){
                        let initdatas = JSON.parse(JSON.stringify(nMembers))//nMembers.slice()
                        setInitData(initdatas)
                        setIsOpen(membersView)
                        setMembers(nMembers)
                    }
                }


                setSelectPersonal(List)

                let data = {
                    ...formValues,
                    artifactNameList: []
                }
                Object.keys(List).map((value) => {
                    data["artifactNameList"] = [...data["artifactNameList"], ...List[value]]
                })


                setDataDelete(listOfData)

            })
            setShowTable(true)
        }

    }, [formValues?.userGroupId,changed])


    const handler_senAuth = (m) => {
        
        let views = m.filter(x=>x.viewAccess == true && JSON.stringify(initData).indexOf(JSON.stringify(x))<0)

        let dataDelete1 = m.filter(x=>x.viewAccess == false && JSON.stringify(initData).indexOf(JSON.stringify(x))<0)
        let data = {
            ...formValues,
            'artifactNameList':views
        }

        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات ...'))

        axios.post(`${SERVER_URL}/rest/s1/security/artifactAuth`, { data , dataDelete1}, keyData).then(response => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
            setchanged((prev)=>{
                return !prev
            })
        })
    }


    const skillcolumns = [
        { name: "description", label: "نوع دسترسی", type: "text" },
        { name: "viewAccess", label: "دسترسی", type: "accessCheckboxes","data":members,"setData":setMembers },
    ]

    return (
        <>
            <Box p={2}>
                <Card>
                    <CardHeader />
                    <CardContent>
                        <FormPro
                            prepend={formStructure}
                            submitCallback={()=>{handler_senAuth(members)}}
                            resetCallback={()=>{setShowTable(false)}}
                            formValues={formValues} setFormValues={setFormValues}
                            actionBox={showTable && <ActionBox>
                                <Button type="submit" role="primary">  ثبت نهایی</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>
                            }

                        />
                        <Box p={2} />

                        {showTable &&
                        <AccessCollapseTable columns={skillcolumns}
                            showRowNumber={false}
                            rows={members}
                            pagination={false}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                        }

                    </CardContent>

                </Card>
            </Box>

        </>
    )
}

export default Access