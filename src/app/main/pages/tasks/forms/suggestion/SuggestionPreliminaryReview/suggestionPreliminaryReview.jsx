import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import SuggestionPreliminaryReviewForm from './SuggestionPreliminaryReviewForm'

const suggestionPreliminaryReview=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"بررسی اولیه پیشنهاد"} />}
            content=
            {
                <SuggestionPreliminaryReviewForm />

            }
            />
        </React.Fragment>
      );
}
export default suggestionPreliminaryReview;