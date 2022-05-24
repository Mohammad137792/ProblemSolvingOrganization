import React from 'react';
import {Card, CardContent, Grid, TextField, MenuItem, Button} from "@material-ui/core";
import {Add, Delete, DeleteOutlined, Edit} from "@material-ui/icons"
import CTable from "../../../components/CTable";
import axios from "axios";
import {setFormDataHelper} from "../../../helpers/setFormDataHelper";
import {submitPost} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";

import {SERVER_URL} from "../../../../../configs";

const ContactInformation = ({formValues, addFormValue}) => {
    const addFormData = setFormDataHelper(addFormValue)

    const [parties, setParties] = React.useState([]);
    const [getdatadelete, setgetdatadelete] = React.useState([]);
    const [getdatadelete1, setgetdatadelete1] = React.useState([]);
    const [partieselectronic, setPartieselectronic] = React.useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [tableContent1, setTableContent1] = React.useState([]);
    const dispatch = useDispatch();

    const deleteRow = (id) => {
        axios.delete(SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber?contactMechId=" + id, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }, getdatadelete
        })
            .then(res => {
                axios.delete(SERVER_URL + "/rest/s1/mantle/parties/EX_JOHN_DOE/contactMechs/" + id, {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    }, getdatadelete1
                }).then(res => {
                    setTableContent(preFormData => preFormData.filter(member => {
                        // console.log(`member: ${member.id} and id: ${id}`);
                        console.log(res.data)
                        return member.id !== id
                    }))
                })
            })
    }

    const addRow1 = () => {

        dispatch(submitPost("/rest/s1/mantle/parties/contactMechs/telecomNumbers",
            {
                formValues,
                contactMechPurposeId: formValues.contactMechPurposeId,
                contactNumber: formValues.contactNumber,
                areaCode: formValues.areaCode,
                description:formValues.contactMechPurposeId

            }, "add")).then(res =>{

                    const row = {
                        id: res.data.contactMechId,
                        contactInformationType: formValues.contactMechPurposeId,
                        contactNumber: formValues.areaCode + "-" + formValues.contactNumber,
                        modify: <Button variant="outlined" color="secondary"
                                        onClick={() => deleteRow(res.data.contactMechId)}><DeleteOutlined/></Button>,
                        // modify1: <Button  onClick={() => updateRow(res.data.contactMechId)} value={"ویرایش"}>ویرایش</Button>
                    }
                    setTableContent(rows1 => [...rows1, row]);
                }
            )


    }
    const addRow2 = () => {

        // dispatch(submitPost("/rest/s1/mantle/parties/contactMechs/telecomNumbers",
        //     formValues, "add")).then(res =>
        //     dispatch(submitPost("/rest/s1/mantle/parties/EX_JOHN_DOE/contactMechs/postalAddresses/findOrCreate",
        //         {
        //             formValues,
        //             telecomContactMechId: res.data.contactMechId,
        //             contactMechPurposeId: formValues.contactMechPurposeId,
        //             postalContactMechPurposeIds: formValues.contactMechPurposeId,
        //             address1: formValues.address1,
        //             city: formValues.city,
        //             address2: formValues.address2,
        //             district: formValues.district,
        //             street: formValues.stream,
        //             alley: formValues.alley,
        //             plate: formValues.plate,
        //             floor: formValues.floor,
        //             unitNumber: formValues.unitNumber,
        //             postalCode: formValues.postalCode,
        //             contactNumber: formValues.contactNumber,
        //             areaCode: formValues.areaCode
        //
        //         }, "add")).then(res => {
        //             const row = {
        //                 // id: idSuggesion,
        //                 id: res.data.contactMechId,
        //                 x: formValues.contactMechPurposeId,
        //                 z: formValues.alley + "," + formValues.address1 + "," + formValues.address2,
        //                 contactNumber: formValues.areaCode + "-" + formValues.contactNumber,
        //                 // modify: <Button variant="outlined" color="secondary" onClick={() => deleteRow(idSuggesion)}><DeleteOutlined/></Button>,
        //                 // modify: <Button variant="outlined" color="secondary"
        //                 //                 onClick={() => deleteRow(res.data.contactMechId)}><DeleteOutlined/></Button>,
        //                 // modify1: <Button  onClick={() => updateRow(res.data.contactMechId)} value={"ویرایش"}>ویرایش</Button>
        //             }
        //             setTableContent(rows1 => [...rows1, row]);
        //         }
        //     )
        // );
    }

    const getRow = (data) => {
        // console.log(data)
        // for (var k in data.yekList){
        //     console.log(k)
        //     const row1 = {
        //         id: data.yekList[k].contactMechId,
        //         x: data.yekList[k].postalContactMechPurposeIds,
        //         z: data.yekList[k].alley + "," + data.yekList[k].address1 + "," + data.yekList[k].address2,
        //         contactNumber: data.yekList[k].areaCode + "-" + data.yekList[k].contactNumber,
        //         // modify: <Button variant="outlined" color="secondary"
        //         //                 onClick={() => deleteRow(data.yekList[k].contactMechId)}><DeleteOutlined/></Button>,
        //         // modify1: <Button onClick={() => updateRow(data.yekList[k].contactMechId)} value={"ویرایش"}>ویرایش</Button>
        //     }
        //     console.log(typeof data.yekList[k].areaCode )
        //     // if(data.yekList[k].areaCode !== undefined || data.yekList[k].contactMechPurposeIds != null ||  typeof data.yekList[k].contactMechPurposeIds !== undefined ){
        //     if(typeof data.yekList[k].areaCode != "undefined" ){
        //
        //         setTableContent( rows1 => [...rows1, row1]);
        //     }
        // }
    }

    React.useEffect(() => {

        axios.get(SERVER_URL + "/rest/s1/fadak/gettelecomenumber", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }, parties
        }).then(response => {
            setParties(response.data.telecomcontactList);

        }).catch(error => {
            console.log('errrrrror', error);
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/getelectronics", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }, partieselectronic
        }).then(response => {
            setPartieselectronic(response.data.electroniccontactList);

        }).catch(error => {
            console.log('errrrrror', error);
        });
    }, []);

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField select variant="outlined" id="contactMechPurposeId"
                                   name="contactMechPurposeId"
                                   label="نوع شماره تماس" onChange={addFormData()} fullWidth>
                            {parties.map(function (party, index) {
                                return (<MenuItem value={party.contactMechPurposeId}
                                                  key={index}>{party.description}</MenuItem>);
                            })}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TextField variant="outlined" id="contactNumber" name="contactNumber" value={formValues.contactNumber} label="شماره ثابت تماس"
                                   onChange={addFormData()} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <TextField variant="outlined" id="areaCode" name="areaCode"
                                   onChange={addFormData()} fullWidth/>
                    </Grid>

                </Grid>
                <Button variant="contained" color="secondary" startIcon={<Add/>}
                                  className="mt-5"  id="add" onClick={addRow1}>افزودن</Button>
                <CTable headers={[{
                    id: "contactMechPurposeId",
                    label: "نوع اطلاعات تماس"
                }, {
                    id: "contactNumber",
                    label: "مقدار"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                }, ]} rows={tableContent}/>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField select variant="outlined" id="contactInformationType1" name="contactInformationType1"
                                   label="نوع راه ارتباطی " onChange={addFormData()} fullWidth>
                            {partieselectronic.map(function (party, index) {
                                return (<MenuItem value={party.contactMechPurposeId}
                                                  key={index}>{party.description}</MenuItem>);
                            })}

                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField  variant="outlined" id="infoString" name="infoString"
                                  label="راه ارتباطی"  onChange={addFormData()} fullWidth/>
                    </Grid>
                </Grid>
                <Button variant="contained" color="secondary" startIcon={<Add/>}
                        className="mt-5"  id="add" onClick={addRow2}>افزودن</Button>
                <CTable headers={[{
                    id: "contactInformationType",
                    label: "نوع  راه ارتباطی"
                }, {
                    id: "contactNumber1",
                    label: "راه ارتباطی"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                }, ]} rows={tableContent1}/>

            </CardContent>
        </Card>
    );
}

export default ContactInformation;
