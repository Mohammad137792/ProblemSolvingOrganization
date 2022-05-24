import React, { Component } from "react";

const OrganizationalUnitConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/organizationalUnit",
      component: React.lazy(() => import("./OrganizationalUnit")),
    },
  ],
};

export default OrganizationalUnitConfig;
