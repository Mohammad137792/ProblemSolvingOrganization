import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Box, CardHeader, Typography } from "@material-ui/core";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ModelOfExcellence from "./modelOfExcellence/ModelOfExcellence";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ModelAllocation from "./modelAllocation/ModelAllocation";
import Testing from "./test/Testing";
import TestConfig from './test/TestConfig';

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

// function OrganizationExcellence() {
//   return (
//     <FusePageSimple
//       header={<CardHeader title={"تعریف مدل تعالی"} />}
//       content={<Box p={2}>ایجاد مولفه تعالی</Box>}
//     />
//   );
// }

function SubEmplOrderFrame(props) {
  const classes = useStyles();
  const { children, title } = props;
  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">تعالی سازمان </Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              {title}
            </Box>
          }
        />
      }
      content={<Box p={2}>{children}</Box>}
    />
  );
}

export default function OrganizationExcellence() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <OrganizationExcellence />
      </Route>
      {console.log("path", path)}
      <Route path={`${path}/test`}>
        <SubEmplOrderFrame title="تعریف مدل تعالی">
          <Testing />
        </SubEmplOrderFrame>
      </Route>
      <Route path={`${path}/allocationExcellenceModel`}>
        <SubEmplOrderFrame title="قرارداد">
          <ModelAllocation />
        </SubEmplOrderFrame>
      </Route>
    </Switch>
  );
}
