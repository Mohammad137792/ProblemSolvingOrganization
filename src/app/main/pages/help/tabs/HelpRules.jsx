import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import {Button, Grid, Tab, Tabs, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FuseHighlight from "../../../../../@fuse/components/FuseHighlight/FuseHighlight";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import HelpComponents from "./HelpComponents";
import {FusePageSimple} from "../../../../../@fuse";
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from "../../../components/ActionBox";
import FormPro from "../../../components/formControls/FormPro";

export default function HelpRules() {
    return(
        <React.Fragment>
            <Card>
                <CardHeader title="قالب صفحه"/>
                <CardContent>
                    <FrameRuleSample
                        description={"برای قالب صفحات معمولی از قالب زیر استفاده شود. "}
                        html={`
                            <FusePageSimple
                                header={
                                    <CardHeader title="عنوان صفحه"/>
                                }
                                content={
                                    <Box p={2}>
                                        <Card>
                                            <CardHeader title="عنوان کارت اول"/>
                                            <CardContent>
                                                محتوای کارت اول...
                                            </CardContent>
                                        </Card>
                                        <Box m={2}/>
                                        <Card>
                                            <CardHeader title="عنوان کارت اول"/>
                                            <CardContent>
                                                محتوای کارت دوم...
                                            </CardContent>
                                        </Card>
                                    </Box>
                                }
                            />
                        `}
                    >
                        <Card variant="outlined">
                            <FusePageSimple
                                header={
                                    <CardHeader title="عنوان صفحه"/>
                                }
                                content={
                                    <Box p={2}>
                                        <Card>
                                            <CardHeader title="عنوان کارت اول"/>
                                            <CardContent>
                                                محتوای کارت اول...
                                            </CardContent>
                                        </Card>
                                        <Box m={2}/>
                                        <Card>
                                            <CardHeader title="عنوان کارت دوم"/>
                                            <CardContent>
                                                محتوای کارت دوم...
                                            </CardContent>
                                        </Card>
                                    </Box>
                                }
                            />
                        </Card>
                    </FrameRuleSample>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <CardHeader title="حالت انتظار برای دکمه ها"/>
                <CardContent>
                    <FrameRuleSample
                        description={"در مواردی که انجام عملیات مربوط به کلیک یک دکمه زمان بر است، برای غیر فعال کردن دکمه و نمایش حالت انتظار به صورت زیر عمل شود."}
                        html={`
                            const [waiting, set_waiting] = useState(false)
                            
                            <FormPro
                                submitCallback={()=>{
                                    set_waiting(true)
                                    setTimeout(()=>{
                                        set_waiting(false)
                                    },2000)
                                }}
                                actionBox={
                                    <ActionBox>
                                        <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>افزودن</Button>
                                        <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                                    </ActionBox>
                                }
                            />
                        `}
                    >
                        <ButtonWaiting/>
                    </FrameRuleSample>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

function ButtonWaiting() {
    const [waiting, set_waiting] = useState(false)
    return (
        <Card variant="outlined">
            <CardContent>
                <FormPro
                    submitCallback={()=>{
                        set_waiting(true)
                        setTimeout(()=>{
                            set_waiting(false)
                        },2000)
                    }}
                    actionBox={
                        <ActionBox>
                            <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>افزودن</Button>
                            <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                        </ActionBox>
                    }
                />
            </CardContent>
        </Card>
    )
}

function FrameRuleSample ({title, description, html='', js='',children}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">{title}</Typography>
                {description && <Typography variant="body1">{description}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
                {/*<Box my={2}>*/}
                    {children}
                {/*</Box>*/}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper variant="outlined" style={{backgroundColor:'#263238',direction:'ltr'}}>
                    {js && <FuseHighlight component="pre" className="language-js">
                        {js}
                    </FuseHighlight>}
                    <FuseHighlight component="pre" className="language-html">
                        {html}
                    </FuseHighlight>
                </Paper>
            </Grid>
        </Grid>
    )
}
