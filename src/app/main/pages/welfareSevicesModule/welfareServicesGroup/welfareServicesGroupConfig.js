import React from "react";
import { authRoles } from "app/auth";

const welfareServicesGroupConfig = {
  routes: [
    {
      path: "/welfareServicesGroup",
      component: React.lazy(() => import("./WelfareServicesGroupForm")),
    },
  ],
};

export default welfareServicesGroupConfig;
