import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import { FusePageSimple } from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import { useSelector } from "react-redux";
import TabPro from "../../../components/TabPro";
import PayrollBaseInfo from "./tabs/PayrollBaseInfo";
import InsuranceExemption from "./tabs/InsuranceExemption";
import Facilities from "./tabs/Facilities";
import PaySlips from "./tabs/PaySlips";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ReserveFoodReport from "./tabs/ReserveFoodReport"
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import Loan from './tabs/Loan'
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
    const sendProfile = useSelector(({ fadak }) => fadak.workEffort);
    const tabs = [{
        label: "اطلاعات پایه حقوق و دستمزد",
        panel: <PayrollBaseInfo salaryGroup={salaryGroup} partyRelationshipId={partyRelationshipId} partyId={partyId} />
    },
    {
        label: "گزارش رزرو غذا",
        panel: <ReserveFoodReport partyRelationshipId={partyRelationshipId} sendProfile={sendProfile}/>
    },
    {
        label: "تسهیل مالی",
        panel: <Loan />
    },
        // {
        //     label: "معافیت های بیمه و مالیات",
        //     panel: <InsuranceExemption scrollTop={scroll_to_top}/>
        // },{
        //     label: "فیش های حقوقی",
        //     panel: <PaySlips/>
        // },{
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
    const history = useHistory();

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={

                < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10"> پروفایل جبران خدمت</Typography>
                    {Object.keys(sendProfile).length>0?<Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={() => { history.goBack() }}
                        startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>:""}

                </ div>
            }
            content={
                <Box>
                    <UserProfile setSalaryGroup={setSalaryGroup} setPartyRelationshipId={setPartyRelationshipId} setPartyId={setPartyId} sendProfile={sendProfile} />
                    <TabPro tabs={tabs} />
                </Box>
            }
        />
    )
}

function UserProfile(props) {
    const { setSalaryGroup, setPartyRelationshipId, setPartyId,sendProfile } = props
    const [personInfo, setPersonInfo] = useState({ EmplPositionMainName: "", idValue: "", name: "", partyRelationId: "", pseudoId: "" });
    const partyIdUser = useSelector(({ auth }) => auth.user.data.partyId)?.toString();
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
        name: "fullName",
        label: "نام و نام خانوادگی",
    }, {
        name: "pseudoId",
        label: "شماره پرسنلی",
    }, {
        name: "emplPositionId",
        label: "پست سازمانی",
    }, {
        name: "nationalId",
        label: "کد ملی",
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
            let companyPartyId = sendProfile?.ownerPartyId ? sendProfile?.ownerPartyId?.toString() : res?.data?.result[0]?.companyPartyId
            axios.get(SERVER_URL + `/rest/s1/salary/salaryGroup?partyId=${companyPartyId}`, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res1 => {
                setSalaryGroup(res1.data.list)
            }).catch(err => { });

        }).catch(err => { });
    }, []);

    const partyId = sendProfile?.partyId ? sendProfile?.partyId?.toString() : partyIdUser

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfoHeader?partyId=" + partyId, axiosKey).then(response => {
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
                axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" + partyId, axiosKey).then(response2 => {

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

        }).catch(error => { });
    }, []);

    return (
        <Box>
            {(partyPerson13.length !== 0 && partyPerson13.partyContentTypeEnumId !== undefined) ? (
               <Box style={{marginLeft:Object.keys(sendProfile).length>0?100:0}}> <Avatar src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + partyPerson13.contentLocation)} className={classes.photo} id={"imagePreview-" + "contentLocation"} /></Box>
            ) : (
                <Box style={{marginLeft:Object.keys(sendProfile).length>0?100:0}}> <Avatar className={classes.photo} /></Box>
            )}
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{ width: "auto" }}>
                    {formStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Divider />
        </Box>
    )
}
