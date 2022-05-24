import React from "react";
import { Redirect } from "react-router-dom";
import { FuseUtils } from "@fuse";
import { DashboardConfig } from "app/main/pages/dashboard/DashboardConfig";
import LoginConfig from "../main/pages/login/LoginConfig";
import PersonnelBaseInformationConfig from "../main/pages/personnelBaseInformation/PersonnelBaseInformationConfig";
import DefineJobConfig from "../main/pages/organizationalStructureModule/defineJob/DefineJobConfig";
import EmplOrderConfig from "../main/pages/emplOrder/EmplOrderConfig";
import QuestionnaireConfig from "../main/pages/questionnaire/QuestionnaireConfig";
import SurveyConfig from "../main/pages/survey/SurveyConfig";
import CompensationConfig from "../main/pages/compensation/CompensationConfig";
import PayrollConfig from "../main/pages/payroll/PayrollConfig";
import FilesManagementConfig from "../main/pages/filesManagement/FilesManagementConfig";
import OrgsAndBranchesConfig from "../main/pages/systemBaseData/organizationsAndBranches/OrgsAndBranchesConfig";
// import ModifiedEmplOrderConfig from "../main/pages/emplOrder/modifiedEmplOrder/MEOConfig";
import HelpConfig from "../main/pages/help/HelpConfig";
import PersonnelManagementConfig from "../main/pages/personnelManagement/PersonnelManagementConfig";
import FunctionalManagementConfig from "../main/pages/functionalManagement/FunctionalManagementConfig";
import UserProfileConfig from "../main/pages/userProfile/UserProfileConfig";
import familyReport from "../main/pages/reportModule/familyReport/familyReportConfig";
import contactReport from "../main/pages/reportModule/contactReport/contactReportConfig";
import addressReport from "../main/pages/reportModule/addressReport/addressReportConfig";
import Tasks from "../main/pages/tasks/TasksConfig";
// import ExampleConfig from "../main/pages/example/exampleConfig";
// import AnotherTestConfig from "../main/pages/anotherTest/anotherTestConfig";
import DataAnalysisDashboardComponentConfig from "../main/pages/DataAnalysisDashboard/DataAnalysisDashboardComponentConfig";
import organizationalPosition from "../main/pages/organizationalStructureModule/organizationalPosition/organizationalPositionConfig";
import OrganizationalUnitConfig from "../main/pages/organizationalStructureModule/organizationalUnit/OrganizationalUnitConfig";
import OrganizationalChartConfig from "../main/pages/organizationalStructureModule/organizationalChart/organizationalChartConfig";
import skillsConfig from "../main/pages/skills/skillsConfig";
import FormulaConfig from "../main/pages/formula/FormulaConfig";
import BankReportConfig from "../main/pages/reportModule/bankReport/bankReportConfig";
import GeneralBaseDataConfig from "../main/pages/systemBaseData/generalBaseData/GeneralBaseDataConfig";
import InstitutionsConfig from "../main/pages/educationModule/BasicInformation/institutionsAndlecturers/InstitutionsAndlecturersConfig";
import definitionOfEducationalTitlesConfig from "../main/pages/educationModule/BasicInformation/definitionOfEducationalTitles/definitionOfEducationalTitlesConfig";
import educationalProfileConfig from "../main/pages/educationModule/BasicInformation/EducationalProfile/EducationalProfileConfig";
import trainingNeedsConfig from "../main/pages/educationModule/BasicInformation/needAssessment/needAssessmentConfig";
import DefineOrganizationConfig from "../main/pages/organizationalStructureModule/defineOrganization/DefineOrganizationConfig";
import AddInstitutionsConfig from "app/main/pages/educationModule/BasicInformation/institutionsAndlecturers/Institutions/AddInstitutions/AddInstitutionsConfig";
import baseOrganizationStructureInformationConfig from "../main/pages/baseOrganizationStructureInformation/baseOrganizationStructureInformationConfig";
import DefinitionOfWelfareServicesConfig from "./../main/pages/definitionOfWelfareServices/DefinitionOfWelfareServicesConfig";
import accessLevelConfig from "../main/pages/accessLevel/accessLevelConfig";
import AccommodationServicesConfig from "./../main/pages/definitionOfWelfareServices/AccommodationServicesConfig";
// import createEvaluationFormConfig from "../main/pages/educationModule/BasicInformation/createEvaluationForm/createEvaluationFormConfig"
import needAssessmentEmpolyConfig from "../main/pages/educationModule/BasicInformation/needAssessmentEmpoly/needAssessmentEmpolyConfig";
import needAssessmentManagerConfig from "../main/pages/educationModule/BasicInformation/needAssessmentManager/needAssessmentManagerConfig";
import recordCoursesListConfig from "../main/pages/educationModule/BasicInformation/needAssessmentManager/recordCoursesListConfig";
import editEducationalProgramAndBudgetConfig from "../main/pages/educationModule/BasicInformation/editEducationalProgramAndBudget/editEducationalProgramAndBudgetConfig";
import RequiredCoursesConfig from "../main/pages/educationModule/BasicInformation/requiredCourses/RequiredCoursesConfig";
import educationCoursesConfig from "../main/pages/educationModule/educationCourses/educationCoursesConfig";
import notificationConfig from "../main/pages/notification/notificationConfig";
import myNotificationsConfig from "./../main/pages/myNotifications/myNotificationsConfig";
import AddedCourseListConfig from "app/main/pages/educationModule/BasicInformation/requiredCourses/AddedCourseList/AddedCourseListConfig";
import studyneedAssessmentOrganizationConfig from "app/main/pages/educationModule/BasicInformation/studyneedAssessmentOrganization/studyneedAssessmentOrganizationConfig";
import studyneedAssessmentConfig from "app/main/pages/educationModule/BasicInformation/studyneedAssessment/studyneedAssessmentConfig";
import goalsConfig from "../main/pages/goals/goalsConfig";
import reportGoalsConfig from "../main/pages/goals/reportGoals/reportGoalsConfig";
import defineEvaluationTimeConfig from "../main/pages/goals/performanceEvaluation/defineEvaluationTime/defineEvaluationTimeConfig";
import evaluatorDeterminationConfig from "../main/pages/goals/performanceEvaluation/evaluatorDetermination/evaluatorDeterminationConfig";
import recordConfig from "../main/pages/goals/record/recordConfig";
import evaluationsManagementConfig from "../main/pages/goals/performanceEvaluation/evaluationsManagement/evaluationsManagementConfig";
import reportPerformanceEvaluationFormConfig from "../main/pages/goals/performanceEvaluation/reportPerformanceEvaluation/reportPerformanceEvaluationFormConfig";
import correctEvaluatorConfig from "../main/pages/goals/performanceEvaluation/correctEvaluator/correctEvaluatorConfig";
import seniorManagersConfirmationConfig from "../main/pages/goals/performanceEvaluation/seniorManagersConfirmation/seniorManagersConfirmationConfig";
import defineSuggestConfig from "../main/pages/suggestion/submitSuggestions/defineSuggestConfig";
import committeeConfig from "../main/pages/suggestion/Committee/committeeConfig";
import porofileSuggestionConfig from "../main/pages/suggestion/ProfileSuggestion/porofileSuggestionConfig";
import resultSuggestionConfig from "../main/pages/suggestion/resultSuggestion/resultSuggestionConfig";
import operationalPlanningConfig from "../main/pages/StrategicAndOperationalPlanning/operationalPlanning/operationalPlanningConfig";
import suggestionGuidelineConfig from "../main/pages/suggestion/suggestionGuideline/suggestionGuidelineConfig";
import suggestionGeneralConfig from "../main/pages/suggestion/suggestionGeneral/suggestionGeneralConfig";
import suggestionResultConfig from "../main/pages/suggestion/suggestionResult/suggestionResultConfig";
import BDHRPConfig from "./../main/pages/humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/BDHRPConfig";
import creatingJobNeedsConfig from "./../main/pages/humanResourcesPlanning/creatingJobNeeds/creatingJobNeedsConfig";
import jobNeedManagementConfig from "./../main/pages/humanResourcesPlanning/jobNeedManagement/jobNeedManagementConfig";
import signUpConfig from "app/main/pages/humanResourcesPlanning/jobBoards/signUp/signUpConfig";
import mainPageConfig from "app/main/pages/humanResourcesPlanning/jobBoards/mainPageConfig";
import talentProfileConfig from "./../main/pages/humanResourcesPlanning/talentProfile/talentProfileConfig";
import volunteerManagementConfig from "./../main/pages/humanResourcesPlanning/volunteerManagement/volunteerManagementConfig";
import volunteerReviewConfig from "./../main/pages/humanResourcesPlanning/volunteerManagement/volunteerReview/volunteerReviewConfig";
import jobDescriptionConfig from "./../main/pages/humanResourcesPlanning/jobBoards/jobDescription/jobDescriptionConfig";
import { DevicesConfig } from "./../main/pages/concurrencyManagement/Devices/DevicesConfig";
import { PerformanceProfileConfig } from "./../main/pages/concurrencyManagement/PerformanceProfile/PerformanceProfileConfig";
import { WorkingCalendarConfig } from "./../main/pages/concurrencyManagement/WorkingCalendar/WorkingCalendarConfig";
import { WorkingFactorsConfig } from "../main/pages/concurrencyManagement/workingFactors/WorkingFactorsConfig";
import { PerformanceReportConfig } from "../main/pages/concurrencyManagement/PerformanceReport/PerformanceReportConfig";
import { InstantReportConfig } from "../main/pages/concurrencyManagement/InstantReport/InstantReportConfig";
import { RequestWorkAgentConfig } from "../main/pages/concurrencyManagement/RequestWorkAgent/RequestWorkAgentConfig";
import { RequestMoveShiftConfig } from "../main/pages/concurrencyManagement/RequestMoveShift/RequestMoveShiftConfig";
import { RequestFunctionalIntegrationConfig } from "../main/pages/concurrencyManagement/RequestFunctionalIntegration/RequestFunctionalIntegrationConfig";
import determiningBasicWorkingScope from "./../main/pages/employeeSafetyAndHealthRecords/basicSafetyAndHealthInformation/determiningBasicWorkingScope/DBWSConfig";
import humanResourcesExpertConfig from "app/main/pages/employeeSafetyAndHealthRecords/professionalHealth/humanResourcesExpertConfig";
import medicalDocumentConfig from "app/main/pages/employeeSafetyAndHealthRecords/professionalHealth/medicalDocumentConfig";
import { StaffPerformanceReviewConfig } from "../main/pages/concurrencyManagement/RequestFunctionalIntegration/StaffPerformanceReview/StaffPerformanceReviewConfig";
import { ReviewManagarConfig } from "../main/pages/concurrencyManagement/RequestFunctionalIntegration/ReviewManagar/ReviewManagarConfig";
import { ConfirmRequestConfig } from "../main/pages/concurrencyManagement/RequestWorkAgent/ConfirmRequest/ConfirmRequestConfig";
import EvaluationReportConfig from "app/main/pages/tasks/forms/PerformanceEvaluations/difineEvaluation/EvaluationReports/EvaluationReportConfig";
import specialExaminationReportsConfig from "app/main/pages/employeeSafetyAndHealthRecords/specialExaminations/specialExaminationReports/specialExaminationReportsConfig";
import EvaluationListConfig from "../main/pages/goals/performanceEvaluation/evaluationList/EvaluationListConfig";

