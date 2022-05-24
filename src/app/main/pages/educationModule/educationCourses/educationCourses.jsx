import { FusePageSimple } from "@fuse";
import React, { createRef } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import EducationCoursesForm from "./EducationCoursesForm";

const educationCourses = () => {
  const myScrollElement =  createRef(0);

  return (
    <React.Fragment>
      <FusePageSimple ref={myScrollElement}
        header={<CardHeader title={"دوره های آموزشی"} />}
        content=
        {
         <EducationCoursesForm myScrollElement = {myScrollElement} />
        }
        />
    </React.Fragment>
  );
};

export default educationCourses;