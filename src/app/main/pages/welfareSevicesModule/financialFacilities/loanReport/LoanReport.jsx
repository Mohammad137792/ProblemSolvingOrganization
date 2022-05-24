import React, { Fragment } from "react";
import { FusePageSimple } from "@fuse";
import { CardHeader, Typography, Box } from "@material-ui/core";
import LoanReportForm from "./LoanReportForm";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const LoanReport = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <FusePageSimple
        header={
          <CardHeader
            title={
              <Box className={classes.headerTitle}>
                <Typography color="textSecondary">خدمات رفاهی</Typography>
                <KeyboardArrowLeftIcon color="disabled" />
                گزارشات تسهیل مالی
              </Box>
            }
          />
        }
        content={
          <>
            <LoanReportForm />
          </>
        }
      />
    </Fragment>
  );
};

export default LoanReport;
