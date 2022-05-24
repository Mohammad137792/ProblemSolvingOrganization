import React, {useEffect} from "react";
import TablePro from "../../../../components/TablePro";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ListProAccordion from "../../../../components/ListProAccordion";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import useListState from "../../../../reducers/listState";

export default function PCDVoucher({rows=[]}) {
    const context = useListState()

    useEffect(()=>{
        context.set(rows)
    },[rows])

    return (
        <React.Fragment>
            <ListProAccordion
                title="لیست سندهای حسابداری"
                context={context}
                renderAccordionSummary={(item,expanded) => <ItemSummary item={item}/>}
                renderAccordionDetails={(item) => <ItemDetails item={item}/>}
                action={
                    <Tooltip title="دریافت فایل">
                        <IconButton>
                            <CloudDownloadIcon/>
                        </IconButton>
                    </Tooltip>
                }
            />
        </React.Fragment>
    )
}

function ItemSummary({item}) {
    const moment = require('moment-jalaali');

    return (
        <Box className="w-full" display="flex">
            <Typography>{`${item.voucherNumber} ─ ${item.description}`}</Typography>
            <Box ml={3}><Typography color="textSecondary">{moment(item.date).format("jD jMMMM jYYYY")}</Typography></Box>
        </Box>
    )
}

function ItemDetails({item}) {

    const tableColumns = [{
        name    : "accountCode",
        label   : "حساب معین",
        type    : "text",
        style   : {width: "20%"}
    },{
        name    : "creditor",
        label   : "بستانکار",
        type    : "text",
        style   : {width: "10%"}
    },{
        name    : "debtor",
        label   : "بدهکار",
        type    : "text",
        style   : {width: "10%"}
    },{
        name    : "gdAccounts",
        label   : "حساب تفصیلی",
        type    : "text",
        // options : ""+fieldsInfo+"",
        // optionIdField   : "detailedAccountId",
        // optionLabelField: "enumDescription",
        style   : {width: "30%"}
    },{
        name    : "xx5",
        label   : "شرح",
        type    : "text",
    }]

    return (
        <Box className="w-full">
            <TablePro
                rows={item.articles}
                columns={tableColumns}
                showTitleBar={false}
            />
        </Box>
    )
}
