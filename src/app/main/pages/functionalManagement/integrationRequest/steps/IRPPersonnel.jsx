import React, {useEffect, useState} from "react";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import TransferList from "../../../../components/TransferList";
import useListState from "../../../../reducers/listState";
import UserFullName from "../../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../../components/formControls/UserEmplPosition";
import axios from "../../../../api/axiosRest";
import FormProPersonnelFilter from "../../../../components/formControls/FormProPersonnelFilter";
import Box from "@material-ui/core/Box";

export default function IRPPersonnel({values, onSubmit, data}) {
    const moment = require("moment-jalaali");
    const formDefaultValues = {
        createDate: moment().format("Y-MM-DD"),
    }
    const primaryKey = "userId"
    const personnel = useListState(primaryKey)
    const selectedPersonnel = useListState(primaryKey,[])
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [filterValues, set_filterValues] = useState({});

    const incomplete = selectedPersonnel.length===0 //|| !formValues.timePeriodTypeId || !formValues.timePeriodId

    const formStructure = [
        {
            name    : "trackingCode",
            label   : "کد رهگیری",
            type    : "display",
        },{
            name    : "createDate",
            label   : "تاریخ درخواست",
            type    : "display",
            options : "Date",
        },{
            type    : "component",
            component: <UserFullName label="تهیه کننده" name="producerPartyRelationshipId" name2="producerFullName" setValue={set_formValues} valueHandler={set_formValues} />
        },{
            type    : "component",
            component: <UserEmplPosition label="پست سازمانی تهیه کننده" name="producerEmplPositionId" valueObject={formValues} valueHandler={set_formValues}
                                         getOptionLabel={opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""}/>
        },{
            name    : "timePeriodTypeId",
            label   : "نوع دوره زمانی",
            type    : "select",
            options : data.timePeriodTypes,
            optionIdField   : "timePeriodTypeId",
            required: true,
            disableClearable: true,
        },{
            name    : "timePeriodId",
            label   : "دوره زمانی",
            type    : "select",
            options : data.timePeriods,
            filterOptions: options => options.filter(o=> formValues.timePeriodTypeId === o.timePeriodTypeId) ,
            optionIdField   : "timePeriodId",
            optionLabelField: "periodName",
            otherOutputs    : [{name: "periodName", optionIdField: "periodName"},
                {name: "periodFromDate", optionIdField: "fromDate"},
                {name: "periodThruDate", optionIdField: "thruDate"}],
            disabled: !formValues.timePeriodTypeId,
            required: true,
            disableClearable: true,
        },{
            name    : "periodFromDate",
            label   : "از تاریخ",
            type    : "display",
            options : "Date",
        },{
            name    : "periodThruDate",
            label   : "تا تاریخ",
            type    : "display",
            options : "Date",
        },{
            name    : "endDate",
            label   : "تاریخ اتمام زمان تکمیل کارکرد",
            type    : "date",
        },{
            name    : "sendToPersonnel",
            label   : "ارسال برای پرسنل",
            type    : "indicator",
        },
    ]

    const filter_selected_personnel = (parties) => {
        if(selectedPersonnel.list) {
            return parties.filter(i => selectedPersonnel.list.findIndex(j => j[primaryKey] === i[primaryKey]) < 0)
        }else{
            return parties
        }
    }

    const load_personnel = (filter) => {
        personnel.set(null)
        axios.get("/s1/fadak/searchPersonnelAndEmplOrder",{params: filter}).then(res => {
            personnel.set(filter_selected_personnel(res.data.result))
        }).catch(() => {
            personnel.set([])
        });
    }

    const handle_add_participant = (parties) => new Promise((resolve) => {
        resolve(parties);
    });

    const handle_delete_participant = (parties) => new Promise((resolve) => {
        resolve(parties);
    });

    const handle_reset = () => {
        set_formValues(formDefaultValues)
        set_formValidation({})
        set_filterValues({})
        selectedPersonnel.set([])
        load_personnel()
    }

    const handle_submit = () => {
        set_waiting(true)
        const packet = Object.assign({}, {formValues}, {personnel: selectedPersonnel.list})
        onSubmit(packet).finally(()=>{
            set_waiting(false)
        })
    }

    const display_org_info = (item) => {
        let info = []
        if(item.emplPosition) info.push(item.emplPosition)
        if(item.unitOrganization) info.push(item.unitOrganization)
        if(item.organizationName) info.push(item.organizationName)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudoId} ─ ${item.firstName||'-'} ${item.lastName||'-'} ${item.suffix||''}`

    useEffect(() => {
        set_formValues(values.formValues||{})
        selectedPersonnel.set(values.personnel||[])
    },[values])

    useEffect(() => {
        load_personnel()
    },[])

    return (
        <React.Fragment>
            <CardHeader title="انتخاب پرسنل"/>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={set_formValues}
                    formDefaultValues={formDefaultValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    prepend={formStructure}
                />
                <Box m={2}/>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TransferList
                            rightTitle="لیست پرسنل"
                            rightContext={personnel}
                            rightItemLabelPrimary={display_name}
                            rightItemLabelSecondary={display_org_info}
                            leftTitle="لیست پرسنل انتخاب شده"
                            leftContext={selectedPersonnel}
                            leftItemLabelPrimary={display_name}
                            leftItemLabelSecondary={display_org_info}
                            onMoveLeft={handle_add_participant}
                            onMoveRight={handle_delete_participant}
                            rightFilterForm={
                                <FormProPersonnelFilter
                                    formValues={filterValues}
                                    setFormValues={set_filterValues}
                                    searchMethod={load_personnel}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ActionBox>
                            <Button type="button" role="primary" onClick={handle_submit}
                                    disabled={waiting||incomplete}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}>
                                مرحله بعد
                            </Button>
                            <Button type="button" role="secondary" onClick={handle_reset}>
                                لغو
                            </Button>
                        </ActionBox>
                    </Grid>
                </Grid>
            </CardContent>
        </React.Fragment>
    )
}
