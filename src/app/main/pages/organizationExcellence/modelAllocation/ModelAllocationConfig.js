import React from "react";

const ModelAllocationConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/modelAllocation",
      component: React.lazy(() => import("./ModelAllocation")),
    },
  ],
};
 
export default ModelAllocationConfig;
