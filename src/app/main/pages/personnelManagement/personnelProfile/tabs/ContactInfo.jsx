import React from "react";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import {Box, Grid} from "@material-ui/core";

export default function () {
    return (
        <Box p={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <TablePro
                            title="شماره های تماس"
                            rows={[]}
                            columns={[
                                {name: "type", label: "نوع شماره تماس"},
                                {name: "number", label: "شماره"}
                            ]}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <TablePro
                            title="راه های ارتباط فضای مجازی"
                            rows={[]}
                            columns={[
                                {name: "type", label: "نوع راه ارتباطی"},
                                {name: "address", label: "آدرس"}
                            ]}
                        />
                    </Card>
                </Grid>
            </Grid>

            {/*<Box m={2}/>*/}

        </Box>
    )
}
