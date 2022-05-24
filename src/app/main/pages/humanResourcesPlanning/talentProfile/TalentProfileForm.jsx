import FormPro from "../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TabPro from 'app/main/components/TabPro';
import ActionBox from "../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import HeaderPersonnelFile from "../../personnelBaseInformation/HeaderPersonnelFile";
import BaseInformation from "./tabs/BaseInformation"
import Skills from "./tabs/Skills"
import RequestedJobPositions from "./tabs/RequestedJobPositions"
import FavoriteJobs from "./tabs/FavoriteJobs"
import UserProfile from "./UserProfile";
import WorkingHistory from "./tabs/WorkingHistory"
import InterviewAndScrutinyResults from "./tabs/InterviewAndScrutinyResults"
import EducationalProfile from "../../educationModule/BasicInformation/EducationalProfile/EducationalProfile"
import UserInfoHeader from "app/main/components/UserInfoHeader";



const TalentProfileForm = (props) => {

    const {jobApplicantId} = props

    const datas =  useSelector(({ fadak }) => fadak);

    let tabsPermision = []

    if(checkPermis("personnelManagement/talentProfile/baseInformation", datas)){
        tabsPermision.push({
            label: "اطلاعات پایه",
            panel: <BaseInformation />
        })
    }

    if(checkPermis("personnelManagement/talentProfile/skills", datas)){
        tabsPermision.push({
            label: " مهارت ها و رزومه",
            panel: <Skills />
        })
    }

    if(checkPermis("personnelManagement/talentProfile/requestedJobPositions", datas)){
        tabsPermision.push({
            label: "موقعیت های شغلی درخواستی",
            panel: <RequestedJobPositions />
        })
    }

    // if(checkPermis("personnelManagement/talentProfile/favoriteJobs", datas)){
    //     tabsPermision.push({
    //         label: "شغل های مورد علاقه",
    //         panel: <FavoriteJobs />
    //     })
    // }

    if(checkPermis("personnelManagement/talentProfile/interviewAndScrutinyResults", datas)){
        tabsPermision.push({
            label: "نتیجه بررسی ها و مصاحبه های داوطلب",
            panel: <InterviewAndScrutinyResults jobApplicantId={jobApplicantId}/>
        })
    }

    if(checkPermis("personnelManagement/talentProfile/workingHistory", datas)){
        tabsPermision.push({
            label: "تاریخچه ارتباط کاری با سازمان",
            panel: <WorkingHistory />
        })
    }

    if(checkPermis("personnelManagement/talentProfile/EducationalProfile", datas)){
        tabsPermision.push({
            label: "شناسنامه آموزشی",
            panel: <EducationalProfile />
        })
    }

    return ( 
        <div>
            {/* <UserProfile/> */}
            <UserInfoHeader headerTitle={" پروفایل استعدادها"}/>
            <TabPro tabs={tabsPermision}/>
        </div>
    );
};

export default TalentProfileForm;
