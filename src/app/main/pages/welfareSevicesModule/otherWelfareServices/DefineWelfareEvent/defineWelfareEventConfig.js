import React from "react";
import { authRoles } from "app/auth";

const defineWelfareEventConfig = {
  routes: [
    {
      path: "/DefineWelfareEvent",
      component: React.lazy(() => import("./DefineWelfareEvent")),
    },
  ],
};

export default defineWelfareEventConfig;
