import React, {useState} from "react";
import TablePro from "../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../components/ModalPro";
import {useDialogReducer} from "../../../../components/ConfirmDialog";
import axios from "../../../../api/axiosRest";
import OutputPrint from "../../print/output/OutputPrint";
import PrintIcon from "@material-ui/icons/Print";
import {useReactToPrint} from "react-to-print";

export default function PCDOutput({rows=[]}) {
    const modalPreview = useDialogReducer()
    const [printSettings, set_printSettings] = useState([])
    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const tableColumns = [{
        name    : "title",
        label   : "عنوان نوع خروجی",
        type    : "text",
    },{
        name    : "outputTypeEnumId",
        label   : "نوع خروجی",
        type    : "select",
        options : "OutputType",
    },{
        name    : "settingId",
        label   : "نسخه خروجی",
        type    : "select",
        options : printSettings,
        optionIdField: "settingId",
        optionLabelField: "title",
    }]

    React.useEffect(()=>{
        axios.get("/s1/payroll/outputPrintSetting").then(res => {
            set_printSettings(res.data.printSettingList)
        }).catch(() => {});
    },[])

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "نمایش",
                    icon: VisibilityIcon,
                    onClick: modalPreview.show,
                }]}
                showTitleBar={false}
            />
            <ModalPro
                title={modalPreview.data.title}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={5}>
                        <div>
                            <OutputPrint version={modalPreview.data.settingId} printRef={componentRef}/>
                        </div>
                    </Box>
                }
                headerActions={[{
                    title: "چاپ",
                    icon: PrintIcon,
                    onClick: handlePrint
                }]}
            />
        </React.Fragment>
    )
}
