import React from "react";

const ViewRecipientConfig = {
  routes: [
    {
      path: "/viewRecipient/:accompanyId?",
      component: React.lazy(() => import("./ViewRecipient")),
    },
  ],
};

export default ViewRecipientConfig;
