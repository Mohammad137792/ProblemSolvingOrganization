import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import {CardHeader} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Pagination from "@material-ui/lab/Pagination";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    pagination: {
        justifyContent: "center",
        margin: theme.spacing(1),
    },
}));

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        minHeight: 42,
        '&$expanded': {
            backgroundColor: 'rgba(0, 0, 0, .03)',
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        padding: 0
    },
}))(MuiAccordionDetails);

export default function ListProAccordion({context, title, action, rowsPerPage=5, renderAccordionSummary=()=>null, renderAccordionDetails=()=>null}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [page, set_page] = React.useState(1)
    const pagesCount = Math.ceil(context?.length/rowsPerPage) || 1
    const items = context?.list?.slice((page-1) * rowsPerPage,page * rowsPerPage) || []
    const primaryKey = context.pk

    const handle_change_page = (event, value) => {
        set_page(value)
    }
    const handle_change_accordion = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <React.Fragment>
            <CardHeader title={title} action={action}/>
            <Divider />
            {items.map((item,ind)=>(
                <Accordion key={ind} square expanded={expanded === item[primaryKey]} onChange={handle_change_accordion(item[primaryKey])}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                        {renderAccordionSummary(item,expanded)}
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderAccordionDetails(item,expanded)}
                    </AccordionDetails>
                </Accordion>
            ))}
            <Pagination
                classes={{ul: classes.pagination}}
                count={pagesCount}
                page={page}
                onChange={handle_change_page}
            />
        </React.Fragment>
    )
}
