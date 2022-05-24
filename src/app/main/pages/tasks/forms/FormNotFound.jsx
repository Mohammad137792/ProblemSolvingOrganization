import React from 'react';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded';

export default function FormNotFound (props) {
    return(
        <Box textAlign="center" color="text.secondary" p={2}>
            <ReportProblemRoundedIcon/>
            <Typography variant={"body1"}>فرم یافت نشد!</Typography>
        </Box>
    )
}