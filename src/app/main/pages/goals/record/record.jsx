import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Recordevent from '../record/Recordevent'
const record=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"record"} />}
            content=
            {
                <Recordevent/>
            }
            />
        </React.Fragment>
      );
}
export default record;