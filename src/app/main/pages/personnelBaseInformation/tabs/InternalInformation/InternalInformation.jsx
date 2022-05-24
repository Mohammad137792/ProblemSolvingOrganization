import React from 'react';
import InternalInformationForm from "./InternalInformationForm";
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {ALERT_TYPES, setAlertContent, submitPost} from "../../../../../store/actions/fadak";
import {Button, Grid} from "@material-ui/core";
import {DeleteOutlined} from "@material-ui/icons";
import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../../../configs";
import {useDispatch} from "react-redux/es/hooks/useDispatch";

const InternalInformation = props => {
    const [formData, setFormData] = React.useState({});
    const [data, setData] = React.useState(false);
    const addFormData = setFormDataHelper(setFormData);

    const partyId = useSelector(({auth}) => auth.user.data.partyId);
    const [tableContent, setTableContent] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [familyToEdit, setFamilyToEdit] = React.useState(-1);
    const [idDelete, setId] = React.useState([]);
    const [enablecancel, stenablecancel] = React.useState(false);
    const [display, setDisplay] = React.useState(true);
    const [currentData, setCurrentData] = React.useState(false);
    const [currentData1, setCurrentData1] = React.useState(false);
    const [currentData2, setCurrentData2] = React.useState(false);
    const [getFile, setgetFile] = React.useState(true);
    const [partyClassification, setpartyClassification] = React.useState(false);
    const [fieldEnumId, setfieldEnumId] = React.useState(false);
    const [qualificationTypeEnumId, setqualificationTypeEnumId] = React.useState(false);
    const [facilityNameState, setfacilityNameState] = React.useState([]);

    const [addRows, setAddRows] = React.useState({
        "asset" :1,
    });

    React.useEffect(()=>{
        const data_types = ["asset"]
        let is_updating = false;
        data_types.map((item, index) => {
            if(typeof addRows[item] != "undefined" && addRows[item] === 0){
                is_updating = true;
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
            }
        })
        data_types.map((item, index) => {
            if(typeof addRows[item] != "undefined" && addRows[item] === -1){
                // is_updating = true;

                setTimeout(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  به روزرسانی شد'));

                },2000)
            }
        })
        if(is_updating === false){

        }
    },[addRows])


    React.useEffect(()=>{
        const data_types = ["person", "relation","postalAddress","telecom","partyContactMech" ,"partyQualification",
            "contentLocation",
            "partyNote",
            "partyIdentification",
            "classification"]
        let is_updating = false;
        data_types.map((item, index) => {
            if(typeof addRows[item] != "undefined" && addRows[item] === 0){
                is_updating = true;
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
            }
        })
        data_types.map((item, index) => {
            if(typeof addRows[item] != "undefined" && addRows[item] === -1){
                // is_updating = true;

                setTimeout(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  به روزرسانی شد'));

                },2000)
            }
        })
        if(is_updating === false){

        }
    },[addRows])

    React.useEffect(()=>{

        axios.get(SERVER_URL + "/rest/s1/fadak/facilityCompanyNameRest"
            ,{
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(responsefacilityCompanyName => {
            setfacilityNameState(responsefacilityCompanyName.data.facilityNameList)
            axios.get(SERVER_URL + "/rest/s1/fadak/getAssetrest", {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(responseAssetTypeList => {

                axios.get(SERVER_URL + "/rest/s1/fadak/getAssetTitlerest", {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                }).then(responseAssetTitleList => {

                    axios.get(SERVER_URL + "/rest/s1/fadak/UseTypeEnumIdAssetrest", {
                        headers: {
                            'api_key': localStorage.getItem('api_key')
                        },
                    }).then(responseUseTypeEnumIdList => {
                        setData({
                            "facilityCompanyName":responsefacilityCompanyName.data.facilityNameList,
                            "Asset":responseAssetTypeList.data,
                            "AssetTitle":responseAssetTitleList.data,
                            "UseTypeEnumIdAsset":responseUseTypeEnumIdList.data
                        })
                        axios.get(SERVER_URL + "/rest/s1/fadak/getAssetPartyInforest?partyId=" + partyId, {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response => {

                            response.data.AssetPartyList.map((pa , index) => {
                                response.data.AssetList.map((pa1,index1)=>{
                                    if(pa1.assetId === pa.assetId){
                                        let converted_date_fromDate = new Date(pa.fromDate).toLocaleDateString('fa-IR');
                                        let converted_date_thruDate = new Date(pa.thruDate).toLocaleDateString('fa-IR');

                                        responseAssetTitleList.data.AssetTitleList.map((qqq , index) => {
                                            if(qqq.assetId === pa1.assetName){
                                                pa1.assetName = qqq.assetName
                                            }
                                        })
                                        const row = {
                                            id: pa1.assetId,
                                            assetName: pa1.assetName,
                                            serialNumber: pa1.serialNumber,
                                            assetTypeEnumId: pa1.assetTypeEnumId,
                                            fromDate:converted_date_fromDate,
                                            thruDate:converted_date_thruDate,
                                            delete: <Button variant="outlined" color="secondary"
                                                            onClick={() => openDeleteModal(pa1.assetId)}><DeleteOutlined/></Button>,
                                            modify: <Button variant="outlined" color="secondary"
                                                            onClick={() => displayUpdateForm1(pa,pa1)}>ویرایش</Button>,
                                        }
                                        setTableContent( rows1 => [...rows1, row]);
                                    }

                                })

                            })

                        }).catch(error => {
                        });
                    })

                })
            })

        }).catch(error => {
        });




    },[]);

    const displayUpdateForm1 = (values,values2) => {
        const finalValues = Object.assign({}, values,values2)
        setCurrentData({
            "UseTypeEnumId" : finalValues.UseTypeEnumId,
            "assetName" : finalValues.assetName,
            "assetTypeEnumId":finalValues.assetTypeEnumId,
            "comments" :finalValues.comments,
            "fromDate" :finalValues.fromDate,
            "thruDate":finalValues.thruDate,
            "capacity":finalValues.capacity,
            "serialNumber":finalValues.serialNumber,
            "assetId":finalValues.assetId,
            "partyId":partyId,

        })
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)
        // addformvalues(finalValues);
        setEnableDisableCreate(true);
    }

    const cancelUpdate = () => {
        setEnableDisableCreate(false);
        stenablecancel(false)
        setFamilyToEdit(-1)

    };
    const handleClose =()=>{
        setOpen(false);
    };
    const dispatch = useDispatch();
    const openDeleteModal=(id)=>{
        setId(id);
        setOpen(true);
    };


    const [enableDisableCreate, setEnableDisableCreate] = React.useState(false);
    const displayUpdateForm = (values) => {
        setFormData(values);
        setEnableDisableCreate(true);
    };
    const [facilityNameRoomState, setfacilityNameRoomState] = React.useState([]);
    const [telecomNumbers, settelecomNumbers] = React.useState([]);

    const handleChange = (data) => event => {
        const {id, value, name} = event.target;
        // addformvalues({ ...formvalues, [event.target.value.id ?? event.target.name]: event.target.value });

        axios.get(SERVER_URL + "/rest/s1/fadak/facilityCompanyNameRoomRest?parentFacilityId=" + event.target.value, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
            if(response.data.facilityNameRoomList.length !== 0){

                setfacilityNameRoomState(response.data.facilityNameRoomList);
            }

        }).catch(error => {
        });
    }
    const handleChangeNumbr = (newValue)  => {
        setFormData({ ...formData, ["telecomNumberRoom"]: newValue.contactMechId });

    }

    const handleChange1 =(newValue) =>{
        // const {id, value, name} = event.target;
        // formData = {...formData,[filedName]: newValue[field]};
        // const newFormdata = Object.assign({},formData);
        // setFormData(newFormdata)
        // setFormData({ ...formData, [event.target.value.id ?? event.target.name]: event.target.value });
        setFormData({ ...formData, ["facilityNameRoom"]: newValue.pseudoId });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/FacilityContactMech?facilityId=" + newValue.pseudoId, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
            setfacilityNameRoomState(response.data.result);
            response.data.result.map((facility , index) => {
                axios.get(SERVER_URL + "/rest/s1/fadak/getTelecomNumbersFacilityrest?contactMechId=" + facility.contactMechId, {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                })
                    .then(response => {
                        settelecomNumbers(response.data.telecomnumberList);
                    })
                    .catch(error => {
                    });

            })
        }).catch(error => {
        });
    }

    const displayUpdateForm2 =(index)=>{
        setFamilyToEdit(index)

        setEnableDisableCreate(true);
    }


    const configPost = {timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            api_key: localStorage.getItem('api_key')
        }
    };



    const addRow = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

        if (typeof formData.asset.comments != "undefined" && typeof formData.asset.UseTypeEnumId != "undefined"){
            dispatch(submitPost("/rest/s1/fadak/entity/Asset", {data : 
                {

                    assetTypeEnumId: formData.asset.assetTypeEnumId,
                    assetName: formData.asset.assetName,
                    serialNumber: formData.asset.serialNumber ,
                    capacity: formData.asset.capacity
                }}, "add")).then(resAsset => {
                const newaddRows = Object.assign({},{["asset"]: 0});
                setAddRows(newaddRows)
                dispatch(submitPost("/rest/s1/fadak/entity/AssetPartyAssignment", {data : 
                    {

                        assetId: resAsset.data.assetId.assetId,
                        partyId: partyId,
                        roleTypeId: "100000",
                        fromDate: formData.asset.fromDate,
                        thruDate: formData.asset.thruDate
                        ,
                        comments: formData.asset.comments,
                        UseTypeEnumId: formData.asset.UseTypeEnumId
                    }}, "add")).then(resAsseParty => {
                    const newaddRows = Object.assign({},{["asset"]: 0});
                    setAddRows(newaddRows)
                    // var fulldate = new Date(formvalues.fromDate);
                    // let converted_date_fromDate = fulldate.toLocaleDateString('fa-IR');
                    // var fulldate = new Date(formvalues.thruDate);
                    // let converted_date_thruDate = fulldate.toLocaleDateString('fa-IR');

                    data.AssetTitle.AssetTitleList.map((qqq , index) => {
                        if(qqq.assetId === formData.asset.assetName){
                            formData.asset.assetName = qqq.assetName
                        }
                    })

                    data.Asset.AssetTypeList.map((qqq , index) => {
                        if(qqq.enumId === formData.asset.assetTypeEnumId){
                            formData.asset.assetTypeEnumId = qqq.description
                        }
                    })
                    let converted_date=''
                    if(typeof formData.asset.fromDate != "undefined"){
                        var fulldate = new Date(formData.asset.fromDate);
                         converted_date = fulldate.toLocaleDateString('fa-IR');
                    } else{

                        let converted_date = "";
                    }
                    let converted_datethruDate=""
                    if(typeof formData.asset.thruDate != "undefined"){
                        var fulldate = new Date(formData.asset.thruDate);
                         converted_datethruDate = fulldate.toLocaleDateString('fa-IR');
                    } else{

                        let converted_datethruDate = "";
                    }


                    const row = {
                        id: resAsset.data.assetId.assetId,
                        assetName: formData.asset.assetName,
                        serialNumber: formData.asset.serialNumber,
                        assetTypeEnumId: formData.asset.assetTypeEnumId,
                        fromDate: converted_date,
                        thruDate: converted_datethruDate,
                        delete: <Button variant="outlined" color="secondary"
                                        onClick={() => openDeleteModal(resAsset.data.assetId.assetId)}><DeleteOutlined/></Button>,
                        modify: <Button variant="outlined" color="secondary"
                                        onClick={() => displayUpdateForm(formData.asset)}>ویرایش</Button>,
                    }

                    if(typeof formData.asset != "undefined") {
                        if (typeof formData.asset.assetName != "undefined") {
                            formData.asset.assetName = ''
                        }
                        if (typeof formData.asset.serialNumber != "undefined") {
                            formData.asset.serialNumber = ''
                        }
                        if (typeof formData.asset.assetTypeEnumId != "undefined") {
                            formData.asset.assetTypeEnumId = ''
                        }
                    }
                    const newFormdata = Object.assign({},formData);
                    setFormData(newFormdata)
                    setDisplay(false)
                    setTimeout(()=>{
                        setDisplay(true)
                    },20)

                    // setassetName("")
                    // setUseTypeEnumId("")
                    // setassetTypeEnumId("")
                    // settelecomNumberRoom("")
                    // setfacilityNameRoom("")
                    // setfacilityName("")
                    //
                    // formvalues.pseudoId = ""
                    // formvalues.serialNumber = ""
                    // formvalues.capacity = ""
                    // formvalues.comments = ""
                    setTableContent(rows1 => [row, ...rows1

                    ]);
                }).catch(error => {

                })
            }).catch(error => {

            })

        }
        // dispatch(submitPost("/rest/e1/FacilityParty",
        //     {
        //         facilityId:formData.facilityNameRoom,partyId:partyId,roleTypeId:"100000"
        //     }, "add")).then(resOrg => {
        //     dispatch(submitPost("/rest/e1/ContactMechPurpose",
        //         {
        //             contactMechTypeEnumId:"CmtTelecomNumberOrgRoom",description: "TelecomNumberOrgRoom"
        //         }, "add")).then(resContactMechPurpose => {
        //         dispatch(submitPost("/rest/e1/PartyContactMech",
        //             {
        //                 contactMechPurposeId: resContactMechPurpose.data.contactMechPurposeId,
        //                 contactMechId: formData.telecomNumberRoom
        //                 , partyId: partyId
        //             }, "add")).then(resPartyContactMech => {
        //             dispatch(submitPost("/rest/e1/FacilityContactMech",
        //                 {
        //                     facilityId: formData.facilityNameRoom, contactMechId: formData.telecomNumberRoom,
        //                     contactMechPurposeId: resContactMechPurpose.data.contactMechPurposeId
        //                 }, "add")).then(resContactMechPurpose => {
        //
        //             }).catch(error => {
        //
        //             })
        //         }).catch(error => {
        //
        //         })
        //     }).catch(error => {
        //
        //     })
        // }).catch(error => {
        //
        // })
    };



    const addRow1 = () => {


        // if (typeof formvalues.comments != "undefined" && typeof formvalues.UseTypeEnumId != "undefined"){
        //     dispatch(submitPost("/rest/e1/Asset",
        //         {
        //             formvalues,
        //             assetTypeEnumId: formvalues.assetTypeEnumId,
        //             assetName: formvalues.assetName,
        //             serialNumber: formvalues.serialNumber
        //             ,
        //             capacity: formvalues.capacity
        //         }, "add")).then(resAsset => {
        //         dispatch(submitPost("/rest/e1/AssetPartyAssignment",
        //             {
        //                 formvalues,
        //                 assetId: resAsset.data.assetId,
        //                 partyId: partyId,
        //                 roleTypeId: "100000",
        //                 fromDate: Date.now(),
        //                 thruDate: formvalues.thruDate
        //                 ,
        //                 comments: formvalues.comments,
        //                 UseTypeEnumId: formvalues.UseTypeEnumId
        //             }, "add")).then(resAsseParty => {
        //
        //             console.log("fromdate", formvalues.fromDate)
        //
        //             const row = {
        //                 id: resAsset.data.assetId,
        //                 assetName: formvalues.assetName,
        //                 serialNumber: formvalues.serialNumber,
        //                 assetTypeEnumId: formvalues.assetTypeEnumId,
        //                 fromDate: formvalues.fromDate,
        //                 thruDate: formvalues.thruDate,
        //                 delete: <Button variant="outlined" color="secondary"
        //                                 onClick={() => openDeleteModal(resAsset.data.assetId)}><DeleteOutlined/></Button>,
        //                 modify: <Button variant="outlined" color="secondary"
        //                                 onClick={() => displayUpdateForm(formvalues)}>ویرایش</Button>,
        //             }
        //             console.log("row add", row)
        //             setTableContent(rows1 => [row, ...rows1
        //
        //             ]);
        //         }).catch(error => {
        //
        //         })
        //     }).catch(error => {
        //
        //     })
        //
        // }
        dispatch(submitPost("/rest/s1/fadak/entity/FacilityParty", {data : 
            {
                facilityId:formData.facilityNameRoom,partyId:partyId,roleTypeId:"100000"
                // facilityId:100002,partyId:partyId,roleTypeId:"100000"
            }}, "submitForm")).then(resOrg => {
            dispatch(submitPost("/rest/s1/fadak/entity/ContactMechPurpose", {data : 
                {
                    formData,contactMechTypeEnumId:"CmtTelecomNumberOrgRoom",description: "TelecomNumberOrgRoom"
                }}, "submitForm")).then(resContactMechPurpose => {
                dispatch(submitPost("/rest/s1/fadak/entity/PartyContactMech", {data : 
                    {
                        contactMechPurposeId: resContactMechPurpose.data.contactMechPurposeId.contactMechPurposeId,
                        contactMechId: formData.telecomNumberRoom
                        , partyId: partyId
                    }}, "submitForm")).then(resPartyContactMech => {
                    dispatch(submitPost("/rest/s1/fadak/entity/FacilityContactMech", {data : 
                        {
                            facilityId: formData.facilityNameRoom, contactMechId: formData.telecomNumberRoom,
                            // facilityId: 100002, contactMechId: formData.telecomNumberRoom,
                            contactMechPurposeId: resContactMechPurpose.data.contactMechPurposeId.contactMechPurposeId
                        }}, "submitForm")).then(resContactMechPurpose => {


                            if (typeof formData.telecomNumberRoom != "undefined") {
                                formData.telecomNumberRoom = ''
                            }
                            if (typeof formData.facilityNameRoom != "undefined") {
                                formData.facilityNameRoom = ''
                            }

                        const newFormdata = Object.assign({},formData);
                        setFormData(newFormdata)
                        setDisplay(false)
                        setTimeout(()=>{
                            setDisplay(true)
                        },20)

                    }).catch(error => {

                    })
                }).catch(error => {

                })
            }).catch(error => {

            })
        }).catch(error => {

        })



    }

    const deleteRow1 = (id) => {
        setTableContent(preFormData => preFormData.filter(member => {
            // console.log(`member: ${member.id} and id: ${id}`);
            return member.id !== id

        }))
    }

    const updateRow = (idasset) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال  به روز رسانی است'));

        setEnableDisableCreate(false);

        if(typeof formData.asset != "undefined"){
            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Asset"  , {data : 
                {
                    assetTypeEnumId:formData.asset.assetTypeEnumId, assetName:formData.asset.assetName,serialNumber:formData.asset.serialNumber,
                    capacity:formData.asset.capacity ,
                    assetId : idasset
                }}
                , {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                }).then(response => {
                const newaddRows = Object.assign({},{["asset"]: -1});
                setAddRows(newaddRows)
            }).catch(error => {

            })

            if(typeof formData.asset.thruDate != "undefined"){
                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/AssetPartyAssignment?assetId="+ idasset +"&partyId="+ partyId +"&roleTypeId=100000&fromDate=*" , {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                })
                    .then(res => {

                    })
                axios.post(SERVER_URL + "/rest/s1/fadak/entity/AssetPartyAssignment" , {data : 
                    {
                        thruDate:formData.asset.thruDate,roleTypeId:100000,partyId : partyId, assetId :idasset,
                        fromDate: Date.now(), comments:currentData.comments ? currentData.comments : "" , UseTypeEnumId: currentData.UseTypeEnumId ? currentData.UseTypeEnumId : ""

                    }}
                    , {
                        headers: {
                            'api_key': localStorage.getItem('api_key')
                        },
                    }).then(response => {
                    const newaddRows = Object.assign({},{["asset"]: -1});
                    setAddRows(newaddRows)
                }).catch(error => {
                })


            } else  if(typeof formData.asset.fromDate != "undefined"){
                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/AssetPartyAssignment?assetId="+ idasset +"&partyId="+ partyId +"&roleTypeId=100000&fromDate=*" , {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                })
                    .then(res => {

                    })
                axios.post(SERVER_URL + "/rest/s1/fadak/entity/AssetPartyAssignment" , {data : 
                    {
                        fromDate:formData.asset.fromDate,roleTypeId:100000,partyId : partyId, assetId :idasset,
                     comments:currentData.comments ? currentData.comments : "" , thruDate : currentData.thruDate ? currentData.thruDate : "",
                        UseTypeEnumId: currentData.UseTypeEnumId ? currentData.UseTypeEnumId : ""

                    }}
                    , {
                        headers: {
                            'api_key': localStorage.getItem('api_key')
                        },
                    }).then(response => {
                    const newaddRows = Object.assign({},{["asset"]: -1});
                    setAddRows(newaddRows)
                }).catch(error => {
                })
            }

            if(typeof  formData.asset.assetName != "undefined") {
                data.AssetTitle.AssetTitleList.map((qqq , index) => {
                    if(qqq.assetId === formData.asset.assetName){
                        formData.asset.assetName = qqq.assetName
                    }
                })
                currentData.assetName = formData.asset.assetName;
            }
            if(typeof  formData.asset.serialNumber != "undefined") {
                currentData.serialNumber = formData.asset.serialNumber;
            }
            if(typeof  formData.asset.assetTypeEnumId != "undefined") {
                data.Asset.AssetTypeList.map((qqq , index) => {
                    if(qqq.enumId === formData.asset.assetTypeEnumId){
                        formData.asset.assetTypeEnumId = qqq.description
                    }
                })
                currentData.assetTypeEnumId = formData.asset.assetTypeEnumId;
            }
            if(typeof  formData.asset.thruDate != "undefined") {
                var fulldate = new Date(formData.asset.thruDate);
                let converted_date = fulldate.toLocaleDateString('fa-IR');
                currentData.thruDate = converted_date;
            } else if(typeof  formData.asset.thruDate == "undefined"){
                var fulldate = new Date(currentData.thruDate);
                let converted_date = fulldate.toLocaleDateString('fa-IR');
                currentData.thruDate = converted_date;
            }
            if(typeof  formData.asset.fromDate != "undefined") {
                var fulldate = new Date(formData.asset.fromDate);
                let converted_date = fulldate.toLocaleDateString('fa-IR');
                currentData.fromDate = converted_date;
            } else if(typeof  formData.asset.fromDate == "undefined")  {
                var fulldate = new Date(currentData.fromDate);
                let converted_date = fulldate.toLocaleDateString('fa-IR');
                currentData.fromDate = converted_date;
            }

                deleteRow1(currentData.assetId);
                const row2 = {
                    id: idasset,
                    assetName: currentData.assetName,
                    serialNumber: currentData.serialNumber,
                    assetTypeEnumId: currentData.assetTypeEnumId,
                    fromDate: currentData.fromDate,
                    thruDate: currentData.thruDate,
                    delete: <Button variant="outlined" color="secondary"
                                    onClick={() => openDeleteModal(idasset)}><DeleteOutlined/></Button>,
                    modify: <Button variant="outlined" color="secondary"
                                    onClick={() => displayUpdateForm1(currentData)}>ویرایش</Button>,
                }
                setTableContent(rows2 => [...rows2, row2]);


            if(typeof formData.asset != "undefined") {
                if (typeof formData.asset.assetName != "undefined") {
                    formData.asset.assetName = ''
                }
                if (typeof formData.asset.serialNumber != "undefined") {
                    formData.asset.serialNumber = ''
                }
                if (typeof formData.asset.assetTypeEnumId != "undefined") {
                    formData.asset.assetTypeEnumId = ''
                }
            }
            const newFormdata = Object.assign({},formData);
            setCurrentData(newFormdata)
            setDisplay(false)
            setTimeout(()=>{
                setDisplay(true)
            },20)

        }
    }

    return (
        <Grid>
            { data && display && <InternalInformationForm addFormData={addFormData}  setFormData={setFormData} formData={formData}
                                             data={data} tableContent={tableContent} setTableContent={setTableContent} handleChangeNumbr={handleChangeNumbr}
                                             setOpen={setOpen} setId={setId} idDelete={idDelete} open={open} handleClose={handleClose} enableDisableCreate={enableDisableCreate}
                                             currentData={currentData} handleChange1={handleChange1} telecomNumbers={telecomNumbers}
                                             updateRow={updateRow} addRow={addRow} enablecancel={enablecancel} cancelUpdate={cancelUpdate} setCurrentData={setCurrentData}
                                             display={display} addRow1={addRow1} facilityNameRoomState={facilityNameRoomState} handleChange={handleChange}
                                             familyToEdit={familyToEdit} getFile={getFile} facilityNameState={facilityNameState}
            />}

        </Grid>
    );
}

export default InternalInformation;