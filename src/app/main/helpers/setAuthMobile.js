/**
 * @author Ali Sarmadi <mr.snaros@gmial.com>
 *this function set basic auth for mobile
 **/



 export const setAuthFunction = (model) =>{


   const auth =    "Basic " + btoa(model.email + ":" + model.password)
   localStorage.setItem( "Authorization", auth)
console.log("aaaaaaaaaaaaaaaaaaaaaaaa" , localStorage.getItem("Authorization"))

   //
   // headers: {
   //     Authorization: "Basic " + btoa(username + ":" + password)
   // }

 }
