import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import InfoChangeTypeForm from './InfoChangeTypeForm'

const communication=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={" نوع تغییر اطلاعات پرسنلی و تشکیلاتی"} />}
            content=
            {
                <InfoChangeTypeForm />

            }
            />
        </React.Fragment>
      );
}
export default communication;