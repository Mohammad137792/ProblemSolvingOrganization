import React, { useState, useEffect } from 'react';
import { AppBar, Card, CardContent, Dialog, Grid, IconButton, Paper, Toolbar, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";


import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { SERVER_URL } from "../../../../configs";
import axios from "axios";
import DashboardDialog from "../dashboard/DashboardDialog";
import { FusePageSimple } from "@fuse";
import { makeStyles } from "@material-ui/core/styles";
import background from "./../../../../images/login_background.jpg"


// import Example from './../../components/loading'


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: 'flex',
        justifyContent: 'center'
    },
    main: {
        width: 660,
        display: "flex",
        justifyContent:"center",
        alignItems:"center"

    },
    ulList: {
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        width: "100%",

        justifyContent: "space-around"

    },
    liList: {
        marginBottom: 7,
        height: 120,
    },
    btnStyle: {
        height: "100%",
        background: "linear-gradient(45deg, #a85358 30%, #3f7a7e 90%)",
        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
        borderRadius: 15,
        color: "white",
        transition: "1s",
        "&:hover": {
            transform: "scale(1.05)",
            transition: "2s",
            transitionDuration: "1s",
            zIndex: 10000

        }
    },
    fir: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100%",
        display: "flex"



    }
}));


const DataAnalysisDashboardComponent = (props) => {
    const [dashboard, setDashboard] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [config, setConfig] = React.useState({});


    const classes = useStyles();
    const [title, setTitle] = React.useState("");
    const [selected, setSelected] = React.useState();
    const[loding , setLoding] = useState(false)
    const [current, setCurrentData] = useState();
    const configAxios = {
        headers: {
            api_key: localStorage.getItem("api_key")
        }
    };



    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Dashboard", configAxios).then(response => {
            let data = response.data.result;
            let array = response.data.result;

            let col = [400, 210];

            for (let i = 0; i < data.length; i++) {

                data[i].style = "100%";
                if (col.length == 0) {
                    col = [400, 210];
                }

                let len = Math.floor(Math.random() * col.length);
                data[i].cols = col[len];
                col.splice(len, 1);
                if (data.length % 2 !== 0) {
                    data[data.length - 1].cols = 620;
                }
            }
            setCurrentData(data);
            setLoding(true)
        });
    }, []);


    const handlerAddress = (tile) => {
        setOpen(true);

        setConfig({
            title: tile.title,
            url: tile.address,

        })

    }



    return (









        <FusePageSimple
            header={<Typography variant="h6" className="p-10">  داشبورد</Typography>}
            content={



                <div className={classes.fir}>

                    <div className={classes.root} >
                        <div className={classes.main}>

                            {
                                (loding) ? (
                                    <ul className={classes.ulList}>
                                        {current?.map(tile => (
                                            <li
                                                style={{
                                                    width: tile.cols
                                                }}
                                                className={classes.liList} >
                                                <Button
                                                    style={{
                                                        width: tile.style,

                                                    }}
                                                    className={classes.btnStyle}
                                                    id="ali"
                                                    onClick={() => handlerAddress(tile)}
                                                    // href={tile.address}

                                                    variant="contained"

                                                >
                                                    {`${tile.title}`}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                        // <Example type={"bars"} color={"red"}  height={90} width={120} />
                                        <>
                                        </>
                                    )


                            }

                            {config &&


                                <DashboardDialog open={open} setOpen={setOpen} config={config} />

                            }
                        </div>

                    </div>
                </div>

            }
        />




























    );
}


export default DataAnalysisDashboardComponent;
