import React, { useRef, useState } from "react";
import OrganizationChart from "@dabeng/react-orgchart";
import { FusePageSimple } from "@fuse";
import { Typography, CardHeader, Box } from "@material-ui/core";
import "./style.css";

import Maintenance from "./../../../../components/Maintenance";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const OrganizationalChartForm = (props) => {
  const { list_to_tree, currentData } = props;
  const classes = useStyles();

  const DATA = list_to_tree(currentData.partyClassificationAppl);

  console.log("asdjvkavnav", DATA);
  const ds = DATA[0];
  const textOfErrorPage = {
    h2: "چارت سازمانی ایجاد یا ساخته نشد",
    span: "لطفا برای تکمیل چارت به صفحه واحد سازمانی مراجعه کنید",
  };

  // console.log("adjkvaipvadvj 1" , dss)

  const orgchart = useRef();

  const exportTo = () => {
    orgchart.current.exportTo(filename, fileextension);
  };

  const [filename, setFilename] = useState("organization_chart");
  const [fileextension, setFileextension] = useState("png");

  const onNameChange = (event) => {
    setFilename(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileextension(event.target.value);
  };

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">
                مدیریت ساختار سازمانی
              </Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              چارت سازمانی
            </Box>
          }
        />
      }
      content={
        <>
          {DATA.length ? (
            <>
              <section className="toolbar">
                <div>
                  <label htmlFor="txt-filename"> اسم فایل:</label>
                  <input
                    id="txt-filename"
                    type="text"
                    value={filename}
                    onChange={onNameChange}
                    style={{ fontSize: "1rem", marginRight: "2rem" }}
                  />
                </div>
                <div id="re-txt-png">
                  <span>فرمت خروجی فایل : </span>
                  <input
                    id="rd-png"
                    type="radio"
                    value="png"
                    checked={fileextension === "png"}
                    onChange={onExtensionChange}
                  />
                </div>

                <div>
                  <label htmlFor="rd-png">png</label>
                  <input
                    style={{ marginLeft: "1rem" }}
                    id="rd-pdf"
                    type="radio"
                    value="pdf"
                    checked={fileextension === "pdf"}
                    onChange={onExtensionChange}
                  />
                  <label htmlFor="rd-pdf">pdf</label>
                  <button onClick={exportTo} style={{ marginLeft: "2rem" }}>
                    خروجی
                  </button>
                </div>
              </section>
              <OrganizationChart ref={orgchart} datasource={ds} />
            </>
          ) : (
            <Maintenance textOfErrorPage={textOfErrorPage} />
          )}
        </>
      }
    />
  );
};

export default OrganizationalChartForm;
