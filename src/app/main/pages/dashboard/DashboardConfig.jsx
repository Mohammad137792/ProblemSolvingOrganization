import React from "react";

export const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: ["ADMIN", "FadakJobUsers"],
  routes: [
    {
      path: "/dashboard",
      component: React.lazy(() => import("./Dashboard")),
    },
  ],
};
