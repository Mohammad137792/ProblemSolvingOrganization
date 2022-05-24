import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import Box from "@material-ui/core/Box";
import {Button, CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import FormInput from "./formControls/FormInput";
import {useSelector} from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { FusePageSimple } from '@fuse';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';



function UserInfoHeader(props){
    const myScrollElement = createRef();
    const useStyles = makeStyles((theme) => ({
        photo: {
            width: "15rem",
            height: "15rem",
            border: "8px solid rgb(58 64 79)",
            borderRadius: "0 42px",
            float: "right",
            marginTop: "-64px",
            marginRight: "32px"
        },
    }));
    const{ headerTitle}=props
    const [personInfo, setPersonInfo] = useState({ EmplPositionMainName: "", idValue: "", name: "", partyRelationId: "", pseudoId: "" });
    const partyIdUser = useSelector(({ auth }) => auth.user.data.partyId)?.toString();
    const sendProfile = useSelector(({ fadak }) => fadak.workEffort);
    const [partyPerson13, setpartyPerson13] = useState(false);
    const classes = useStyles();
    const profileValues = {
        fullName: sendProfile?.fullName !== undefined ? sendProfile?.fullName : personInfo[0]?.name,
        pseudoId: sendProfile?.pseudoId !== undefined ? sendProfile?.pseudoId : personInfo[0]?.pseudoId,
        emplPositionId: personInfo[0]?.empPositionName,
        nationalId: sendProfile?.nationalId !== undefined ? sendProfile?.nationalId : personInfo[0]?.idValue,
    }
    const formStructure = [{
        name    : "fullName",
        label   : "نام و نام خانوادگی",
    },{
        name    : "pseudoId",
        label   : "شماره پرسنلی",
    },{
        name    : "emplPositionId",
        label   : "پست سازمانی",
    },{
        name    : "nationalId",
        label   : "کد ملی",
    }]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
const history=useHistory();

    useEffect(() => {
        let data = {
            partyId: sendProfile?.partyId ? sendProfile?.partyId?.toString() : "",
            toPartyId: sendProfile?.ownerPartyId ? sendProfile?.ownerPartyId.toString() : "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonInfo(res.data.result)
        }).catch(err => {});
    }, []);

    const partyId=sendProfile?.partyId ? sendProfile?.partyId?.toString():partyIdUser

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfoHeader?partyId=" +  partyId, axiosKey).then(response => {
            if (typeof response.data.IdentificationList != 'undefined') {
                response.data.IdentificationList.map((identification1, index) => {
                    if (identification1.partyIdTypeEnumId === "Nationalcode") {
                    }
                })
            }
            if (typeof response.data.partyuserInfolist != "undefined") {
                response.data.partyuserInfolist.map((identification1, index) => {
                    if (identification1.partyContentTypeEnumId === "PcntFaceImage") {

                        setpartyPerson13(identification1)
                    } else {

                    }
                })
            } else if (typeof response.data.partyuserInfolist == "undefined") {
                axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" +  partyId, axiosKey).then(response2 => {

                    response2.data.partyuserInfolist.map((identification12, index) => {
                        if ((identification12.partyContentTypeEnumId === "PcntFaceImage"
                            || identification12.partyContentTypeEnumId === "signatureImage")
                            || typeof identification12.partyContentTypeEnumId == "undefined") {
                            identification12.partyContentTypeEnumId = null;

                        }
                    })

                })
            }

        }).catch(error => {});
    }, []);

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={

                < div style={{ width: "97%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10">{headerTitle}</Typography>
                    {Object.keys(sendProfile).length>0?<Button variant="contained" style={{ background: "white", color: "black", height: "50px",marginLeft:"10%" }} className="ml-10  mt-5" onClick={() => { history.goBack() }}
                        startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>:""}

                </ div>
            }
            content={
                <Box>
                    {(partyPerson13.length !== 0 && partyPerson13.partyContentTypeEnumId !== undefined) ? (
                        <Avatar src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + partyPerson13.contentLocation)} className={classes.photo} id={"imagePreview-" + "contentLocation"}/>
                    ):(
                        <Avatar className={classes.photo}/>
                    )}
                    <Box p={4} className="card-display">
                        <Grid container spacing={2} style={{width: "auto"}}>
                            {formStructure.map((input, index) => (
                                <Grid key={index} item xs={input.col || 6}>
                                    <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Divider/>
                </Box>
                
            }
        />
        
    )
}

export default UserInfoHeader;