import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import UserCompany from "../../../components/formControls/UserCompany";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {closeDialog, openDialog} from "../../../../store/actions/fuse";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";

export default function DefinePersonnelForm({data, submitCallback, candidates , recruitmentProcess = false}){
    let moment = require('moment-jalaali')
    const dispatch = useDispatch();
    const formDefaultValues = {
        fromDate: moment().format("Y-MM-DD")
    }
    const [formValues, setFormValues] = useState(formDefaultValues);
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [
        {
            type:   "component",
            component: <UserCompany/>
        },{
            name:   "fromDate",
            label:  "تاریخ استخدام",
            type:   "date",
            required: true
        },{
            name:   "nationalId",
            label:  "کد ملی",
            type:   "number",
            required: true,
            autoFocus: true,
            validator: values=>{
                const nationalId = values.nationalId.toString();
                return new Promise(resolve => {
                    if(nationalId.length !== 10){
                        resolve({error: true, helper: "کد ملی اشتباه است."})
                    }else{
                        resolve({error: false, helper: ""})
                    }
                })
            }
        },{
            name:   "pseudoId",
            label:  "کد کاربری",
            type:   "text",
            required: true,
            validator: values => {
                const pseudoId = values.pseudoId;
                return new Promise((resolve,reject) => {
                    axios.get(SERVER_URL + `/rest/s1/fadak/entity/PartyRelationship?toPartyId=${data.ownerPartyId}&relationshipTypeEnumId=PrtEmployee&pseudoId=${pseudoId}`, {
                        headers: {'api_key': localStorage.getItem('api_key')},
                    }).then(res => {
                        if(res.data.result.length>0){
                            resolve({error: true, helper: "این کد پرسنلی قبلا برای شخص دیگر مورد استفاده قرار گرفته است."})
                        }
                        resolve({error: false, helper: ""})
                    }).catch(err => {
                        console.log('get personnel id error..', err);
                        reject({error: true, helper: ""})
                    })
                })
            }
        },{
            name:   "username",
            label:  "نام کاربری",
            type:   "text",
            required: true,
            validator: values => {
                const username = values.username;
                return new Promise((resolve, reject) => {
                    if( /[^a-z0-9]/i.test(username) || username.length>30 || username.length<6 ){
                        resolve({error: true, helper: "نام کاربری باید بین 6 تا 30 کاراکتر و فقط شامل اعداد و حروف لاتین باشد!"})
                    }
                    axios.get(SERVER_URL + `/rest/s1/fadak/entity/UserAccount?username=${username}`, {
                        headers: {'api_key': localStorage.getItem('api_key')},
                    }).then(res => {
                        if(res.data.result.length>0){
                            resolve({error: true, helper: "این نام کاربری تکراری است."})
                        }
                        resolve({error: false, helper: ""})
                    }).catch(err => {
                        console.log('get username error..', err);
                        reject({error: true, helper: ""})
                    })
                })
            }
        },{
            name:   "password",
            label:  "رمز عبور",
            type:   "password",
            required: true,
            autoComplete: "new-password",
            validator: values => {
                const rule = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s)(?=.{8,})";//"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"; //.{8,15}$
                const password = values.password;
                const message = "رمز عبور باید حداقل 8 کاراکتر و شامل حروف کوچک و بزرگ لاتین، اعداد و علائم ویژه باشد!";
                return new Promise(resolve => {
                    if(password.match(rule)){
                        resolve({error: false, helper: ""})
                    }else{
                        resolve({error: true, helper: message})
                    }
                })
            }
        },{
            name:   "passwordVerify",
            label:  "تکرار رمز عبور",
            type:   "password",
            required: true,
            validator: values => {
                const password = values.password;
                const passwordVerify = values.passwordVerify;
                const message = "تکرار رمز عبور صحیح نیست!"
                return new Promise(resolve => {
                    if(passwordVerify===password){
                        resolve({error: false, helper: ""})
                    }else{
                        resolve({error: true, helper: message})
                    }
                })
            }
        },{
            name:   "emailAddress",
            label:  "ایمیل بازیابی",
            type:   "text",
            validator: values => {
                const email = values.emailAddress;
                return new Promise(resolve => {
                    if (!email || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                        resolve({error: false, helper: ""})
                    }else{
                        resolve({error: true, helper: "آدرس ایمیل اشتباه است."})
                    }
                })
            }
        },{
            name:   "relationshipTypeEnumId",
            label:  "نوع ارتباط",
            type:   "select",
            options : "PartyRelationshipType" ,
            optionLabelField : "description" ,
            optionIdField : "enumId" ,
            filterOptions   : options => options.filter(o=>o.parentEnumId==="PrtUserTypeRelation"),
            required: true,

        }]

    function setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
            });
        });
        }

    React.useEffect(()=>{
        if(recruitmentProcess && candidates.length > 0){
            setFormValues(Object.assign({},formValues,{nationalId : candidates[0]?.nationalCode}))
        }
    },[])
    const handleSubmit = ()=>{
        dispatch(openDialog({
            children: (
                <React.Fragment>
                    <DialogTitle id="alert-dialog-title">آیا از ایجاد کاربر جدید مطمئن هستید؟</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            با تأیید شما کاربر جدید ایجاد می شود و امکان حذف آن از سیستم وجود ندارد.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> dispatch(closeDialog())} color="primary">
                            خیر
                        </Button>
                        <Button onClick={()=> {dispatch(closeDialog());submitCallback(formValues)}} color="primary" autoFocus>
                            بلی
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )
        }))
    }
    return (
        <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                 formValidation={formValidation} setFormValidation={setFormValidation}
                 submitCallback={handleSubmit}
                 append={formStructure}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">ایجاد کاربر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        />
    )
}
