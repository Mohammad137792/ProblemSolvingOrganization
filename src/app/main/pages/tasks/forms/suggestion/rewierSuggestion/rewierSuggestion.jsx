import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import RewierSuggestionForm from './RewierSuggestionForm'

const rewierSuggestion=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={' بررسی کننده پیشنهاد'} />}
            content=
            {
                <RewierSuggestionForm />

            }
            />
        </React.Fragment>
      );
}
export default rewierSuggestion;