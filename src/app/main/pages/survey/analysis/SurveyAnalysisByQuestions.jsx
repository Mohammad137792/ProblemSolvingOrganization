import React, {useState} from "react";
import {Divider, Tab, Tabs, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TablePro from "../../../components/TablePro";
import Chart from 'react-apexcharts';
import FormInput from "../../../components/formControls/FormInput";
import TableProAjax from "../../../components/TableProAjax";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../components/ModalPro";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(() => ({
    tabs: {
        width: "100%",
        borderBottom: "1px solid #ddd"
    },
    tabItem: {
        minWidth: "100px"
    },
    divider: {
        marginTop: "16px",
        marginBottom: "16px",
    }
}));

export default function SurveyAnalysisByQuestions({questionnaire, data}) {
    const classes = useStyles();
    const [pageIndex, set_pageIndex] = React.useState(0);
    if (questionnaire) return (
        <React.Fragment>
            <Tabs indicatorColor="secondary" textColor="secondary"
                  variant="scrollable" scrollButtons="on"
                  value={pageIndex} onChange={(e,newValue)=>set_pageIndex(newValue)}
                  className={classes.tabs}
            >
                {questionnaire.pages.map((page,index)=>(
                    <Tab key={index} className={classes.tabItem} label={page.name||"صفحه بدون نام"} />
                ))}
            </Tabs>
            <CardContent>
                <Grid container spacing={2}>
                    {questionnaire.pages[pageIndex].elements.map((elem,index)=>(
                        <Grid item xs={12} key={index}>
                            {index>0 && <Divider variant="fullWidth" className={classes.divider}/>}
                            <QuestionAnswers number={questionnaire.pages[pageIndex].startNumber+index} element={elem} data={data}/>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </React.Fragment>
    )
    else return null
}

function QuestionAnswers({element, number, data}) {
    const [modalPreview, set_modalPreview] = useState({display: false, data: null});
    const chartTypeOptions = [
        {
            name: "bar",
            type: "bar",
            label: "میله ای"
        },{
            name: "hor",
            type: "bar",
            label: "میله ای افقی"
        },{
            name: "pie",
            type: "pie",
            label: "دایره ای"
        }
    ]
    const [chartSettings, set_chartSettings] = React.useState({type: "bar"})
    let ResultView;
    function show_full_answer(data) {
        set_modalPreview({
            display: true,
            data: data
        })
    }
    if(element.type==="text" || element.type==="textarea") {
        ResultView = <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card variant="outlined" square>
                    <TableProAjax
                        columns={[
                            {name: "fullName", label: "مخاطب", type: "text", style: {width: "170px"}},
                            {name: element.elementId, label: "جواب", type: "text", sortable: false},
                        ]}
                        url={"/s1/questionnaire/answer?questionnaireAppId="+data.questionnaireAppId+"&elementId="+element.elementId}
                        showTitleBar={false}
                        fixedLayout={true}
                        rowActions={[
                            {
                                title: "مشاهده کامل جواب",
                                icon: VisibilityIcon,
                                onClick: row => show_full_answer(row)
                            }
                        ]}
                    />
                </Card>
                <ModalPro
                    title={`جواب ${modalPreview.data?.fullName}به سوال \"${element.name}\"`}
                    open={modalPreview.display}
                    setOpen={(val)=>set_modalPreview(prevState => ({...prevState, display: val}))}
                    content={
                        <Box p={2}>
                            <Typography>{element.title}</Typography>
                            <Box m={2}/>
                            <TextField type="textarea" value= {modalPreview.data ? modalPreview.data[element.elementId] : ""} className="display-paragraph" fullWidth multiline disabled/>
                        </Box>
                    }
                    maxWidth={"sm"}
                />
            </Grid>
        </Grid>
    }
    if(element.type==="number") {
        ResultView = <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" square>
                    <TablePro
                        columns={[
                            {name: "title", label: "عنوان"},
                            {name: "value", label: "مقدار", type: "number"},
                        ]}
                        rows={[
                            {title: "تعداد", value: element.count},
                            {title: "میانگین", value: element.avg},
                            {title: "انحراف معیار", value: element.std},
                            {title: "کمینه", value: element.min},
                            {title: "بیشینه", value: element.max},
                            {title: "میانه", value: element.median},
                        ]}
                        showRowNumber={false}
                        showTitleBar={false}
                        pagination={false}
                        sortable={false}
                        size="small"
                    />
                </Card>
            </Grid>
        </Grid>
    }
    if(element.type==="radio" || element.type==="check") {
        let totalAnswer = 0
        element.items.map(i=> totalAnswer+=i.count)
        const hasNotAnswered = element.required==="N" && element.type==="radio"
        let rows = (hasNotAnswered)
            ? [...element.items,{label: "بدون پاسخ", count: data.numberOfParticipated-totalAnswer }]
            : element.items
        rows.map(i=> {
            i.percent = i.count/totalAnswer*100||0;
            i.percentOfTotal = i.count/data.numberOfParticipated*100||0;
        })
        ResultView = <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" square>
                    <TablePro
                        columns={[
                            {name: "label", label: "عنوان گزینه"},
                            {name: "count", label: "تعداد", type: "number"},
                            {name: "percent", label: "درصد", type: "render", render: (row)=>row.label==="بدون پاسخ"?"-":row.percent?.toFixed(2)+"%"},
                            ...(hasNotAnswered ? [{name: "percentOfTotal", label: "درصد به کل", type: "render", render: (row)=>row.percentOfTotal?.toFixed(2)+"%"}]:[])
                        ]}
                        rows={rows}
                        showRowNumber={false}
                        showTitleBar={false}
                        pagination={false}
                        size="small"
                    />
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card variant="outlined" square>
                    <CardContent>
                        {chartSettings.type==="bar" &&
                        <Chart options={{
                            xaxis: {
                                categories: element.items.map(i=>i.label),
                            },
                            tooltip: {
                                enabled: false
                            },
                        }} series={[{data: element.items.map(i=>i.count)}]} type="bar"/>
                        }
                        {chartSettings.type==="hor" &&
                        <Chart options={{
                            plotOptions: {
                                bar: {
                                    horizontal: true
                                }
                            },
                            xaxis: {
                                categories: element.items.map(i=>i.label),
                            },
                            yaxis : {
                                labels: {
                                    align: 'center',
                                }
                            },
                            tooltip: {
                                enabled: false
                            },
                        }} series={[{data: element.items.map(i=>i.count)}]} type="bar"/>
                        }
                        {chartSettings.type==="pie" &&
                        <Chart options={{
                            dataLabels: {
                                enabled: true,
                                formatter: function (val) {
                                    return val.toFixed(2) + "%"
                                },
                            },
                            labels: element.items.map(i=>i.label),
                        }} series={element.items.map(i=>i.count)} type="pie"/>
                        }
                        <Grid container spacing={2}>
                            <FormInput col={12} label="نوع نمودار" type="select" name="type" valueObject={chartSettings} valueHandler={set_chartSettings} options={chartTypeOptions} optionIdField="name" optionLabelField="label" disableClearable/>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    }
    return (
        <>
            <Typography>{number}. {element.title}</Typography>
            <br/>
            {ResultView}
        </>
    )
}
