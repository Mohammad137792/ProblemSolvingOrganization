import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  Paper,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Button,
  Card,
  Box,
} from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import TabPane from "../../../components/TabPane";
import OrganizationFormHeader from "./steps/OrganizationFormHeader";
import OrganFormHeader from "./steps/OrganFormHeader";
import AddressInfo from "../../personnelBaseInformation/tabs/AddressInformation/AddressInfo";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ContactInfo from "../../personnelBaseInformation/tabs/ContactInformation/ContactInfo";
import ContactInfoCyber from "../../personnelBaseInformation/tabs/ContactInformation/ContactInfoCyber";
import BankingInfoCom from "../../personnelBaseInformation/tabs/BankInfo/BankingInfoCom";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import TaxJurisdictions from "./tabs/compensation/TaxJurisdictions";
import HealthInsurance from "./tabs/compensation/HealthInsurance";
// import BankingInfo from "./tabs/BankingInfo";
import checkPermis from "app/main/components/CheckPermision";
import AccessSettings from "./tabs/functionalManagement/AccessSettings";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const DefineOrganization = (props) => {
  // const theme = useTheme();
  // const [value, setValue] = React.useState(0);
  // const handleChange = (event, newValue) => {
  //     setValue(newValue);
  // };
  const classes = useStyles();
  const partyRelationshipId = useSelector(
    ({ auth }) => auth.user.data.partyRelationshipId
  );
  const [partyIdOrg, setpartyIdOrg] = React.useState(false);
  const [tabs, setTabs] = React.useState([]);
  const datas = useSelector(({ fadak }) => fadak);

  React.useEffect(() => {
    if (partyIdOrg) {
      let allTabs = [];

      if (
        checkPermis(
          "organizationChartManagement/defineOrganization/addresTab",
          datas
        )
      ) {
        allTabs.push({
          label: "آدرس",
          panel: (
            <AddressInfo CmtOrgPostalAddress={true} partyIdOrg={partyIdOrg} />
          ),
        });
      }
      if (
        checkPermis(
          "organizationChartManagement/defineOrganization/contactInfoTab",
          datas
        )
      ) {
        allTabs.push({
          label: "اطلاعات تماس",
          panel: (
            <React.Fragment>
              <ContactInfo CmtOrgPostalPhone={true} partyIdOrg={partyIdOrg} />
              <ContactInfoCyber partyIdOrg={partyIdOrg} />
            </React.Fragment>
          ),
        });
      }
      if (
        checkPermis(
          "organizationChartManagement/defineOrganization/bankingInfoComTab",
          datas
        )
      ) {
        allTabs.push({
          label: "اطلاعات بانکی",
          panel: <BankingInfoCom partyIdOrg={partyIdOrg} />,
        });
      }
      if (
        checkPermis(
          "organizationChartManagement/defineOrganization/taxJurisdictionsTab",
          datas
        )
      ) {
        allTabs.push({
          label: "حوزه های مالیاتی",
          panel: (
            <TaxJurisdictions
              parentKey={"partyId"}
              parentKeyValue={partyIdOrg}
            />
          ),
        });
      }
      if (
        checkPermis(
          "organizationChartManagement/defineOrganization/healthInsuranceTab",
          datas
        )
      ) {
        allTabs.push({
          label: "حوزه بیمه درمانی",
          panel: (
            <HealthInsurance
              parentKey={"partyId"}
              parentKeyValue={partyIdOrg}
            />
          ),
        });
      }
      allTabs.push({
        label: "تنظیمات دسترسی ها",
        panel: (
          <AccessSettings parentKey={"partyId"} parentKeyValue={partyIdOrg} />
        ),
      });
      setTabs(allTabs);
    }
  }, [partyIdOrg]);

  React.useEffect(() => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" +
          partyRelationshipId,
        {
          headers: {
            api_key: localStorage.getItem("api_key"),
          },
        }
      )
      .then((response11) => {
        if (response11.data.orgPartyRelationResult) {
          if (response11.data.orgPartyRelationResult[0]) {
            if (response11.data.orgPartyRelationResult[0].toPartyId) {
              setpartyIdOrg(
                response11.data.orgPartyRelationResult[0].toPartyId
              );
            }
          }
        }
      });
  }, []);

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">
                مدیریت ساختار سازمانی
              </Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              اطلاعات سازمان
            </Box>
          }
        />
      }
      content={
        <>
          {/* <OrganizationFormHeader/> */}
          <Card style={{ margin: 10, padding: 5 }}>
            <OrganFormHeader />
          </Card>
          {/*<Paper>*/}
          {/*<Tabs*/}
          {/*    value={value}*/}
          {/*    onChange={handleChange}*/}
          {/*    indicatorColor="secondary"*/}
          {/*    textColor="primary"*/}
          {/*    variant="scrollable"*/}
          {/*    scrollButtons="auto"*/}
          {/*>*/}
          {/*    <Tab label="آدرس " />*/}
          {/*    <Tab label="اطلاعات تماس" />*/}
          {/*    <Tab label="اطلاعات بانکی" />*/}

          {/*</Tabs>*/}
          {/*<TabPane value={value} index={0} dir={theme.direction}>*/}
          {/*    <AddressInfo CmtOrgPostalAddress={true} partyIdOrg={partyIdOrg} />*/}
          {/*</TabPane>*/}
          {/*<TabPane value={value} index={1} dir={theme.direction}>*/}
          {/*    <ContactInfo CmtOrgPostalPhone ={true}  partyIdOrg={partyIdOrg}/>*/}
          {/*    <ContactInfoCyber partyIdOrg={partyIdOrg}/>*/}
          {/*</TabPane>*/}
          {/*<TabPane value={value} index={2} dir={theme.direction}>*/}
          {/*    <BankingInfoCom partyIdOrg={partyIdOrg}/>*/}
          {/*</TabPane>*/}
          <TabPro tabs={tabs} />

          {/*</Paper>*/}
        </>
      }
    />
  );
};

export default DefineOrganization;
