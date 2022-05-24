import React, { useEffect, useState } from 'react'
import TablePro from "../../../components/TablePro";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import FormButton from "../../../components/formControls/FormButton";
import FilterHistory from "../../../components/FilterHistory";
import { Box, Card, Button } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SERVER_URL } from "../../../../../configs";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import axios from 'axios'
import UserCompany from "../../../components/formControls/UserCompany";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { useDispatch } from "react-redux";

const formDefaultValues = {
    disabled: "N",
    statusId: "ActiveRel"
}

const SearchUserForm = ({opt , getPersonnel}) => {
    const [formValues, setFormValues] = useState(formDefaultValues);
    const [moreFilter, setMoreFilter] = useState(false);
    const enums = [
        { enumId: "N", description: "فعال" },
        { enumId: "Y", description: "غیر فعال" }
    ]
    const status = [
        { statusId: "NotActiveRel", description: "غیرفعال" },
        { statusId: "ActiveRel", description: "فعال" }
    ]
    const formStructure = [
        {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text"
        }, {
            name: "fullName",
            label: "نام  پرسنل",
            type: "text"
        }, {
            name: "nationalId",
            label: "کد ملی",
            type: "number",
        }, {
            type:   "component",
            component: <UserCompany/>,
            display: moreFilter
        }, {
            name: "orgniztionUnit",
            label: "واحد سازمانی",
            type: "select",
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            options: opt.organizationUnit,
            display: moreFilter
        }, {
            name: "relationshipTypeEnumId",
            label: "نوع ارتباط",
            type: "select",
            optionLabelField: "description",
            optionIdField: "enumId",
            options: opt.relationTypes,
            display: moreFilter
        }, {
            name: "username",
            label: "نام کاربری",
            type: "text",
            display: moreFilter
        }, {
            name: "EmployeeGroups",
            label: "گروه پرسنلی",
            type: "select",
            options: opt?.EmployeeGroups,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            filterOptions: options => formValues["EmployeeSubGroups"] ? options.filter((item) =>{
                let list = opt?.EmployeeSubGroups,
                selectedParent = list.find(x=>x.partyClassificationId == formValues["EmployeeSubGroups"])?.parentClassificationId
               
                return item.partyClassificationId == selectedParent
            }) : options,
            display: moreFilter
        }, {
            name: "EmployeeSubGroups",
            label: "زیر گروه پرسنلی",
            type: "select",
            options: opt?.EmployeeSubGroups ,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            filterOptions: options => formValues["EmployeeGroups"] ? options.filter(o=>o["parentClassificationId"] == formValues["EmployeeGroups"]) : options,
            display: moreFilter
        }, {
            name: "ActivityArea",
            label: "منطقه فعالیت",
            type: "select",
            options: opt?.ActivityArea,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            display: moreFilter
        }, {
            name: "ExpertiseArea",
            label: "حوزه فعالیت",
            type: "select",
            options: opt?.ExpertiseArea,
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            display: moreFilter
        }, {
            name: "statusId",
            label: "وضعیت پرسنل",
            type: "select",
            options: status,
            optionLabelField: "description",
            optionIdField: "statusId",
            display: moreFilter
        }, {
            name: "disabled",
            label: "وضعیت حساب کاربری",
            type: "select",
            options: enums,
            optionLabelField: "description",
            optionIdField: "enumId",
            display: moreFilter
        },
        
    ]

    return (
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
            formValues={formValues} setFormValues={setFormValues}
            submitCallback={()=>getPersonnel(formValues)} 
            resetCallback={()=>getPersonnel(formDefaultValues)}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
                {/* <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_personnel"} loadCallback={(val) => getPersonnel(val)} /> */}
            </ActionBox>}
        >
            <FormButton onClick={() => setMoreFilter(!moreFilter)}
                startIcon={moreFilter && <ChevronRightIcon />}
                endIcon={!moreFilter && <ChevronLeftIcon />} >
                {moreFilter ? "فیلترهای کمتر" : "فیلترهای بیشتر"}
            </FormButton>
        </FormPro>

    )
}


