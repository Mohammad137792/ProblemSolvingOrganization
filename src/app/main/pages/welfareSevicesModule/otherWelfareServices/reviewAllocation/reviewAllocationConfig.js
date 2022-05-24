import React from "react";
import { authRoles } from "app/auth";

const reviewAllocationConfig = {
  routes: [
    {
      path: "/reviewAllocation",
      component: React.lazy(() => import("./ReviewAllocation")),
    },
  ],
};

export default reviewAllocationConfig;
