import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import VolunteerReviewForm from "./VolunteerReviewForm"
const VolunteerReview=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"بررسی داوطلب"} />}
            content=
            {
                <VolunteerReviewForm />

            }
            />
        </React.Fragment>
      );
}
export default VolunteerReview;