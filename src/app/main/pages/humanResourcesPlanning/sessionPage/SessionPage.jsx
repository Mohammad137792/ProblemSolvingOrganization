import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import SessionPageForm from "./SessionPageForm"
const SessionPage=()=>{

  const [formValues, setFormValues] = React.useState({});
  const [contentsName, setContentsName] = React.useState([]);
  const [jobAdvantages, setJobAdvantages] = React.useState([]);

    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"بررسی نیازمندی شغلی توسط مدیر متقاضی"} />}
            content=
            {
                <SessionPageForm formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>

            }
            />
        </React.Fragment>
      );
}
export default SessionPage;