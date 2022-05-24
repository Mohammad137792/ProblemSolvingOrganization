import React, { useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from 'configs';
import { useDispatch  } from 'react-redux/es/hooks/useDispatch';
import { setPermision } from "./../../store/actions/fadak";
import checkPermis from './../components/CheckPermision'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import * as Actions from 'app/store/actions'; 
import navigationConfig from 'app/fuse-configs/navigationConfig';
/**
 * @author Ali Sarmadi <mr.snaros@gmail.com>
 * hoc component for get all of permission  after that authentication is valid :)) and
 * store in redux
 */

function WithAccess(props) {

    const state = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        var config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/security/permisionList`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        };

        axios(config)
            .then(function (response) {
                dispatch(setPermision(response.data.dicit))
                dispatch(Actions.setNavigation(navigationConfig))
            })
            .catch(function (error) {
                console.log(error);
            });





            // async function fetchMyAPI() {
            //     var config = {
            //         method: 'get',
            //         url: `${SERVER_URL}/rest/s1/security/permisionList`,
            //         headers: { 'api_key': localStorage.getItem('api_key') },
            //     };
            //     let response = await axios(config)
            //     response = await response.data
            //     dispatch(setPermision(response.dicit))
            //   }
          
            //   fetchMyAPI()





    }, [])





    // console.log("alisarmadi checkPermis", checkPermis("/baseifo/veiw_page"))


    
    return (
        <>

            {props.children}
        </>
    )
}


export default WithAccess