import React from "react";
import { SERVER_URL } from "../../../../../configs";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { Divider, Grid } from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  photo: {
    width: "15rem",
    height: "15rem",
    border: "8px solid rgb(58 64 79)",
    borderRadius: "0 42px",
    float: "right",
    marginTop: "-64px",
    marginRight: "32px",
  },
}));

export default function PersonnelProfileHeader({ values, avatar }) {
  const classes = useStyles();
  const formStructure = [
    {
      name: "fullName",
      label: "نام و نام خانوادگی",
    },
    {
      name: "pseudoId",
      label: "شماره پرسنلی",
    },
    {
      name: "emplPosition",
      label: "پست سازمانی",
    },
    {
      name: "relationshipTypeEnum",
      label: "نوع ارتباط",
    },
    {
      name: "nationalCode",
      label: "کد ملی",
    },
  ];

  return (
    <Box>
      {avatar ? (
        <Avatar
          src={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + avatar}
          className={classes.photo}
          id={"imagePreview-" + "contentLocation"}
        />
      ) : (
        <Avatar className={classes.photo} />
      )}
      <Box p={4} className="card-display">
        <Grid container spacing={2} style={{ width: "auto" }}>
          {formStructure.map((input, index) => (
            <Grid key={index} item xs={input.col || 6}>
              <FormInput
                {...input}
                emptyContext={"─"}
                type="display"
                variant="display"
                grid={false}
                valueObject={values}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
}
