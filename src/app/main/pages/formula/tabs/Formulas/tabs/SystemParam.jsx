import React from 'react';
import {Collapse, ListItem, ListItemText,Divider,List} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

class SystemParam extends React.Component {

    constructor(props){
        super(props);
        this.geo = props?.params.geo
        this.job = props?.params.job
        this.positions = props?.params.emplPosition
        this.organizationUnit = props?.params.organizationUnit
        this.payGrade = props?.params.PayGrade
        this.classifications = props?.params.classifications
        this.orderType = props?.params.orderTypes
        this.enums = { ...props?.params}
        delete this.enums.geo
        delete this.enums.job
        delete this.enums.emplPosition
        delete this.enums.organizationUnit
        delete this.enums.PayGrade
        delete this.enums.orderTypes
        delete this.enums.classifications
    }

    state = {};

    handleClick = e => {
        this.setState({ [e]: !this.state[e] });
    };

    renderTitle = k =>{
        switch(k.toLowerCase()) {
            case 'sect' :
                return 'مذهب';
            case 'religion' :
                return 'دین';
            case 'residence' :
                return 'نوع اسکان';
            case 'marital' :
                return 'تاهل';
            case 'sacrifice' :
                return 'ایثارگری';
            case 'university' :
                return 'دانشگاه';
            case 'universitytype' :
                return 'نوع دانشگاه';
            case 'department' :
                return 'گروه آموزشی';
            case 'employmentstatus' :
                return 'اشتغال';
            case 'gradetype' :
                return 'رده سازمانی';
            case 'sibling' :
                return 'نسبت خانوادگی';
            case 'qualification' :
                return 'مقطع تحصیلی';
            case 'militarystate' :
                return 'نظام وظیفه';
            case 'employeegroups' :
                return 'گروه پرسنلی';
            case 'employeesubgroups' :
                return 'زیرگروه پرسنلی';
            case 'activityarea' :
                return 'منطقه فعالیت';
            case 'expertisearea' :
                return 'حوزه کاری';
            case 'costcenter' :
                return 'مرکز هزینه';
            case 'fields' :
                return 'رشته تحصیلی';
            case 'paygrade' :
                return 'طبقه شغلی';
            case 'emplposition' :
                return 'پست سازمانی';
            case 'positiontype' :
                return 'نوع پست';
            case 'jobgrade' :
                return 'طبقه ';
            case 'jobtitle' :
                return 'عنوان طبقه شغلی';
            case 'agreementtype' :
                return 'نوع قرارداد';
            case 'relationdegree' :
                return 'ارتباط';
        }
    }