// taha
import WaitingRegistrationConfig from "../main/pages/excellencePersonel/waitingRegistration/WaitingRegistrationConfig";
import { ExcellenceConfig } from "./../main/pages/excellencePersonel/ExcellenceConfig";

import sessionPageConfig from "./../main/pages/humanResourcesPlanning/sessionPage/sessionPageConfig";
import FoodDefinitionConfig from "app/main/pages/feedingAutomation/foodDefinition/FoodDefinitionConfig";
import MealDefinitionConfig from "app/main/pages/feedingAutomation/mealDefinition/MealDefinitionConfig";
import FoodScheduleConfig from "app/main/pages/feedingAutomation/foodScheduleDefinition/FoodScheduleConfig";
import PartyDefinitionConfig from "app/main/pages/feedingAutomation/partyDefinition/PartyDefinitionConfig";
import FoodReserveConfig from "app/main/pages/feedingAutomation/foodReserve/FoodReserveConfig";
import CreditChargeConfig from "app/main/pages/feedingAutomation/creditCharge/CreditChargeConfig";
import DailyReserveConfig from "app/main/pages/feedingAutomation/dailyReserve/DailyReserveConfig";
import ReserveReportConfig from "app/main/pages/feedingAutomation/foodReserveReport/ReserveReportConfig";

