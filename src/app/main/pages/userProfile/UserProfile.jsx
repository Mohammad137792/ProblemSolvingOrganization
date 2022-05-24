import React from "react";
import {FusePageSimple} from "../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import PersonnelProfileView from "../personnelManagement/personnelProfile/PersonnelProfileView";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useDispatch, useSelector } from "react-redux";


export default function UserProfile(props) {

    const {partyId, recruitmentProcess, pageStatus} = props

    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    
    const goBack = () => {
        recruitmentProcess("main")
    }

    return (
        <FusePageSimple
            header={<CardHeader
                 title="پروفایل پرسنلی من" 
                 action={
                    (pageStatus === "personnelProfile")  ? <Tooltip title="بازگشت"><IconButton onClick={goBack}><BackIcon/></IconButton></Tooltip> : ""
                    }
                    style={{width: "calc(100% - 15rem - 90px)"}}
                />}
            content={<PersonnelProfileView origin="userProfile" partyId={partyId}/>}
        />
    )
}
