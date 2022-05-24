import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import CreatingJobNeedsForm from "./CreatingJobNeedsForm"
const CreatingJobNeeds=()=>{

  const [formValues, setFormValues] = React.useState({personnel : []});
  const [contentsName, setContentsName] = React.useState([]);
  const [jobAdvantages, setJobAdvantages] = React.useState([]);

    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"ایجاد نیازمندی شغلی"} />}
            content=
            {
                <CreatingJobNeedsForm formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>

            }
            />
        </React.Fragment>
      );
}
export default CreatingJobNeeds;