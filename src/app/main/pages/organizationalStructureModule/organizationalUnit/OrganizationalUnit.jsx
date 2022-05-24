import React, { Fragment, createRef } from "react";
import { FusePageSimple } from "@fuse";
import { CardHeader, Typography, Box } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
import OrganizationalUnitForm from "./OrganizationalUnitForm";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const OrganizationalUnit = () => {
  const classes = useStyles();
  const myScrollElement = createRef(0);

  return (
    <Fragment>
      <FusePageSimple
        ref={myScrollElement}
        header={
          <CardHeader
            title={
              <Box className={classes.headerTitle}>
                <Typography color="textSecondary">
                  مدیریت ساختار سازمانی
                </Typography>
                <KeyboardArrowLeftIcon color="disabled" />
                واحدهای سازمانی
              </Box>
            }
          />
        }
        content={
          <>
            <OrganizationalUnitForm myScrollElement={myScrollElement} />
          </>
        }
      />
    </Fragment>
  );
};

export default OrganizationalUnit;