function User({ select = false, selectPersonal, setSelectPersonal, data }) {
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opt, setOpt] = useState([]);
    const [persons, setPersons] = useState([]);
    const dispatch = useDispatch();

  
    const tableCols = [
        { name: "pseudoId", label: "کد پرسنلی", type: "text", readOnly : true,required:false},
        { name: "fullName", label: "نام و نام خانوادگی", type: "text" , readOnly : true,required:false},
        { name: "username", label: " نام کاربری", type: "text" , readOnly : true,required:false},
        { name: "emailAddress", label: "ایمیل بازیابی", type: "text" , readOnly : true,required:false},
        { name: "statusId", label: "وضعیت پرسنل", type: "indicator", indicator: {'true':"ActiveRel",'false':'NotActiveRel'}, required:false},
        { name: "disabled", label: "وضعیت حساب کاربری", type: "indicator", indicator: {'true':"N",'false':'Y' },required:false}
    ]

    const getPersonnel = (filter) => {



        setLoading(true)
        
        axios.get(SERVER_URL + "/rest/s1/fadak/getPersonnelList", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            params: {
                ...filter,
                
            }
        }).then(res => {
            setLoading(false)
            setPersons(res.data.party)
            searchPersonnel(formDefaultValues,res.data.party)
        }).catch(err => {
        });
    }

    const getOpt = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/getFiltersOptions",
            { headers: { 'api_key': localStorage.getItem('api_key') } }).then(response => {
                setOpt(response.data.data)
            })
    }

    const searchPersonnel = (filterValues,initPersons) =>{

        var personList = initPersons ? initPersons.slice(0) : persons.slice(0)

        personList = personList.filter((obj)=>{
            var exist = true
            for(let item in filterValues){
                
                try{
                    if(item == "fullName"){
                        if(filterValues[item] && !obj[item].includes(filterValues[item]) ){
                            exist = false
                        }
                    }
                    else if(item == "orgniztionUnit"){
                        if(filterValues[item] && obj["units"].indexOf(filterValues[item]) < 0){
                            exist = false
                        }
                    }
                    else{
                        if(filterValues[item] && filterValues[item] != obj[item] ){
                            exist = false
                        }
                    }

                   
                }
                catch{
                }
            }
            return exist
        })

        setTableContent(personList)

    }

    useEffect(() => {
        getPersonnel()
        getOpt()
    }, [])


    useEffect(() => {

        if (data) {
            var ids = new Set(data.map(d => d?.userId));
            
            setSelectPersonal(tableContent.filter(d => ids.has(d?.userId)))
        }
    }, [data])

    const handleEdit= (row) =>{
        dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "در حال ارسال اطلاعات..."
            )
          );
        return new Promise((resolve, reject) => {
        axios.post(SERVER_URL + "/rest/s1/fadak/editAceessLevelPeronnel", {data:row},{
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }).then(res => {
            dispatch(
                setAlertContent(
                  ALERT_TYPES.SUCCESS,
                  "عملیات با موفقیت انجام شد."
                )
              );
            resolve()
        }).catch(err => {
        });
    })
    }

    return (
        <>
            <Box p={2}>
                <Card>
                    <TablePro
                        title='لیست حساب های کاربری'
                        columns={tableCols}
                        rows={tableContent}
                        loading={loading}
                        filter="external"
                        selectable={select}
                        selectedRows={selectPersonal}
                        setSelectedRows={setSelectPersonal}
                        setRows={setTableContent}
                        filterForm={
                            <SearchUserForm  opt ={opt} getPersonnel={searchPersonnel} />
                            // <SearchUserForm />
                        }
                        edit= {!select ? "inline" : ''}
                        editCallback={handleEdit}
                    />
                </Card>
            </Box>
        </>

    )
}

export default User