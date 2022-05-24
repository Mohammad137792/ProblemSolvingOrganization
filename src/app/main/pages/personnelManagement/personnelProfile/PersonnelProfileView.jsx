import React, { useEffect, useState } from "react";
import PersonnelProfileHeader from "./PersonnelProfileHeader";
import TabPro from "../../../components/TabPro";
// import ContactInfo from "./tabs/ContactInfo";
import Base from "./tabs/Base";
import axios from "../../../api/axiosRest";
import AddressInfo from "../../personnelBaseInformation/tabs/AddressInformation/AddressInfo";
import ContactInfoCyber from "../../personnelBaseInformation/tabs/ContactInformation/ContactInfoCyber";
import ContactInfo from "../../personnelBaseInformation/tabs/ContactInformation/ContactInfo";
import EducationalHistory from "../../personnelBaseInformation/tabs/EducationalHistory/EducationalHistory";
import Sacrifice from "../../personnelBaseInformation/tabs/Sacrifice/Sacrifice";
import Family from "../../personnelBaseInformation/tabs/Family/Family";
import BankingInfoCom from "../../personnelBaseInformation/tabs/BankInfo/BankingInfoCom";
import OrganizationInformation from "../../personnelBaseInformation/tabs/OrganizationInformation/OrganizationInformation";
import InstructorQualification from "../../personnelBaseInformation/tabs/InstructorQualification/InstructorQualification";
import { useSelector } from "react-redux";
import checkPermis from "../../../components/CheckPermision";
import OtherInfo from "../../personnelBaseInformation/tabs/OtherInfo/OtherInfo";
import UnitAddress from "./../../organizationalStructureModule/organizationalUnit/tabs/UnitAddress";
import UnitTel from "./../../organizationalStructureModule/organizationalUnit/tabs/UnitTel";

export default function PersonnelProfileView({
  partyId = "",
  partyRelationshipId = "",
  origin,
  tab,
}) {
  const datas = useSelector(({ fadak }) => fadak);
  const [values, set_values] = useState({});
  const [avatar, set_avatar] = useState(null);
  const [relationshipType, setRelationshipType] = React.useState();
  const party = { partyId, partyRelationshipId };

  const forOther = origin === "search";
  const forUser = origin === "userProfile";
  const forNew = origin === "register";
  const forReport = origin === "report";

  useEffect(() => {
    axios
      .get("/s1/fadak/userHedaerInfo", { params: party })
      .then((res) => {
        set_values(res.data.userHeaderInfo);
        set_avatar(res.data.faceImage);
      })
      .catch(() => { });
    axios
      .get("/s1/fadak/prtRel", { params: party })
      .then((res) => {
        setRelationshipType(res.data?.relationType);
      })
      .catch(() => { });
  }, []);

  return (
    <React.Fragment>
      <PersonnelProfileHeader values={values} avatar={avatar} />
      <TabPro
        initialValue={tab}
        tabs={[
          {
            label: "اطلاعات پایه",
            panel: (
              <Base
                {...party}
                origin={origin}
                avatar={avatar}
                setAvatar={set_avatar}
              />
            ),
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/base",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/base",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/base",
                  datas
                )),
          } /*,{
                label: "اطلاعات تماس",
                panel: <ContactInfo/>,
                display: false
            }*/,
          {
            name: "contact",
            label: "اطلاعات تماس",
            panel: (
              <UnitTel
                electronicWay={true}
                addPermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/addTell" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/addTell" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/addTell" : false
                }
                updatePermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/updateTel" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/updateTel" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/updateTel" : false
                }
                deletePermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/deleteTel" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/deleteTel" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/deleteTel" : false
                }
                addPermisElectronic={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/addElectronic" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/addElectronic" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/addElectronic" : false
                }
                updatePermisElectronic={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/updateElectronic" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/updateElectronic" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/updateElectronic" : false

                }
                deletePermisElectronic={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/contact/deleteElectronic" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/contact/deleteElectronic" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/contact/deleteElectronic" : false

                }
              />
              // <>
              //   <ContactInfo partyIdOrg={null} />
              //   <ContactInfoCyber partyIdOrg={null} />
              // </>
            ),
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/contact",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/contact",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/contact",
                  datas
                )) ||
              (forReport &&
                checkPermis(
                  "reports/personnelReport/contactReport/contact",
                  datas
                )),
          },
          {
            name: "address",
            label: "آدرس",
            panel: (
              // <AddressInfo CmtOrgPostalAddress={false} partyIdOrg={null} />
              <UnitAddress
                contactMechTypeEnumId={"CmtPostalAddress"}
                addPermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/address/add" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/address/add" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/address/add" :false
                }
                updatePermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/address/update" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/address/update" :
                      forNew ? "personnelInformationManagement/addNewPersonnel/addInformation/address/update" :false
                }
                deletePermis={
                  forOther ?
                    "personnelInformationManagement/searchPersonnelList/editPersonnel/address/delete" :
                    forUser ?
                      "personnelManagement/personnelBaseInformation/address/delete" :
                      forNew ?"personnelInformationManagement/addNewPersonnel/addInformation/address/delete" :false
                }
              />
            ),
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/address",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/address",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/address",
                  datas
                )) ||
              (forReport &&
                checkPermis(
                  "reports/personnelReport/addressReport/address",
                  datas
                )),
          },
          {
            label: "سوابق شغلی و تحصیلی",
            panel: <EducationalHistory />,
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/experiments",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/experiments",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/experiments",
                  datas
                )),
          },
          {
            label: "سابقه ایثارگری و پزشکی",
            panel: <Sacrifice />,
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/medical",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/medical",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/medical",
                  datas
                )),
          },
          {
            label: "خانواده",
            panel: <Family />,
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/family",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/family",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/family",
                  datas
                )),
          },
          {
            label: "اطلاعات بانکی",
            panel: <BankingInfoCom partyIdOrg={null} />,
            display:
              (forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/banking",
                  datas
                )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/banking",
                  datas
                )) ||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/banking",
                  datas
                )),
          },
          {
            label: "اطلاعات سازمانی",
            panel: <OrganizationInformation />,
            display:
              relationshipType !== "prtInstructor" &&
              ((forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/organizational",
                  datas
                )) ||
                (forUser &&
                  checkPermis(
                    "personnelManagement/personnelBaseInformation/organizational",
                    datas
                  )) ||
                (forNew &&
                  checkPermis(
                    "personnelInformationManagement/addNewPersonnel/addInformation/organizational",
                    datas
                  ))),
          },
          {
            label: "سایر اطلاعات ",
            panel: <OtherInfo settingTypeEnumId={"OtherPersonalInf"} origin={origin} />
            ,
            display:
              relationshipType !== "prtInstructor" &&
              ((forOther &&
                checkPermis(
                  "personnelInformationManagement/searchPersonnelList/editPersonnel/OtherInfo",
                  datas
                )) ||
                (forUser &&
                  checkPermis(
                    "personnelManagement/personnelBaseInformation/OtherInfo",
                    datas
                  )) ||
                (forNew &&
                  checkPermis(
                    "personnelInformationManagement/addNewPersonnel/addInformation/OtherInfo",
                    datas
                  ))),
          },
          {
            label: "سنجش صلاحیت",
            panel: <InstructorQualification />,
            display: relationshipType === "prtInstructor",
          },
        ]}
      />
    </React.Fragment>
  );
}
