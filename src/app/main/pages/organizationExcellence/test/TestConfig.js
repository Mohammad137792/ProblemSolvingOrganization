import React from "react";
import Testing from './Testing';

const TestConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/test",
      component: React.lazy(() => import("./Testing")),
    },
  ],
};
 
export default TestConfig;
