import React, { Fragment } from 'react';
import { FusePageSimple } from '@fuse'
import { CardHeader ,Button,Grid,Box} from '@material-ui/core';
import StudyNeedAssessmentOrganizationForm from '../../../../educationModule/BasicInformation/studyneedAssessmentOrganization/StudyNeedAssessmentOrganizationForm';
import ActionBox from 'app/main/components/ActionBox';
import { useSelector } from "react-redux";
import FormInput from "../../../../../components/formControls/FormInput";
import CircularProgress from "@material-ui/core/CircularProgress";
import ModalPro from "../../../../../components/ModalPro";

const ResponsibleForm = (props) => {
    const {submitCallback , formVariables}= props
    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);
    const partyIdUser = useSelector(({ auth }) => auth?.user?.data?.partyId);
    const [waiting, set_waiting] = React.useState(false)
    const [isValid, setIsValid] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false);

    
    let moment = require('moment-jalaali')
    
    const assessment = formVariables.assessment?.value ?? []

    const profileValues = {
        title: assessment?.title,
        code: assessment?.code,
        resp: assessment?.emplPosition,
        fromDate: moment(assessment?.fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
    }

    const topFormStructure = [{
        name    : "title",
        label   : "عنوان نیازسنجی ",
    },{
        name    : "code",
        label   : "کد نیازسنجی",
    },{
        name    : "fromDate",
        label   : "تاریخ شروع",
    },{
        name    : "resp",
        label   : "مسئول نیازسنجی",
    }]

    function confirmedData(){
        const packet = {
            result: "accept",
            partyRelationshipId: partyRelationshipId,
            partyIdUser: partyIdUser,
            api_key: localStorage.getItem('Authorization')
        }
        set_waiting(true)
        setOpenModal(false)

        submitCallback(packet)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    function sendtoVerification(isValid1){
        if(isValid1){
            confirmedData()
            setOpenModal(false)
        }
        else{
            setOpenModal(true)
        }
    }

    return (
        <Fragment >
        <FusePageSimple
            header={<CardHeader title={"بررسی  نیازسنجی سازمان"} />}
            content={<>
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{width: "auto"}}>
                    {topFormStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
                <StudyNeedAssessmentOrganizationForm py={5} curriculumId={formVariables.assessment.value.curriculumId} display={true} isValid={isValid} setIsValid={setIsValid}/>
                <ActionBox>
                    <Button type="button" disabled={waiting} endIcon={waiting ?<CircularProgress size={20}/>:null}  onClick={()=>sendtoVerification(isValid)} role="primary">ارسال به مراتب تایید</Button>
                  
                </ActionBox>
                <ModalPro
                    title={'توجه!'}
                    open={openModal}
                    setOpen={setOpenModal}
                    maxWidth='sm'
                    fullWidth={false}
                    content={
                        <Box p={3}>
                            <div style={{marginBottom:'16px'}}>
                                هیچ دوره ای انتخاب نکرده اید. مایلید لیست دوره را خالی ارسال کنید؟
                            </div>
                            <ActionBox>
                                <Button type="submit" onClick={confirmedData} role="primary">بله</Button>
                                <Button type="reset" onClick={closeModal} role="secondary">خیر</Button>
                            </ActionBox>
                        </Box>
                    }
                />
            </>}
            
        />

    </Fragment>
    )
};

export default ResponsibleForm;
