import React from "react";
import { authRoles } from "app/auth";

const defineWelfareServiceConfig = {
  routes: [
    {
      path: "/DefineWelfareService",
      component: React.lazy(() => import("./DefineWelfareService")),
    },
  ],
};

export default defineWelfareServiceConfig;
