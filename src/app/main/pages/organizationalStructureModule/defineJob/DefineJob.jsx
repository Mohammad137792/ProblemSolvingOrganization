import React, { useState } from "react";
import { FusePageSimple } from "@fuse";
import {
  CardContent,
  Divider,
  CardHeader,
  Box,
  Typography,
} from "@material-ui/core";
import DefineJobForm from "./DefineJobForm";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import TablePro from "../../../components/TablePro";
import DefineJobTabs from "./DefineJobTabs";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function DefineJob() {
  const classes = useStyles();
  const tableCols = [
    { name: "jobCode", label: "کد شغل", type: "text", style: { width: "20%" } },
    {
      name: "jobTitle",
      label: "عنوان شغل",
      type: "text",
      style: { width: "35%" },
    },
    {
      name: "jobCategoryEnumId",
      label: "رسته شغل",
      type: "select",
      options: "JobCategory",
    },
  ];
  const [loading, setLoading] = useState(true);
  const [tableContent, setTableContent] = React.useState([]);
  const [data, setData] = React.useState({});
  const [actionObject, setActionObject] = React.useState(null); //jobId

  function getUser() {
    axios
      .get(SERVER_URL + "/rest/s1/fadak/getUser", {
        headers: { api_key: localStorage.getItem("api_key") },
        params: {
          emplPosition: true,
          organization: true,
        },
      })
      .then((res) => {
        const userData = res.data.allUserData.data;
        const producerPartyId = userData.partyId;
        const producerFullName = userData.userFullName;
        const emplPosition = res.data.emplPosition;
        // const producerEmplPosition = emplPosition.description;
        // const producerEmplPositionId = emplPosition.emplPositionId;
        const companyPartyId = res.data.organization.partyId;
        setData((prevState) => ({
          ...prevState,
          user: {
            producerPartyId,
            producerFullName,
            companyPartyId,
            emplPosition,
          },
        }));
      })
      .catch((err) => {
        console.log("User err..", err);
      });
  }

  function getEnums() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          SERVER_URL +
            "/rest/s1/fadak/getEnums?enumTypeList=JobCategory,UniversityFields,QualificationType,JobGrade,JobTitle,JobAuthorityType,OrdinalScale,CommunicationType,CommunicationPlatform,SkillLevel",
          {
            headers: { api_key: localStorage.getItem("api_key") },
          }
        )
        .then((res) => {
          const enumData = res.data.enums;
          const JobTitleCode = enumData.JobTitle.map((item) => ({
            enumId: item.enumId,
            description: item.enumCode,
          }));
          const ImportanceDegree = enumData.OrdinalScale.filter(
            (item) => item.parentEnumId === "SevenPointLikertScale"
          );
          const QualificationType = enumData.QualificationType.filter(
            (item) => item.enumId !== "WorkExperience"
          );
          setData((prevState) => ({
            ...prevState,
            enums: {
              ...enumData,
              JobTitleCode,
              ImportanceDegree,
              QualificationType,
            },
          }));
          resolve(enumData);
        })
        .catch((err) => {
          console.log("Enums err..", err);
          reject(false);
        });
    });
  }

  function getJobs() {
    axios
      .get(SERVER_URL + "/rest/s1/orgStructure/job", {
        headers: { api_key: localStorage.getItem("api_key") },
      })
      .then((res) => {
        setTableContent(res.data.jobs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function deleteJob(job) {
    return new Promise((resolve, reject) => {
      axios
        .delete(SERVER_URL + "/rest/s1/orgStructure/job?jobId=" + job.jobId, {
          headers: { api_key: localStorage.getItem("api_key") },
        })
        .then((res) => {
          if (res.data.result === "OK") {
            setActionObject(null);
            resolve();
          } else {
            reject(
              "از این شغل در جای دیگر استفاده شده است و امکان حذف آن وجود ندارد!"
            );
          }
        })
        .catch(() => {
          reject();
        });
    });
  }

  function handleEdit(job) {
    setActionObject(job.jobId);
  }

  React.useEffect(() => {
    getUser();
    getJobs();
    getEnums();
  }, []);

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
              شناسنامه شغل
            </Box>
          }
        />
      }
      content={
        <Box p={2}>
          <Card>
            <CardHeader title={"تعریف شناسنامه شغل"} />
            <CardContent>
              <Grid container spacing={2} width={100}>
                <Grid item xs={12} width={100}>
                  <DefineJobForm
                    actionObject={actionObject}
                    setActionObject={setActionObject}
                    tableContent={tableContent}
                    setTableContent={setTableContent}
                    data={data}
                  />
                </Grid>

                {actionObject && (
                  <React.Fragment>
                    <Grid item xs={12} width={100}>
                      <Divider variant="fullWidth" />
                    </Grid>
                    <Grid item xs={12}>
                      <DefineJobTabs actionObject={actionObject} data={data} />
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </CardContent>
          </Card>
          <Box m={2} />
          <Card>
            <TablePro
              title="لیست شناسنامه مشاغل"
              columns={tableCols}
              rows={tableContent}
              setRows={setTableContent}
              loading={loading}
              removeCallback={deleteJob}
              edit={"callback"}
              editCallback={handleEdit}
              defaultOrderBy="jobCode"
            />
          </Card>
        </Box>
      }
    />
  );
}
