import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import ResultSuggestionsForm from './ResultSuggestionsForm'

const resultSuggestions=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={" مشاهده نتیجه پیشنهاد"} />}
            content=
            {
                <ResultSuggestionsForm />

            }
            />
        </React.Fragment>
      );
}
export default resultSuggestions;