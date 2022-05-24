import DemoFrame from "./demoFrame";
import React from "react";
import ReactDOM from "react-dom";
import CardMedia from "@material-ui/core/CardMedia";

const navigationConfig = [
  {
    id: "applications",
    title: "صفحه ها",
    type: "group",
    icon: "apps",
    children: [
      {
        id: "tasks",
        title: "پیشخوان",
        type: "item",
        url: "/tasks",
        icon: "assignment_turned_in",
        permision: "tasks",
      },
      {
        id: "dashboard",
        title: "داشبورد",
        // 'type': 'item',
        type: "item",
        // 'url':'/dashboard' ,
        // 'icon': 'dashboard',
        icon: "extension",
        url: "/DataAnalysisDashboard",
        permision: "dashboard",

        // children: [{
        //     'id': 'defineOrganization1',
        //     'title': 'داشبورد اطلاعات پرسنلی',
        //     'type': 'item',
        //     'url': '/DataAnalysisDashboard'
        //         // 'http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858'

        //     // <CardMedia src={"http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858"} />

        //     // '<iframe src="http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858" title="description">'
        //     // 'http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858'
        // }],
        // 'url': '/dashboard'
        // 'url': '/http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858'
      },
      {
        id: "personnelManagement",
        title: "پروفایل من",
        type: "collapse",
        icon: "person_outline",
        permision: "personnelManagement",

        children: [
          {
            id: "personnelBaseInformation",
            title: "پروفایل پرسنلی",
            type: "item",
            url: "/userProfile",
            permision: "personnelManagement/personnelBaseInformation",
          },
          {
            id: "talentProfile",
            title: "پروفایل استعدادها",
            type: "item",
            url: "/talentProfile",
            permision: "personnelManagement/talentProfile",
          },
          {
            id: "personnelPaymentInformation",
            title: "پروفایل جبران خدمات",
            type: "item",
            url: "/compensation/userProfile",
            permision: "personnelManagement/compensation/userProfile",
          },
          {
            id: "personnelTimeManagement",
            title: "پروفایل کارکرد",
            type: "item",
            url: "/performanceProfileForm",
            permision: "personnelManagement/performanceProfileForm",
          },
          // {
          //   id: "personnelWelfareService",
          //   title: "پروفایل نظام پیشنهادات",
          //   type: "item",
          //   url: "/porofileSuggestion",
          //   permision: "personnelManagement/porofileSuggestion",
          // },
          {
            id: "listSuggestions1",
            title: "پروفایل نظرسنجی",
            type: "item",
            url: "/surveyProfile",
            permision: "personnelManagement/surveyProfile",
          },
          {
            id: "hse",
            title: "پروفایل سلامت و ایمنی شغلی",
            type: "item",
            url: "/hseProfile",
            permision: "personnelManagement/hseProfile",
          },
          {
            id: "excellenceProfile",
            title: " پروفایل تعالی ",
            type: "item",
            url: "/excellenceProfile",
            permision: "personnelManagement/excellenceProfile",
          },
        ],
      },

      {
        id: "personnelInformationManagement",
        title: "مدیریت اطلاعات پرسنلی",
        type: "collapse",
        icon: "supervisor_account",
        permision: "personnelInformationManagement",

        children: [
          {
            id: "addNewPersonnel",
            title: "تعریف کاربر",
            type: "item",
            url: "/personnel/register",
            permision: "personnelInformationManagement/addNewPersonnel",
          },
          {
            id: "searchPersonnelList",
            title: "لیست پرسنل",
            type: "item",
            url: "/personnel/search",
            permision: "personnelInformationManagement/searchPersonnelList",
          },
        ],
      },

      {
        id: "organizationChartManagement",
        title: "مدیریت ساختار سازمانی",
        type: "collapse",
        icon: "account_balance",
        permision: "organizationChartManagement",

        children: [
          {
            id: "defineJob",
            title: "شناسنامه شغل",
            type: "item",
            url: "/defineJob",
            permision: "organizationChartManagement/defineJob",
          },
          {
            id: "defineOrganization",
            title: "اطلاعات سازمان",
            type: "item",
            url: "/defineOrganization",
            permision: "organizationChartManagement/defineOrganization",
          },
          {
            id: "organizationalPosition",
            title: "پست سازمانی",
            type: "item",
            url: "/organizationalPosition",
            permision: "organizationChartManagement/organizationalPosition",
          },
          {
            id: "organizationalUnit",
            title: "واحد های سازمانی",
            type: "item",
            url: "/organizationalUnit",
            permision: "organizationChartManagement/organizationalUnit",
          },
          {
            id: "OrganizationalChart",
            title: "چارت سازمانی",
            type: "item",
            url: "/OrganizationalChart",
            permision: "organizationChartManagement/OrganizationalChart",
          },
          //     {
          //     'id': 'defineOrganizationBaseInformation',
          //     'title': 'تعریف اطلاعات پایه',
          //     'type': 'item',
          //     'url': '/defineOrganizationBaseInformation'
          // }
        ],
      },
      {
        id: "issuedSentence",
        title: " صدور احکام ",
        type: "collapse",
        icon: "rate_review",

        children: [
          {
            id: "infoChangeType",
            title: "تنظیم تغییر اطلاعات پرسنلی و تشکیلاتی",
            type: "item",
            url: "/infoChangeType",
          },
          {
            id: "definitionOfNotification",
            title: "تعریف فرم ابلاغ",
            type: "item",
            url: "/definitionOfNotification",
          },
          {
            id: "RequestCommunicated",
            title: "درخواست صدور ابلاغ",
            type: "item",
            url: "/requestCommunicated",
          },
          {
            id: "CommunicatedArchive",
            title: "بایگانی ابلاغیه",
            type: "item",
            url: "/communicatedArchive",
          },
        ],
      },

      {
        id: "emplOrder",
        title: "قرارداد و احکام کارگزینی",
        type: "collapse",
        icon: "assignment",
        permision: "emplOrder",

        children: [
          {
            id: "emplOrderContract",
            title: "تعریف قرارداد",
            type: "item",
            url: "/emplOrder/contract",
            permision: "emplOrder/emplOrderContract",
          },
          {
            id: "emplOrderFactors",
            title: "عوامل حکمی",
            type: "item",
            url: "/emplOrder/factors",
            permision: "emplOrder/emplOrderFactors",
          },
          {
            id: "emplOrderStructure",
            title: "نسخه های احکام کارگزینی",
            type: "item",
            url: "/emplOrder/structure",
            permision: "emplOrder/emplOrderStructure",
          },
          {
            id: "emplOrderOrders",
            title: "احکام کارگزینی",
            type: "item",
            url: "/emplOrder/orders",
            permision: "emplOrder/emplOrderOrders",
          },
          {
            id: "emplOrderIssuance",
            title: "صدور احکام و تنظیم قرارداد",
            type: "item",
            url: "/emplOrder/issuance",
            permision: "emplOrder/emplOrderIssuance",
          },
          {
            id: "modifiedEmplOrder",
            title: "صدور احکام اصلاحی",
            type: "item",
            url: "/emplOrder/modifyEmplOrder",
            permision: "emplOrder/modifiedEmplOrder",
          },
        ],
      },

      {
        id: "concurrencyManagement",
        title: "مدیریت کارکرد پرسنل",
        type: "collapse",
        icon: "assignment",
        permision: "functionalManagement",
        children: [
          {
            id: "workingFactors",
            title: "عوامل کاری",
            type: "item",
            icon: "rate_review",
            url: "/workingFactors",
            permision: "functionalManagement/defineWorkingFactors",
          },
          {
            id: "WorkingCalendar",
            title: "تقویم کاری",
            type: "item",
            icon: "rate_review",
            url: "/workingCalendar",
            permision: "functionalManagement/workCalendar",
          },
          {
            id: "Devices",
            title: "سیستم های کنترل کارکرد",
            type: "item",
            icon: "rate_review",
            url: "/devicesForm",
          },
          {
            id: "trafficInfo",
            title: "ثبت کارکرد",
            type: "item",
            icon: "rate_review",
            url: "/functional/trafficInfo",
            permision: "functionalManagement/trafficInfo",
          },
          // {
          //   id: "performanceProfileForm",
          //   title: "پروفایل کارکرد",
          //   type: "item",
          //   icon: "rate_review",
          //   url: "/performanceProfileForm",
          // },
          ///* ################################################### */
          {
            id: "performanceReportForm",
            title: " گزارش کارکرد",
            type: "item",
            icon: "rate_review",
            url: "/performanceReportForm",
          },
          {
            id: "instantReportForm",
            title: "گزارش لحظه ای ",
            type: "item",
            icon: "rate_review",
            url: "/instantReportForm",
          },
          {
            id: "functionalIntegration",
            title: " درخواست تجمیع کارکرد",
            type: "item",
            icon: "rate_review",
            url: "/functional/integrationRequest",
          },
          {
            id: "requestWorkAgentForm",
            title: "درخواست عامل کاری",
            type: "item",
            icon: "rate_review",
            url: "/requestWorkAgentForm",
          },
          {
            id: "RequestMoveShiftForm",
            title: " درخواست جا به جایی شیفت",
            type: "item",
            icon: "rate_review",
            url: "/RequestMoveShiftForm",
          },
        ],
      },

      {
        id: "payroll",
        title: "حقوق و دستمزد",
        type: "collapse",
        icon: "payment",
        permision: "payroll",
        children: [
          {
            id: "payrollOutputType",
            title: "نوع خروجی",
            type: "item",
            url: "/payroll/outputType",
            permision: "payroll/outputType",
          },
          {
            id: "payrollFactors",
            title: "عوامل حقوق و دستمزد",
            type: "item",
            url: "/payroll/factors",
            permision: "payroll/payrollFactor",
          },
          {
            id: "payrollSalarySlipType",
            title: "نوع فیش حقوق و دستمزد",
            type: "item",
            url: "/payroll/salarySlipType",
            permision: "payroll/payslipType",
          },
          {
            id: "payrollAccounting",
            title: "حسابداری حقوق و دستمزد",
            type: "item",
            url: "/payroll/accounting",
            permision: "payroll/accounting",
          },
          {
            id: "payrollGroup",
            title: "گروه حقوق و دستمزد",
            type: "item",
            url: "/payroll/payrollGroup",
            permision: "payroll/payGroup",
          },
          {
            id: "payrollSalaryCalculation",
            title: "محاسبه حقوق و دستمزد",
            type: "item",
            url: "/payroll/salaryCalculation",
            permision: "payroll/salaryCalculation",
          },
        ],
      },

      {
        id: "welfareServices",
        title: "خدمات رفاهی ",
        type: "collapse",
        icon: "local_mall",
        permision: "welfareServices",

        children: [
          {
            id: "financialFacilities",
            title: " تسهیلات مالی",
            type: "collapse",
            permision: "welfareServices/financialFacilities",
            children: [
              {
                id: "definitionOfFinancialFacilitation",
                title: "تعریف تسهیل مالی",
                type: "item",
                url: "/definitionOfFinancialFacilitation",
                permision:
                  "welfareServices/financialFacilities/definitionOfFinancialFacilitation",
              },
              {
                id: "provideFinancialFacilitation",
                title: "تامین تسهیل مالی",
                type: "item",
                url: "/provideFinancialFacilitation",
                permision:
                  "welfareServices/financialFacilities/provideFinancialFacilitation",
              },
              {
                id: "requestForFinancialFacility",
                title: "درخواست تسهیل مالی",
                type: "item",
                url: "/requestForFinancialFacility",
                permision:
                  "welfareServices/financialFacilities/requestForFinancialFacility",
              },
              {
                id: "installmentSettlement",
                title: "تسویه اقساط تسهیل مالی",
                type: "item",
                url: "/installmentSettlement",
                permision:
                  "welfareServices/financialFacilities/installmentSettlement",
              },
            ],
          },
          {
            id: "otherWelfareServices",
            title: " سایر خدمات رفاهی ",
            type: "collapse",
            children: [
              {
                id: "defineWelfareService",
                title: "تعریف خدمات رفاهی",
                type: "item",
                url: "DefineWelfareService",
              },
              {
                id: "defineWelfareEvent",
                title: "تعریف رویداد رفاهی",
                type: "item",
                url: "DefineWelfareEvent",
              },
              {
                id: "welfareServiceAllocation",
                title: "تخصیص خدمت رفاهی",
                type: "item",
                url: "/welfareServiceAllocation",
              },
              {
                id: "welfareServiceAllocation",
                title: "درخواست خدمت رفاهی",
                type: "item",
                url: "otherWelfareServices/welfareRequest",
              },
            ],
          },
          {
            id: "welfareServicesGroup",
            title: "گروه خدمات رفاهی",
            type: "item",
            url: "/welfareServicesGroup",
            permision: "welfareServices/welfareServicesGroup",
          },
          {
            id: "supplementaryInsurance",
            title: "بیمه تکمیلی",
            type: "collapse",
            children: [
              {
                id: "definitionSupplementaryInsurance",
                title: "تعریف قرارداد بیمه تکمیلی",
                type: "item",
                // icon: "confirmation_number",
                url: "/supplementaryInsurance/definition",
              },

              {
                id: "requestSupplementaryInsurance",
                title: "درخواست بیمه تکمیلی",
                type: "item",
                // icon: "confirmation_number",
                url: "/InsuranceRequest",
              },
            ],
          },
        ],
      },

      // {
      //   id: "feedingAutomation",
      //   title: "اتوماسیون تغذیه ",
      //   type: "collapse",
      //   icon: "local_mall",
      //   permision: "feedingAutomation",

      //   children: [
      //     {
      //       id: "foodDefinition",
      //       title: "تعریف غذا  ",
      //       type: "item",
      //       url: "/foodDefinition",
      //       permision: "feedingAutomation/foodDefinition",
      //     },
      //     {
      //       id: "FoodSchedule",
      //       title: "تعریف برنامه غذایی  ",
      //       type: "item",
      //       url: "/foodSchedule",
      //       permision: "feedingAutomation/foodScheduleDefinition",
      //     },
      //     {
      //       id: "PartyDefinition",
      //       title: "تعریف گروه  ",
      //       type: "item",
      //       url: "/partyDefinition",
      //       permision: "feedingAutomation/partyDefinition",
      //     },
      //     {
      //       id: "mealDefinition",
      //       title: "تعریف وعده  ",
      //       type: "item",
      //       url: "/mealDefinition",
      //       permision: "feedingAutomation/mealDefinition",
      //     },
      //     {
      //       id: "foodReserveReport",
      //       title: "گزارش رزرو غذا   ",
      //       type: "item",
      //       url: "/foodReserveReport",
      //       permision: "feedingAutomation/foodReserveReport",
      //     },
      //     {
      //       id: "FoodReserve",
      //       title: "رزرو غذا  ",
      //       type: "item",
      //       url: "/foodReserve",
      //       permision: "feedingAutomation/foodReserve",
      //     },
      //     {
      //       id: "creditCharge",
      //       title: "شارژ اعتبار  ",
      //       type: "item",
      //       url: "/creditCharge",
      //       permision: "feedingAutomation/creditCharge",
      //     },
      //     {
      //       id: "DailyReserve",
      //       title: "رزرو روزانه   ",
      //       type: "item",
      //       url: "/dailyReserve",
      //       permision: "feedingAutomation/dailyReserve",
      //     },
      //   ],
      // },

      {
        id: "humanResourcesPlanning",
        title: "برنامه ریزی منابع انسانی",
        type: "collapse",
        icon: "assignment",
        permision: "humanResourcesPlanning",
        children: [
          {
            id: "basicDefinitionsOfHumanResourcesPlanning",
            title: "تعاریف پایه",
            type: "item",
            icon: "rate_review",
            url: "/BDHRP",
            permision:
              "humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning",
          },
          {
            id: "creatingJobNeeds",
            title: "ایجاد نیازمندی شغلی",
            type: "item",
            icon: "rate_review",
            url: "/creatingJobNeeds",
            permision: "humanResourcesPlanning/creatingJobNeeds",
          },
          {
            id: "jobBoards",
            title: "شهر مشاغل",
            type: "item",
            icon: "rate_review",
            url: "/jobBoards",
            permision: "jobBoards",
          },
        ],
      },

      {
        id: "educationModule",
        title: "آموزش و توانمندسازی",
        type: "collapse",
        icon: "school",
        permision: "education",
        children: [
          {
            id: "educationBaseInformation",
            title: "اطلاعات پایه آموزش",
            type: "collapse",
            permision: "education/educationBaseInformation",

            children: [
              {
                id: "institutionsAndlecturers",
                title: "بررسی موسسات و مدرسین دوره",
                type: "item",
                url: "/institutionsAndlecturers",
                permision:
                  "education/educationBaseInformation/institutionsAndlecturers",
              },
              {
                id: "definitionOfEducationalTitles",
                title: "تعریف عناوین آموزشی",
                type: "item",
                url: "/definitionOfEducationalTitles",
                permision:
                  "education/educationBaseInformation/definitionOfEducationalTitles",
              },
              // {
              //   id: "EducationalProfile",
              //   title: "شناسنامه آموزشی",
              //   type: "item",
              //   url: "/EducationalProfile",
              //   permision:
              //     "education/educationBaseInformation/EducationalProfile",
              // },
            ],
          },
          {
            id: "TrainingNeedsAssessment",
            title: "نیازسنجی آموزشی",
            type: "item",
            url: "/TrainingNeedsAssessment",
            permision: "education/TrainingNeedsAssessment",
          },
          {
            id: "editEducationalProgramAndBudget",
            title: "تدوین برنامه آموزشی",
            type: "item",
            url: "/editEducationalProgramAndBudget",
            permision: "education/editEducationalProgramAndBudget",
          },
          {
            id: "educationCourses",
            title: "دوره های آموزشی",
            type: "item",
            url: "/educationCourses",
            permision: "education/educationCourses",
          },
          // {
          //   id: "needAssessmentEmploy",
          //   title: "نیاز سنجی آموزشی -کارمندان ",
          //   type: "item",
          //   url: "/needAssessmentEmpoly",
          // },
          // {
          //   id: "needAssessmentManager",
          //   title: "نیاز سنجی آموزشی -مدیران ",
          //   type: "item",
          //   url: "/needAssessmentManager",
          // },
          // {
          //   id: "studyneedAssessmentOrganization",
          //   title: "بررسی نیاز سنجی سازمان",
          //   type: "item",
          //   url: "/studyneedAssessmentOrganization",
          //   permision: "education/studyneedAssessmentOrganization",

          // },
        ],
      },

      {
        id: "manjor",
        title: "مدیریت و ارزیابی عملکرد",
        type: "collapse",
        icon: "rate_review",
        permision: "performanceManagement",
        children: [
          {
            id: "goals",
            title: "تعریف هدف",
            type: "item",
            url: "/goals",
            permision: "performanceManagement/goals",
          },
          {
            id: "goalsReport",
            title: "گزارش هدف",
            type: "item",
            url: "/reportGoals",
            permision: "performanceManagement/reportGoals",
          },
          {
            id: "defineEvaluationTime",
            title: "تعریف دوره ارزیابی",
            type: "item",
            url: "/defineEvaluationTime",
            permision: "performanceManagement/defineEvaluationTime",
          },
          // {
          //   id: 'evaluatorDetermination',
          //   title: 'تعیین ارزیاب',
          //   type: 'item',
          //   icon: 'rate_review',
          //   url: "/evaluatorDetermination",
          // },
          // {
          //   id: "evaluationsManagement",
          //   title: "راهبری دوره های ارزیابی",
          //   type: "item",
          //   url: "/evaluationsManagement",
          //   permision: "performanceManagement/evaluationsManagement",

          // },
          // {
          //   id: "reportPerformanceEvaluation",
          //   title: "گزارش ارزیابی عملکرد",
          //   type: "item",
          //   url: "/EvaluationReport",
          //   // permision: "performanceManagement/reportPerformanceEvaluation",

          // },
          // {
          //   id: 'correctEvaluator',
          //   title: 'اصلاح ارزیاب',
          //   type: 'item',
          //   icon: 'rate_review',
          //   url: "/correctEvaluator",
          // },
          // {
          //   id: 'seniorManagersConfirmation',
          //   title: 'تایید مدیران ارشد',
          //   type: 'item',
          //   icon: 'rate_review',
          //   url: "/seniorManagersConfirmation",
          // }
        ],
      },

      // {
      //   id: "suggestion",
      //   title: "نظام پیشنهادات",
      //   type: "collapse",
      //   icon: "assignment",
      //   permision: "suggestions",
      //   children: [
      //     {
      //       id: "submitSuggestions",
      //       title: " تعاریف پایه نظام پیشنهادات",
      //       permision: "suggestions/submitSuggestions",
      //       type: "collapse",
      //       children: [
      //         {
      //           id: "committee",
      //           title: " تعریف کمیته",
      //           type: "item",
      //           url: "/committee",
      //           permision: "suggestions/submitSuggestions/committee",
      //         },
      //       ],
      //     },
      //     {
      //       id: "defineSuggest",
      //       title: "ارائه پیشنهاد",
      //       type: "item",
      //       url: "/defineSuggest",
      //       permision: "suggestions/definitionSuggestion",
      //     },
      //     {
      //       id: "suggestionGuideline",
      //       title: " صفحه راهبری پیشنهادات",
      //       type: "item",
      //       url: "/suggestionGuideline",
      //       permision: "suggestions/suggestionGuideline",
      //     },
      //   ],
      // },

      {
        id: "excellence",
        title: "تعالی پرسنل و خانواده",
        type: "collapse",
        icon: "person_outline",
        permision: "excellence",

        children: [
          {
            id: "excellencePersonel",
            title: "تعریف برنامه تعالی پرسنل و خانواده",
            type: "item",
            url: "/excellence/excellencePersonel",
            icon: "person_outline",
            permision: "excellence/excellencePersonel",
          },
          {
            id: "Execution",
            title: "اجرای برنامه فرهنگی",
            type: "collapse",
            icon: "person_outline",
            // url: "/excellence/Execution",
            // permision: "tasks",

            children: [
              {
                id: "ExecutionProgram",
                title: "اجرای برنامه فرهنگی",
                type: "item",
                url: "/excellence/ExecutionProgram/ExecutionProgram",
                permision: "excellence/ExecutionProgram",
              },
              {
                id: "WaitingRegistration",
                title: "راهبری اجرای برنامه تعالی پرسنل و خانواده",
                type: "item",
                url: "/excellence/WaitingRegistration",
                permision: "excellence/WaitingRegistration",
              },
              // {
              //   id: "ConfirmationManagers",
              //   title: "تایید مدیران ارشد",
              //   type: "item",
              //   url: "/excellence/ConfirmationManagers",
              //   // permision: "excellence/WaitingRegistration",
              // },
              // {
              //   id: "RecordEvents",
              //   title: "ثبت وقایع برنامه توسط مسئول",
              //   type: "item",
              //   url: "/excellence/RecordEvents",
              //   // permision: "excellence/WaitingRegistration",
              // },
              // {
              //   id: "AudienceEvaluation",
              //   title: "ارزیابی شرکت کنندگان توسط مربی",
              //   type: "item",
              //   url: "/excellence/AudienceEvaluation",
              //   // permision: "excellence/WaitingRegistration",
              // },
              // {
              //   id: "ProgramEvaluation",
              //   title: "ارزیابی برنامه فرهنگی",
              //   type: "item",
              //   url: "/excellence/ProgramEvaluation",
              //   // permision: "excellence/WaitingRegistration",
              // }
            ],
          },
          {
            id: "Registration",
            title: "ثبت‌‌نام در برنامه",
            type: "collapse",
            icon: "person_outline",
            // url: "/excellence/Execution",
            // permision: "tasks",

            children: [
              {
                id: "excellenceRegistration",
                title: "ثبت‌‌نام در برنامه",
                type: "item",
                url: "/excellence/Registration",
                permision: "excellence/Registration",
              },
              // {
              //   id: "approveRegistration",
              //   title: "تایید پیشنهادات",
              //   type: "item",
              //   url: "/excellence/ApproveOffers",
              // },
            ],
          },
          // {
          //   id: "reports",
          //   title: "گزارشات",
          //   type: "item",
          //   url: "/excellence/reports",
          //   permision: "excelence/excellencePersonel",
          // },
        ],
      },

      {
        id: "StrategicAndOperationalPlanning",
        title: "برنامه ریزی راهبردی و عملیاتی",
        type: "collapse",
        icon: "assignment",
        permision: "strategicAndOperationalPlanning",
        children: [
          {
            id: "operationalPlanning",
            title: "برنامه ریزی عملیاتی",
            type: "item",
            icon: "rate_review",
            url: "/operationalPlanning",
            permision: "strategicAndOperationalPlanning/operationalPlanning",
          },
        ],
      },

      // {
      //   id: "hse",
      //   title: "ایمنی ، بهداشت و سلامت کارکنان",
      //   type: "collapse",
      //   icon: "assignment",
      //   permision: "hse",
      //   children: [
      //     {
      //       id: "determiningBasicWorkingScope",
      //       title: "تعیین محدوده‌های کاری پایه",
      //       type: "item",
      //       icon: "rate_review",
      //       url: "/determiningBasicWorkingScope",
      //       permision: "hse/determiningBasicWorkingScope",
      //     },
      //     {
      //       id: "humanResourcesExpert",
      //       title: "فرایند بهداشت حرفه‌ای",
      //       type: "item",
      //       icon: "rate_review",
      //       url: "/humanResourcesExpert",
      //       permision: "hse/professionalHealth/humanResourcesExpert",
      //     },

      //     // {
      //     //   id: "medicalDocument",
      //     //   title: "پرونده کامل پزشکی",
      //     //   type: "item",
      //     //   icon: "rate_review",
      //     //   url: "/medicalDocument",
      //     // },
      //     // {
      //     //   id: "specialExaminationReports",
      //     //   title: " گزارشات معاینات خاص",
      //     //   type: "item",
      //     //   icon: "rate_review",
      //     //   url: "/specialExaminationReports",
      //     //   permision: "hse/specialExaminationReports",
      //     // },
      //   ],
      // },

      {
        id: "fileManager",
        title: "مدیریت مستندات",
        type: "item",
        icon: "folder_open",
        url: "/fileManager",
        permision: "fileManager",
      },

      {
        id: "survey",
        title: "نظرسنجی",
        type: "collapse",
        // url: "/survey",
        icon: "list_alt",
        permision: "survey",
        children: [
          {
            id: "surveyDefinition",
            title: "تعریف نظرسنجی",
            type: "item",
            url: "/survey/definition",
            permision: "survey/surveyDefinition",
          },
          {
            id: "questionnaireArchive",
            title: "لیست نظرسنجی ها",
            permision: "survey/questionnaireArchive",
            type: "item",
            url: "/survey/list",
          },
        ],
      },

      {
        id: "notification",
        title: "اعلان ها",
        type: "collapse",
        icon: "list_alt",
        permision: "notification",
        children: [
          {
            id: "notificationManagement",
            title: "مدیریت اعلان‌ها",
            type: "item",
            icon: "confirmation_number",
            url: "/notification",
            permision: "notification/management",
          },
          {
            id: "myNotifications",
            title: "پیام‌های من",
            permision: "notification/myNotifications",
            icon: "confirmation_number",
            type: "item",
            url: "myNotifications",
          },
        ],
      },

      {
        id: "questionnaire",
        title: "پرسشنامه",
        type: "collapse",
        icon: "live_help",
        permision: "questionnaire",
        children: [
          {
            id: "questionnaireEditor",
            title: "ویرایشگر پرسشنامه",
            type: "item",
            url: "/questionnaire/editor",
          },
          {
            id: "questionnaireArchive",
            title: "بایگانی پرسشنامه",
            type: "item",
            url: "/questionnaire/archive",
          },
        ],
      },

      {
        id: "reports",
        title: "گزارشات",
        type: "collapse",
        icon: "bar_chart",
        permision: "reports",

        children: [
          {
            id: "personnelReport",
            title: "اطلاعات پرسنلی",
            type: "collapse",
            icon: "",
            permision: "reports/personnelReport",

            children: [
              {
                id: "addressReport",
                title: "گزارش آدرس",
                type: "item",
                url: "/addressReport",
                permision: "reports/personnelReport/addressReport",
              },
              {
                id: "contactReport",
                title: "گزارش اطلاعات تماس",
                type: "item",
                url: "/contactReport",
                permision: "reports/personnelReport/contactReport",
              },
              {
                id: "familyReport",
                title: "گزارش اطلاعات خانواده",
                type: "item",
                url: "/familyReport",
                permision: "reports/personnelReport/familyReport",
              },
              {
                id: "bankReport",
                title: "گزارش اطلاعات بانکی",
                type: "item",
                url: "/bankReport",
                permision: "reports/personnelReport/bankReport",
              },
            ],
          },

          {
            id: "EvaluationList",
            title: "لیست دوره ارزیابی",
            type: "item",
            url: "/evaluationList",
            permision: "reports/evaluationList",
          },
          {
            id: "reportsExcelence",
            title: "گزارشات تعالی",
            type: "item",
            url: "/reports/excellence",
            permision: "reports/excelence",
          },
          {
            id: "emplOrder",
            title: "قرارداد و احکام کارگزینی",
            type: "collapse",
            icon: "",
            permision: "reports/emplOrder",

            children: [
              {
                id: "emplOrderArchiveOrders",
                title: "بایگانی احکام کارگزینی",
                type: "item",
                url: "/emplOrder/archive/orders",
                permision: "reports/emplOrder/emplOrderArchiveOrders",
              },
              {
                id: "emplOrderArchiveContracts",
                title: "بایگانی قراردادها",
                type: "item",
                url: "/emplOrder/archive/contracts",
                permision: "reports/emplOrder/emplOrderArchiveContracts",
              },
            ],
          },
          {
            id: "payroll",
            title: "حقوق و دستمزد",
            type: "collapse",
            icon: "",
            permision: "payroll",
            children: [
              {
                id: "payrollCalculationsList",
                title: "لیست محاسبات حقوق و دستمزد",
                type: "item",
                url: "/payroll/reports/calculations",
                permision: "payroll/calcPayroll",
              },
              {
                id: "payrollOutputs",
                title: "خروجی های حقوق و دستمزد",
                type: "item",
                url: "/payroll/reports/outputs",
                permision: "payroll/outputs",
              },
              {
                id: "payrollAuditReport",
                title: "گزارش حسابرسی حقوق و دستمزد",
                type: "item",
                url: "/payroll/reports/audit",
                // permision: "payroll/audit",
              },
            ],
          },
        ],
      },

      // {
      //     'id': 'education',
      //     'title': 'آموزش',
      //     'type': 'collapse',
      //     'icon': 'rate_review',
      //     'children': [{
      //         'id': 'needAssessment',
      //         'title': 'نیازسنجی آموزشی',
      //         'type': 'item',
      //         'url': '/needAssessment'
      //     }]
      // },

      {
        id: "systemBaseData",
        title: " اطلاعات پایه سامانه ",
        type: "collapse",
        icon: "rate_review",
        permision: "systemBaseData",

        children: [
          {
            id: "BaseOrganizationStructureInformation",
            title: "اطلاعات پایه ساختار سازمانی",
            type: "item",
            url: "/BaseOrganizationStructureInformation",
            permision: "systemBaseData/BOS",
          },
          {
            id: "systemBaseDataOrganizationsAndBranches",
            title: "سازمان ها و شعب",
            type: "item",
            url: "/organizationsAndBranches",
            permision: "payroll/organsAndBranches",
          },
          {
            id: "systemBaseDataGeneral",
            title: "مدیریت استعدادها",
            type: "item",
            url: "/generalBaseData",
            // permision: "/generalBaseData/root_view",
          },
          {
            id: "payrollBaseData",
            title: "اطلاعات پایه حقوق و دستمزد",
            type: "item",
            url: "/payroll/baseData",
            permision: "payroll/baseData",
          },
          {
            id: "emplOrderGeneral",
            title: "قرارداد و احکام کارگزینی",
            type: "collapse",

            children: [
              {
                id: "formulaDefinition",
                title: "تعريف فرمول",
                type: "item",
                url: "/formula",
                permision: "systemBaseData/emplOrderGeneral/formulaDefinition",
              },
            ],
            permision: "systemBaseData/emplOrderGeneral",
          },
        ],
      },
    ],
  },
  {
    id: "systemManagement",
    title: "مديريت سيستم",
    type: "collapse",
    icon: "dvr",
    permision: "systemManagement",

    children: [
      // {
      //     'id': 'formula',
      //     'title': 'فرمول',
      //     'type': 'collapse',
      //     'icon': 'functions',
      //     'children': [{
      //         'id': 'formulaDefinition',
      //         'title': 'تعريف فرمول',
      //         'type': 'item',
      //         'url': '/formula'
      //     }]
      // },
      {
        id: "accessLevel",
        title: "مدیریت دسترسی",
        type: "item",
        icon: "functions",
        url: "/accessLevel",
        permision: "systemManagement/accessLevel",
      },
    ],
  },
  {
    id: "organizationExcellence",
    title: "تعالی سازمان",
    type: "collapse",
    icon: "dvr",

    children: [
      {
        id: "modelDefinition",
        title: "تعریف مدل تعالی",
        type: "item",
        icon: "functions",
        url: "/organizationExcellence/modelOfExcellence",
      },
      {
        id: "modelAllocation",
        title: "تخصیص فرم های مدل تعالی",
        type: "item",
        icon: "functions",
        url: "/organizationExcellence/modelAllocation",
      },
      {
        id: "test",
        title: "تست",
        type: "item",
        icon: "functions",
        url: "/organizationExcellence/test",
      },
    ],
  },
];

export default navigationConfig;
