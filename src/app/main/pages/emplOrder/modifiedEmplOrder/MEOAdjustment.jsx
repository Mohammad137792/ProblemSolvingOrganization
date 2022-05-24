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

const formDefaultValues = {
    partyDisabled: "N",
}

const MEOOrders = (props)=>{
    const {initData} = props

    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableContent, setTableContent] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [filterValues, setFilterValues] = useState([]);
    const [formValidation, setFormValidation] = useState({});
    const [personExpanded, setPersonExpanded] = useState(false);
    const [organExpanded, setOrganExpanded] = useState(false);
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
   
    const classes = useStyles();
    const tableCols = [
        {name: "pseudoId", label: "ترتیب محاسبه", type: "text", style: {width:"80px"}},
        {name: "emplStatus", label: "عنوان عامل حکمی", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "orderDate", label: "گروه عامل حکمی", type: "date"},
        {name: "fromDate", label: "جزییات فرمول محاسبه", type: "date"}
    ]

    const formStructure = [{
        name    : "empl",
        label   : "حکم کارگزینی",
        type    : "select",
        options : personnel,
        optionLabelField: 'fullName',
        optionIdField:'partyId',
    }]

    const personalInformation = [{
        name    : "agreementType",
        label   : "نام پدر",
        type    : "text",
    },{ 
        name    : "emplType",
        label   : "کد ملی",
        type    : "text",
    },{ 
        name    : "personnelGroup",
        label   : "شماره شناسنامه",
        type    : "text",
    },{ 
        name    : "personnelSubGroup",
        label   : "سری شناسنامه",
        type    : "text",
    },{ 
        name    : "district",
        label   : "محل صدور",
        type    : "text",
    },{ 
        name    : "region",
        label   : "محل تولد",
        type    : "text",
    },{ 
        name    : "cost",
        label   : "تاریخ تولد",
        type    : "date",
    },{ 
        name    : "job",
        label   : "وضعیت نظام وظیفه",
        type    : "select",
        optionLabelField: 'description',
        optionIdField:'partyClassificationId',
        options : initData?.classifications?.Militarystate
    },{ 
        name    : "unit",
        label   : "وضعیت تاهل",
        type    : "select",
    },{ 
        name    : "emplPosition",
        label   : "تعداد فرزندان",
        type    : "text",
    },{ 
        name    : "fromExecuteDate",
        label   : "تعداد افراد تحت تکفل",
        type    : "text",
    },{ 
        name    : "toExecuteDate",
        label   : "وضعیت اسکان",
        type    : "select",
    },{ 
        name    : "fromDate",
        label   : "آخرین مقطع تحصیلی",
        type    : "select",
    },{ 
        name    : "thruDate",
        label   : "رشته تحصیلی",
        type    : "select",
    },{ 
        name    : "emplCode",
        label   : "نوع دانشگاه",
        type    : "select",
    },{ 
        name    : "emplStatus",
        label   : "سطح ارتباط آخرین مقطع تحصیلی",
        type    : "select",
    },{ 
        name    : "inputFactors",
        label   : "میزان سابقه شغلی",
        type    : "text",
    },{ 
        name    : "inputFactorsValue",
        label   : "میزان سابقه شغلی مرتبط",
        type    : "text",
    },{ 
        name    : "inputFactorsValue",
        label   : "میزان سابقه شغلی نیمه مرتبط",
        type    : "text",
    },{ 
        name    : "constants",
        label   : "ملیت ",
        type    : "select",
    },{ 
        name    : "constantsValue",
        label   : "استان محل سکونت",
        type    : "select",
    },{ 
        name    : "constantsValue",
        label   : "شهرستان محل سکونت",
        type    : "select",
    },{ 
        name    : "parameters",
        label   : "نوع ایثارگری",
        type    : "select",
    },{ 
        name    : "parametersValue",
        label   : "مدت ایثارگری",
        type    : "text",
    },{ 
        name    : "payrollFactors",
        label   : "درصد جانبازی",
        type    : "text",
    }]

    const organizationInformation = [{
        name    : "agreementType",
        label   : "گروه پرسنلی",
        type    : "text",
    },{
        name    : "agreementType",
        label   : "زیر گروه پرسنلی",
        type    : "text",
    },{ 
        name    : "emplType",
        label   : "منطقه فعالیت",
        type    : "text",
    },{ 
        name    : "emplType",
        label   : "حوزه فعالیت",
        type    : "text",
    },{ 
        name    : "personnelGroup",
        label   : "مرکز هزینه",
        type    : "text",
    },{ 
        name    : "personnelSubGroup",
        label   : "شرکت",
        type    : "text",
    },{ 
        name    : "district",
        label   : "واحد سازمانی",
        type    : "text",
    },{ 
        name    : "region",
        label   : "تعداد پست های همزمان",
        type    : "text",
    },{ 
        name    : "cost",
        label   : "کد شغل",
        type    : "text",
    },{ 
        name    : "job",
        label   : "عنوان شغل",
        type    : "text",
    },{ 
        name    : "unit",
        label   : "کد پست اصلی",
        type    : "text",
    },{ 
        name    : "unit",
        label   : "عنوان پست اصلی",
        type    : "select",
    },{ 
        name    : "emplPosition",
        label   : "طبقه شغلی",
        type    : "select",
    },{ 
        name    : "fromExecuteDate",
        label   : "رتبه شغلی",
        type    : "select",
    },{ 
        name    : "toExecuteDate",
        label   : "نوع پست",
        type    : "select",
    },{ 
        name    : "fromDate",
        label   : "رده سازمانی",
        type    : "select",
    },{ 
        name    : "thruDate",
        label   : "تاریخ استخدام",
        type    : "date",
    },{ 
        name    : "emplCode",
        label   : "امتیاز شغلی",
        type    : "text",
    }]

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
            setLoading(false)
            setTableContent(res.data.empls)
        }).catch(err => {
            setLoading(false)
            console.log('get personnel error..', err);
        });
    }


    
    return(
        <React.Fragment>
            {console.log('fffffffff',initData)}
          
            <FormPro
                append={formStructure}
                formValues={formValues}
                formDefaultValues={formDefaultValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}

            />

            <Card>
                <CardHeader  className={classes.headerCollapse}  title={"اطلاعات شخصی"}
                    action={
                        <Tooltip title="نمایش مخاطبین نیازسنجی">
                            <ToggleButton
                                value="check"
                                selected={personExpanded}
                                onChange={() => setPersonExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
                <CardContent >
                    <Collapse in={personExpanded}>
                        <FormPro
                            append={personalInformation}
                            formValues={filterValues}
                            formDefaultValues={formDefaultValues}
                            
                        />

                        

                    </Collapse>


                </CardContent>



            </Card>

            <Card>
                <CardHeader  className={classes.headerCollapse}  title={"اطلاعات سازمانی"}
                    action={
                        <Tooltip title="نمایش اطلاعات سازمانی">
                            <ToggleButton
                                value="check"
                                selected={organExpanded}
                                onChange={() => setOrganExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
                <CardContent >
                    <Collapse in={organExpanded}>
                        <FormPro
                            append={organizationInformation}
                            formValues={filterValues}
                            formDefaultValues={formDefaultValues}
                          
                        />

                        

                    </Collapse>


                </CardContent>



            </Card>



                <Grid item xs={12}>
                    <Card variant="outlined">
                        <TablePro
                            title="لیست عوامل حکمی"
                            columns={tableCols}
                            rows={tableContent}
                            loading={loading}
                            defaultOrderBy="firstName"
                        />
                    </Card>
                </Grid>
                {/* </Grid> */}
        </React.Fragment>
    )
}
export default MEOOrders
