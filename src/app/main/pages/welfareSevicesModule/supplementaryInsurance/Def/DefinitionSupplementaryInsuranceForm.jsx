import React, { useState , useEffect} from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import axios from "axios";
import Attachment from "./Attachment";
import { SERVER_URL } from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent, setUser, setUserId } from "../../../../../store/actions/fadak";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from 'react-router-dom';
import { get } from 'lodash';



export default function DefinitionSupplementaryInsurance() {

    const [formValues, setFormValues] = useState([])
    const [formValues2, setFormValues2] = useState([])
    const [verifList, setVerifList] = useState([])
    const [excProgId, setExcProgId] = useState()
    const [activeExc, setActiveExc] = useState()
    const [excSuggId, setExcSuggId] = useState()
    const handleReset = () => { }
    const handleReset2 = () => { }
    const [tableContent, setTableContent] = useState([])
    const [fieldsData, setFieldsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)
    const handleEdit = () => { }
    const handlerRemove = () => { }
    const [tableContentRegistration, setTableContentRegistration] = useState([])
    const [loadingRegistration, setLoadingRegistration] = useState(true)
    const handleEditRegistration = () => { }
    const handlerRemoveRegistration = () => { }
    const dispatch = useDispatch();
    const [attachments, setAttachments] = useState([])


    // const handleSubmit = () => {
    //     axios.post(SERVER_URL + "/rest/s1/exellence/progDeff", { formValues: formValues, verif: verifList }, {
    //         headers: {
    //             'api_key': localStorage.getItem('api_key')
    //         }
    //     }).then(res => {

    //     }).catch(err => {
    //     })
    // }

    const handleSubmit = () => {

    }

    const formStructure = [
        {
            name: "code",
            label: "????",
            type: "text",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            required:true,

        },
        {
            name: "title",
            label: "??????????*",
            type: "text",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            required:true,

        },        {
            name: "creatDate",
            label: "?????????? ??????????",
            type: "date",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "status",
            label: "??????????",
            type: "select",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "fromdate",
            label: "???? ??????????",
            type: "date",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "thrudate",
            label: "???? ??????????",
            type: "date",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "insuranceOrganization",
            label: "???????? ???????? ????",
            type: "text",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "formula",
            label: "?????????? ???????????? ???? ????????",
            type: "select",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "paymentType",
            label: "???????? ???????????? ??????????",
            type: "select",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "payslipType",
            label: "?????? ?????? ??????",
            type: "select",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            required:true,

        },        {
            name: "poarticipant",
            label: "?????????? ?????? ????????",
            type: "multiselect",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        
        {
            name: "percent",
            label: "?????? ???????? ???? (????????)",
            type: "number",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "number",
            label: "?????????? ?????? ?????? ???????? ???????? ????????????",
            type: "number",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "month",
            label: "?????????? ???????????? ?????? ????????(??????)",

            type: "number",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "compensatoryCosts",
            label: "?????????? ?????? ????????????",
            type: "multiselect",
            col: 6,

            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },        {
            name: "description",
            type: "textarea",
            label: "??????????????",
            col: 12,

            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        },
        {
            type: "component",
            component: (
              <Attachment
                attachments={attachments}
                setAttachments={setAttachments}
                // partyContentType={formValues?.partyContentType}
              />
            ),
            col: 12,
          },
        
    ]

    const tableCols = [
        {
            name: "code",
            label: "????",
            type: "text"
        },
        {
            name: "title",
            label: "??????????*",
            type: "text",
        },
        {
            name: "creatDate",
            label: "?????????? ??????????",
            type: "date"
        },
        {
            name: "status",
            label: "??????????",
            type: "select"
        },
        {
            name: "",
            label: "???????? ???????? ????",
            type: "text",
            // options: ,
            // optionLabelField: "",
            // optionIdField: "",
            // required:true,

        }, 


    ]


    // React.useEffect(() => {
    //     // axios.get(SERVER_URL + "/rest/s1/exellence/progDef", {
    //     //     headers: {
    //     //         'api_key': localStorage.getItem('api_key')
    //     //     },
    //     // }).then(res => {
    //     //     console.log("res", res)
    //     //     console.log("res.data.excellenceProgramDefinition", res.data.excellenceProgramDefinition)
    //     //     console.log("res.data", res.data)
    //     //     setFieldsData(res.data)
    //     //     setTableContent(res.data.excellenceProgramDefinition)
    //     //     setLoadingRegistration(false)
            
    //     //     getVerifList()

    //     // }).catch(err => {
    //     //     console.log('get org error..', err);
    //     // });
    // }, []);




    return (
        <FusePageSimple
        header={<Box>
            <CardHeader title={'?????????? ?????????????? ???????? ????????????'} />
        </Box>}
                    content={
                <Box p={2}>
                    <Card>
                        <CardContent>
                            {console.log("fieldsData :: ", fieldsData)}
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                actionBox=
                                {                                    <ActionBox>
                                    <Button type="submit" onClick={handleSubmit} role="primary">????????????</Button>
                                    <Button type="reset" role="secondary">??????</Button>
                                </ActionBox>}
                            />


                                    <TablePro

                                        title="???????????? ????"
                                        columns={tableCols}
                                        rows={tableContent}
                                        setRows={setTableContent}
                                        loading={loadingRegistration}
                                        edit="callback"
                                        editCallback={handleEdit}
                                        delete="inline"
                                        removeCallback={handlerRemove}

                                    />
                                </CardContent>

                            </Card>
                    <Box m={2} />
                </Box>
            }
        />
    )
}