import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import TabPro from "../../../../components/TabPro";
import EvaluatorDeterminationForm from "../evaluatorDetermination/EvaluatorDeterminationForm"
import CommentPanel from "../../../tasks/forms/EmplOrder/checking/EOCommentPanel"
import DisplayField from "../../../../components/DisplayField";

const CorrectEvaluatorForm = () => {

    const [signData, setSignData] = useState(null);
    const [formValues, setFormValues] = useState([]);

    const verificationList = [{
        title : "مدیر واحد سازمانی",
        verificationDate : new Date (),
        // partyId : partyId,
        emplPositionId : 100982,
        firstName : "محمدصادق" ,
        lastName : "خلفی" ,
        comment : "نظرات قبلی"
    },{
        title : "مدیر منابع انسانی",
        // verificationDate : new Date (),
        // partyId : partyId,
        emplPositionId : 100982,
        firstName : "محمدصادق" ,
        lastName : "خلفی" ,
        // comment : "نظرات قبلی"
    },{
        title : "مدیر عامل",
        verificationDate : new Date (),
        // partyId : partyId,
        emplPositionId : 100982,
        firstName : "محمدصادق" ,
        lastName : "خلفی" ,
        comment : "نظرات قبلی"
    },{
        title : "مکاتبات",
        verificationDate : new Date (),
        // partyId : partyId,
        emplPositionId : 100982,
        firstName : "محمدصادق" ,
        lastName : "خلفی" ,
        comment : "نظرات قبلی"
    }]

    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId" optionLabelField="description"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i==1} setSignData={setSignData}/>
    }))

    const handleNextStep = () => {

    }

    return(
        <Card>
            <CardContent>
                <EvaluatorDeterminationForm showConfirmButton={false}/>
                <Box m={2}/>
                <Card>
                    <CardContent>
                        <CardHeader title="نظرات مدیران"/>
                        <TabPro orientation="vertical" tabs={tabs} initialValue={0}/>
                    </CardContent>
                </Card>
                <Box m={2}/>
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        style={{
                            width: 140 ,
                            color: "white",
                            backgroundColor: "#039be5",
                            marginRight: "8px",
                        }}
                        variant="outlined"
                        type="submit"
                        role="primary"
                        onClick={handleNextStep}
                        >
                        {" "} ارسال جهت تایید{" "}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

}
export default CorrectEvaluatorForm;
