import React, {useState} from "react";
import EOIAgreement from "../issuance/EOIAgreement";
import Card from "@material-ui/core/Card";
import TabPro from "../../../../../components/TabPro";
import DisplayField from "../../../../../components/DisplayField";
import CommentPanel from "../checking/EOCommentPanel";
import Box from "@material-ui/core/Box";

export default function EOCAgreement(props) {
    const {verificationList} = props
    const [formValues, setFormValues] = useState({});
    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues}/>
    }))
    return (
        <React.Fragment>
            <EOIAgreement {...props} correction/>
            <Box m={2}/>
            <Card variant="outlined">
                <TabPro orientation="vertical" tabs={tabs}/>
            </Card>
        </React.Fragment>
    )
}
