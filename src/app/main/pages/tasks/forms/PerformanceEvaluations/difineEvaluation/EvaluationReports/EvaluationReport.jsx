import React from 'react';
import { Button, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import EvaluationReportForm from './EvaluationReportForm';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';

const EvaluationReport = () => {
    const history = useHistory();

    return (
        <React.Fragment>
            <FusePageSimple
                header={
                    < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <Typography variant="h6" className="p-10"> گزارش ارزیابی عملکرد</Typography>


                        <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={() => { history.goBack() }}
                            startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>

                    </ div>
                }
                content={<>
                    <EvaluationReportForm />
                </>}

            />
        </React.Fragment>
    )
};

export default EvaluationReport;