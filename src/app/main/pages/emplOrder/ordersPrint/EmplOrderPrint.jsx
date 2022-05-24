import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import Box from "@material-ui/core/Box";
import EOPDefault from "./EOPDefault";
import EOPEmployee from "./EOPEmployee";

export default function EmplOrderPrint({type, data}) {
    switch (type) {
        case "EmplOrderPrintDefault":
            return <EOPDefault data={data}/>
        case "employee":
            return <EOPEmployee data={data}/>
        default:
            return (
                <Card variant="outlined" square>
                    <CardContent>
                        <Box textAlign="center" color="text.secondary" p={2}>
                            <ReportProblemRoundedIcon/>
                            <Typography variant={"body1"}>این نسخه تعریف نشده است!</Typography>
                        </Box>
                    </CardContent>
                </Card>
            )
    }
}
