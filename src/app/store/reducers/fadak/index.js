import { combineReducers } from "redux";
import formData from "./formData.reducers";
import formState from "./formState.reducers";
import alert from "./alert.reducers";

import baseInformationInisial from "./baseInformation.reducers";
import constData from "./constData.reducers";
import permisionList from "./auth.reducers";
import myNotifications from "./notification.reducers";
import hseDoq from "./hse.reducers";
import workEffort from "./workEffort.reducers";
import formComplexParty from "./formComplexParty.reducers";

export default combineReducers({
  formState,
  formData,
  alert,
  baseInformationInisial,
  constData,
  permisionList,
  myNotifications,
  hseDoq,
  workEffort,
  formComplexParty,
});
