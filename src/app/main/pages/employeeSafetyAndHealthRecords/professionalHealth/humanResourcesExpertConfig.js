import React from "react";

const humanResourcesExpertConfig = {
  settings: {},
  routes: [
    {
      path: "/humanResourcesExpert",
      component: React.lazy(() =>
        import(
          "./../../tasks/forms/HSE/professionalHealth/humanResourcesExpert/HumanResourcesExpert"
        )
      ),
    },
  ],
};

export default humanResourcesExpertConfig;
