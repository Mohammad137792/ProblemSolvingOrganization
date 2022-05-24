import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import BDHRPForm from "./BDHRPForm"
const BDHRP=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعاریف پایه برنامه ریزی منابع انسانی"} />}
            content=
            {
                <BDHRPForm />

            }
            />
        </React.Fragment>
      );
}
export default BDHRP;