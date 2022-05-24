/**
 * @author Ali Sarmadi <mr.snsaros@gamil.com>
 * the latest logic is implemented in this component. It's a good practice to checkout the first tab source code
 * in order to learn project standards.
 */

 import React from 'react';
 import { useTheme } from '@material-ui/core/styles';
 import { Paper, Tabs, Tab, Typography, CircularProgress, Button } from '@material-ui/core';
 import { FusePageSimple } from "@fuse";
 import TabPane from "../../components/TabPane";
 import PersonnelFormHeader from "../../components/PersonnelFormHeader";
 import BaseInformation from "./tabs/BaseInformation/BaseInformation";
 import Address from "./tabs/Address";
 import ContactInformation from "./tabs/ContactInformation";
 import Family from "./tabs/Family/Family";
 import Sacrifice from "./tabs/Sacrifice/Sacrifice";
 // import BankingInfo from "./tabs/BankingInfo";
 import ContractInformation from "./tabs/ContractInformation/ContractInformation";
 import InternalInformation from "./tabs/InternalInformation/InternalInformation";
 import OrganizationInformation from "./tabs/OrganizationInformation/OrganizationInformation";
 import LeavingOrganization from "./tabs/LeavingOrganization/LeavingOrganization";
 import EducationalHistory from "./tabs/EducationalHistory/EducationalHistory";
 import EmploymentOrder from "./tabs/EmploymentOrder";
 // import BaseTest from "../example/tabs/BaseTest";
 import AddressInfo from "./tabs/AddressInformation/AddressInfo";
 import ContactInfo from "./tabs/ContactInformation/ContactInfo";
 import ContactInfoCyber from "./tabs/ContactInformation/ContactInfoCyber";
 import BankingInfoCom from "./tabs/BankInfo/BankingInfoCom"
 import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
 import { useDispatch, useSelector } from "react-redux";
 import { showAlert, SET_USER, setUser , setUserId } from "../../../store/actions/fadak";
 import { useHistory, useParams } from 'react-router-dom';
 import axios from 'axios';
 import { SERVER_URL } from './../../../../configs'
 import InstructorQualification from "./tabs/InstructorQualification/InstructorQualification"
 import checkPermis from 'app/main/components/CheckPermision';
 import HeaderPersonnelFile from './HeaderPersonnelFile';
 
 const PersonnelBaseInformation = (props) => {

    const {volunteerProfile = false, recruitmentProcess} = props

     const theme = useTheme();
     const [value, setValue] = React.useState(0);
 
     const handleChange = (event, newValue) => {
         setValue(newValue);
     };
     const params = useParams()
 
     const history = useHistory();
     const dispatch = useDispatch();
     const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
     const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
     const datas =  useSelector(({ fadak }) => fadak);
     const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin
     const partyRelationshipIdLogin =  useSelector(({ auth }) => auth.user.data.partyRelationshipId);
     const isNewUser = datas.baseInformationInisial.isNewUser
     const partyRelationshipIdUser =  datas.baseInformationInisial.partyRelationshipId
     const partyRelationshipId = (partyRelationshipIdUser && partyRelationshipIdUser !== null) ? partyRelationshipIdUser : partyRelationshipIdLogin
 
     //define relationshipTypeEnumId of user , used for show/hide  InstructorQualification tab
     const [relationshipType, setRelationshipType] = React.useState();
     const isLoginUser = !partyIdUser || partyIdUser == partyIdLogin
 
     const axiosKey = {
         headers: {
             'api_key': localStorage.getItem('api_key')
         }
     }

     console.log('isNewUser',isNewUser)
 
     const handleGoBack = () => {
         dispatch(setUser(null))
         if(volunteerProfile){
            recruitmentProcess("main")
         }
         else{
            if(relationshipType == "prtInstructor"){
                dispatch(setUserId(null))
            }
            history.goBack()//push("/searchPersonnel");
        }
     }
 
     React.useEffect(() => {
         change()
         axios.get(`${SERVER_URL}/rest/s1/fadak/prtRel?pageSize=1000000000&partyRelationshipId=${partyRelationshipId}&partyId=${partyId}`, axiosKey).then(type => {
             setRelationshipType(type?.data?.relationType)
         })
     }, [partyRelationshipId])
 
 
     const change = () => {
         if (params.index) {
             setValue(parseInt(params.index))
         }
     }
 
     return (
         <FusePageSimple
             header={
                 < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                     <Typography variant="h6" className="p-10"> پروفایل پرسنلی</Typography>
 
                     {(partyIdUser !== null) ?
                         <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={handleGoBack}
                             startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button> : ""
                     }
                 </ div>
             }
             content={relationshipType &&
                 <>
                 
                         <HeaderPersonnelFile relationshipType={relationshipType}/>
                     <Paper>
                         <Tabs
                             value={value}
                             onChange={handleChange}
                             indicatorColor="secondary"
                             textColor="primary"
                             variant="scrollable"
                             scrollButtons="auto"
                         >
                            <Tab label="اطلاعات پایه"
                             style={{display: 
                             ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/base" ,datas)) ||
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/base" ,datas))) ||
                              (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/base" ,datas))) ? "" : "none"}}/>

                            <Tab label="اطلاعات تماس" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/contact" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/contact" ,datas))) || 
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/contact" ,datas))) ? "" : "none"}}/>

                            <Tab label="آدرس" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/address" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/address" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/address" ,datas))) ? "" : "none"}}/>

                            <Tab label="سوابق شغلی و تحصیلی" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/experiments" ,datas)) ||
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/experiments" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/experiments" ,datas))) ? "" : "none"}}/>

                            <Tab label="سابقه ایثارگری و پزشکی" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/medical" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/medical" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/medical" ,datas))) ? "" : "none"}}/>

                            <Tab label="خانواده" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/family" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/family" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/family" ,datas))) ? "" : "none"}}/>

                            <Tab label="اطلاعات بانکی" 
                            style={{display: 
                            ((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/banking" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/banking" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/banking" ,datas))) ? "" : "none"}}/>
                             {relationshipType != "prtInstructor" ?
                                 <Tab label="اطلاعات سازمانی" 
                                 style={{display: 
                                    ((!isNewUser && 
                                        (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/organizational" ,datas)) || 
                                        (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/organizational" ,datas))) ||
                                    (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/organizational" ,datas)))? "" : "none"}}/>
                                 :
                                 <Tab label="سنجش صلاحیت" />
                             }
                             {/*<Tab label="اطلاعات قرارداد"/>*/}
                             {/*<Tab label="حکم کارگزینی"/>*/}
                             {/*<Tab label="اطلاعات داخلی"/>*/}
                             {/*<Tab label="ترک سازمان"/>*/}
 
                        </Tabs>
                        
                            <TabPane value={value} index={0} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/base" ,datas)) ||
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/base" ,datas))) || 
                             (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/base" ,datas))) &&
                                <BaseInformation />
                            }
                            </TabPane>
                        
                            <TabPane value={value} index={1} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/contact" ,datas)) ||
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/contact" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/contact" ,datas))) &&
                                <>
                                    <ContactInfo partyIdOrg={null} />
                                    <ContactInfoCyber partyIdOrg={null} />
                                </>
                            }
                            </TabPane>

                            <TabPane value={value} index={2} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/address" ,datas)) ||
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/address" ,datas))) || 
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/address" ,datas))) &&
                                <AddressInfo CmtOrgPostalAddress={false} partyIdOrg={null} />
                            }
                            </TabPane>

                            <TabPane value={value} index={3} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/experiments" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/experiments" ,datas))) || 
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/experiments" ,datas))) &&

                                <EducationalHistory />
                            }      
                            </TabPane>

                            <TabPane value={value} index={4} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/medical" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/medical" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/medical" ,datas))) &&

                                <Sacrifice />
                            }

                            </TabPane>

                            <TabPane value={value} index={5} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/family" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/family" ,datas))) || 
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/family" ,datas))) &&

                                <Family />
                            } 
                            </TabPane>

                            <TabPane value={value} index={6} dir={theme.direction}>
                            {((!isNewUser && 
                                (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/banking" ,datas)) || 
                                (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/banking" ,datas))) ||
                            (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/banking" ,datas))) &&

                                <BankingInfoCom partyIdOrg={null} />
                            }
                            </TabPane>

                            {relationshipType != "prtInstructor" ?
                                <TabPane value={value} index={7} dir={theme.direction}>
                                    {((!isNewUser && 
                                        (!isLoginUser && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/organizational" ,datas)) || 
                                        (isLoginUser && checkPermis("personnelManagement/personnelBaseInformation/organizational" ,datas)))  ||
                                    (isNewUser && checkPermis("personnelInformationManagement/addNewPersonnel/addInformation/organizational" ,datas))) && <OrganizationInformation />
                                    }
                                </TabPane>
                                : 
                                <TabPane value={value} index={7} dir={theme.direction}>
                                    <InstructorQualification />
                                </TabPane>
                            }
                         {/*<TabPane value={value} index={8} dir={theme.direction}>*/}
                         {/*<ContractInformation/>*/}
                         {/*</TabPane>*/}
                         {/*<TabPane value={value} index={9} dir={theme.direction}>*/}
                         {/*<EmploymentOrder/>*/}
                         {/*</TabPane>*/}
                         {/*<TabPane value={value} index={10} dir={theme.direction}>*/}
                         {/*<InternalInformation/>*/}
                         {/*</TabPane>*/}
                         {/*<TabPane value={value} index={11} dir={theme.direction}>*/}
                         {/*<LeavingOrganization/>*/}
                         {/*</TabPane>*/}
 
                     </Paper>
                 </>
             } />
     )
 }
 export default PersonnelBaseInformation;
 