import React from "react";

const InstallmentSettlementConfig = {
  routes: [
    {
      path: "/installmentSettlement",
      component: React.lazy(() => import("./InstallmentSettlement")),
    },
  ],
};

export default InstallmentSettlementConfig;
