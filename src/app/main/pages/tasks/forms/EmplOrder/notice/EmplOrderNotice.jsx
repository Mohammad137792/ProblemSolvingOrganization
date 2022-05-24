import React,{useState,useEffect} from "react";
import EONForm from "./EONForm";
import {Button} from "@material-ui/core";
import ActionBox from "../../../../../components/ActionBox";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import DisplayField from "../../../../../components/DisplayField";
import Grid from "@material-ui/core/Grid";

function Signature({data,setSignData}) {

    const [sign, setSign] = React.useState(null)
    let moment = require('moment-jalaali')
    const date = data.verificationDate ? moment(data.verificationDate).format('jYYYY/jM/jD') : "-"
    React.useEffect(()=>{
        if(data.partyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PartyContent?partyId=${data.partyId}&partyContentTypeEnumId=signatureImage`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setSignData(res.data.result[0].partyContentId)
                setSign(res.data.result[0].contentLocation)
            }).catch(() => {
            });
        }
    },[data.partyId])
    return(
        <Grid item xs={4} style={{textAlign:"center"}}>
            <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + sign)} alt="Signature" style={{maxHeight:'3cm',maxWidth:'4cm'}}/>
            <div>{`${data.firstName || ''} ${data.lastName || ''} ${data.suffix || ''}`}</div>
            <DisplayField value={data.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
            <div>{date}</div>
        </Grid>
    )
}


export default function EmplOrderNotice(props) {
    const {formVariables, submitCallback} = props;
    const emplOrderData = Object.assign({}, formVariables.person?.value)
    const [signData, setSignData] = useState(null);
    let moment = require('moment-jalaali')

    const handleSubmit = ()=>{
        const packet = {
            result: "accept",
            partyContentId :signData

        }
        submitCallback(packet)
    }


    return(
        <React.Fragment>
            <EONForm emplOrderData={emplOrderData}/>
            {emplOrderData.verificationList.map((verify,index)=>{
                return <Grid key={index} container direction="row-reverse">
                    <Grid item xs={4} style={{textAlign:"center"}}>
                        <Signature data={verify} setSignData={setSignData}/>
                        <div>{moment(verify.verificationDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jM/jD')}</div>
                    </Grid>
                </Grid>
            })}
            
            <ActionBox>
                <Button type="button" onClick={handleSubmit} role="primary">تایید</Button>
            </ActionBox>
        </React.Fragment>
    )
}
