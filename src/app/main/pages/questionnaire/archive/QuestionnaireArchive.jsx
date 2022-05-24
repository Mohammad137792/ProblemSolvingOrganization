import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {FusePageSimple} from "../../../../../@fuse";
import QATable from "./QATable";
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

export default function QuestionnaireArchive() {
    const datas = useSelector(({ fadak }) => fadak);
    return checkPermis("questionnaire/archive", datas) && <FusePageSimple
        header={
            <CardHeader title="بایگانی پرسشنامه"/>
        }
        content={
            <Box p={2}>
                <QATable/>
            </Box>
        }
    />
}
