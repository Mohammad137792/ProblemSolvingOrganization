import React from "react";

const medicalDocumentConfig = {
  settings: {},
  routes: [
    {
      path: "/medicalDocument",
      component: React.lazy(() =>
        import(
          "./../../tasks/forms/HSE/professionalHealth/medicalDocument/MedicalDocumentForm"
        )
      ),
    },
  ],
};

export default medicalDocumentConfig;
