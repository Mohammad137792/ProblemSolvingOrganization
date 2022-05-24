import React, {useState} from "react";
import axios from "app/main/api/axiosRest";
import {useDispatch} from "react-redux";
import TransferList from "app/main/components/TransferList";
import useListState from "app/main/reducers/listState";
import { setAlertContent,ALERT_TYPES } from "app/store/actions";
import FormProPersonnelFilter from "./FormProPersonnelFilter";

export default function EvaluationParticipants({personnel,participants, participantss,setParticipants,partyRelationshipIds,setPartyRelationshipIds,evaluationPeriodTrackingCode}) {
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState({});

    const load_participants = () => {

        // axios.get("/s1/survey/surveyParticipants?questionnaireAppId="+questionnaireAppId).then(res => {
        if(participantss){
            participants.set(participantss)
            // load_personnel({},participantss)
        }
        else{
            participants.set([])
        }
        
        // }).catch(() => {
        //     participants.set([])
        // });
    }
    const handle_add_participant = (parties) => new Promise((resolve, reject) => {
        let oldParticipants = participantss ? participantss.slice(0) : []
        let newParticipants =  []
        let newParticipantsIds = []
        for(let i in parties) {

            const ind = participants.list.findIndex(j=>j.partyRelationshipId===parties[i].partyRelationshipId)

            if(ind<0) {
                newParticipants.push(parties[i])
                newParticipantsIds.push(parties[i].partyRelationshipId)
            }
        }

        if(newParticipantsIds.length>0) {
            // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
            // axios.post("/s1/survey/surveyParticipants", {
            //     questionnaireAppId: questionnaireAppId,
            //     partyRelationshipIds: newParticipantsIds
            // }).then(res => {
            //     newParticipants.forEach(party=>{
            //         party.answerId = res.data.participants.find(i=>i.partyRelationshipId===party.partyRelationshipId).answerId
            //     })
            setPartyRelationshipIds((old)=>{return old?.concat(newParticipantsIds)})
            setParticipants(participantss.concat(newParticipants))
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'پرسنل انتخابی با موفقیت به لیست اضافه شدند.'));
            resolve(newParticipants) 
            // }).catch(() => {
            //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            //     reject()
            // });
        }else {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'پرسنل انتخابی قبلا اضافه شده اند.'));
        }
    })
    const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        const answerIds = parties.map(i=>i.answerId)
        // axios.delete("/s1/survey/surveyParticipants?answerId="+answerIds).then((res) => {
            let newParticipants =  []
            let newParticipantsIds = []
            for(let i in parties) {
    
                const ind = participants.list.findIndex(j=>j.partyRelationshipId===parties[i].partyRelationshipId)
    
                // if(ind<0) {
                    newParticipants.push(parties[i])
                    newParticipantsIds.push(parties[i].partyRelationshipId)
                // }
            }
            // personnel.set(personnel.list.concat(newParticipants))
            let old= partyRelationshipIds.slice(0)
            let newR = old.filter( function( el ) {
                return !newParticipantsIds.find(x=>x == el);
              })
             
                setPartyRelationshipIds(newR)
            setParticipants((oldP)=>{return oldP.filter( function( el ) {
                return !newParticipants.find(x=>x.partyRelationshipId == el.partyRelationshipId);
              })})

                // setParticipants(participantss.concat(newParticipants))
                // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
                // resolve(newParticipants)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'مخاطب(های) مورد نظر با موفقیت حذف شد.'));
            resolve(parties)
        // }).catch(() => {
        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        //     reject()
        // });
    })

    React.useEffect(()=>{
        // load_personnel()
        load_participants()
    },[])

    // React.useEffect(()=>{
    //     if(questionnaireAppId) {
    //         load_participants()
    //     }
    // },[questionnaireAppId])

    const display_org_info = (item) => {
        let info = []
     
        if(item.organization) info.push(item.organization)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudo} ─ ${item.fullName||'-'}`

    return (
        <TransferList
            rightTitle="لیست پرسنل"
            rightContext={personnel}
            rightItemLabelPrimary={display_name}
            rightItemLabelSecondary={display_org_info}
            leftTitle="لیست مخاطبان"
            leftContext={participants}
            leftItemLabelPrimary={display_name}
            leftItemLabelSecondary={display_org_info}
            onMoveLeft={handle_add_participant}
            onMoveRight={handle_delete_participant}
            rightFilterForm={
                <FormProPersonnelFilter
                    // searchMethod={load_personnel}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
            }
        />
    )
}
