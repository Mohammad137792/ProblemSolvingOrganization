import React from "react";

const ModelOfExcellenceConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/modelOfExcellence",
      component: React.lazy(() => import("./ModelOfExcellence")),
    },
  ],
};
 
export default ModelOfExcellenceConfig;
