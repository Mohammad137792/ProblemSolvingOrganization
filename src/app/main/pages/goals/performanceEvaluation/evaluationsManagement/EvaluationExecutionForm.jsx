import React, { useState, useEffect , createRef} from 'react';
import {Button, CardContent, CardHeader, Grid, Card, Typography} from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import ActionBox from "../../../../components/ActionBox";
import FormPro from 'app/main/components/formControls/FormPro';
import Box from "@material-ui/core/Box";

const EvaluationExecutionForm = (props) => {

    const {setShowEvaluationExecutionForm} = props

    const [executionFormValues,setExecutionFormValues] = useState({});

    const [submitClicked, setSubmitClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);

    const submitRef = createRef(0);
    const cancelRef = createRef(0);

    const formStructure = [
        {
            name: "fromDate",
            label: "تاریخ ارسال فرم ارزیابی به ارزیاب",
            type: "date" ,
            col : 6 
        },{
            name: "thruDate",
            label: "مهلت تکمیل فرم ارزیابی توسط ارزیاب",
            type: "date",
            col : 6 
        }]

    function trigerHiddenSubmitBtn() {
        setSubmitClicked(submitClicked + 1);
    }

    function trigerHiddenCancelBtn() {
        setCancelClicked(cancelClicked + 1);
    }

    React.useEffect(() => {
        if (submitRef.current && submitClicked > 0) {
            submitRef.current.click();
        }
    }, [submitClicked]);

    React.useEffect(() => {
        if (cancelRef.current && cancelClicked > 0) {
            cancelRef.current.click();
        }
    }, [cancelClicked]);

    const resetCallback = () => {
        setShowEvaluationExecutionForm(false)
    }
    return (

        <React.Fragment>
            <FusePageSimple 
                header={
                    < div style={{ width: "100%", display: "flex", justifyContent: "center" , textAlign : "center" }} >
                        <Typography variant="h5" className="p-10">اجرای ارزیابی</Typography>
                    </ div>
                }
                content=
                {
                    <Card>
                        <CardContent>
                            <FormPro
                                formValues = {executionFormValues}
                                setFormValues = {setExecutionFormValues}
                                append={formStructure}
                                // submitCallback = {() => 
                                //     edit ? 
                                //         editDefinition()
                                //         :   
                                //         createEvaluation() 
                                // }
                                resetCallback={resetCallback}
                                actionBox={
                                    <ActionBox>
                                        <Button
                                            ref={submitRef}
                                            type="submit"
                                            role="primary"
                                            style={{ display: "none" }}
                                        />
                                        <Button
                                            ref={cancelRef}
                                            type="reset"
                                            role="secondary"
                                            style={{ display: "none" }} 
                                        />
                                    </ActionBox>
                                }
                            />
                            <Card>
                                <CardContent>
                                    <CardHeader title="اخطار :" />
                                        <Typography component="div">
                                            <Box lineHeight={3} m={1}>
                                            فشردن دکمه ارسال به منزله شروع فرایند ارزیابی و ارسال فرم ارزیابی به ارزیابان می‌باشد. پس از ارسال، قابلیت ویرایش دوره و فرم‌های ارزیابی وجود ندارد. در صورت اطمنیان کمه ارسال را بفشارید 
                                            </Box>
                                        </Typography>
                                </CardContent>
                            </Card>     
                            <Box m={2}/>
                            <div
                                style={{display: "flex", justifyContent: "flex-end" }}
                                >
                                <Button
                                    style={{
                                    width: "70px",
                                    color: "secondary",
                                    }}
                                    variant="outlined"
                                    type="reset"
                                    role="secondary"
                                    onClick={trigerHiddenCancelBtn}
                                >
                                    {" "}لغو{" "}
                                </Button>
                                <Button
                                    style={{
                                    width: 120,
                                    color: "white",
                                    backgroundColor: "#039be5",
                                    marginRight: "8px",
                                    }}
                                    variant="outlined"
                                    type="submit"
                                    role="primary"
                                    onClick={trigerHiddenSubmitBtn}
                                >
                                    {" "}ارسال{" "}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                }
            />
        </React.Fragment>
        
    );
};

export default EvaluationExecutionForm;