import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import {red} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function QuickBox({variant, title, description, card, padding=4}) {
    let context;

    switch (variant) {
        case "error":
            context = (
                <React.Fragment>
                    <Box textAlign="center">
                        <ReportProblemRoundedIcon style={{fontSize:100, color:red[50]}}/>
                    </Box>
                    <Box mb={1} style={{color: red[700]}}>
                        <Typography variant="body1"><b>{title}</b></Typography>
                    </Box>
                    {description && <Typography variant="body1" color="textSecondary">{description}</Typography>}
                </React.Fragment>
            )
            break
        case "loading":
            context = (
                <Box textAlign="center" color="text.secondary">
                    <CircularProgress />
                    <Typography variant="body1">{title??"در حال دریافت اطلاعات"}</Typography>
                    {description && <Typography variant="body1" color="textSecondary">{description}</Typography>}
                </Box>
            )
            break
        default:
    }

    return (
        <Box component={card?Card:null} variant="outlined" square={card} textAlign="center" p={padding}>
            {context}
        </Box>
    )
}
