import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TalentProfileForm from "./TalentProfileForm"
import { Paper, Tabs, Tab, Typography, CircularProgress, Button } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { showAlert, SET_USER, setUser , setUserId } from "../../../../store/actions/fadak";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";



const TalentProfile=(props)=>{

    const {volunteerProfile = false, recruitmentProcess, jobApplicantId} = props

    const history = useHistory();

    const dispatch = useDispatch();

    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);

    const handleGoBack = () => {
        dispatch(setUser(null))
        if(volunteerProfile){
          recruitmentProcess("main")
        }
        else{
          history.goBack()//push("/searchPersonnel");
        }
    }

    return (
        <React.Fragment>
          <FusePageSimple 
              // header={<CardHeader
              //   title="پروفایل استعدادها" 
              //     action={
              //       (partyIdUser !== null) ? <Tooltip title="بازگشت"><IconButton onClick={handleGoBack}><BackIcon/></IconButton></Tooltip> : ""
              //       }
              //       style={{width: "calc(100% - 15rem - 90px)"}}
              //   />
              // }
            content=
            {
                <TalentProfileForm jobApplicantId={jobApplicantId}/>

            }
            />
        </React.Fragment>
      );
}
export default TalentProfile;