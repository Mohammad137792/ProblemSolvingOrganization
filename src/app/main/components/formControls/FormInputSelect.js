import React from "react";
import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../../../../configs";
import { addConstData } from "../../../store/actions/fadak";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { VariableSizeList } from "react-window";

export function getDescription(def, val, lists = {}) {
  const {
    options,
    optionLabelField = "description",
    optionIdField = "enumId",
  } = def;
  switch (typeof options) {
    case "string":
      if (typeof lists[options] === "undefined") {
        return "؟";
      } else {
        const opt = lists[options].find((i) => i[optionIdField] === val);
        return opt ? opt[optionLabelField] : "؟";
      }
    case "object":
      const opt = options.find((i) => i[optionIdField] === val);
      return opt ? opt[optionLabelField] : "؟";
    default:
      return "؟";
  }
}

export function getList(listName, dispatch) {
  return new Promise((resolve) => {
    let statusType, uomType;
    if (listName.substr(0, 3) === "Sta") {
      statusType = listName.substr(3);
      listName = "Status";
    }
    if (listName.substr(0, 3) === "Uom") {
      uomType = listName.substr(3);
      listName = "Uom";
    }
    switch (listName) {
      case "Test2":
        setTimeout(() => {
          const Test2 = [
            {
              enumId: "opt1a",
              description: "گزینه یک الف",
              parentEnumId: "opt1",
            },
            {
              enumId: "opt2a",
              description: "گزینه دو الف",
              parentEnumId: "opt2",
            },
            {
              enumId: "opt2b",
              description: "گزینه دو ب",
              parentEnumId: "opt2",
            },
          ];
          dispatch(addConstData("list", { [listName]: Test2 }));
          resolve(Test2);
        }, 5000);
        break;
      case "UserEmplPosition":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/getUser", {
            headers: { api_key: localStorage.getItem("api_key") },
            params: {
              emplPosition: true,
            },
          })
          .then((res) => {
            const newList = res.data.emplPosition;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "EmplPosition":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/emplPosition", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.position;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Role":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/getRoles", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.roles;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "OrganizationUnit":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.organizationUnit;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Organization":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.organization.concat(
              res.data.subOrganization
            );
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Job":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/getListByCompany", {
            headers: { api_key: localStorage.getItem("api_key") },
            params: {
              listName,
              listType: "entity",
              ownerField: "companyPartyId",
            },
          })
          .then((res) => {
            const newList = res.data.list;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Agreement":
        axios
          .get(SERVER_URL + "/rest/s1/emplOrder/agreement/type", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.agreementTypes;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "TimePeriod":
        axios
          .get(SERVER_URL + "/rest/s1/payroll/timePeriodList", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.timePeriodList;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "ActivityArea":
      case "ExpertiseArea":
      case "EmployeeGroups":
      case "CostCenter":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/getListByCompany", {
            headers: { api_key: localStorage.getItem("api_key") },
            params: {
              listName,
              listType: "classification",
              ownerField: "parentClassificationId",
            },
          })
          .then((res) => {
            const newList = res.data.list;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "EmployeeSubGroups":
        axios
          .get(SERVER_URL + "/rest/s1/fadak/getListByCompany", {
            headers: { api_key: localStorage.getItem("api_key") },
            params: {
              listName,
              listType: "subClassification",
              ownerField: "parentClassificationId",
              parentName: "EmployeeGroups",
            },
          })
          .then((res) => {
            const newList = res.data.list;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Uom":
        axios
          .get(
            SERVER_URL + "/rest/s1/fadak/entity/Uom?uomTypeEnumId=" + uomType,
            {
              headers: { api_key: localStorage.getItem("api_key") },
            }
          )
          .then((res) => {
            let newList = res.data.result;
            dispatch(addConstData("list", { [`Uom${uomType}`]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "Status":
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/StatusItem?statusTypeId=" +
              statusType,
            {
              headers: { api_key: localStorage.getItem("api_key") },
            }
          )
          .then((res) => {
            let newList = res.data.status;
            newList = newList.sort((a, b) =>
              a.sequenceNum > b.sequenceNum
                ? 1
                : a.sequenceNum < b.sequenceNum
                ? -1
                : 0
            );
            dispatch(addConstData("list", { [`Sta${statusType}`]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      case "course":
        axios
          .get(SERVER_URL + "/rest/s1/training/entity/Course", {
            headers: { api_key: localStorage.getItem("api_key") },
          })
          .then((res) => {
            const newList = res.data.course;
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          });
        break;
      case "Country":
      case "Province":
      case "County":
      case "Postal_Code":
      case "City":
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/Geo?geoTypeEnumId=GEOT_" +
              listName,
            {
              headers: { api_key: localStorage.getItem("api_key") },
            }
          )
          .then((res) => {
            let newList = res.data.result;
            newList = newList.sort((a, b) => (a.geoName > b.geoName ? 1 : -1));
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
        break;
      default:
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/Enumeration?enumTypeId=" +
              listName,
            {
              headers: {
                api_key: localStorage.getItem("api_key"),
              },
            }
          )
          .then((res) => {
            let newList = res.data.result;
            newList = newList.sort((a, b) =>
              a.sequenceNum > b.sequenceNum
                ? 1
                : a.sequenceNum < b.sequenceNum
                ? -1
                : 0
            );
            dispatch(addConstData("list", { [listName]: newList }));
            resolve(newList);
          })
          .catch(() => {
            resolve([]);
          });
    }
  });
}

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    // height: "54px",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  listbox: {
    boxSizing: "border-box",

    // margin: 0,
    // padding: '8px 0',
    // overflow: 'auto',
    // textOverflow: "ellipsis",
    //
    // listStyle: 'none',
    // maxHeight: '40vh',
    //
    direction: "rtl",
    "& ul": {
      padding: 0,
      margin: 0,
      direction: "rtl",
      //     // textAlign: "right",
      //     '& li':{
      //         // textAlign: "right",
      //         direction: 'rtl'
      //     }
    },
  },
}));

const LISTBOX_PADDING = 8; // px

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}
function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref} style={{ direction: "rtl" }}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

export default function FormInputSelect({
  name,
  group,
  label,
  options,
  variant,
  value,
  valueHandler,
  optionLabelField,
  optionIdField,
  readOnly,
  disabled,
  required,
  multiple,
  helperText = "",
  long,
  urlLong,
  error = false,
  setValidation = () => {},
  loading,
  appendOptions = null,
  noneOption = false,
  allOption = false,
  placeholder,
  hasTooManyOptions = false,
  changeCallback = () => {},
  getOptionLabel,
  otherOutputs,
  ...rest
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cx = require("classnames");
  const lists = useSelector(({ fadak }) => fadak.constData.list);
  const [opt, setOpt] = React.useState([]);
  const [loadingState, setLoading] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");
  const [autocompleteValue, setAutocompleteValue] = React.useState([]);
  const [timer, setTimer] = React.useState(null);
  const setOptions = (newOpt) => {
    setOpt(
      newOpt
        .concat(appendOptions ? appendOptions : [])
        .concat(
          noneOption
            ? [{ [optionIdField]: "NA", [optionLabelField]: "هیچ کدام" }]
            : []
        )
    );
  };
  React.useEffect(() => {
    switch (typeof options) {
      case "string":
        if (typeof lists[options] === "undefined") {
          getList(options, dispatch, lists).then((list) => {
            setOptions(list);
            setLoading(false);
          });
        } else {
          setOptions(lists[options]);
          setLoading(false);
        }
        break;
      case "object":
        setOptions(options);
        setLoading(false);
        break;
      default:
    }
  }, [options]);

  React.useEffect(() => {
    if (multiple && !long) {
      const valueArr = JSON.parse(value ? value : "[]");
      const selectedOpt = opt.filter(
        (o) => valueArr.indexOf(o[optionIdField]) > -1
      );
      setAutocompleteValue(selectedOpt);
    }
  }, [value, opt]);

  function processMultipleValue(newOption) {
    let valueList = newOption.map((o) => o[optionIdField]);
    // if(valueList.indexOf("NA")>-1){
    //     valueList = ["NA"]
    // }
    // if(valueList.indexOf("AA")>-1){
    //     valueList = opt
    // }
    return JSON.stringify(valueList);
  }

  function search_handler(newInputValue) {
    if (timer) {
      clearTimeout(timer);
      // setTimer(null)
    }
    // let test_timeOut;
    // let newValue = e.target.value;
    // clearTimeout(test_timeOut)
    let timeOut = setTimeout(() => {
      let config = {
        headers: { api_key: localStorage.getItem("api_key") },
        params: { valueIndex: `${newInputValue}` },
      };
      axios.get(`${SERVER_URL}${urlLong}`, config).then((res) => {
        const newList = res.data.result;
        setOptions(newList);
        setLoading(false);
        setTimer(null);
      });
    }, 1000);
    setTimer(timeOut);
  }

  function setValue(event, newOption) {
    const newValue =
      newOption !== null
        ? multiple
          ? processMultipleValue(newOption)
          : newOption[optionIdField]
        : null;
    let otherOutputsValue = null;
    if (otherOutputs && !multiple) {
      otherOutputsValue = {};
      for (let i in otherOutputs) {
        otherOutputsValue[otherOutputs[i].name] = newValue
          ? newOption[otherOutputs[i].optionIdField]
          : null;
      }
    }
    if (group) {
      valueHandler((prevState) => ({
        ...prevState,
        [group]: {
          ...prevState[group],
          [name]: newValue,
          ...otherOutputsValue,
        },
      }));
    } else {
      valueHandler((prevState) => ({
        ...prevState,
        [name]: newValue,
        ...otherOutputsValue,
      }));
    }
    if (error && newValue) {
      setValidation();
    }
    changeCallback(newOption);
  }

  const autocompleteProps = {
    name: name,
    options: opt,
    loading: loading || loadingState,
    noOptionsText: long ? `${label} را جستجو کنید ` : "گزینه ای وجود ندارد!",
    openText: "نمایش لیست",
    closeText: "بستن لیست",
    clearText: "لغو انتخاب",
    loadingText: "در حال دریافت گزینه ها...",
    onChange: valueHandler && setValue,
    inputValue: inputValue,
    onInputChange: (event, newInputValue) => {
      setInputValue(newInputValue);
      if (long) {
        search_handler(newInputValue);
      }
    },
    classes: {
      inputRoot: classes.inputRoot,
      ...(hasTooManyOptions && { listbox: classes.listbox }),
    },
    disabled: disabled || readOnly,
    getOptionLabel:
      getOptionLabel ||
      ((option) => (option ? option[optionLabelField] || "؟" : "")),
    getOptionDisabled: (option) =>
      option?.optionIndicator === "N" || option?.disabled === true,
    // freeSolo: long,
    renderInput: (params) => (
      <TextField
        {...params}
        required={required}
        className={cx(readOnly && "read-only", required && "required")}
        variant={variant}
        label={label}
        fullWidth
        margin="none"
        helperText={helperText}
        error={error}
        placeholder={placeholder}
      />
    ),
    ...(!multiple && {
      //!long &&
      value: opt.find((o) => (o ? o[optionIdField] === value : false)) ?? null,
    }),
    ...(multiple &&
      !long && {
        value: autocompleteValue,
      }),
    ...(multiple && {
      multiple: true,
      renderTags: (value, getTagProps) => (
        <Typography noWrap>
          {value.map((option) => option[optionLabelField]).join("؛ ")}
        </Typography>
      ),
      limitTags: 2,
    }),
    ...(hasTooManyOptions && {
      disableListWrap: true,
      renderOption: (option) => (
        <Typography noWrap align="left" style={{ direction: "rtl" }}>
          {option[optionLabelField]}
        </Typography>
      ),
      ListboxComponent: ListboxComponent,
    }),
    ...rest,
  };
  return <Autocomplete {...autocompleteProps} />;
}

FormInputSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  optionLabelField: PropTypes.string,
  optionIdField: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  freeSolo: PropTypes.bool,
  disableClearable: PropTypes.bool,
};

FormInputSelect.defaultProps = {
  label: "",
  variant: "outlined",
  optionLabelField: "description",
  optionIdField: "enumId",
  readOnly: false,
  disabled: false,
  required: false,
  multiple: false,
};
