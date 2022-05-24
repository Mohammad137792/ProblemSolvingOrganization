import React, { useState } from "react";
import { Card, CardContent, Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";

const ParaclinicalActions = ({ paraclinicalAction, fieldsInfo }) => {
  const [formValues, setFormValues] = useState({});
  const [paraclinicalTable, setParaclinicalTable] = useState([
    ...paraclinicalAction,
  ]);
  const [loading, setLoading] = useState(false);

  const tableCols = [
    {
      name: "paraclinicalActionEnum",
      label: "نوع اقدام",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      style: { minWidth: "80px" },
    },
  ];

  return (
    <Card>
      <CardContent>
        <CardContent>
          <TablePro
            title="سایر اقدامات"
            columns={tableCols}
            rows={paraclinicalTable}
            setRows={setParaclinicalTable}
            loading={loading}
            edit="external"
            editForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={true}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
              />
            }
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};
export default ParaclinicalActions;

function ExternalForm({ editing = false, ...restProps }) {
  const { formValues, setFormValues, handleClose, fieldsInfo, setLoading } =
    restProps;

  const formStructure = [
    {
      name: "paraclinicalActionEnumId",
      label: "نوع اقدام",
      type: "select",
      options: fieldsInfo.paraAction,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "paraclinicalActionElaboration",
      label: "شرح اقدام",
      type: "textarea",
      readOnly: true,
      col: 8,
    },
    {
      name: "paraclinicalActionResult",
      label: "نتیجه",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
  ];

  const handleReset = () => {
    setLoading(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formStructure={formStructure}
        actionBox={
          <ActionBox>
            <Button type="reset" role="secondary">
              لغو
            </Button>
          </ActionBox>
        }
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
