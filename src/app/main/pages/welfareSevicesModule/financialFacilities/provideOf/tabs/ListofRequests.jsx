import React ,{useState} from 'react'
import TablePro from "app/main/components/TablePro";

export default function ListofRequests() {
    const cols  = []
    const [tableContent ,  setTableContent] = useState([])
    return (
        <>
            <TablePro
                title="لیست  درخواست ها"
                columns={cols}
                rows={tableContent}
                setRows={setTableContent}
            />


        </>

    )
}
