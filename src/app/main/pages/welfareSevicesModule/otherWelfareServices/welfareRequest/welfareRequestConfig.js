import React from "react";
import { authRoles } from "app/auth";

const welfareServiceAllocationConfig = {
  routes: [
    {
      path: "/otherWelfareServices/welfareRequest",
      component: React.lazy(() => import("./WelfareRequest")),
    },
  ],
};

export default welfareServiceAllocationConfig;
