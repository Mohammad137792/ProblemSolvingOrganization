import React from "react";
import { authRoles } from "app/auth";

const welfareServiceAllocationConfig = {
  routes: [
    {
      path: "/welfareServiceAllocation",
      component: React.lazy(() => import("./WelfareServiceAllocation")),
    },
  ],
};

export default welfareServiceAllocationConfig;
