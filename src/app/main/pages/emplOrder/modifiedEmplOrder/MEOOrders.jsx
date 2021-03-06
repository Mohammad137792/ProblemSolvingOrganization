import React , {useState,useEffect} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {CardHeader,CardContent,Divider,Button,Collapse,Tooltip,Card,Grid} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import TablePro from "../../../components/TablePro";
import UserFullName from "../../../components/formControls/UserFullName";
import UserCompany from "../../../components/formControls/UserCompany";
import ActionBox from "../../../components/ActionBox";
import FormPro from "../../../components/formControls/FormPro";
import {makeStyles} from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

const formDefaultValues = {
    partyDisabled: "N",
}

    const MEOOrders = (props)=>{
    const {initData,selectedEmpl,setSelectedEmpls,selectedPerson,setSelectedPerson} = props
    const [personnel, setPersonnel] = useState([]);
    const [orders, selectedOrders] = useState([]);
    // const [initData, setInitData] = useState({"enums":{},"classifications":{}});
    const [loading, setLoading] = useState(false);
    const [tableContent, setTableContent] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [filterValues, setFilterValues] = useState([]);
    const [formValidation, setFormValidation] = useState({});
    const [expanded, setExpanded] = useState(false);
    const useStyles = makeStyles({
        DisableRow: {
            position:'relative',
            '&::after':{
                content: '""',
                zIndex:'9999',
                position: 'absolute',
                top:'0',
                display:'block',
                width: '100%',
                height: '100%',
                background:'#ffffff74'
            }

        },
        centerFlux:{
            display: "flex" ,
            alignItems : "center",
            justifyContent: "center"
        },
        headerCollapse:{
            backgroundColor: "#2D323E",
            justifyContent: "center",
            color:"#fff",
            textAlign : "center",
            "& .MuiCardHeader-action" :{
                backgroundColor: "#fff",
                borderRadius:"4px"
            }
        }
    }); 
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin

    const classes = useStyles();
    const tableCols = [
        {name: "pseudoId", label: "?????????? ??????", type: "text", style: {width:"80px"}},
        {name: "emplStatus", label: "?????????? ??????", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "orderDate", label: "?????????? ????????", type: "date"},
        {name: "fromDate", label: "?????????? ????????", type: "date"},
        {name: "thruDate", label: "?????????? ????????????", type: "date"},
        {name: "EmplOrderType", label: "?????? ??????????????", type: "text"},
        {name: "employmentDate", label: "?????????? ??????????????", type: "date"},
        {name: "emplPositionTitle", label: "?????? ??????????????", type: "text"},
        {name: "jobTitle", label: "??????", type: "text"},
    ]

    const formStructure = [{
        type:   "component",
        component: <UserFullName/>
    },{
        type:   "component",
        component: <UserCompany/>
    },{
        name    : "thruDate",
        label   : "?????????? ???????? ??????",
        type    : "date",
    },{
        name    : "personelName",
        label   : "?????? ??????????",
        type    : "select",
        options : personnel,
        optionLabelField: 'fullName',
        optionIdField:'partyId',
    }]

    const filterStructure = [{
        name    : "agreementType",
        label   : "?????? ??????????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'enumId',
        options : initData?.enums?.AgreementType
    },{
        name    : "emplType",
        label   : "?????? ?????? ????????????????",
        type    : "select",
        optionLabelField: 'title',
        optionIdField:'settingId',
        options : initData?.orderTypes

    },{
        name    : "personnelGroup",
        label   : "???????? ????????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.EmployeeGroups

    },{
        name    : "personnelSubGroup",
        label   : "?????????????? ????????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.EmployeeSubGroups

    },{
        name    : "district",
        label   : "?????????? ????????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.ActivityArea
        
    },{
        name    : "region",
        label   : "???????? ????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.ExpertiseArea

    },{
        name    : "cost",
        label   : "???????? ??????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.CostCenter

    },{
        name    : "job",
        label   : "??????",
        type    : "select",
    },{
        name    : "unit",
        label   : "???????? ??????????????",
        type    : "select",
        
        optionLabelField: 'organizationName',
        optionIdField:'partyId',
        options : initData?.organizationUnit
    },{
        name    : "emplPosition",
        label   : "?????? ??????????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'emplPositionId',
        options : initData?.emplPosition
    },{
        name    : "fromExecuteDate",
        label   : "???? ?????????? ?????????? ??????",
        type    : "date",
    },{
        name    : "toExecuteDate",
        label   : "???? ?????????? ?????????? ??????",
        type    : "date",
    },{
        name    : "fromDate",
        label   : "???? ?????????? ???????????? ??????",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "???? ?????????? ???????????? ??????",
        type    : "date",
    },{
        name    : "emplCode",
        label   : "?????????? ??????",
        type    : "text",
    },{
        name    : "emplStatus",
        label   : "?????????? ??????",
        type    : "select",
    },{
        name    : "inputFactors",
        label   : "?????????? ??????????",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'inputId',
        options : initData?.inputFactors
    },{
        name    : "inputFactorsValue",
        label   : "?????????? ?????????? ??????????",
        type    : "text",
    },{
        name    : "constants",
        label   : "???????????? ???????? ",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'enumId',
        options : initData?.constants?.consts
    },{
        name    : "constantsValue",
        label   : "?????????? ???????????? ????????",
        type    : "text",
    },{
        name    : "parameters",
        label   : "??????????????",
        type    : "select",
    },{
        name    : "parametersValue",
        label   : "?????????? ??????????????",
        type    : "text",
    },{
        name    : "payrollFactors",
        label   : "?????????? ????????",
        type    : "select",
        optionLabelField: 'title',
        optionIdField:'enumId',
        options : initData?.payRollfactors
    },{
        name    : "payrollFactorsValue",
        label   : "?????????? ???????? ????????",
        type    : "text",
    },]

    
    // function getStepInfo(){
    //     let params = {
    //         "partyId":partyId,
    //         "partyClassificationTypeList":['EmployeeGroups','EmployeeSubGroups','ActivityArea','ExpertiseArea','CostCenter' ],
    //         "enumTypeList" :['AgreementType','InputFactor','constantType',]
    //     }
    //     axios.post(SERVER_URL + "/rest/s1/emplOrder/stepOneInfo",{info : params}, {
    //         headers: {
    //             'api_key': localStorage.getItem('api_key')
    //         },
    //     }).then(async res=> {
    //         setInitData(res.data.enums)
    //         console.log('sssssssssssss',res.data)
    //     })
    // }


    function getPersons(params=formDefaultValues) {
        axios.get(SERVER_URL + "/rest/s1/emplOrder/getPersonnelsForModification", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            console.log('dddddd',res.data.result)
            setPersonnel(res.data.result)
        }).catch(err => {
            console.log('get personnel error..', err);
        });
    }

    function getOrders(){
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/emplOrder/getEmplsForModifications", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params : {"partyId":formValues.personelName}
        }).then(res => {
            
            console.log('orders', res);
            setLoading(false)
            setTableContent(res.data.empls)
        }).catch(err => {
            setLoading(false)
        });
    }

    useEffect(()=>{
        // getStepInfo()
        getPersons()
    },[])


    useEffect(()=>{
        if(formValues.personelName){
            getOrders()
        }
    },[formValues])

    return(
        
        <React.Fragment>
        {console.log("aaaaaaaaaaaaaa",initData)}  
            <FormPro
                append={formStructure}
                formValues={formValues}
                formDefaultValues={formDefaultValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}

            />

            <Card>
                <CardHeader  className={classes.headerCollapse}  title={"?????????? ??????????"}
                    action={
                        <Tooltip title="?????????? ?????????????? ????????????????">
                            <ToggleButton
                                value="check"
                                selected={expanded}
                                onChange={() => setExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
                <CardContent >
                    <Collapse in={expanded}>
                        <FormPro
                            append={filterStructure}
                            formValues={filterValues}
                            formDefaultValues={formDefaultValues}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">????????????</Button>
                                <Button type="reset" role="secondary">??????</Button>
                            </ActionBox>}
                        />

                        

                    </Collapse>


                </CardContent>



            </Card>



                <Grid item xs={12}>
                    <Card variant="outlined">
                        <TablePro
                            title="???????? ??????????"
                            columns={tableCols}
                            rows={tableContent}
                            loading={loading}
                            defaultOrderBy="firstName"
                            selectable
                            selectedRows={orders}
                            setSelectedRows={selectedOrders}
                            isSelected={(row,selectedRows) => selectedRows.map(i=>i.emplOrderId).indexOf(row.emplOrderId)!==-1 }

                        />
                    </Card>
                </Grid>
                {/* </Grid> */}
        </React.Fragment>
    )
}
export default MEOOrders
