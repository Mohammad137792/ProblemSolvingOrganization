import React from 'react';
import {ListItem, ListItemText,List,Collapse} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

function makeStatement(){
    const statementList=[
        {"title":"if","description":"اگر-آنگاه","formula":"if(){\n}\nelse{\n}"},
        {"title":"if-else","description":"اگر-آنگاه اگر","formula":"if(){\n}\nelse if(){\n}\nelse{\n}"},
        //{"title":"switch-case","description":"switch-case","formula":"switch(variable)  {\n case 'state1':\n // statement1\n break;\n case 'state2':\n // statement2\n break;} "},
        {"title":"return","description":"مقدار خروجی","formula":"return  ;"},
        {"title":"for","description":"حلقه","formula":"myArray.each{item ->\n}"},
        // {"title":"else","description":"در غیر اینصورت","formula":"در غیر این صورت()"},
        // {"title":"elseif","description":"در غیر اینصورت- اگر","formula":"در غیر این صورت- اگر()"},
        // {"title":"while","description":"تا زمانی که","formula":"تا زمانی که()"},
    ]

    
    return statementList
}

class Statement extends React.Component{
    state = {};
    handleClick = e => {
        this.setState({ [e]: !this.state[e] });
    };

    render(){
        const statements=makeStatement();

        const operators = [
            {"title":"equal","description":"مساوی","formula":"=="},
            {"title":"biggerThan","description":"بزرگتر","formula":">"},
            {"title":"lessThan","description":"کوچکتر","formula":"<"},
            {"title":"and","description":"و","formula":"&&"},
            {"title":"or","description":"یا","formula":"||"},
            {"title":"biggerOrEqual","description":"بزرگتر مساوی","formula":">="},
            {"title":"lessOrEqual","description":"کوچکتر مساوی","formula":"<="},
        ]
    return(
        <div>
        {statements.map((ele)=>{
            return(
                <>
                <ListItem
                    button
                    onClick={()=>{this.props.changeFormula(ele.formula)}}>
                    <ListItemText
                        primary={ele.description}
                    />
                    <Divider  absolute />
                </ListItem>
                </>
            )
        })}
        { <>
                <ListItem button onClick={this.handleClick.bind(
                    this,
                    "operators"
                )}>
                    <ListItemText primary={"عملگرها"} />
                    {this.state["operators"] ? (
                        <ExpandLess/>
                    ) : (
                        <ExpandMore/>
                    )}
                    <Divider absolute/>
                </ListItem>
                <Collapse
                    component="li"
                    in={this.state["operators"]}
                    timeout="auto"
                    unmountOnExit
                >
                    <List>
                        {operators.map(ele=>{
                            return(
                                <>
                                    <ListItem button onClick={()=>{this.props.changeFormula(ele.formula)}}>
                                        <ListItemText primary={ele.description} />
                                    </ListItem>
                                </>
                            )
                        })}
                    </List>
                </Collapse>
            </>}
        </div>
    )
}
}
export default Statement;