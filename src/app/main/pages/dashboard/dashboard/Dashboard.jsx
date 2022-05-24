import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
import dashboardBackground from "../../../../../images/dashboardBg.jpeg";
import dashboardDiagram from "../../../../../images/dashboardDiagram.png"
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
        alignItems: "center"
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
                <Typography variant="h6" className="p-10">داشبورد</Typography>
            }
            content={
                <div className={classes.container}>
                    <DashboardDialog open={isDialogOpen} setOpen={setDialogOpen} config={dialogConf}/>
                    {/*<img src={dashboardDiagram}*/}
                    <img src={dashboardDiagram}
                         useMap="#diagram" alt="diagram" height={500}/>
                    <map name="diagram">
                        <area shape="rect" onClick={e => openDialog("تامین سرمایه انسانی", "http://178.216.248.36:5601/goto/8acbb7d6cdbd1cb094037baa7b2eedaa", e)} coords="205,0,495,79" target="_blank" href="#1"/>
                        <area shape="rect" onClick={e => openDialog("توسعه عملکرد", "http://178.216.248.36:5601/goto/bb0d06a15388c434dd52f90e60d6183e", e)} coords="302,145,599,210" target="_blank" href="#2"/>
                        <area shape="rect" onClick={e => openDialog("اطلاعات تحلیلی و آماری",
"http://178.216.248.36:5601/app/kibana?security_tenant=Fadak#/dashboard/19997e70-c3b8-11ea-b274-5f777f38ea58?_a=(description:'',filters:!(),fullScreenMode:!t,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:12,i:'04eade68-9ff8-43e8-98fd-8f94870a131c',w:48,x:0,y:0),id:'20990070-c42a-11ea-b274-5f777f38ea58',panelIndex:'04eade68-9ff8-43e8-98fd-8f94870a131c',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:12,i:'8b8b97ea-339d-485a-b0d7-d184a2311ba6',w:20,x:0,y:12),id:e5731f20-c3b7-11ea-b274-5f777f38ea58,panelIndex:'8b8b97ea-339d-485a-b0d7-d184a2311ba6',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:12,i:'6f08e444-705b-4a68-985d-8fb2e568ef5c',w:28,x:20,y:12),id:'6867a350-c3b9-11ea-b274-5f777f38ea58',panelIndex:'6f08e444-705b-4a68-985d-8fb2e568ef5c',type:visualization,version:'7.7.0'),(embeddableConfig:(vis:(legendOpen:!f)),gridData:(h:15,i:e7bf8406-9e81-4ac6-8dd6-e6dad077bb77,w:24,x:0,y:24),id:f848bae0-c3be-11ea-b274-5f777f38ea58,panelIndex:e7bf8406-9e81-4ac6-8dd6-e6dad077bb77,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:30,i:'3eb9881d-0399-4914-99de-85ef5138aed6',w:24,x:24,y:24),id:'813acff0-c3ba-11ea-b274-5f777f38ea58',panelIndex:'3eb9881d-0399-4914-99de-85ef5138aed6',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'025f6b58-6383-4f20-8589-9e37599126ec',w:24,x:0,y:39),id:'57e97930-c3bf-11ea-b274-5f777f38ea58',panelIndex:'025f6b58-6383-4f20-8589-9e37599126ec',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'0fb65dca-51a6-4d63-bded-9973fa395146',w:24,x:0,y:54),id:cad2eaf0-c3c7-11ea-b274-5f777f38ea58,panelIndex:'0fb65dca-51a6-4d63-bded-9973fa395146',type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!f,vis:(legendOpen:!t)),gridData:(h:15,i:'546abfb8-fdf7-47a5-b1a9-9e016528721b',w:24,x:24,y:54),id:'5effcf40-c3c8-11ea-b274-5f777f38ea58',panelIndex:'546abfb8-fdf7-47a5-b1a9-9e016528721b',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'0421952b-9332-4a14-9cfd-91cc92f4f06d',w:24,x:0,y:69),id:'90560980-c3c6-11ea-b274-5f777f38ea58',panelIndex:'0421952b-9332-4a14-9cfd-91cc92f4f06d',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'6cf74f50-03d0-4bdb-8950-b1c77cdbedb7',w:24,x:24,y:69),id:'3e077fc0-c42e-11ea-b274-5f777f38ea58',panelIndex:'6cf74f50-03d0-4bdb-8950-b1c77cdbedb7',type:visualization,version:'7.7.0'),(embeddableConfig:(vis:(defaultColors:('20%20-%2040':'rgb(8,48,107)','40%20-%2060':'rgb(107,174,214)','60%20-%2080':'rgb(247,251,255)'),legendOpen:!f)),gridData:(h:13,i:'9b553aea-fb8b-43b8-8929-8e3f43f66975',w:48,x:0,y:84),id:c7b72f30-c3cb-11ea-b274-5f777f38ea58,panelIndex:'9b553aea-fb8b-43b8-8929-8e3f43f66975',type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!t,vis:(legendOpen:!f)),gridData:(h:15,i:ebaf682d-d4b0-4a26-b240-814949db0b04,w:24,x:0,y:97),id:f89dad20-c3c8-11ea-b274-5f777f38ea58,panelIndex:ebaf682d-d4b0-4a26-b240-814949db0b04,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'6cc0dc13-818c-42eb-adde-3fbc3dc18ce7',w:24,x:24,y:97),id:b8ba0db0-c3fb-11ea-b274-5f777f38ea58,panelIndex:'6cc0dc13-818c-42eb-adde-3fbc3dc18ce7',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'1aba85ee-9d26-4eca-8cf1-92c7d329031d',w:24,x:0,y:112),id:f2529480-c3fa-11ea-b274-5f777f38ea58,panelIndex:'1aba85ee-9d26-4eca-8cf1-92c7d329031d',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:dd44ebaa-996c-42f8-9a66-50f2bbdbf37b,w:24,x:24,y:112),id:'4f4fe710-c3cd-11ea-b274-5f777f38ea58',panelIndex:dd44ebaa-996c-42f8-9a66-50f2bbdbf37b,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'88cf58b2-0458-4c07-b34a-f45cfaa0ac0b',w:24,x:0,y:127),id:a97089f0-c528-11ea-b274-5f777f38ea58,panelIndex:'88cf58b2-0458-4c07-b34a-f45cfaa0ac0b',type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!f,vis:(legendOpen:!t)),gridData:(h:15,i:c54b66a4-3d28-4317-8300-13aa131e361d,w:24,x:24,y:127),id:cf4d1300-c528-11ea-b274-5f777f38ea58,panelIndex:c54b66a4-3d28-4317-8300-13aa131e361d,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'7d1eec4a-a33c-4629-a6f3-451153f618b1',w:24,x:0,y:142),id:'6c658970-c3fc-11ea-b274-5f777f38ea58',panelIndex:'7d1eec4a-a33c-4629-a6f3-451153f618b1',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:af65bf10-814e-4447-882b-ffc5e6162af2,w:24,x:24,y:142),id:c67657b0-c400-11ea-b274-5f777f38ea58,panelIndex:af65bf10-814e-4447-882b-ffc5e6162af2,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:bc9d7336-57e3-4d36-bf6e-1b8f759460f2,w:24,x:24,y:157),id:'447d0a20-c404-11ea-b274-5f777f38ea58',panelIndex:bc9d7336-57e3-4d36-bf6e-1b8f759460f2,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'8b79f48a-f0bd-4249-bc5d-dddfb1471012',w:24,x:0,y:157),id:e721f2e0-c3ff-11ea-b274-5f777f38ea58,panelIndex:'8b79f48a-f0bd-4249-bc5d-dddfb1471012',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'7c57331e-0313-41eb-a548-b20e9799bdb9',w:24,x:24,y:172),id:'91bf6ed0-c419-11ea-b274-5f777f38ea58',panelIndex:'7c57331e-0313-41eb-a548-b20e9799bdb9',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'2fb9cd45-149c-47cf-ad6a-79f745391f3c',w:24,x:0,y:172),id:dec23670-c402-11ea-b274-5f777f38ea58,panelIndex:'2fb9cd45-149c-47cf-ad6a-79f745391f3c',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:f27097c5-bc24-4f8f-b96b-89beb89ae627,w:24,x:24,y:187),id:'6254b0e0-c41b-11ea-b274-5f777f38ea58',panelIndex:f27097c5-bc24-4f8f-b96b-89beb89ae627,type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!t,vis:(legendOpen:!f)),gridData:(h:15,i:d58e9702-f797-4d78-bf6c-3c818fd85cd3,w:24,x:0,y:187),id:'24451850-c405-11ea-b274-5f777f38ea58',panelIndex:d58e9702-f797-4d78-bf6c-3c818fd85cd3,type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!t,vis:(legendOpen:!f)),gridData:(h:15,i:'2ca48c8c-b6bc-471a-8354-0c0964aa364e',w:24,x:24,y:202),id:c4dae470-c432-11ea-b274-5f777f38ea58,panelIndex:'2ca48c8c-b6bc-471a-8354-0c0964aa364e',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'0fa58e63-0fe7-4cbd-9033-dcdd5ff3d0d0',w:24,x:0,y:202),id:'308f1a60-c41a-11ea-b274-5f777f38ea58',panelIndex:'0fa58e63-0fe7-4cbd-9033-dcdd5ff3d0d0',type:visualization,version:'7.7.0'),(embeddableConfig:(vis:(legendOpen:!f)),gridData:(h:15,i:'16789c40-a799-4c1e-bfc5-dcea3e50ad1f',w:24,x:0,y:217),id:e8ab3f40-c431-11ea-b274-5f777f38ea58,panelIndex:'16789c40-a799-4c1e-bfc5-dcea3e50ad1f',type:visualization,version:'7.7.0')),query:(language:kuery,query:''),timeRestore:!t,title:'%D9%81%D8%AF%DA%A9%20-%20%D8%A2%D9%85%D8%A7%D8%B1%20%D9%88%D8%A7%D9%82%D8%B9%DB%8C',viewMode:view)&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))"                            , e)} coords="302,287,599,352" target="_blank" href="#3"/>
                        <area shape="rect" onClick={e => openDialog("وضعیت حضور و برنامه کاری", "http://178.216.248.36:5601/goto/c7125549e86df61a1c7d7dd147c41add", e)} coords="205,410,495,475" target="_blank" href="#4"/>
                    </map>
                </div>
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(Dashboard);
