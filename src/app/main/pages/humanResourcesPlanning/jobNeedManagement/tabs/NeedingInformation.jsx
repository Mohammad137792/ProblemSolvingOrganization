import React from 'react';
import Attachment from '../../creatingJobNeeds/steps/Attachment';
import BaseInformation from "../../creatingJobNeeds/steps/BaseInformation"
import FurtherInformation from '../../creatingJobNeeds/steps/FurtherInformation';
import JobAndPositionInformation from '../../creatingJobNeeds/steps/JobAndPositionInformation';
import JobDescription from '../../creatingJobNeeds/steps/JobDescription';
import TeamAndPathOfRecruitment from '../../creatingJobNeeds/steps/TeamAndPathOfRecruitment';
import {Button, Grid, Typography, Box} from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";


const NeedingInformation = (props) => {

    const {formValues, setFormValues, contentsName, setContentsName, jobAdvantages, setJobAdvantages, submitRef, submit=()=>{}} = props

    return (
        <div>
            <BaseInformation confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} />
            <JobAndPositionInformation confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} />
            <FurtherInformation confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>
            <JobDescription confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>
            <Attachment confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>
            <TeamAndPathOfRecruitment confirmation={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>
            <ActionBox>
                <Button
                    ref={submitRef}
                    type="submit"
                    role="primary"
                    style={{ display: "none" }}
                    onClick={submit}
                />
            </ActionBox>
        </div>
    );
};

export default NeedingInformation;