import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, CardContent } from "@material-ui/core";
import { SERVER_URL } from "configs";
import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";

export default function UseCost({ welfareGroupPartyClassificationId }) {
  const [tableContent, setTableContent] = useState([]);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [welfareList, setWelfareList] = useState([{ id: 1, value: "صندوق1" }, { id: 1, value: "صندوق2" }, { id: 1, value: "صندوق3" }]);
  const [gabList, setGapList] = useState([{ id: 1, value: "روز" }, { id: 1, value: "هفته" }, { id: 1, value: "ماه" }, { id: 1, value: "سال" }]);

  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "user",
      label: " استفاده کننده ",
      col: 3,
    }, {
      name: "cost",
      label: " هزینه استفاده",
      col: 3,
    },

  ];

  const getBasicPersonnel = () => {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: { employment: "Y", justCompanyPartyId: "Y" },
        },
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            personnel: res.data.result,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت پرسنل رخ داده است."
          )
        );
      });
  };

  const getWelfareGroupPersonel = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/personWelfareGroup?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.welfareGroupPersonel);
        setLoading(false);
      })
      .catch(() => {
        // dispatch(
        //   setAlertContent(
        //     ALERT_TYPES.ERROR,
        //     "خطا در دریافت لیست اعضای گروه خدمات رفاهی!"
        //   )
        // );
        setLoading(false);
      });
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      setLoading(true);
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/personWelfareGroup?partyClassificationId=${welfareGroupPartyClassificationId}&partyRelationshipId=${row?.partyRelationshipId}&fromDate=${row?.fromDate}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (person) =>
              person.partyRelationshipId != row?.partyRelationshipId &&
              person.fromDate != row?.fromDate
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          // dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف پرسنل!"));
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getBasicPersonnel();
  }, []);

  useEffect(() => {
    getWelfareGroupPersonel();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="هزینه استفاده از خدمت"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/add",
            datas
          ) && "external"
        }
        addForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            welfareList={welfareList}
            gabList={gabList}
            editing={false}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        edit={
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/update",
            datas
          ) && "external"
        }
        editForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            welfareList={welfareList}
            gabList={gabList}
            editing={true}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        removeCondition={() =>
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/delete",
            datas
          )
        }
        removeCallback={handleRemove}
      />
    </>
  );
}

function ExternalForm({ editing = false, ...restProps }) {

  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    tableContent,
    setTableContent,
    welfareGroupPartyClassificationId,
    welfareList,
    gabList
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructur=[
    {
      type: "group",
      items: [
        {
          name: "cost",
          label:
            "هزینه تامین",
          type: "float",
          required: true,
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "5px" },
        },
      ],
      col: 3,
    },
    {
      name: "Source ",
      label: "منبع تامین",
      type: "select",
      options:[{id:1,value:"داخل سازمان"},{id:2,value:"خارج سازمان"}],
      optionIdField: "id",
      optionLabelField: "value",
      col: 3,
    },
    {
      name: "Branch",
      type: "select",
      label: " شعبه",
      options:[{id:1,value:"شعبه1"},{id:2,value:"شعبه2"}],
      optionIdField: "id",
      optionLabelField: "value",
      col: 3,
    },
 

    {
      type: "group",
      items: [
        {
          name: "ForeignOrganizationShare",
          label:
            "سهم سازمان خارجی",
          type: "float",
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "5px" },
        },
      ],
      col: 3,
    },
    
    {
      name: "aduince",
      type: "select",
      label: " مخاطب خدمت",
      options:[{id:1,value:"پرسنل"},{id:2,value:"همسر"},{id:3,value:"فرزند"}],
      optionIdField: "id",
      optionLabelField: "value",
      col: 3,
    },
    {
      type: "group",
      items: [
        {
          name: "useCost",
          label:
          "هزینه استفاده",
          type: "float",
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "5px" },
        },
      ],
      col: 3,
    },
   ]
  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/personWelfareGroup",
        {
          ...formValues,
          partyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          fullName: fieldsInfo?.personnel.find(
            (person) =>
              person.partyRelationshipId == formValues.partyRelationshipId
          )?.fullName,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        // dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن پرسنل!"));
        setWaiting(false);
        setLoading(false);
      });
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .put(
        SERVER_URL + "/rest/s1/welfare/personWelfareGroup",
        {
          ...formValues,
          partyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const editedTableContent = [...tableContent];
        const personIndex = tableContent.findIndex(
          (person) =>
            person.partyRelationshipId == formValues.partyRelationshipId &&
            person.fromDate == formValues.fromDate
        );
        editedTableContent[personIndex] = {
          ...editedTableContent[personIndex],
          ...formValues,
        };
        setTableContent(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        // dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش پرسنل!"));
        setWaiting(false);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructur}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={() => (editing ? handleEdit() : handleSubmit())}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              {editing ? "ویرایش" : "افزودن"}
            </Button>
            <Button type="reset" role="secondary" disabled={waiting}>
              لغو
            </Button>
          </ActionBox>
        }
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
