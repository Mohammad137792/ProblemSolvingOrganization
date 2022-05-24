import React from "react";

const OrganizationExcellenceConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/organizationExcellence",
      component: React.lazy(() => import("./OrganizationExcellence")),
    },
  ],
};
 
export default OrganizationExcellenceConfig;
