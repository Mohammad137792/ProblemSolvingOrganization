import React from 'react';
import List from "@material-ui/core/List";
import {Collapse, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
function makeFunctionList(){
    const general=[
        {"title":"existValue","description":"مقدار دارد" ,"math":"existValue()"}
        ,{"title":"value","description":"مقدار" ,"math":"value()"}]
    const string=[
        {"title":"rightValue","description":"مقدار از سمت راست" ,"math":"rightValue()"},
        {"title":"leftValue","description":"مقدار از سمت چپ" ,"math":"leftValue()"},
        {"title":"length","description":"طول رشته" ,"math":"size ()"}]
    const math=[
        {"title":"max","description":"بیشترین مقدار","math":"$max()"},
        {"title":"min","description":"کمترین مقدار","math":"$min()"},
        {"title":"abs","description":"قدر مطلق","math":"$abs()"}]
    const date=[
        {"title":"dateBase","description":"قالب تاریخ","math":"1400/02/02"},
        {"title":"before","description":"قبل از","math":"before()"},
        {"title":"after","description":"بعد از","math":"after()"}]
    const functionList=[
        // {"title":"general","description":"توابع عمومی" ,"members":general},
        // {"title":"string","description":"توابع رشته ای" ,"members":string}
        {"title":"math","description":"توابع ریاضی" ,"members":math},
        // {"title":"date","description":"توابع تاریخ" ,"members":date},
    ]
    return functionList;
}
class FunctionList extends React.Component {
    state = {};
    handleClick = e => {
        this.setState({ [e]: !this.state[e] });
    };
    render() {
        const functions=makeFunctionList();
        return (
            <>
                <List>
                    {functions?.map((ele)=>{
                        return(
                            <>
                        <ListItem button  onClick={this.handleClick.bind(
                            this,
                            ele.title
                        )}>
                            <ListItemText primary={ele.description}/>
                            {this.state[ele.title] ? (
                                <ExpandLess/>
                            ) : (
                                <ExpandMore/>
                            )}
                            <Divider absolute/>
                        </ListItem>
                        <Collapse
                            component="li"
                            in={this.state[ele.title]}
                            timeout="auto"
                            unmountOnExit
                        >
                            {ele.members.map((entry)=>{
                                return(
                                    <List  onClick={()=>{this.props.changeFormula(entry.math)}}>
                                <ListItem button>
                                    <ListItemText primary={entry.description}/>
                                </ListItem>
                            </List>
                                )
                            })}
                        </Collapse>
                            </>
                    )})}
                </List>
            </>
        )
    }
}
export default FunctionList;