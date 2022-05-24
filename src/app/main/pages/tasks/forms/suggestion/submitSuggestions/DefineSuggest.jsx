import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import DefineSuggestForm from './DefineSuggestForm'

const DefineSuggest=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعریف پیشنهاد"} />}
            content=
            {
                <DefineSuggestForm />

            }
            />
        </React.Fragment>
      );
}
export default DefineSuggest;