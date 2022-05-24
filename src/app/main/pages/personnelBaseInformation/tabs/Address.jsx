import React from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Add, Edit, Delete } from "@material-ui/icons";
import CTable from "../../../components/CTable";

const Address = ({ formValues, addFormValue }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              variant="outlined"
              id="addressType"
              label="نوع آدرس"
              onChange={addFormValue}
              fullWidth
            >
              <MenuItem value="temporary">آدرس موقت</MenuItem>
              <MenuItem value="permanent">آدرس دائمی</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressCountry"
              label="کشور"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressState"
              label="استان"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressCity"
              label="شهر"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressDistrict"
              label="محله"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressStreet"
              label="خیابان"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressLane"
              label="کوچه"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressNo"
              label="پلاک"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressFloor"
              label="طبقه"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressUnit"
              label="واحد"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressZipCode"
              label="کد پستی"
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              id="addressTelephoneNumber"
              label="پیش شماره  "
              onChange={addFormValue}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Add />}
          className="mt-5"
        >
          افزودن
        </Button>
        <CTable
          headers={[
            {
              id: "addressType",
              label: "نوع آدرس",
            },
            {
              id: "addressContent",
              label: "آدرس",
            },
            {
              id: "addressTelephoneNumber",
              label: "تلفن ثابت",
            },
            {
              id: "modify",
              label: "ویرایش / حذف",
            },
          ]}
          rows={[]}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
