class Aimal {
    constructor() {
        this.show()
    }
    show() {
        let s = 5 + 4;
        console.log("asvavd", s)
    }
}


class Al extends Aimal {
    constructor(...arg) {
        super(...arg)
    }
    show() {
        super.show();
        let a = 5;
        console.log(a)
    }
}





new Aimal();
new Al();












// let dataTEst = [
//     { id: 1, name: 'l1' },
//     { id: 2, name: 'l2' },
//     { id: 1, name: 'l3' },

// ]
// let props = {
//     id: 1,
//     name: 'l3'
// }



// const DATA_TAB = dataTEst.filter((item) => {
//     let n_match = true
//     for (let a in props) {
//         console.log(a)

//         if (item[a] !== props[a]) {
//             n_match = false;
//             break;
//         }
//     }
//     return n_match

// })



// console.log(DATA_TAB)



// }
// let mergeed_list = {}
// a.map(item => {
//     if (!mergeed_list[item.id]) {
//         mergeed_list[item.id] = []
//     }
//     mergeed_list[item.id].push(item)
// })


// //

// Object.keys(b).forEach((key, index) => {

//     // console.log(b[key])



// })






// var axios = require('axios');

// var config = {
//     method: 'get',
//     url: 'http://localhost:8080/rest/s1/fadak/getInstitutionPostal?partyId=104609',
//     headers: {
//         'Cookie': 'JSESSIONID=node01eim9adzcfmizim3aus6gmga0195.node0'
//     }
// };

// axios(config)
//     .then(function(response) {
//         let b = response.data
//         let postalArry = []
//         Object.keys(b).forEach((key, index) => {
//             let obj = {}
//             b[key].map(item => {
//                 if (item.contactMechPurposeId === 'PostalInstitute') {
//                     obj[item.contactMechPurposeId] = item
//                 }

//                 if (item.contactMechPurposeId === 'PhoneInstitute') {
//                     obj[item.contactMechPurposeId] = item

//                 }
//                 if (item.contactMechPurposeId === 'FaxInstitute') {
//                     obj[item.contactMechPurposeId] = item

//                 }

//             })
//             postalArry.push(obj)



//         })
//         let postalArry2 = []

//         postalArry.map(item =>{
//             let onj ={
//                 address1 : item.PostalInstitute.address1 || '',
//                 countryCode : item.PhoneInstitute.countryCode || '',
//                 address2 : item.FaxInstitute.countryCode || ''

//             }
//             postalArry2.push(onj)


//         })
//         console.log(postalArry2)






//     })
//     .catch(function(error) {
//         console.log(error);
//     });