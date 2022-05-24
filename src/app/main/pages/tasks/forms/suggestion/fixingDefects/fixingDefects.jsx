import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import FixingDefectsForm from './FixingDefectsForm'

const fixingDefects=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={" رفع نواقص"} />}
            content=
            {
                <FixingDefectsForm />

            }
            />
        </React.Fragment>
      );
}
export default fixingDefects;