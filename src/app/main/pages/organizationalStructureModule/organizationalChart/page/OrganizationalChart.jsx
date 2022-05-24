import React, { useEffect, useState } from 'react'
import OrganizationalChartForm from './OrganizationalChartForm'
import { useDispatch, useSelector } from "react-redux";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import axios from "axios";
const OrganizationalChart = () => {
  const [currentData, setCurrentData] = useState({})
  const partyId = useSelector(({ auth }) => auth.user.data.partyId);
  const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

  //axios  ---> tokenKey &&  config <---//
  const axiosKey = {
    headers: {
      'api_key': localStorage.getItem('api_key')
    }
  }
  // ---
  useEffect(() => {
    let arryapush = []
    let partyClassificationAppl = []
    let partyORg = []

    axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=" + partyRelationshipId, axiosKey).then(responseToParty => {
      const toParty = responseToParty.data.result[0].toPartyId;
      axios.get(SERVER_URL + "/rest/s1/mantle/parties/organization?companyPartyId=" + toParty, axiosKey).then(response => {
        let partyList = { partyIdList: response.data.map(item => item.partyId) }
        axios.post(SERVER_URL + "/rest/s1/fadak/getPartyClassificationApplRest/filtrerdByParty", partyList, axiosKey).then(responseSecound => {
          console.log("avkakvalvkav"  ,responseSecound )
          console.log("avkakvalvkav"  ,response )

          if (responseSecound.data && responseSecound.data.partyList) {

            responseSecound.data.partyList.map((item, index) => {
              response.data.map((item2, index2) => {
                if (item.partyId === item2.partyId) {
                  let aryya = Object.assign({}, item, item2)
                  console.log("adk;avbklaba" , aryya)
                  arryapush.push(aryya)
                }
              })
            })
            console.log("akvavjakvkajvakv" ,typeof(arryapush))
            setCurrentData(prevState => ({
              partyClassificationAppl: arryapush ?? []
            }))
          }else{
            setCurrentData(prevState => ({
              partyClassificationAppl: []
            }))
          }
        })
      })
    })
  }, [partyRelationshipId])




  function list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i++) {
      map[list[i].partyId] = i; // initialize the map
      list[i].children = []; // initialize the children
      list[i].id =i;
      list[i].name=': نام واحد'
      list[i].title=list[i].organizationName
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.ownerPartyId !== "_NA_" && node.disabled === "N") {
        list[map[node.ownerPartyId]].children.push(node);

      } else if(node.ownerPartyId === "_NA_" && node.disabled === "N") {
        roots.push(node);
      }
    }

    return roots;
  }
  console.log("dakvjavavamnvav"  ,currentData.partyClassificationAppl )



  return (
    <>
      {currentData &&currentData.partyClassificationAppl  && <OrganizationalChartForm currentData={currentData}  list_to_tree ={list_to_tree}/>}
    </>

  )
}

export default OrganizationalChart
