import React, { useState } from "react";
import { FusePageSimple } from "@fuse";
import { Box, CardHeader, Typography } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
import DBWSForm from "./DBWSForm";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const DBWS = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <FusePageSimple
        header={
          <CardHeader
            title={
              <Box className={classes.headerTitle}>
                <Typography color="textSecondary">
                  ایمنی ، بهداشت و سلامت کارکنان
                </Typography>
                <KeyboardArrowLeftIcon color="disabled" />
                تعیین محدوده‌های کاری پایه
              </Box>
            }
          />
        }
        content={<DBWSForm />}
      />
    </React.Fragment>
  );
};
export default DBWS;
