import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import checkPermis from "app/main/components/CheckPermision";
import {useSelector , useDispatch} from "react-redux";
import { SERVER_URL } from './../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import UserCompany from "app/main/components/formControls/UserCompany";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";



const formDefaultValues = {statusId : "Y"}

const Exfilter = ({...restProps}) => {
    
    const {setLoading, setTableContent, fieldsInfo} = restProps;

    const [filterFormValues, setFilterFormValues] = useState([])

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "code",
        label: "کد عامل کاری",
        type: "text",
        col : 3
    },{
        name: "title",
        label: "عنوان عامل کاری",
        type: "text",
        col : 8
    },{
        name: "statusId",
        label: "وضعیت",
        type: "indicator",
        col : 1
    },{
        name: "uomId",
        label: "واحد عامل کاری",
        type: "select",
        options: fieldsInfo?.workingFactorUnit,
        optionLabelField :"description",
        optionIdField:"uomId",
        col : 3
    },{
        name: "typeEnumId",
        label: "نوع عامل کاری",
        type: "text",
        type: "select",
        options: fieldsInfo?.workingFactorType,
        optionLabelField :"description",
        optionIdField:"enumId",
        disabled : (!filterFormValues?.uomId || filterFormValues?.uomId == "") ? true : false ,
        filterOptions: (options) =>
        (filterFormValues?.uomId == "WFTHours") 
          ? options.filter((o) =>  o["parentEnumId"] == "WFTHours" )
          :
          options.filter(
                (o) =>  o["parentEnumId"] == "WFTNonHours" 
          ),
        col : 3
    },{
        name: "partySettingTypeId",
        label: "بخش های ضروری",
        type: "multiselect",
        options: fieldsInfo?.essentialSections,
        optionLabelField :"description",
        optionIdField:"partySettingTypeId",
        col : 3
    }]

    const search = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال دریافت اطلاعات ..."));
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/SearchWorkingFactors`, {data : {...filterFormValues , statusId : filterFormValues?.statusId == "Y" ? "WFSActive" : "WFSNotActive" }} , axiosKey).then((res)=>{
            setTableContent(res.data?.list)
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات !'));
        })
    }

    const resetSearch = () => {
        setFilterFormValues({})
        setLoading(true)
        set_waiting(false)
    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={filterFormValues}
            setFormValues={setFilterFormValues}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary"
                            disabled={waiting}
                            endIcon={waiting?<CircularProgress size={20}/>:null}
                        >جستجو</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
            submitCallback={search}
            resetCallback={resetSearch}
        />
    )
}

export default function WorkingFactorsForm() {

    const [formValues, setFormValues] = useState(formDefaultValues)
    const [formValidation, setFormValidation] = useState({});

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [waiting, set_waiting] = useState(false) 

    const [editing,setEditing] = useState(false) 

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [titleOfRelatedTo,setTitleOfRelatedTo] = useState('')

    const [assignEditValues,setaAssignEditValues] = useState(false) 

    const dispatch = useDispatch();

    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
            type    : "component",
            component: <UserCompany setValue={setFormValues}/>,
            display : false
        },{
            name: "code",
            label: "کد عامل کاری",
            type: "text",
            required : true,
            col : 3
        }, {
            name: "title",
            label: "عنوان عامل کاری",
            type: "text",
            required : true,
            col : 8
        }, {
            name: "statusId",
            label: "فعال",
            type: "indicator",
            col : 1
        }, {
            name: "uomId",
            label: "واحد عامل کاری",
            type: "select",
            options: fieldsInfo?.workingFactorUnit,
            optionLabelField :"description",
            optionIdField:"uomId",
            required : true,
            col : 3
        },{
            name: "typeEnumId",
            label: "نوع عامل کاری",
            type: "select",
            options: fieldsInfo?.workingFactorType,
            optionLabelField :"description",
            optionIdField:"enumId",
            required : true,
            disabled : (!formValues?.uomId || formValues?.uomId == "") ? true : false ,
            filterOptions: (options) =>
            (formValues?.uomId == "WFTHours") 
              ? options.filter((o) =>  o["parentEnumId"] == "WFTHours" )
              :
              options.filter(
                    (o) =>  o["parentEnumId"] == "WFTNonHours" 
              ),
            col : 3
        }, {
            name: "relatedWorkedFactorId",
            label: `${titleOfRelatedTo} مربوط به`,
            type: "select",
            required : true,
            options: fieldsInfo?.relatedTo,
            optionLabelField :"title",
            optionIdField:"workedFactorTypeId",
            display : (formValues?.typeEnumId && formValues?.typeEnumId !== "WFTMainNonShift" && formValues?.typeEnumId !== "WFTMainShift" && formValues?.typeEnumId !== "WFTMain" && formValues?.typeEnumId !=="WFTVacation" ) ? true : false ,
            disabled : (!formValues?.uomId || formValues?.uomId == "") ? true : false ,
            filterOptions: (options) => 
            formValues?.uomId === "WFTHours" && (formValues?.typeEnumId === "WFTHurryUp" || formValues?.typeEnumId === "WFTDelay") 
             ? options.filter((o) =>  o?.uomId == formValues?.uomId && (o.typeEnumId == "WFTMainShift")) 
             : options.filter((o) =>  o?.uomId == formValues?.uomId && (o.typeEnumId == "WFTMainNonShift" || o.typeEnumId == "WFTMainShift" || o.typeEnumId == "WFTMain")),
            col : 3
        }, {
            name: "partySettingTypeId",
            label: "بخش های ضروری",
            type: "multiselect",
            options: fieldsInfo?.essentialSections,
            optionLabelField :"description",
            optionIdField:"partySettingTypeId",
            col : 3
        },{
            name: "description",
            label: " توضیحات ",
            type: "textarea",
            col: 12
        }
    ]

    React.useEffect(()=>{
        if(loading){
            getData()
        }
    },[loading])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactorsFieldsData`, axiosKey).then((type)=>{
            setFieldsInfo(type.data?.listsData)
            axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactors`, axiosKey).then((table)=>{
                setTableContent(table.data?.list)
                setLoading(false)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            })
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    React.useEffect(()=>{
        if(!assignEditValues){
            formValues.typeEnumId = ""
            formValues.relatedWorkedFactorId = ""
            setFormValues(Object.assign({},formValues))
        }
        setaAssignEditValues(false)
    },[formValues?.uomId])

    React.useEffect(()=>{
        if(formValues?.code && formValues?.code != ""){
            formValues.code = formValues?.code.replace(/[^A-Za-z0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.code])

    React.useEffect(()=>{
        if(formValues?.typeEnumId && formValues?.typeEnumId != ""){
            const ind = fieldsInfo?.workingFactorType.findIndex(o=>o.enumId == formValues?.typeEnumId)
            setTitleOfRelatedTo(fieldsInfo?.workingFactorType[ind]?.description)
        }
    },[formValues?.typeEnumId])

    const handleSubmit = () => { 
        let codeExist = tableContent.find(x=>x.code == formValues.code)

        if(codeExist){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'کد وارد شده تکراری است.'));
        }
        else{
            set_waiting(true)
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            axios.post(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactors`, {data : {...formValues , statusId : formValues?.statusId == "Y" ? "WFSActive" : "WFSNotActive" }} , axiosKey).then((res)=>{
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                setLoading(true)
                handleReset()
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                set_waiting(false)
            })
        }
    }

    const handleReset = () => {
        setEditing(false)
        set_waiting(false)
        setFormValues(formDefaultValues)
     }

    /* ##############################################         table          ################################################### */

    const tableCols = [{
            name: "code",
            label: "کد عامل کاری",
            type: "text",
            col : 3
        },{
            name: "title",
            label: "عنوان عامل کاری",
            type: "text",
            col : 8
        },{
            name: "statusId",
            label: "وضعیت",
            type: "indicator",
            col : 1
        },{
            name: "uomId",
            label: "واحد عامل کاری",
            type: "select",
            options: fieldsInfo?.workingFactorUnit,
            optionLabelField :"description",
            optionIdField:"uomId",
            col : 3
        },{
            name: "typeEnumId",
            label: "نوع عامل کاری",
            type: "text",
            type: "select",
            options: fieldsInfo?.workingFactorType,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : (!formValues?.uomId || formValues?.uomId == "") ? true : false ,
            filterOptions: (options) =>
            (formValues?.uomId == "WFTHours") 
              ? options.filter((o) =>  o["parentEnumId"] == "WFTHours" )
              :
              options.filter(
                    (o) =>  o["parentEnumId"] == "WFTNonHours" 
              ),
            col : 3
        },{
            name: "essentialSections",
            label: "بخش های ضروری",
            type: "text",
            col : 3
        }]

    const handleEdit = (rowData) => { 
        setFormValues(rowData)
        setEditing(true)
        setaAssignEditValues(true)
    }

    const handlePutRequest = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactors`, {data : {...formValues , statusId : formValues?.statusId == "Y" ? "WFSActive" : "WFSNotActive"} } , axiosKey).then((res)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'))
            setLoading(true)
            handleReset()
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        })
    }

    const handlerRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactors?workedFactorTypeId=${oldData.workedFactorTypeId}`, axiosKey).then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
     }

    return (
        <FusePageSimple
            header={< > </>}
            content={
                <Box p={2}>

                    <Card>
                        <CardHeader title={"تعریف عامل کاری"} />
                        <CardContent>
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                formValidation={formValidation} setFormValidation={setFormValidation}
                                actionBox={
                                    checkPermis("functionalManagement/defineWorkingFactors/addWorkingFactors", datas) ? 
                                        <ActionBox>
                                            <Button type="submit" role="primary"
                                                    disabled={waiting}
                                                    endIcon={waiting?<CircularProgress size={20}/>:null}
                                                >{editing ? "ویرایش" : "افزودن"}</Button>
                                            <Button type="reset" role="secondary">لغو</Button>
                                        </ActionBox>
                                :""}
                                submitCallback={editing ? handlePutRequest : handleSubmit}
                                resetCallback={handleReset}
                            />
                        </CardContent>
                    </Card>
                    <Box m={2} />
                    <Card>
                        <CardContent>
                            <TablePro
                                exportCsv="خروجی اکسل"
                                title="لیست عوامل کاری"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                editCondition={(row) =>
                                    (row?.companyPartyId && row?.companyPartyId != "") && checkPermis("functionalManagement/defineWorkingFactors/editWorkingFactors", datas) 
                                }
                                edit="callback"
                                editCallback={handleEdit}
                                filter="external"
                                filterForm={<Exfilter setLoading={setLoading} setTableContent={setTableContent} fieldsInfo={fieldsInfo} />}
                                removeCondition={(row) =>
                                    (row?.companyPartyId && row?.companyPartyId != "") && checkPermis("functionalManagement/defineWorkingFactors/deleteWorkingFactors", datas)
                                }
                                removeCallback={handlerRemove}
                            />
                        </CardContent>
                    </Card>
                </Box>
            }
        />
    )
}