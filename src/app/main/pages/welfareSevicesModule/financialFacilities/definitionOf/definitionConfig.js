import React from "react";
import { authRoles } from "app/auth";

const definitionConfig = {
  routes: [
    {
      path: "/definitionOfFinancialFacilitation",
      component: React.lazy(() => import("./DefinitionForm")),
    },
  ],
};

export default definitionConfig;
