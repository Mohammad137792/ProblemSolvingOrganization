import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import Box from "@material-ui/core/Box";
import {Divider, Grid} from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import {useSelector} from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


const UserProfile = (props) => {

    const{setPartyRelationshipId,setPartyId}=props

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);

    const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin

    const partyRelationshipIdUser =  useSelector(({ fadak }) => fadak.baseInformationInisial.partyRelationshipId)

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

    const [personInfo, setPersonInfo] = useState({ EmplPositionMainName: "", idValue: "", name: "", partyRelationId: "", pseudoId: "" });

    const [partyPerson13, setpartyPerson13] = useState(false);
    const [partyPerson1, setpartyPerson1] = useState([]);
    const [partyPerson11, setpartyPerson11] = useState(false);

    const classes = useStyles();

    const profileValues = {
        fullName: personInfo[0]?.name,
        pseudoId: personInfo[0]?.pseudoId,
        emplPositionId: personInfo[0]?.empPositionName,
        nationalId: personInfo[0]?.idValue,
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

    useEffect(() => {
        if(partyIdUser && partyIdUser !== null){
            let data = {
                partyId: "" ,
                partyRelationshipId : partyRelationshipIdUser ,
                toPartyId : partyIdUser
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                setPersonInfo(res.data.result)
                setPartyRelationshipId(res?.data?.result[0]?.partyRelationshipId)
                setPartyId(res?.data?.result[0]?.partyId)

            }).catch(err => {});
        }
        if((!partyIdUser || partyIdUser === null) && partyIdLogin){
            let data = {
                partyId: "" ,
                partyRelationshipId : "" ,
                toPartyId : ""
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                setPersonInfo(res.data.result)
                setPartyRelationshipId(res?.data?.result[0]?.partyRelationshipId)
                setPartyId(res?.data?.result[0]?.partyId)

            }).catch(err => {});
        }
    }, [partyIdUser,partyIdLogin]);

    useEffect(() => {
        if(partyId){
            axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfoHeader?partyId=" +  partyId, axiosKey).then(response => {
                if (typeof response.data.IdentificationList != 'undefined') {
                    response.data.IdentificationList.map((identification1, index) => {
                        if (identification1.partyIdTypeEnumId === "Nationalcode") {
                            setpartyPerson11(identification1.idValue)
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

                    setpartyPerson1(response.data.partyuserInfolist[0])

                } else if (typeof response.data.partyuserInfolist == "undefined") {
                    axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" +  partyId, axiosKey).then(response2 => {

                        response2.data.partyuserInfolist.map((identification12, index) => {
                            if ((identification12.partyContentTypeEnumId === "PcntFaceImage"
                                || identification12.partyContentTypeEnumId === "signatureImage")
                                || typeof identification12.partyContentTypeEnumId == "undefined") {
                                identification12.partyContentTypeEnumId = null;
                                setpartyPerson1(identification12);

                            }
                        })

                    })
                }

            }).catch(error => {});
        }
    }, [partyId]);

    return (
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
    )
}

export default UserProfile;