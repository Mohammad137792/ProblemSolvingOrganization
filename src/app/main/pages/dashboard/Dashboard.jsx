import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
// import dashboardBackground from "../../../../images/dashboardBg.jpeg";
import dashboardBackground from "../../../../images/login_background.jpg";
import dashboardDiagram from "../../../../images/dashboardDiagram.png"
import DashboardDialog from "./DashboardDialog";
import {Typography} from "@material-ui/core";

const styles = theme => ({
    container: {
        width: "100%",
        height: "100%",
        backgroundImage: `url(${dashboardBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 50
    }
});

const Dashboard = props => {
    const {classes} = props;
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConf, setDialogConf] = React.useState({});
    const openDialog = (title, URL, e) => {
        e.preventDefault();
        setDialogOpen(true);
        setDialogConf({
            title: title,
            url: URL
        });
    }
    return (
        <FusePageSimple
            header={
                <Typography variant="h6" className="p-10">داشبورد  </Typography>
            }
            content={
                <div className={classes.container}>
                    <DashboardDialog open={isDialogOpen} setOpen={setDialogOpen} config={dialogConf}/>
                    <img
                        style={{display: "none"}}
                        src={dashboardDiagram}
                         useMap="#diagram" alt="diagram" height={500}/>
                    <map name="diagram">
                        <area shape="rect" onClick={e => openDialog("تامین سرمایه انسانی", "http://178.216.248.36:5601/goto/8acbb7d6cdbd1cb094037baa7b2eedaa", e)} coords="205,0,495,79" target="_blank" href="#1"/>
                    <area shape="rect" onClick={e => openDialog("توسعه عملکرد",
                        "http://178.216.248.36:5601/goto/bb0d06a15388c434dd52f90e60d6183e", e)} coords="302,145,599,210" target="_blank" href="#2"/>
                    <area shape="rect" onClick={e => openDialog("اطلاعات تحلیلی و آماری",
                    "http://178.216.248.36:5601/goto/49fb193d93eb45c89e22a33cb5f2b858"
                        , e)}
                          coords="302,287,599,352" target="_blank" href="#3"/>
                    <area shape="rect" onClick={e => openDialog("وضعیت حضور و برنامه کاری", "http://178.216.248.36:5601/goto/c7125549e86df61a1c7d7dd147c41add", e)} coords="205,410,495,475" target="_blank" href="#4"/>
                </map>
                </div>
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(Dashboard);
