import React,{Component} from 'react';
import {FusePageSimple} from "@fuse";
import {Typography, Tabs, Tab, Button, Paper, TextField, MenuItem, Grid} from "@material-ui/core";
import BaseInsurance from "./tabs/BaseInsurance";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HireTable from "./tabs/HireTable";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    table: {
        minWidth: 650,
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));


function createData(name, c1, c2, c3, c4,c5,c6,c7) {
    return {name, c1, c2, c3, c4, c5, c6, c7};
}

const rows = [
    createData('', "", "", "", "","","",""),

];

const HirePersonnel = (props) => {
    const [formValues, setFormValues] = React.useState({});
    const addFormValue = event => {
        const field = event.target;
        setFormValues(currentObject => ({...currentObject, [field.id ? field.id : field.name]: field.value}));
    }

    // const [tableContent, setTableContent] = React.useState([]);

    const handleOpen = () => {
        setOpen(true);
    };

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };
    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(BaseInsurance.bind(newValue));
    };

    const [expanded, setExpanded] = React.useState(true);


    // const [formValues, setFormValues] = React.useState({});
    // console.log(formValues);
    // const addFormValue = type => {
    //     switch (type) {
    //         case "checkBox":
    //             return event => {
    //                 const field = event.target;
    //                 setFormValues(currentObject => ({...currentObject, [field.name]: field.checked}));
    //             }
    //         case "picker":
    //             return name => ( event => {
    //                 setFormValues(currentObject => ({...currentObject, [name]: event.toDate()}));
    //             })
    //         case "multiSelect":
    //             return event => {
    //                 const field = event.target;
    //                 setFormValues(currentObject => ({...currentObject, [field.name]: field.value}));
    //             }
    //         default:
    //             return event => {
    //                 const field = event.target;
    //                 setFormValues(currentObject => ({...currentObject, [field.id]: field.value}));
    //             }
    //     }
    // }
    return (
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">?????????? ???????? ?????????????? ?? ???????? ??????????  </Typography>}

            content={<>


                <Grid>

                    <Grid id="bottom-row" container spacing={24}>
                        <Grid item xs={4}>
                            <TextField style={{marginTop: '5px',marginRight:'5px'}} select variant="outlined" id="attendanceSchedule" label=" ?????? ??????????????" fullWidth>
                                <MenuItem value="tamin">  </MenuItem>
                                <MenuItem value="??????????1"> ??????????1 </MenuItem>
                                <MenuItem value="  ??????????2">  ??????????2</MenuItem>
                                <MenuItem value="  ??????????3">  ??????????3</MenuItem>
                            </TextField>
                        </Grid>
                        <div>
                            <Button  variant="contained" color="primary" size="medium" className={classes.margin}>
                                ????????????????
                            </Button>
                            <Button  variant="contained" color="primary" size="medium" className={classes.margin}>
                                ?????? ???????? ??????????????
                            </Button>

                        </div>

                    </Grid>

                </Grid>

                <Paper>
                    <Accordion expanded={expanded} onChange={() => setExpanded(prevState => !prevState)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>

                                <Button variant="contained" color="primary" size="medium">??????????</Button>

                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <BaseInsurance formValues={formValues} addFormValue={setFormValues} handleChanges={setExpanded}/>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField disabled={true} id="standard-basic" label="?????????? ???????? " />
                        <TextField disabled={true} id="standard-basic" label=" ?????????? ??????  " />
                    </form>
                    <Grid item xs={12} >


                        <HireTable/>

                    </Grid>
                </Paper>
            </>}/>
    );
}

export default HirePersonnel;