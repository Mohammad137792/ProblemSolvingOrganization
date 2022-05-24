import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";
import {SERVER_URL , AXIOS_TIMEOUT} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import TablePro from "../../../components/TablePro";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../components/ActionBox";


const DefineSuggestForm = () => {

    const [basicInformationFormValues,setBasicInformationFormValues] = useState({suggestionCreationDate : new Date ()})

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    const basicInformationStructure=[
        {
            type    : "component",
            component : <BasicInformationForm basicInformationFormValues={basicInformationFormValues} setBasicInformationFormValues={setBasicInformationFormValues} /> ,
            col     : 6
        },{
            type    : "component",
            component : <KeyWord/> ,
            col     : 6
        },{
            type    : "component",
            component : <SubmitCondition basicInformationFormValues={basicInformationFormValues} setBasicInformationFormValues={setBasicInformationFormValues}  /> ,
            col     : 12
        }
    ]

    function BasicInformationForm (props) {

        const {basicInformationFormValues,setBasicInformationFormValues} = props

        const basicInformationFormStructure=[
            {
                type    : "component",
                component : <CardHeaderComponent/> ,
                col     : 12
            },{
                name    : "suggestionCode",
                label   : "کد پیشنهاد",
                type    : "text",
                col     : 6,
                required: true,
            },{
                name    : "companyPartyId",
                label   : "شرکت",
                type    : "select",
                // options : parent,
                // optionLabelField :"workEffortName",
                // optionIdField:"workEffortId",
                col     : 6,
            },{
                label   : "تاریخ ایجاد",
                name    : "suggestionCreationDate",
                type    : "date",
                col     : 6,
                disabled: true,
            },{
                name    : "suggestionScopeEnumId",
                label   : "حوزه پیشنهاد",
                type    : "select",
                // options : parent,
                // optionLabelField :"workEffortName",
                // optionIdField:"workEffortId",
                col     : 6,
            },{
                name    : "suggestionInvitationId",
                label   : "کد فراخوان",
                type    : "text",
                col     : 6,
            },{
                name    : "performanceEnumId",
                label   : "نحوه اجرا پیشنهاد",
                type    : "select",
                // options : statusIds,
                // optionLabelField :"description",
                // optionIdField:"statusId",
                col     : 6,
            },{
                name    : "suggestionImpactEnumId",
                label   : "تاثیر حاصل پیشنهاد",
                type    : "select",
                // options : statusIds,
                // optionLabelField :"description",
                // optionIdField:"statusId",
                col     : 6,
            },{
                name    : "suggestionOriginEnumId",
                label   : "منشا پیشنهاد",
                type    : "select",
                // options : statusIds,
                // optionLabelField :"description",
                // optionIdField:"statusId",
                col     : 6,
            },{
                name    : "suggestionType",
                label   : "نوع پیشنهاد",
                type    : "select",
                // options : statusIds,
                // optionLabelField :"description",
                // optionIdField:"statusId",
                col     : 6
            },{
                name    : "rewardPerferance",
                label   : "ترجیح در نحوه دریافت پاداش",
                type    : "select",
                // options : statusIds,
                // optionLabelField :"description",
                // optionIdField:"statusId",
                col     : 6
            }
        ]

        function CardHeaderComponent () {
            return(
                <Typography variant="h6" style={{ padding: '14px 8px 0px 8px'}}>اطلاعات اولیه پیشنهاد</Typography>
            )
        }

        return(
            <FormPro
                prepend={basicInformationFormStructure}
                formValues={basicInformationFormValues}
                setFormValues={setBasicInformationFormValues}
            />
        )
    } 

    function KeyWord () {

        const [keyWordLoading,setKeyWordLoading] = useState(false);
        const [keyWordTableContent,setKeyWordTableContent] = useState([]);

        const keyWordTableCols = [
            { name: "description", label:"کلید واژه", type: "text"},
        ]

        const handleAdd = () => {

        }

        const handleEdit = () => {

        }

        const handleRemove = () => {

        }

        return(
            <TablePro
                title="کلید واژه پیشنهاد"
                columns={keyWordTableCols}
                rows={keyWordTableContent}
                setRows={setKeyWordTableContent}
                loading={keyWordLoading}
                add="inline"
                addCallback={handleAdd}
                edit="inline"
                editCallback={handleEdit}
                removeCallback={handleRemove}
            />
        )
    }

    function SubmitCondition (props) {

        const {basicInformationFormValues,setBasicInformationFormValues} = props

        const conditionStructure=[
            {
                type    : "component",
                component : <TitleComponent/> ,
                col     : 12
            },{
                type    : "component",
                component : <HandleCheckBox/> ,
                col     : 12
            }
        ]


        function TitleComponent () {
            return(
                <Typography variant="h6" style={{ padding: '14px 8px 0px 8px'}}>نحوه ارائه پیشنهاد</Typography>
            )
        }

        function HandleCheckBox (props) {

            const [handleCheckBox,setHandleCheckBox] = useState ({group : false , individual : false})

            const checkBoxStructure=[
                {
                    name    : "individual",
                    label   : "فردی",
                    type    : "check",
                    col     : 3,
                },{
                    name    : "group",
                    label   : "گروهی",
                    type    : "check",
                    col     : 3,
                },handleCheckBox?.group ? {
                    type    : "component",
                    component : <SuggestingGroup basicInformationFormValues={basicInformationFormValues} setBasicInformationFormValues={setBasicInformationFormValues} /> ,
                    col     : 12
                }:{
                    type    : "component",
                    component : <div/> ,
                    col     : 12
                }
            ]

            useEffect(() => {
                if(handleCheckBox?.individual){
                    handleCheckBox.individual = true
                    handleCheckBox.group = false
                    setHandleCheckBox(Object.assign({},handleCheckBox))
                }
            }, [handleCheckBox?.individual])

            useEffect(() => {
                if(handleCheckBox?.group ){
                    handleCheckBox.individual = false
                    handleCheckBox.group = true
                    setHandleCheckBox(Object.assign({},handleCheckBox))
                }
            }, [handleCheckBox?.group])

            return(
                <FormPro
                    prepend={checkBoxStructure}
                    formValues={handleCheckBox}
                    setFormValues={setHandleCheckBox}
                />
            )
        }

        function SuggestingGroup () {

            const [suggestingGroupTableContent,setSuggestingGroupTableContent] = useState([])
            const [suggestingGroupLoading,setSuggestingGroupLoading] = useState([])

            const suggestingGroupStructure=[
                {
                    name    : "company",
                    label   : "شرکت",
                    type    : "select",
                    // options : parent,
                    // optionLabelField :"workEffortName",
                    // optionIdField:"workEffortId",
                    col     : 3,
                    required: true,
                },{
                    name    : "PartyRelationshipID",
                    label   : "پرسنل",
                    type    : "select",
                    // options : parent,
                    // optionLabelField :"workEffortName",
                    // optionIdField:"workEffortId",
                    col     : 3,
                },{
                    label   : "واحد سازمانی",
                    name    : "unit",
                    type    : "select",
                    // options : parent,
                    // optionLabelField :"workEffortName",
                    // optionIdField:"workEffortId",
                    col     : 3,
                },{
                    name    : "emplPositionID",
                    label   : "پست سازمانی",
                    type    : "select",
                    // options : parent,
                    // optionLabelField :"workEffortName",
                    // optionIdField:"workEffortId",
                    col     : 3,
                },{
                    name    : "ParticipationRate",
                    label   : "درصد مشارکت",
                    type    : "number",
                    col     : 3,
                },{
                    name    : "RewardPreference",
                    label   : "ترجیح در نحوه دریافت پاداش",
                    type    : "select",
                    // options : statusIds,
                    // optionLabelField :"description",
                    // optionIdField:"statusId",
                    col     : 3,
                }
            ]
            
            const handleRemove = () => {

            }

            function SuggestingGroupForm (props) {

                const {formStructure,basicInformationFormValues,setBasicInformationFormValues,editing=false} = props

                const addGroup = () => {

                }

                const resetGroup = () => {

                }

                return(
                    <FormPro
                        prepend={formStructure}
                        formValues={basicInformationFormValues}
                        setFormValues={setBasicInformationFormValues}
                        submitCallback={addGroup}
                        resetCallback={resetGroup}
                        actionBox={
                            <ActionBox>
                                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                    />
                )
            }

            return(
                <TablePro
                    title="گروه پیشنهاد دهنده"
                    columns={suggestingGroupStructure}
                    rows={suggestingGroupTableContent}
                    setRows={setSuggestingGroupTableContent}
                    loading={suggestingGroupLoading}
                    add="external"
                    addForm={<SuggestingGroupForm formStructure={suggestingGroupStructure} />}
                    edit="external"
                    editForm={<SuggestingGroupForm formStructure={suggestingGroupStructure} />}
                    removeCallback={handleRemove}
                />
            )
        }

        return(
            <FormPro
                prepend={conditionStructure}
                formValues={basicInformationFormValues}
                setFormValues={setBasicInformationFormValues}
            />
        )

    }

    ////////////////////////////////////////////////////////////// 

    const discriptionStructure=[
        {
            name    : "suggestionTitle",
            label   : "عنوان پیشنهاد",
            type    : "text",
            col     : 6,
            required: true,
        },{
            name    : "relation",
            label   : "ارتباط پیشنهاد با اهداف استراتژیک شرکت",
            type    : "select",
            // options : parent,
            // optionLabelField :"workEffortName",
            // optionIdField:"workEffortId",
            col     : 6,
        },{
            type    : "component",
            component : <TextAreaPart basicInformationFormValues={basicInformationFormValues} setBasicInformationFormValues={setBasicInformationFormValues}/> ,
            col     : 6
        },{
            type    : "component",
            component : <Attachments/> ,
            col     : 6
        },            {
            name    : "SuggestedMethodAdvantages",
            label   : "مزایای روش پیشنهادی",
            type    : "textarea",
            col     : 6,
        },            {
            name    : "RequieredResources",
            label   : "امکانات و منابع مورد نیاز",
            type    : "textarea",
            col     : 6,
        },            {
            name    : "description",
            label   : "سایر توضیحات",
            type    : "textarea",
            col     : 12,
        },
    ]

    function TextAreaPart (props) {

        const {basicInformationFormValues,setBasicInformationFormValues} = props

        const textAreaStructure=[
            {
                name    : "SuggestionDescription",
                label   : "شرح پیشنهاد",
                type    : "textarea",
                col     : 12,
            },{
                name    : "companyPartyId",
                label   : "مشکلات روش فعلی",
                type    : "textarea",
                col     : 12,
            },{
                label   : "روش پیشنهادی",
                name    : "CurrentMethodProblems",
                type    : "textarea",
                col     : 12,
            },{
                type    : "group",
                items   : [{
                    name    : "estimatedExecutionCost",
                    label   : "برآورد تقریبی هزینه اجرا",
                    type    : "number",
                },{
                    type    : "text",
                    label   : "ریال",
                    disableClearable: true,
                    style:  {width:"30%"}
                }],
                col     : 6
            },{
                type    : "group",
                items   : [{
                    name    : "estimatedAnnualSaving",
                    label   : "برآورد صرفه جویی سالیانه",
                    type    : "number",
                },{
                    type    : "text",
                    label   : "ریال",
                    disableClearable: true,
                    style:  {width:"30%"}
                }],
                col     : 6
            }
        ]

        return(
            <FormPro
                prepend={textAreaStructure}
                formValues={basicInformationFormValues}
                setFormValues={setBasicInformationFormValues}
            />
        )
    }

    function Attachments () {

        const [attachmentsLoading,setAttachmentsLoading] = useState(false);
        const [attachmentsTableContent,setAttachmentsTableContent] = useState([]);

        const axiosKey = {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }

        const attachmentsTableCols = [
            {name: "observeFile", label: "دانلود فایل" , style: {width:"40%"}}
        ]

        React.useEffect(()=>{
            if (attachmentsLoading){

            }
        },[attachmentsLoading])

        const handleRemove = (data)=>{
            return new Promise((resolve, reject) => {
            })
        }

        function AttachmentsForm({...restProps}) {

            const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;

            const config = {
                timeout: AXIOS_TIMEOUT,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    api_key: localStorage.getItem('api_key')
                }
            }

            const axiosKey = {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                }
            }
            const formStructure = [{
                label:  "",
                name:   "SuggestionContentID",
                type:   "inputFile",
                col     : 12
            }]
        
            const handleCreate = (formData)=>{
                return new Promise((resolve, reject) => {
                    // const attachFile = new FormData();
                    // attachFile.append("file", formValues.contentLocation);
                    // axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                    //     .then(res => {
                    //         const postData={
                    //             welfareId : welfareId ,
                    //             contentLocation : res.data.name ,
                    //             welfareContentTypeEnumId : formValues.attachmentsType
                    //         }
                    //         axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent" , postData , axiosKey )
                    //             .then(()=>{
                    //                 setLoading(true)
                    //                 handleClose()
                    //                 resolve(formData)
                    //             })
                    //     })
                })
            }

            return(
                <FormPro
                    prepend={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={()=>{
                        handleCreate(formValues).then((data)=>{
                            successCallback(data)
                        })
                    }}
                    resetCallback={()=>{
                        setFormValues({})
                        handleClose()
                    }}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">افزودن</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                    </ActionBox>}
                />
            )
        }

        return (
            <TablePro
                title="پیوست"
                columns={attachmentsTableCols}
                rows={attachmentsTableContent}
                setRows={setAttachmentsTableContent}
                loading={attachmentsLoading}
                add="external"
                addForm={<AttachmentsForm />}
                removeCallback={handleRemove}
                fixedLayout
            />
        )
    }

    const handleSubmit = () => {

    }

    return(
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <FormPro
                            prepend={basicInformationStructure}
                        />
                    </CardContent>
                </Card>
                <Box m={2}/>
                <Card>
                    <CardContent>
                        <CardHeader title="تشریح پیشنهاد"/>
                        <FormPro
                            prepend={discriptionStructure}
                        />
                    </CardContent>
                </Card>
                <Box m={2}/>
                <ActionBox>
                    <Button type="button" onClick={()=>handleSubmit("accept")} role="primary">ثبت پیشنهاد</Button>
                    <Button type="button" onClick={()=>handleSubmit("modify")} role="secondary">ثبت موقت</Button>
                    <Button type="button" onClick={()=>handleSubmit("reject")} role="secondary">لغو</Button>
                </ActionBox>
            </CardContent>
        </Card>
    )

}
export default DefineSuggestForm;
