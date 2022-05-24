import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import GoalsCourse from "./GoalsCourse"
const goals=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"ثبت اهداف"} />}
            content=
            {
                <GoalsCourse />

            }
            />
        </React.Fragment>
      );
}
export default goals;