import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SERVER_URL } from './../../../../../../../../../configs'
import TableProinline from 'app/main/components/TableProInline';
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import { useSelector } from 'react-redux'
import { Button, Card, CardContent } from '@material-ui/core';



function InstitutionsForm({ dataFilter, handler_search }) {

    const [formValues, setFormValues] = useState();


    const formStructure = [
        { name: "enumId", label: 'نوع ارزیابی', type: 'select', options: dataFilter?.enumList, },
        { name: "Assessment", label: 'عنوان فرم ارزیابی', type: 'select', options: dataFilter?.Assessment, optionLabelField: "title", optionIdField: "assessmentId", filterOptions: options => formValues?.["enumId"] ? options.filter(o => o["type"] === formValues["enumId"]) : options },
    ]


    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues} setFormValues={setFormValues}
            submitCallback={() => handler_search(formValues)}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">نمایش</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
        >
        </FormPro>
    )
}


function AssessmentTab({ orgPartyId, ptyRel, access, currentData }) {

    const [tableContent, setTableContent] = useState()
    const [dataFilter, setDataFilter] = useState()
    const [formValues, setFormValues] = useState();
    const qualificationStatusId = useSelector(state => state.fadak.constData.list.instituteQualification)


    var tableCol = [
        { name: "title", label: "معیار ارزیابی", type: "text", },
        { name: "subTitle", label: "زیر معیار ارزیابی", type: "text" },
        { name: "score", label: "نمره", type: "select", options: [], bool: 'true', optionIdField: "description" },
        {
            name: "description", label: "توضیحات", type: "text", bool: 'true'
        }
    ]
    const [tableCols, setTableCols] = useState(tableCol)

    console.log("aivavsdavsd", currentData)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    useEffect(() => {
        let institute = currentData?.resultRest4Pty?.institute
        if (institute) {
            setFormValues(Object.assign({}, {...institute}))
        }
    }, [currentData])


    useEffect(() => {
        axios.get(`${SERVER_URL}/rest/s1/training/getAssessmentEnums`, axiosKey).then(res => {
            console.log("advkadaadbab",)
            setDataFilter(res.data)
        })

    }, [])

    function list_to_tree(list, listEnums, QualificationAssessments) {
        var map = {}, node, neList = [], i;
        for (i = 0; i < list.length; i++) {
            map[list[i].assessmentCriterionId] = i; // initialize the map
            list[i].id = i;
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node?.parentId) {
                neList = [...neList, { ...list[map[node.parentId]], subTitle: node.title, subAsseCrd: node.assessmentCriterionId, subParent: node.parentId, s: [] }]
            } else if (!node?.parentId) {
                neList = [...neList, node]
            }
        }
        let enums = []
        enums = neList.map(item => {


            if (listEnums[item.criterionEnumRateId]) {

                return {
                    ...item, s: listEnums[item.criterionEnumRateId]
                }
            }



        })
        enums = enums.map(item => {
            let val = QualificationAssessments?.[item?.subParent ? item?.subAsseCrd : item?.assessmentCriterionId]

            console.log("davavada", val)
            if (val) {
                return {
                    ...item, score: val[0].score, description: val[0].description,
                }
            } else {
                return item
            }
        })
        return enums;
    }


    const handler_search = (data) => {
        const ptyRel = currentData?.resultRest4Pty?.RellPty?.partyRelationshipId

        let axiosKey = {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }
        axios.get(`${SERVER_URL}/rest/s1/training/getAssessmentNode?assessmentId=${data?.Assessment}&partyRelationshipId=${ptyRel}`, axiosKey).then(response => {
            let list = response.data.assessmentsList
            const Data = list_to_tree(list, response.data.enumsList, response.data.QualificationAssessments)

            console.log("dkavajnvadvav", Data)
            setTableContent(Data)
        })


    }
    const formStructure = [
        { name: "score", label: 'نمره نهایی', type: 'text', options: [] },
        { name: "qualificationStatusId", label: 'بررسی وضعیت صلاحیت', type: 'select', options: qualificationStatusId, optionLabelField: "description", optionIdField: "statusId" },
    ]


    const handlerSubmit = () => {

        const datas = {
            "qualificationAssessment": tableContent ?? [],
            "data": { toPartyId: orgPartyId, ...formValues }
        }
        const config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/training/score`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            data: datas
        };
        return axios(config).then(response => {
        }).catch(err => { })

    }



    return (
        <>
            <Card>
                <CardContent>
                    {/* <TableProinline
                        title='معیارهای ارزیابی'
                        columns={tableCols}
                        setRows={setTableContent}
                        rows={tableContent}
                        filter="external"
                        filterForm={
                            <InstitutionsForm dataFilter={dataFilter} handler_search={handler_search} />
                        }
                    />
                    <FormPro
                        prepend={formStructure}
                        formValues={formValues} setFormValues={setFormValues}
                        submitCallback={handlerSubmit}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary"> تایید نهایی</Button>
                            <Button type="reset" role="secondary">بازگشت</Button>
                        </ActionBox>}

                    /> */}
                </CardContent>
            </Card>
        </>
    )
}

export default AssessmentTab;