//

import definitionConfig from "app/main/pages/welfareSevicesModule/financialFacilities/definitionOf/definitionConfig";
import welfareServicesGroup from "app/main/pages/welfareSevicesModule/welfareServicesGroup/welfareServicesGroupConfig";
import provideConfig from "app/main/pages/welfareSevicesModule/financialFacilities/provideOf/provideConfig";
import providingloans from "app/main/pages/welfareSevicesModule/financialFacilities/providingloans/providingloansConfig";
import RequestConfig from "app/main/pages/welfareSevicesModule/financialFacilities/RequestFor/RequestConfig";
import LoanReportConfig from "app/main/pages/welfareSevicesModule/financialFacilities/loanReport/loanReportConfig";
import ViewRecipientConfig from "app/main/pages/welfareSevicesModule/financialFacilities/viewRecipient/viewRecipientConfig";
import InstallmentSettlementConfig from "app/main/pages/welfareSevicesModule/financialFacilities/settlement/InstallmentSettlementConfig";
import welfareServiceAllocationConfig from "app/main/pages/welfareSevicesModule/otherWelfareServices/welfareServiceAllocation/welfareServiceAllocationConfig";
import reviewAllocationConfig from "app/main/pages/welfareSevicesModule/otherWelfareServices/reviewAllocation/reviewAllocationConfig";
import welfareRequest from "./../main/pages/welfareSevicesModule/otherWelfareServices/welfareRequest/welfareRequestConfig";
import InsuranceRequestConfig from "app/main/pages/welfareSevicesModule/supplementaryInsurance/InsuranceRequest/InsuranceRequestConfig";
import InsuranceRequestCheckConfig from "app/main/pages/welfareSevicesModule/supplementaryInsurance/InsuranceRequestCheck/InsuranceRequestCheckConfig";
import defineWelfareServiceConfig from "app/main/pages/welfareSevicesModule/otherWelfareServices/DefineWelfareService/defineWelfareServiceConfig";
import defineWelfareEventConfig from "app/main/pages/welfareSevicesModule/otherWelfareServices/DefineWelfareEvent/defineWelfareEventConfig";
import InfoChangeTypeConfig from "app/main/pages/communication/infoChangeType/InfoChangeTypeConfig";

