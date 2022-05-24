import { FusePageSimple } from "@fuse";
import React, { createRef } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import GetCourseInfoForm from "./GetCourseInfoForm";

const getCourseInfo = (props) => {
  const myScrollElement =  createRef(0);

  return (
    <React.Fragment>
      <FusePageSimple ref={myScrollElement}
        header={<CardHeader title={props.title} />}
        content=
        {
         <GetCourseInfoForm myScrollElement = {myScrollElement} />
        }
        />
    </React.Fragment>
  );
};

export default getCourseInfo;