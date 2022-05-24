import React , {useState} from 'react';
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
// import {ListItem, ListItemText} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {Accordion, AccordionDetails, Collapse, ListItem, ListItemText} from "@material-ui/core";



const Constant=(props)=>{
    const consts = props.constant.consts;
    const constVals = props.constant.constantValues;
    const [expand,setExpand]=useState({})

    function handleClick(e){
        setExpand({[e]:!expand[e]})
    }

    console.log(props)
    return (
        <List>
            {consts && consts.map(item => {
                return (
                    <div>
                        <ListItem
                            button
                            onClick={()=>{props.changeFormula("C_"+item.enumCode)}}
                            key={item.enumCode}
                        >
                            <ListItemText
                                primary={item.description}
                            />
                            <Divider  absolute />
                        </ListItem> 
                        {/* <ListItem button onClick={()=>handleClick(item.constantId)}>
                            <ListItemText primary={item.description} />
                            {expand[item.constantId] ? (
                                <ExpandLess/>
                            ) : (
                                <ExpandMore/>
                            )}
                            <Divider absolute/>
                        </ListItem>
                        <Collapse
                            component="li"
                            in={expand[item.constantId]}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List>
                                {constVals?.map(ele=>{
                                    return(
                                        <>
                                        {ele.constantId == item.constantId ?
                                                <ListItem button onClick={()=>{props.changeFormula(ele.value)}}>
                                                    <ListItemText primary={ele.constantType+"-"+ele.value} />
                                                </ListItem>
                                                : ''
                                        }
                                        </>
                                    )
                                })}
                            </List>
                        </Collapse> */}
                    </div>
                )
            })}
        </List>

    );
}
export default Constant;