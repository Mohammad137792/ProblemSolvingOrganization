import React from 'react';
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import ActionBox from "../../../../../components/ActionBox";
import FormPro from "../../../../../components/formControls/FormPro";
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";

const FilterForm = (props) => {
    const {setLoading , setTableContent } = props
    const [formValues,setFormValues]=React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [preRequestField,setPreRequestField]=React.useState([]);
    const [companyId,setCompanyId] = React.useState();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        {name: "courseCode",
        label: "کد دوره",
        type: "text", 
        col : 4 
        },{
        name: "title",
        label: "عنوان دوره",
        type: "text" ,
        col : 4 
        },{
        name: "type",
        label: "وضعیت دوره",
        type: "select",
        options: "CourseType" ,
        col : 4 
        },{
        name: "category",
        label: "نوع دوره",
        type: "select" ,
        options: "CourseCategory" , 
        col : 4 
        },{
        name: "preRequisite",
        label: "پیش نیاز",
        type: "select",
        options: "Existence" ,
        col : 4 
        },{
        name: "prerequisiteCoursesTitle",
        label: "عناوین پیش نیاز" ,
        type: "multiselect",
        options: preRequestField ,
        optionLabelField : "title",
        optionIdField : "courseId",
        col : 4 ,
        disabled: !formValues["preRequisite"] || formValues["preRequisite"]==="notExist" ,
        }]

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/training/defineCourseFields?partyRelationshipId=${partyRelationshipId}`, axiosKey).then(opt=>{
            setPreRequestField(opt.data.response.course)
            setCompanyId(opt.data.response.companyPartyId)
        })
    },[partyRelationshipId]) 
    const filterData=(filter)=>{
        axios.get(SERVER_URL + `/rest/s1/training/filterOfDefineCourse?courseCode=${formValues?.courseCode??""}&category=${formValues?.category??""}&title=${formValues?.title??""}&type=${formValues?.type??""}&preRequisite=${formValues?.preRequisite??""}&preRequestId=${formValues?.prerequisiteCoursesTitle ? JSON.parse(formValues.prerequisiteCoursesTitle) : []}&companyPartyId=${companyId}&partyRelationshipId=${partyRelationshipId}`  , axiosKey)
        .then(res => {
            setTableContent(res.data.filterData)
        })
    }
    const handleReset=()=>{
        setLoading(true)
    }
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={()=>filterData(formValues)}
            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        >
        </FormPro>
    )
};

export default FilterForm;


















