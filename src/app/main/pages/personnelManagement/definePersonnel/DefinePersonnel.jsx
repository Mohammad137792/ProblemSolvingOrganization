import React from 'react';
import {FusePageSimple} from "@fuse";
import { Card, CardContent, CardHeader } from '@material-ui/core';
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import DefinePersonnelForm from "./DefinePersonnelForm";
import {ALERT_TYPES, setAlertContent, setUser, setUserId} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from 'react-router-dom';
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";

const DefinePersonnel = (props) => {

    const {recruitmentProcess = false , recruitmentProcessPageStatus , candidates} = props

    const dispatch = useDispatch();
    const history = useHistory();
    const [data, setData] = React.useState(false);
    const location = useLocation();

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            setData(prevState => ({
                ...prevState,
                organizations: res.data.organization,
                ownerPartyId: res.data.organization[0].partyId,
            }))
        }).catch(err => {
            console.log('get org error..', err);
        });
        if(recruitmentProcess && candidates ) {

        }
    },[]);

    const submitCallback = (formValues)=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات..."));
        axios.post(SERVER_URL + "/rest/s1/fadak/party",formValues, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }).then(res => {
            if(res.data.responseCode===0){
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'پرسنلی با کد ملی وارد شده در سازمان در حال فعالیت است.'));
            }else {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ثبت نام با موفقیت انجام شد.'));
                dispatch(setUser(res.data.partyId))
                dispatch(setUserId(res.data.username, res.data.userId, res.data.partyRelationshipId, res.data.disabled,true))
                // history.push(`/personnelBaseInformation`);
                history.push({
                    pathname: "/personnel/profile",
                    state: {
                        partyId: res.data.partyId,
                        partyRelationshipId: res.data.partyRelationshipId,
                        from: "register"
                    }
                });
                if(recruitmentProcess) {
                    axios.put(`${SERVER_URL}/rest/s1/humanres/acceptApplicant` , {candidates : candidates} , {          
                     headers: {
                        'api_key': localStorage.getItem('api_key')
                     }
                    }).then((table)=>{
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'وضعیت داوطلب به پذیرفته شده تغییر پیدا کرد.'));
                        handleGoBack()
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR , "خطا در ارسال اطلاعات"));
                    })
                }
            }
        }).catch(err => {
            let message = 'خطا در ثبت نام کاربر جدید! '
            let res = err.response.data.errors;
            if(res.includes("Email")){
                message += 'ایمیل وارد شده تکراری است. '
            }
            dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
            console.log('post party err..', res);
        })
    }

    const handleGoBack = () => {
        recruitmentProcessPageStatus("main")
    }

    return (
        <FusePageSimple
            header={
                <CardHeader
                    title="تعریف کاربر"
                    action={ location.state?.from ?
                    <Tooltip title="بازگشت"><IconButton onClick={history.goBack}><BackIcon/></IconButton></Tooltip>
                    : recruitmentProcess ? 
                    <Tooltip title="بازگشت"><IconButton onClick={handleGoBack}><BackIcon/></IconButton></Tooltip>
                    : ""
                    }
                    className="w-full"
                />
            }

            content={
                <Box p={2}>
                    <Card>
                        <CardHeader title=""/>
                        <CardContent>
                            <DefinePersonnelForm submitCallback={submitCallback} data={data} candidates={candidates} recruitmentProcess={recruitmentProcess} />
                        </CardContent>
                    </Card>
                </Box>
            }
        />
    );
}

export default DefinePersonnel;