import DefinitionOfNotificationConfig from "app/main/pages/DefinitionOfNotification/FormConfig";
import RequestCommunicated from "app/main/pages/requestCommunicated/FormConfig";
import communicatedArchive from "app/main/pages/communication/communicatedArchive/FormConfig";
import OrganizationExcellenceConfig from "./../main/pages/organizationExcellence/OrganizationExcellenceConfig";
import TestConfig from "app/main/pages/organizationExcellence/test/TestConfig.js";

const routeConfigs = [
  TestConfig,
  DashboardConfig,
  LoginConfig,
  DefinitionOfNotificationConfig,
  RequestCommunicated,
  communicatedArchive,
  definitionConfig,
  RequestConfig,
  provideConfig,
  providingloans,
  LoanReportConfig,
  ViewRecipientConfig,
  InstallmentSettlementConfig,
  welfareServicesGroup,
  defineWelfareServiceConfig,
  defineWelfareEventConfig,
  welfareServiceAllocationConfig,
  reviewAllocationConfig,
  PersonnelBaseInformationConfig,
  DefineOrganizationConfig,
  ExcellenceConfig,
  WaitingRegistrationConfig,
  welfareRequest,
  InsuranceRequestConfig,
  InsuranceRequestCheckConfig,
  StaffPerformanceReviewConfig,
  ReviewManagarConfig,
  ConfirmRequestConfig,
  PerformanceReportConfig,
  InstantReportConfig,
  RequestWorkAgentConfig,
  RequestMoveShiftConfig,
  RequestFunctionalIntegrationConfig,
  DevicesConfig,
  WorkingCalendarConfig,
  WorkingFactorsConfig,
  PerformanceProfileConfig,
  DefineJobConfig,
  EmplOrderConfig,
  QuestionnaireConfig,
  SurveyConfig,
  CompensationConfig,
  PayrollConfig,
  FilesManagementConfig,
  OrgsAndBranchesConfig,
  HelpConfig,
  PersonnelManagementConfig,
  FunctionalManagementConfig,
  UserProfileConfig,
  // ExampleConfig,
  DataAnalysisDashboardComponentConfig,
  organizationalPosition,
  OrganizationalUnitConfig,
  OrganizationalChartConfig,
  familyReport,
  contactReport,
  addressReport,
  Tasks,
  skillsConfig,
  FormulaConfig,
  BankReportConfig,
  GeneralBaseDataConfig,
  InstitutionsConfig,
  definitionOfEducationalTitlesConfig,
  AddInstitutionsConfig,
  educationalProfileConfig,
  trainingNeedsConfig,
  baseOrganizationStructureInformationConfig,
  DefinitionOfWelfareServicesConfig,
  accessLevelConfig,
  // createEvaluationFormConfig,
  AccommodationServicesConfig,
  needAssessmentEmpolyConfig,
  needAssessmentManagerConfig,
  studyneedAssessmentOrganizationConfig,
  recordCoursesListConfig,
  editEducationalProgramAndBudgetConfig,
  RequiredCoursesConfig,
  educationCoursesConfig,
  notificationConfig,
  myNotificationsConfig,
  AddedCourseListConfig,
  studyneedAssessmentConfig,
  goalsConfig,
  recordConfig,
  reportGoalsConfig,
  defineEvaluationTimeConfig,
  evaluatorDeterminationConfig,
  evaluationsManagementConfig,
  reportPerformanceEvaluationFormConfig,
  correctEvaluatorConfig,
  seniorManagersConfirmationConfig,
  defineSuggestConfig,
  committeeConfig,
  porofileSuggestionConfig,
  resultSuggestionConfig,
  operationalPlanningConfig,
  suggestionGuidelineConfig,
  suggestionGeneralConfig,
  BDHRPConfig,
  suggestionResultConfig,
  creatingJobNeedsConfig,
  jobNeedManagementConfig,
  signUpConfig,
  mainPageConfig,
  talentProfileConfig,
  volunteerManagementConfig,
  volunteerReviewConfig,
  jobDescriptionConfig,
  determiningBasicWorkingScope,
  humanResourcesExpertConfig,
  medicalDocumentConfig,
  sessionPageConfig,
  EvaluationReportConfig,
  // ModifiedEmplOrderConfig
  // AnotherTestConfig,
  // ExampleConfig
  // eslint-disable-next-line no-undef
  FoodDefinitionConfig,
  MealDefinitionConfig,
  FoodScheduleConfig,
  PartyDefinitionConfig,
  FoodReserveConfig,
  CreditChargeConfig,
  DailyReserveConfig,
  ReserveReportConfig,
  specialExaminationReportsConfig,
  EvaluationListConfig,
  StaffPerformanceReviewConfig,
  ReviewManagarConfig,
  ConfirmRequestConfig,
  PerformanceReportConfig,
  InstantReportConfig,
  RequestWorkAgentConfig,
  RequestMoveShiftConfig,
  RequestFunctionalIntegrationConfig,
  DevicesConfig,
  WorkingCalendarConfig,
  WorkingFactorsConfig,
  PerformanceProfileConfig,
  DefineJobConfig,
  EmplOrderConfig,
  QuestionnaireConfig,
  SurveyConfig,
  CompensationConfig,
  PayrollConfig,
  FilesManagementConfig,
  OrgsAndBranchesConfig,
  HelpConfig,
  PersonnelManagementConfig,
  FunctionalManagementConfig,
  UserProfileConfig,
  // ExampleConfig,
  DataAnalysisDashboardComponentConfig,
  organizationalPosition,
  OrganizationalUnitConfig,
  OrganizationalChartConfig,
  familyReport,
  contactReport,
  addressReport,
  Tasks,
  skillsConfig,
  FormulaConfig,
  BankReportConfig,
  GeneralBaseDataConfig,
  InstitutionsConfig,
  definitionOfEducationalTitlesConfig,
  AddInstitutionsConfig,
  educationalProfileConfig,
  trainingNeedsConfig,
  baseOrganizationStructureInformationConfig,
  DefinitionOfWelfareServicesConfig,
  accessLevelConfig,
  // createEvaluationFormConfig,
  AccommodationServicesConfig,
  needAssessmentEmpolyConfig,
  needAssessmentManagerConfig,
  studyneedAssessmentOrganizationConfig,
  recordCoursesListConfig,
  editEducationalProgramAndBudgetConfig,
  RequiredCoursesConfig,
  educationCoursesConfig,
  notificationConfig,
  myNotificationsConfig,
  AddedCourseListConfig,
  studyneedAssessmentConfig,
  goalsConfig,
  recordConfig,
  reportGoalsConfig,
  defineEvaluationTimeConfig,
  evaluatorDeterminationConfig,
  evaluationsManagementConfig,
  reportPerformanceEvaluationFormConfig,
  correctEvaluatorConfig,
  seniorManagersConfirmationConfig,
  defineSuggestConfig,
  committeeConfig,
  porofileSuggestionConfig,
  resultSuggestionConfig,
  operationalPlanningConfig,
  suggestionGuidelineConfig,
  suggestionGeneralConfig,
  BDHRPConfig,
  suggestionResultConfig,
  creatingJobNeedsConfig,
  jobNeedManagementConfig,
  signUpConfig,
  mainPageConfig,
  talentProfileConfig,
  volunteerManagementConfig,
  volunteerReviewConfig,
  jobDescriptionConfig,
  determiningBasicWorkingScope,
  humanResourcesExpertConfig,
  medicalDocumentConfig,
  sessionPageConfig,
  EvaluationReportConfig,
  // ModifiedEmplOrderConfig
  // AnotherTestConfig,
  // ExampleConfig
  // eslint-disable-next-line no-undef
  FoodDefinitionConfig,
  MealDefinitionConfig,
  FoodScheduleConfig,
  PartyDefinitionConfig,
  FoodReserveConfig,
  CreditChargeConfig,
  DailyReserveConfig,
  ReserveReportConfig,
  specialExaminationReportsConfig,
  EvaluationListConfig,
  InfoChangeTypeConfig,

  //OrganizationExcellence
  OrganizationExcellenceConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    component: () => <Redirect to="/dashboard" />,
  },
];

export default routes;
