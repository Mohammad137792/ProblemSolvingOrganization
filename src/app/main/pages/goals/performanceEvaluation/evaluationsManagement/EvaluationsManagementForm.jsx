import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from "../../../../components/TablePro";
import ActionBox from "../../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewListIcon from '@material-ui/icons/ViewList';
import EvaluationExecutionForm from './EvaluationExecutionForm'
import ModalPro from "../../../../components/ModalPro";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useHistory } from 'react-router-dom'

const EvaluationsManagementForm = () => {

    const [definedEvaluationsTableContent, setDefinedEvaluationsTableContent] = React.useState([{}]);
    const [fieldInfo, setFieldInfo] = useState({evaluationMethodEnumId : [] , centerEvaluatorRelationshipId : [] , evaluatingPersonsInfo : [] , positionInfo : [] , companyPartyId : "" , unitInfo : []});
    const [selectionStatus,setSelectionStatus,] = React.useState("");
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [evaluatedLoading, setEvaluatedLoading] = useState(false);
    const [definedEvaluationsLoading, setDefinedEvaluationsLoading] = useState(false);
    const [showEvaluationExecutionForm,setShowEvaluationExecutionForm] = useState(false);
    const [evaluatedListTableContent,setEvaluatedListTableContent] = useState([{}]);
    const [showEvaluatedList,setShowEvaluatedList] = useState(false);

    const history = useHistory()

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    const definedEvaluationsTableCols = [
        {
            name: "code",
            label: "کد دوره ارزیابی",
            type: "text", 
        },{
            name: "name",
            label: " عنوان دوره ارزیابی",
            type: "text" ,
        },{
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: fieldInfo.evaluationMethodEnumId ,
            optionLabelField: "description",
            optionIdField: "enumId",
        },{
            name: "startDate",
            label: "تاریخ شروع ",
            type: "date" ,
        },{
            name: "thruDate",
            label: "تاریخ پایان ",
            type: "date",
        },{
            name: "selectionStatus",
            label: "وضعیت انتخاب ارزیاب ",
            type: "text" ,
        },{
            name: "statusId",
            label: "وضعیت اجرای ارزیاب",
            type: "text",
    }]

    const evaluatedListTableCols = [
        {
            name: "name",
            label: "ارزیابی شونده",
            type: "text", 
            col : 4 
        },{
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text" ,
            col : 4 
        },{
            name: "unitName",
            label: "واحد سازمانی",
            type: "select",
            col : 4 
        },{
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            col : 4 
        },{
            name: "selectionStatus",
            label: "وضعیت",
            type: "select",
            col : 4 
    }]

    const showResult = () => {
        setShowEvaluatedList(true)
    }

    const evaluationExecution = () => {
        setShowEvaluationExecutionForm(true)
    }

    const viewList = () => {

    }

    const showEvaluatedResult = () => {
        history.push(`/reportPerformanceEvaluation`)
    }

    const closeEvaluatedList = () => {
        setShowEvaluatedList(false)
    }

    return (
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <TablePro
                            title = "دوره های تعریف شده"
                            columns={definedEvaluationsTableCols}
                            rows={definedEvaluationsTableContent}
                            setRows={setDefinedEvaluationsTableContent}
                            loading={definedEvaluationsLoading}
                            // edit="callback"
                            // editCallback={handleEditData}
                            // removeCallback={handleRemoveDefinition}
                            filter="external"
                            filterForm={
                                <FilterDefinedEvaluations />
                            }
                            rowActions={[{
                                title: "نتایج",
                                icon: DescriptionIcon,
                                onClick: (row)=>{
                                    showResult(row)
                                }
                            }]}
                            actions={[{
                                title: "اجرای ارزیابی",
                                icon: SettingsIcon ,
                                onClick: () => {
                                    evaluationExecution()
                                }
                            },{
                                title: "دسترسی به لیست ارزیاب و ارزیابی شونده",
                                icon: ViewListIcon ,
                                onClick: () => {
                                    viewList()
                                }
                            }]}
                        />
                    </CardContent>
                </Card>
                <ModalPro
                    open={showEvaluationExecutionForm}
                    setOpen={setShowEvaluationExecutionForm}
                    content={
                        <Box p={5}>
                            <EvaluationExecutionForm setShowEvaluationExecutionForm={setShowEvaluationExecutionForm}/>
                        </Box>
                    }
                />
                <Box m={2}/>
                {showEvaluatedList ? 
                    <Card>
                        <CardContent>
                            <TablePro
                                title = "لیست ارزیابی شوندگان"
                                columns={evaluatedListTableCols}
                                rows={evaluatedListTableContent}
                                setRows={setEvaluatedListTableContent}
                                loading={evaluatedLoading}
                                // edit="callback"
                                // editCallback={handleEditData}
                                // removeCallback={handleRemoveDefinition}
                                rowActions={[{
                                    title: "مشاهده ی نتایج",
                                    icon: VisibilityIcon,
                                    onClick: (row)=>{
                                        showEvaluatedResult(row)
                                    }
                                }]}
                            />
                            <Box m={2}/>
                            <div style={{display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            style={{
                                                width: 120 ,
                                                color: "white",
                                                backgroundColor: "#039be5",
                                                marginRight: "8px",
                                            }}
                                            variant="outlined"
                                            type="submit"
                                            role="primary"
                                            onClick={closeEvaluatedList}
                                            >
                                            {" "} تایید{" "}
                                        </Button>
                                    </div>
                        </CardContent>
                    </Card>
                :""}
            </CardContent>
        </Card>
    );
};

export default EvaluationsManagementForm;

function FilterDefinedEvaluations (props) {

    const {formValues, setFormValues, handleClose} = props

    const filterFormStructure = [
        {
            name: "codeAndName",
            label: "کد و عنوان دوره ارزیابی",
            type: "select", 
            col : 4 
        },{
            name: "selectionStatus",
            label: "وضعیت انتخاب ارزیاب",
            type: "text" ,
            col : 4 
        },{
            name: "statusId",
            label: " وضعیت اجرای ارزیابی",
            type: "select",
            // options: fieldInfo.evaluationMethodEnumId ,
            // optionLabelField: "description",
            // optionIdField: "enumId",
            col : 4 
        },{
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select" ,
            col : 4 
        },{
            name: "startDate",
            label: "تاریخ شروع ارزیابی",
            type: "date" ,
            col : 4 
        },{
            name: "thruDate",
            label: "تاریخ پایان ارزیابی",
            type: "date",
            col : 4 
        }]

    return (

        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={filterFormStructure}
            // submitCallback = {() => 
            //     edit ? 
            //         editDefinition()
            //         :   
            //         createEvaluation() 
            // }
            // resetCallback={resetCallback}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">فیلتر</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />

    )
}