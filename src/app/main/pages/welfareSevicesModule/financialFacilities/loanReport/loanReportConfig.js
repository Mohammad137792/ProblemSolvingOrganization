import React from "react";

const LoanReportConfig = {
  routes: [
    {
      path: "/loanReport",
      component: React.lazy(() => import("./LoanReport")),
    },
  ],
};

export default LoanReportConfig;
