import React, {useState} from "react";
import {useDispatch} from "react-redux";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import TransferList from "../../../../components/TransferList";
import PersonnelFilterForm from "./PersonnelFilterForm";

export default function PayrollOutputsPersonnel({parentKey, parentKeyValue}) {
    const dispatch = useDispatch();
    const personnel = useListState("userId")
    const audience = useListState("userId")
    const [formDefaultValues, setFormDefaultValues] = useState({});
    const [formValues, setFormValues] = useState({});

    const filter_audience = (parties) => {
        if(audience.list) {
            return parties.filter(i => audience.list.findIndex(j => j.userId === i.userId) < 0)
        }else{
            return parties
        }
    }
    const load_personnel = (filter=formDefaultValues) => {
        personnel.set(null)
        axios.get("/s1/fadak/searchPersonnelAndEmplOrder",{params: filter}).then(res => { /* todo: rest? */
            personnel.set(filter_audience(res.data.result))
        }).catch(() => {
            personnel.set([])
        });
    }
    const load_audience = () => {
        // axios.get("/s1/fadak/notificationAudience?notificationMessageId="+notificationMessageId).then(res => {
        //     audience.set(res.data.audience)
        // }).catch(() => {
            audience.set([])
        // });
    }
    const handle_add_participant = (parties) => new Promise((resolve, reject) => {
        let newAudience = filter_audience(parties)
        resolve(newAudience)
        // if(newAudience.length>0) {
        //     dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        //     axios.post("/s1/fadak/notificationAudience", {
        //         notificationMessageId: notificationMessageId,
        //         audience: newAudience
        //     }).then(res => {
        //         dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        //         resolve(res.data.audience)
        //     }).catch(() => {
        //         dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        //         reject()
        //     });
        // }else {
        //     dispatch(setAlertContent(ALERT_TYPES.WARNING, 'پرسنل انتخابی قبلا اضافه شده اند.'));
        // }
    })
    const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
        resolve(parties)
        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        // axios.post("/s1/fadak/removeNotificationAudience",{
        //     notificationMessageId: notificationMessageId,
        //     audience: parties
        // }).then((res) => {
        //     dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'مخاطب(های) مورد نظر با موفقیت حذف شد.'));
        //     resolve(res.data.audience)
        // }).catch(() => {
        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        //     reject()
        // });
    })

    React.useEffect(()=>{
        axios.get("/s1/fadak/party/subOrganization").then( res => {
            const defaultFilter = {
                relationType: "employee", /* todo: default value? */
                organizationPartyId: JSON.stringify([res.data.organization[0].partyId])
            }
            setFormDefaultValues(defaultFilter);
            load_personnel(defaultFilter)
        }).catch(() => {});
    },[])

    React.useEffect(()=>{
        if(personnel.list) {
            personnel.set(filter_audience(personnel.list))
        }
    },[audience.list])

    React.useEffect(()=>{
        if(parentKeyValue) {
            load_audience()
        }
    },[parentKeyValue])

    React.useEffect(()=>{
        setFormValues(formDefaultValues)
    },[formDefaultValues])

    const display_org_info = (item) => {
        let info = []
        if(item.emplPosition) info.push(item.emplPosition)
        if(item.unitOrganization) info.push(item.unitOrganization)
        if(item.organizationName) info.push(item.organizationName)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudoId} ─ ${item.firstName} ${item.lastName}`

    return (
        <TransferList
            rightTitle="لیست پرسنل"
            rightContext={personnel}
            rightItemLabelPrimary={display_name}
            rightItemLabelSecondary={display_org_info}
            leftTitle="لیست پرسنل انتخاب شده"
            leftContext={audience}
            leftItemLabelPrimary={display_name}
            leftItemLabelSecondary={display_org_info}
            onMoveLeft={handle_add_participant}
            onMoveRight={handle_delete_participant}
            rightFilterForm={
                <PersonnelFilterForm
                    search={load_personnel}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formDefaultValues={formDefaultValues}
                />
            }
        />
    )
}

