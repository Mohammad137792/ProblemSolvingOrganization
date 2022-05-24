import FormPro from "../../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Description, Image, TrendingUpRounded } from "@material-ui/icons"
import VisibilityIcon from '@material-ui/icons/Visibility';



const RecordResultsOfVolunteerSurvey = () => {

    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(false);

    const [waiting, set_waiting] = useState(false) 

    const tableCols = [
        { titleofDocumentation: "titleofDocumentation", label:"تاریخ مصاحبه", type: "date" },
        { name : "contentDate", label: "نوع مصاحبه", type: "text" , style: {minWidth:"80px"} },
        { name : "fileObservation", label:"نتیجه مصاحبه", type: "text" , style: {minWidth:"80px"} },
        { name : "contentTypeEnumId", label: "اولویت استخدام", type: "text", style: {minWidth:"120px"} },
    ]

    const observation = () => {

    }

    return (
        <div>
            <TablePro
                title="لیست مصاحبه ها"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                add="external"
                addForm={<AddForm loading={loading} setLoading={setLoading} />}
                rowActions={[{
                    title: " مشاهده نتایج مصاحبه",
                    icon: VisibilityIcon,
                    onClick: (row) => {
                        observation(row);
                    },
                }]}
            />
        </div>
    );
};

export default RecordResultsOfVolunteerSurvey;


function AddForm ({...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading} = restProps;

    const [waiting, set_waiting] = useState(false) 

    const formStructure = [{
        name    : "trackingCodeId",
        label   : "محل استقرار فرد در سازمان",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "آدرس محل استقرار",
        type    : "text",
        col     : 9
    },{
        name    : "trackingCodeId",
        label   : "تاریخ مصاحبه",
        type    : "date",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نوع مصاحبه",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نتیجه مصاحبه",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "اولویت استخدام",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]

    const submit = () => {

    }

    const resetCallback = () => {

    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={submit}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >ثبت</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}