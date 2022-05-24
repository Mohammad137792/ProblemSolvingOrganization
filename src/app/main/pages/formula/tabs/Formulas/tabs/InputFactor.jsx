import React from 'react';
import {Card, Collapse, Container, ListItem, ListItemText, Paper} from "@material-ui/core";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        background: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4
    }
});
const InputFactor= (props)=> {

    console.log("inputs",props)
    const list=props.inputFactor
    
        return (
                        <List>
                            {list.map(item => {
                                return (
                                    <div>
                                            <ListItem
                                                button
                                                onClick={()=>{props.changeFormula("IF_"+item.enumCode)}}
                                                key={item.inputId}
                                            >
                                                <ListItemText
                                                    primary={item.description}
                                                />
                                                <Divider  absolute />
                                            </ListItem>
                                    </div>
                                )
                            })}
                        </List>

        );
}

export default InputFactor;