



import React, { useState, useEffect, createRef } from 'react';
import Card from "@material-ui/core/Card";
import { Button } from "@material-ui/core";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
// import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
// import TablePro from "../../../components/TablePro";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import TablePro from 'app/main/components/TablePro';
// import ActionBox from "../../../components/ActionBox";
import { Image } from "@material-ui/icons"
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useDispatch } from 'react-redux';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import TabPro from 'app/main/components/TabPro';
import VerficationSuggestion from './tabs/VerficationSuggestion';
import { dispatch } from 'd3-dispatch';
import InfoSuggestion from './tabs/InfoSuggestion';
import RejectionReason from './tabs/RejectionReason';



const ResultSuggestionsForm = (props) => {

    const { formVariables, submitCallback = true } = props;
    const [formValuesSuggestion, setFormValuesSuggestion] = useState({});
    const [basicInformationFormValues, setBasicInformationFormValues] = useState({})
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);

    const [tableContent, setTableContent] = React.useState([]);
    const [formValuesPrimery, setFormValuesPrimery] = useState([]);


    const [handleCheckBox, setHandleCheckBox] = useState({ group: false, individual: false })
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([])
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState({})
    const [showTab, setShowTab] = useState(false)
    const dispatch = useDispatch();


     
    const formStructure = [
        {
            label: "کد پیشنهاد",
            name: "suggestionCode",
            type: "text",
            col: 4,
            readOnly:true

        },
        {
            label: "تاریخ ایجاد",
            name: "createDate",
            type: "date",
            col: 4,
            readOnly:true

        }, {
            label: "وضعیت پیشنهاد",
            name: "status",
            type: "text",
            col: 4,
            readOnly:true

        }

    ]




const endTask=()=>{
    submitCallback({})
}

const endAccept=()=>{
    submitCallback({})
}
    const tabs = [
        {
            label: "اطلاعات پیشنهاد ",
            panel:<InfoSuggestion  basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
            setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
            setSuggestingGroupTableContent={setSuggestingGroupTableContent}
            setBasicInformationFormValues={setBasicInformationFormValues}
            keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
            tableContent={tableContent} setTableContent={setTableContent}
            formValuseDiscriptionStructure={formValuseDiscriptionStructure}
            setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure}/>
        },
      
        {
            label: "   نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel: <VerficationSuggestion formVariables={formVariables} endAccept={endAccept}/>
        },
       
       
    ]


    
    const tabs1 = [
        {
            label: "اطلاعات پیشنهاد ",
            panel:<InfoSuggestion  basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
            setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
            setSuggestingGroupTableContent={setSuggestingGroupTableContent}
            setBasicInformationFormValues={setBasicInformationFormValues}
            keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
            tableContent={tableContent} setTableContent={setTableContent}
            formValuseDiscriptionStructure={formValuseDiscriptionStructure}
            setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure}/>
        },


        
        {
            label: "   نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel: <RejectionReason fomVarables={formVariables} endTask={endTask}/>
        },
    

       
    ]






    useEffect(() => {
          

            setFormValuesSuggestion(formVariables?.Recommender?.value[0])


            setFormValuesSuggestion(prevState => ({
                ...prevState,
                status:formVariables?.status?.value,
                suggestionCode: formVariables?.trackingCode?.value,
                createDate:formVariables?.Suggestion?.value?.suggestionCreationDate
              
    
            }))


        setFormValuseDiscriptionStructure(formVariables?.Suggestion?.value)

        setBasicInformationFormValues(formVariables?.Suggestion?.value)
        setBasicInformationFormValues(prevState => ({
            ...prevState,
            suggestionCode: formVariables?.trackingCode?.value

        }))

        setKeyWordTableContent(formVariables.SuggestionKeyWords.value)

        setHandleCheckBox(prevState => ({
            ...prevState,
            individual: formVariables?.Suggestion?.value?.suggestionPresentationType === "Y" ? false : true,
            group: formVariables?.Suggestion?.value?.suggestionPresentationType === "N" ? false : true,

        }))

        setSuggestingGroupTableContent(formVariables?.groupList?.value)



        let tableData = []
        if (formVariables.SuggestionContent?.value.length > 0) {
            formVariables.SuggestionContent.value.map((item, index) => {
                let data = {
                    observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                        target="_blank" >  <Image />  </Button>,
                }

                tableData.push(data)
                setTimeout(() => {

                }, 50)
            })

            setTableContent(prevState => { return [...prevState, ...tableData] })

        }


        let moment = require('moment-jalaali')
        const formDefaultValues = {
            reviewDate: moment().format("Y-MM-DD")
        }
        setFormValuesPrimery(formDefaultValues)


    }, []);










    return (
        <Card>
            <Card style={{ backgroundColor: "#dddd", display: "flex", alignItems: "center", justifyContent: "center", height: 150 }}>
                <Card style={{ width: "99%", height: "97%", display: "flex", alignItems: "center", justifyContent: "center",padding:5 }}>
                    <FormPro
                        append={formStructure}
                        formValues={formValuesSuggestion}
                        setFormValues={setFormValuesSuggestion}

                    />
                </Card>
            </Card>
            <TabPro tabs={formVariables.accepterVerif?tabs:tabs1} />
            {/* <TabPro tabs={tabs} /> */}
        </Card>
    )

}



export default ResultSuggestionsForm;
