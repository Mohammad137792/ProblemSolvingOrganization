import React from 'react';
import {ListItem, ListItemText,Collapse,List,Divider} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

class OrderParam extends React.Component{

    state = {};

    handleClick = e => {
        this.setState({ [e]: !this.state[e] });
    };

    render(){
        console.log('payrolls',this.props.payrollFactor)
        return(
            <div>
                {this.props.payrollFactor.map((ele)=>{
                    return(
                        <>
                            {/* <ListItem
                                button
                                onClick={()=>{this.props.changeFormula(ele.title)}}>
                                <ListItemText
                                    primary={ele.title}
                                />
                                <Divider  absolute />
                            </ListItem> */}


                            <ListItem button onClick={this.handleClick.bind(
                                    this,
                                    ele.payrollFactorId
                                )}>
                                    <ListItemText primary={ele.title} />
                                {this.state[ele.payrollFactorId] ? (
                                    <ExpandLess/>
                                ) : (
                                    <ExpandMore/>
                                )}
                                <Divider absolute/>
                                </ListItem>
                                    <Collapse
                                        component="li"
                                        in={this.state[ele.payrollFactorId]}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                    <List>
                                        <ListItem button onClick={()=>{this.props.changeFormula(`EMPL_R_${ele.payrollFactorId}`)}}>
                                            <ListItemText primary={"ریالی"}/>
                                        </ListItem>
                                        <ListItem button onClick={()=>{this.props.changeFormula(`EMPL_S_${ele.payrollFactorId}`)}}>
                                            <ListItemText primary={"امتیازی"} />
                                        </ListItem>
                                    </List>
                                </Collapse>
                               
                        </>
                    )
                })}

                <ListItem button onClick={this.handleClick.bind(
                    this,
                    "orderRecords"
                )}>
                    <ListItemText primary={"رکوردهای عوامل حکمی"} />
                    {this.state["orderRecords"] ? (
                        <ExpandLess/>
                    ) : (
                        <ExpandMore/>
                    )}
                    <Divider absolute/>
                </ListItem>
                <Collapse
                    component="li"
                    in={this.state["orderRecords"]}
                    timeout="auto"
                    unmountOnExit
                >
                    <List>
                        <ListItem button onClick={()=>{this.props.changeFormula(`EMPLS_R`)}}>
                            <ListItemText primary={"ریالی"}/>
                        </ListItem>
                        <ListItem button onClick={()=>{this.props.changeFormula(`EMPLS_S`)}}>
                            <ListItemText primary={"امتیازی"} />
                        </ListItem>
                    </List>
                </Collapse>
            </div>
        )
    }
}
export default OrderParam;