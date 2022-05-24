import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormInput from "../../../../../components/formControls/FormInput";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import DisplayField from "../../../../../components/DisplayField";
import {Typography} from "@material-ui/core";


function Signature({data,setSignData}) {

    console.log('setSignData',data)
    const [sign, setSign] = React.useState('')
    let moment = require('moment-jalaali')
    const date = data.verificationDate ? moment(data.verificationDate).format('jYYYY/jM/jD') : "-"
    React.useEffect(()=>{
        if(data.partyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PartyContent?partyId=${data.partyId}&partyContentTypeEnumId=signatureImage`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                console.log("partyContentId",res)
                setSign(res.data.result[0].contentLocation)
                setSignData(res.data.result[0].partyContentId)
            
           
            }).catch(() => {
            });
        }
    },[data.partyId])

    return(
        <Grid item xs={4} style={{textAlign:"center"}}>
            <img src={sign ? (SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + sign) : ''} alt="Signature" style={{maxHeight:'3cm',maxWidth:'4cm'}}/>
            {console.log(sign)}
            <div>{`${data.firstName || ''} ${data.lastName || ''} ${data.suffix || ''}`}</div>
            <DisplayField value={data.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
            <div>{date}</div>
        </Grid>
    )
    
}

export default function CommentPanel({data, currentUser, formValues, setFormValues,setSignData}) {
    let moment = require('moment-jalaali')

    

console.log("data",data)

    if(currentUser)
        return(
            <Box p={2}>
                {console.log('formValues',{data, currentUser, formValues, setFormValues})}
                <Grid container spacing={2}>
                    <FormInput col={12} name="comment" label="توضیحات" type="textarea" valueObject={formValues} valueHandler={setFormValues}/>
                </Grid>
                <Box m={2}/>
                <Grid container direction="row-reverse">
                    <Grid item xs={4} style={{textAlign:"center"}}>
                        <div>{`${data.firstName || ''} ${data.lastName || ''} ${data.suffix || ''}`}</div>
                        <DisplayField value={data.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
                        <div>{moment().format('jYYYY/jM/jD')}</div>
                    </Grid>
                </Grid>
            </Box>
        )
    else if(data.verificationDate)
        return(
            <Box p={2}>
                {data.comment &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DisplayField value={data.comment} variant="raw"/>
                    </Grid>
                </Grid>
                }
                <Grid container direction="row-reverse">
                    <Signature data={data} setSignData={setSignData}/>
                </Grid>
            </Box>
        )
    else return(
            <Box p={2}>
                <Typography>
                     هنوز به کارتابل&nbsp;
                     {`${data.firstName || ''} ${data.lastName || ''} ${data.suffix || ''}`}
                    ،&nbsp;
                    {<DisplayField value={data.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>}
                     ، ارسال نشده است.
                     <br />
                     {data.comment}
                </Typography>
            </Box>
        )
}
