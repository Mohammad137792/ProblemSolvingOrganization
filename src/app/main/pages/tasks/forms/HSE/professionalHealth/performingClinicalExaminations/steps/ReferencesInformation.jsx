import { Box, Button, Card, CardContent } from "@material-ui/core";
import React from "react";
import FormPro from "../../../../../../../components/formControls/FormPro";
import { useState, useRef, useEffect } from "react";
import sample_avatar from "../../../../../../../../../images/sample_avatar.png";
import { Visibility } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../store/actions/fadak";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const ReferencesInformation = ({
  formValues,
  setFormValues,
  faceImage,
  setMedicalAttachment,
}) => {
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  useEffect(() => {
    setMedicalAttachment((prevState) => {
      return {
        ...prevState,
        OccuationalRef: formValues?.OccuationalRef?.contentLocation,
      };
    });
  }, [formValues?.partyContent]);

  const structure = [
    {
      type: "component",
      component: (
        <Fields formValues={formValues} setFormValues={setFormValues} />
      ),
      col: 9,
    },
    {
      type: "component",
      component: (
        <Card variant="outlined">
          <img
            src={
              faceImage
                ? SERVER_URL +
                  "/rest/s1/fadak/getpersonnelfile1?name=" +
                  faceImage
                : sample_avatar
            }
            style={{ width: "100%", height: "auto" }}
          />
        </Card>
      ),
      col: 3,
    },
  ];

  function Fields(props) {
    const { formValues, setFormValues } = props;
    const inputRef = useRef(null);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };

    const handleUpload = () => {
      inputRef.current.click();
      inputRef.current.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (
          file &&
          (formValues?.partyContent?.name != file.name ||
            formValues?.partyContent?.size != file.size)
        ) {
          dispatch(
            setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات")
          );
          const fileUrl = new FormData();
          fileUrl.append("file", file);
          axios
            .post(
              SERVER_URL + "/rest/s1/fadak/getpersonnelfile/",
              fileUrl,
              axiosKey
            )
            .then((res) => {
              setFormValues((prevState) => ({
                ...prevState,
                partyContent: file,
                OccuationalRef: {
                  contentLocation: res.data.name,
                  medicalAttachEnumId: "OccuationalRef",
                },
              }));
              dispatch(
                setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت آپلود شد.")
              );
            });
        }
      });
    };

    const handleDelete = () => {
      setFormValues((prevState) => ({
        ...prevState,
        partyContent: null,
        OccuationalRef: null,
      }));
    };

    const formStructure = [
      {
        name: "nationalCode",
        label: "شماره ملی",
        type: "number",
        readOnly: true,
        col: 4,
      },
      {
        name: "firstName",
        label: "نام",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "lastName",
        label: "نام خانوادگی",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "organizationName",
        label: "شرکت",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "unitOrganization",
        label: "واحد سازمانی",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "emplPosition",
        label: "پست",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "pseudoId",
        label: "کد پرسنلی",
        type: "number",
        readOnly: true,
        col: 4,
      },
      {
        name: "examinationTypeEnum",
        label: "نوع معاینه",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "jobTitle",
        label: " شغل",
        type: "text",
        readOnly: true,
        col: 4,
      },
      {
        name: "trackingCode",
        label: "کد رهگیری",
        type: "number",
        readOnly: true,
        col: 4,
      },
      // This component will be added later
      // {
      //   name: "partyContent",
      //   type: "component",
      //   col: { sm: 12, md: 8 },
      //   component: (
      //     <Box display="flex" className="outlined-input">
      //       <Box flexGrow={1} style={{ padding: "18px 14px" }}>
      //         <Typography color="textSecondary">{`پیوست : ${
      //           formValues?.partyContent?.name
      //             ? formValues?.partyContent?.name?.substring(0, 5) + "..."
      //             : ""
      //         } `}</Typography>
      //       </Box>
      //       <Box style={{ padding: "3px 14px" }}>
      //         <input type="file" ref={inputRef} style={{ display: "none" }} />
      //         <Tooltip title="آپلود فایل">
      //           <IconButton>
      //             <CloudUpload
      //               onClick={() =>
      //                 formValues?.partyContent?.name
      //                   ? setUploadDialog(true)
      //                   : handleUpload()
      //               }
      //             />
      //           </IconButton>
      //         </Tooltip>

      //         <Dialog
      //           open={uploadDialog}
      //           onClose={() => setUploadDialog(false)}
      //           aria-labelledby="alert-dialog-title"
      //           aria-describedby="alert-dialog-description"
      //         >
      //           <DialogTitle id="alert-dialog-title">هشدار !</DialogTitle>
      //           <DialogContent>
      //             <DialogContentText id="alert-dialog-description">
      //               فایل جدید جایگزین پیوست قبلی خواهد شد. از جایگزینی فایل
      //               اطمینان دارید؟
      //             </DialogContentText>
      //           </DialogContent>
      //           <DialogActions>
      //             <Button onClick={handleUpload} color="primary">
      //               بلی
      //             </Button>
      //             <Button
      //               onClick={() => setUploadDialog(false)}
      //               color="primary"
      //               autoFocus
      //             >
      //               خیر
      //             </Button>
      //           </DialogActions>
      //         </Dialog>

      //         <Tooltip title="حذف فایل پیوست شده">
      //           <IconButton size={"large"}>
      //             <DeleteIcon
      //               onClick={() =>
      //                 formValues?.partyContent?.name
      //                   ? setDeleteDialog(true)
      //                   : dispatch(
      //                       setAlertContent(
      //                         ALERT_TYPES.ERROR,
      //                         "فایل پیوست شده ای برای حذف وجود ندارد !"
      //                       )
      //                     )
      //               }
      //             />
      //           </IconButton>
      //         </Tooltip>
      //         <Dialog
      //           open={deleteDialog}
      //           onClose={() => setDeleteDialog(false)}
      //           aria-labelledby="alert-dialog-title"
      //           aria-describedby="alert-dialog-description"
      //         >
      //           <DialogTitle id="alert-dialog-title">
      //             آیا از حذف فایل پیوست شده اطمینان دارید ؟
      //           </DialogTitle>
      //           <DialogActions>
      //             <Button onClick={handleDelete} color="primary">
      //               بلی
      //             </Button>
      //             <Button
      //               onClick={() => setDeleteDialog(false)}
      //               color="primary"
      //               autoFocus
      //             >
      //               خیر
      //             </Button>
      //           </DialogActions>
      //         </Dialog>

      //         <Tooltip title="دانلود فایل پیوست شده">
      //           {formValues?.OccuationalRef?.contentLocation ? (
      //             <IconButton
      //               size={"large"}
      //               href={
      //                 SERVER_URL +
      //                 "/rest/s1/fadak/getpersonnelfile1?name=" +
      //                 formValues?.OccuationalRef?.contentLocation
      //               }
      //             >
      //               <Visibility />
      //             </IconButton>
      //           ) : (
      //             <IconButton size={"large"}>
      //               <Visibility
      //                 onClick={() =>
      //                   dispatch(
      //                     setAlertContent(
      //                       ALERT_TYPES.ERROR,
      //                       "فایل پیوست شده ای برای دانلود وجود ندارد !"
      //                     )
      //                   )
      //                 }
      //               ></Visibility>
      //             </IconButton>
      //           )}
      //         </Tooltip>
      //       </Box>
      //     </Box>
      //   ),
      // },
    ];

    return (
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <FormPro
          prepend={structure}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </CardContent>
    </Card>
  );
};

export default ReferencesInformation;
