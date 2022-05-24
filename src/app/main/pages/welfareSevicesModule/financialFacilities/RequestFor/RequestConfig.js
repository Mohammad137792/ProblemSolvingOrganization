import React from "react";
import { authRoles } from "app/auth";

const RequestConfig = {
  routes: [
    {
      path: "/requestForFinancialFacility",
      component: React.lazy(() =>
        import(
          "../../../tasks/forms/WelfareSevices/requestForFinancialFacilitation/Request"
        )
      ),
    },
  ],
};

export default RequestConfig;
