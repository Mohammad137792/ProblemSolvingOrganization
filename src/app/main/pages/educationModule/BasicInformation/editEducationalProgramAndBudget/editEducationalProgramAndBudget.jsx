import { FusePageSimple } from "@fuse";
import React, { createRef } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import EditEducationalProgramAndBudgetForm from "./EditEducationalProgramAndBudgetForm";

const editEducationalProgramAndBudget = () => {
  const myScrollElement =  createRef(0);

  return (
    <React.Fragment>
      <FusePageSimple ref={myScrollElement}
        header={<CardHeader title={"تدوین برنامه آموزشی"} />}
        content=
        {
         <EditEducationalProgramAndBudgetForm myScrollElement = {myScrollElement} />
        }
        />
    </React.Fragment>
  );
};

export default editEducationalProgramAndBudget;