    render() {

        console.log('enums',this.props)

        const geoEnums = this.geo ? Object.entries(this.geo).map(([k, v]) => {
            return(
                <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        k
                    )}>
                        <ListItemText primary={k== 'GEOT_COUNTRY' ? "کشور" : k == 'GEOT_COUNTY' ? "شهرستان" : "استان"} />
                        {this.state[k] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state[k]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {v.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.geoId+'"')}}>
                                            <ListItemText primary={ele.geoName} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
            )
        }) : []

        Object.keys(this.enums).forEach(key => this.enums[key] === undefined ? delete this.enums[key] : {});
        const otherEnums = this.enums ? Object.entries(this.enums).map(([k, v]) => {
            return(
                <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        k
                    )}>
                        <ListItemText primary={this.renderTitle(k)

                        } />
                        {this.state[k] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state[k]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {v.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula(ele.enumCode ? '"'+ele.enumCode+'"' : '"'+ele.code+'"')}}>
                                            <ListItemText primary={ele.description} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
            )
        }) : []

        const classifications = this.classifications ? Object.entries(this.classifications).map(([k, v]) => {
            return(
                <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        k
                    )}>
                        <ListItemText primary={this.renderTitle(k)

                        } />
                        {this.state[k] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state[k]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {v.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.standardCode+'"')}}>
                                            <ListItemText primary={ele.description} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
            )
        }) : []

        const jobs = this.job ? <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "job"
                    )}>
                        <ListItemText primary={"شغل"} />
                        {this.state["job"] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state["job"]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {this.job.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.jobCode+'"')}}>
                                            <ListItemText primary={ele.jobTitle} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
                :[]

        const organizationUnits = this.organizationUnit ? <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "organizationUnit"
                    )}>
                        <ListItemText primary={"واحد سازمانی"} />
                        {this.state["organizationUnit"] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state["organizationUnit"]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {this.organizationUnit.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.pseudoId+'"')}}>
                                            <ListItemText primary={ele.organizationName} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
                :[]

        const positions = this.positions ? <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "positions"
                    )}>
                        <ListItemText primary={"پست سازمانی"} />
                        {this.state["positions"] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state["positions"]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {this.positions.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.pseudoId+'"')}}>
                                            <ListItemText primary={ele.description} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
                :[]

        const payGrades = this.payGrade ? <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "payGrade"
                    )}>
                        <ListItemText primary={"طبقه شغلی"} />
                        {this.state["payGrade"] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state["payGrade"]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {this.payGrade.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula('"'+ele.payGradeId+'"')}}>
                                            <ListItemText primary={ele.description} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
                :[]

        const orderTypes = this.orderType ?  <>
                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "orderTypes"
                    )}>
                        <ListItemText primary={"نوع حکم کارگزینی"} />
                        {this.state["orderTypes"] ? (
                            <ExpandLess/>
                        ) : (
                            <ExpandMore/>
                        )}
                        <Divider absolute/>
                    </ListItem>
                    <Collapse
                        component="li"
                        in={this.state["orderTypes"]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            {this.orderType.map(ele=>{
                                return(
                                    <>
                                        <ListItem button onClick={()=>{this.props.changeFormula(' "'+ele.code+'"')}}>
                                            <ListItemText primary={ele.title} />
                                        </ListItem>
                                    </>
                                )
                            })}
                        </List>
                    </Collapse>
                </>
                :[]

        return (
            <>
                <List>

                    {organizationUnits}
                    {orderTypes}
                    {geoEnums}

                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "gender"
                    )}>
                        <ListItemText primary={"جنسیت"} />
                    {this.state["gender"] ? (
                        <ExpandLess/>
                    ) : (
                        <ExpandMore/>
                    )}
                    <Divider absolute/>
                    </ListItem>
                        <Collapse
                            component="li"
                            in={this.state["gender"]}
                            timeout="auto"
                            unmountOnExit
                        >
                        <List>
                            <ListItem button onClick={()=>{this.props.changeFormula("'M'")}}>
                                <ListItemText primary={"مرد"}/>
                            </ListItem>
                            <ListItem button onClick={()=>{this.props.changeFormula("'F'")}}>
                                <ListItemText primary={"زن"} />
                            </ListItem>
                        </List>
                    </Collapse>


                    <ListItem button onClick={this.handleClick.bind(
                        this,
                        "bool"
                    )}>
                        <ListItemText primary={"دارد - ندارد"} />
                    {this.state["bool"] ? (
                        <ExpandLess/>
                    ) : (
                        <ExpandMore/>
                    )}
                    <Divider absolute/>
                    </ListItem>
                        <Collapse
                            component="li"
                            in={this.state["bool"]}
                            timeout="auto"
                            unmountOnExit
                        >
                        <List>
                            <ListItem button onClick={()=>{this.props.changeFormula("'Y'")}}>
                                <ListItemText primary={"دارد"}/>
                            </ListItem>
                            <ListItem button onClick={()=>{this.props.changeFormula("'N'")}}>
                                <ListItemText primary={"ندارد"} />
                            </ListItem>
                        </List>
                    </Collapse>


                    {otherEnums}
                    {jobs}
                    {positions}
                    {payGrades}
                    {classifications}

                </List>
            </>
        );
    }

}
export default SystemParam;