import React, {useState} from "react";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import UserCompany from "../../../components/formControls/UserCompany";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {useDispatch} from "react-redux";
import Box from "@material-ui/core/Box";
import EmplOrderContractPrint from "../contractsPrint/EmplOrderContractPrint";
import ModalPro from "../../../components/ModalPro";
import EmplOrderPrint from "../ordersPrint/EmplOrderPrint";

const formDefaultValues = {
    typeEnumId: 'EostEmplOrderPrint',
}

export default function EOSForm({actionObject, setActionObject, tableContent, setTableContent, userCompany, setUserCompany, printSettings}){
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [formValues, setFormValues] = useState(formDefaultValues);
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [{
        type    : "component",
        component: <UserCompany setValue={setUserCompany}/>
    },{
        name    : "title",
        label   : "عنوان نسخه",
        type    : "text",
        required: true
    },{
        name    : "emplPositionId",
        label   : "نسخه مربوط به",
        type    : "select",
        options : "EmplPosition",
        optionIdField   : "emplPositionId",
        appendOptions   : [{emplPositionId: "employee", description: "کارمند"}],
        filterOptions   : options => options.filter(o=>(!o.thruDate && o.statusId==="EmpsActive")||o.emplPositionId==="employee"),
    },{
        name    : "printSettingId",
        label   : "نوع نسخه",
        type    : "select",
        options : printSettings,
        optionIdField   : "settingId",
        optionLabelField: "title",
    }]
    function handleSubmit() {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(actionObject){
            handlePut()
        }else{
            handlePost()
        }
    }
    function handleReset() {
        setActionObject(null)
    }
    function handlePost(){
        const packet = {...formValues, companyPartyId: userCompany.userCompanyId}
        axios.post(SERVER_URL + "/rest/s1/fadak/entity/EmplOrderSetting", {data : packet},{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const settingId = res.data.settingId.settingId
            const newData = Object.assign({},formValues,{settingId})
            setTableContent(tableContent.concat(newData))
            setFormValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handlePut(){
        axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplOrderSetting", {data : formValues},{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            const newData = Object.assign([],tableContent)
            const index = newData.indexOf(newData.find(i=>i.settingId===actionObject))
            newData[index] = formValues
            setTableContent(newData)
            setActionObject(null)
            setFormValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handleGet(id){
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?settingId=${id}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setFormValues(res.data.result[0])
        }).catch(err => {
            console.log('get error..', err);
        });
    }
    React.useEffect(()=>{
        if(actionObject){
            handleGet(actionObject)
        }else{
            setFormValues(formDefaultValues)
        }
    },[actionObject]);

    const showPreview = ()=>{
        if(formValues.printSettingId){
            setOpenModal(true)
        }else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'نوع نسخه را انتخاب کنید!'));
        }
    }
    return(
        <React.Fragment>
            <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                     formValidation={formValidation} setFormValidation={setFormValidation}
                     submitCallback={handleSubmit} resetCallback={handleReset}
                     append={formStructure}
                     actionBox={<ActionBox>
                         <Button type="submit" role="primary">{actionObject? "ویرایش": "افزودن"}</Button>
                         <Button type="reset" role="secondary">لغو</Button>
                         <Button type="button" onClick={showPreview} role="tertiary">پیش نمایش</Button>
                     </ActionBox>}
            />
            <ModalPro
                title={`پیش نمایش ${formValues.title||"ساختار حکم کارگزینی"}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <EmplOrderPrint type={formValues.printSettingId} data={{
                            emplOrderData: {
                                title: "حکم کارگزینی",
                                printSettingId: formValues.printSettingId,
                                printSettingTitle: printSettings.find(i=>i.settingId===formValues.printSettingId)?.title || null
                            },
                            verificationList: [],
                            factorsList: [],
                            companyPartyId: userCompany.userCompanyId
                        }}/>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
