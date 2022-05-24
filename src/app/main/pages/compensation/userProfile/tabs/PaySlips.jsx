import React, {useEffect} from "react";
import {Box} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";

const primaryKey = "id0"

export default function PaySlips() {
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "id1",
        label   : "کد فیش",
        type    : "text"
    },{
        name    : "id2",
        label   : "دوره زمانی",
        type    : "text"
    },{
        name    : "id3",
        label   : "حقوق و مزایا",
        type    : "text"
    },{
        name    : "id4",
        label   : "کسورات",
        type    : "text"
    },{
        name    : "id5",
        label   : "خالص پرداختی",
        type    : "text"
    }]

    function get_dataList() {
        // axios.get("/s1/fadak/listOfAllMessages").then(res => {
        //     dataList.set(res.data.notifs)
        // }).catch(() => {
        dataList.set([])
        // });
    }

    useEffect(()=>{
        get_dataList()
    },[])

    return (
        <Box p={2}>
            <Card>
                <TablePro
                    title="لیست فیش های حقوق و دستمزد"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                />
            </Card>
        </Box>
    )
}
