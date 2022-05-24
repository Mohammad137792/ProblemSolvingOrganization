import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import { FusePageSimple } from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {Divider, Grid} from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import {useSelector} from "react-redux";
import TabPro from "../../../components/TabPro";
import PayrollBaseInfo from "./tabs/PayrollBaseInfo/PayrollBaseInfo";
import InsuranceExemption from "./tabs/InsuranceExemption";
import SearchPersonnel from "./tabs/SearchPersonnel";
import PaySlips from "./tabs/PaySlips";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    photo: {
        // position: "absolute",
        // top: "0",
        // right: "32px",
        width: "15rem",
        height: "15rem",
        border: "8px solid rgb(58 64 79)",
        borderRadius: "0 42px",
        float: "right",
        marginTop: "-64px",
        marginRight: "32px"
    },
}));

export default function CompensationProfile(props) {
    const myScrollElement = createRef();
    const [salaryGroup, setSalaryGroup] = useState([]);
    const [partyRelationshipId, setPartyRelationshipId] = useState('');
    const [partyId, setPartyId] = useState('');

    const tabs = [{
        label: "برنامه ها",
        panel: <PayrollBaseInfo scrollTop={scroll_to_top}/>
    },
        // {
        //     label: " پرسشنامه ها",
        //     panel: <SearchPersonnel scrollTop={scroll_to_top}/>
        // },{
        //     label: "توصیه مربیان",
        //     panel: <PaySlips scrollTop={scroll_to_top}/>

        // }
        // ,{
        //     label: "سایر مزایا و کسورات",
        //     panel: <Box/>
        // },{
        //     label: "امکانات",
        //     panel: <Facilities scrollTop={scroll_to_top}/>
        // }
    ]
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 300;
    }
    return (
        <FusePageSimple
            ref={myScrollElement}
            header={<CardHeader title={"پروفايل تعالي"} />}
            content={
                <Box>
                    <UserProfile setSalaryGroup={setSalaryGroup} setPartyRelationshipId={setPartyRelationshipId} setPartyId={setPartyId}/>
                    <TabPro tabs={tabs} />
                </Box>
            }
        />
    )
}

function UserProfile(props) {
    const{setSalaryGroup,setPartyRelationshipId,setPartyId}=props
    const [personInfo, setPersonInfo] = useState({ EmplPositionMainName: "", idValue: "", name: "", partyRelationId: "", pseudoId: "" });
    const partyIdUser = useSelector(({ auth }) => auth.user.data.partyId)?.toString();
    const sendProfile = useSelector(({ fadak }) => fadak.workEffort);
    const [partyPerson13, setpartyPerson13] = useState(false);
    const [partyPerson1, setpartyPerson1] = useState([]);
    const [partyPerson11, setpartyPerson11] = useState(false);
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

    useEffect(() => {
        let data = {
            partyId: sendProfile?.partyId ? sendProfile?.partyId?.toString() : "",
            toPartyId: sendProfile?.ownerPartyId ? sendProfile?.ownerPartyId.toString() : "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonInfo(res.data.result)
            setPartyRelationshipId(res?.data?.result[0]?.partyRelationshipId)
            setPartyId(res?.data?.result[0]?.partyId)
            let companyPartyId=sendProfile?.ownerPartyId ? sendProfile?.ownerPartyId?.toString():res?.data?.result[0]?.companyPartyId
            axios.get(SERVER_URL + `/rest/s1/salary/salaryGroup?partyId=${companyPartyId}`, {
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(res1 => {
                setSalaryGroup(res1.data.list)
            }).catch(err => {});

        }).catch(err => {});
    }, []);

    const partyId=sendProfile?.partyId ? sendProfile?.partyId?.toString():partyIdUser

    useEffect(() => {
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
    }, []);

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
