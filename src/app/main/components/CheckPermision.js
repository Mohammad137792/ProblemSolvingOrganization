/**
 * @author Ali sarmadi  
 * This method checks the user's permission 
 */

import store from './../../store';

function checkPermis(permis , datas) {
    const stro = store.getState()
    const permisionList = stro?.fadak?.permisionList?.data
    const data =datas.permisionList?.data

    let accesses = Object.keys(permisionList),
    hasAchildAccess = accesses.find(x=>x.startsWith(permis+"/")),
    checkAccess = permisionList[hasAchildAccess?.trim()] === 1 || data[hasAchildAccess?.trim()] === 1
    


    if ( permis && (permisionList[permis.trim()] === 1) ||  data [permis.trim()] === 1  || checkAccess) {
        return true
    }
    // for (let ele in permisionList) {
    //     let item = permisionList[ele];
    //     if (item["artifactName"].trim() === permis.trim()) {
    //         return true
    //     }
    // }
    return false
}



export default checkPermis