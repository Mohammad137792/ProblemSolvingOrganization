import React, {createRef, useEffect, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import {FunctionalManagementCardHeader} from "../FunctionalManagement";
import {Box} from "@material-ui/core";
import TrafficInfoForm from "./TrafficInfoForm";
import TrafficInfoList from "./TrafficInfoList";
import useListState from "../../../reducers/listState";
import axios from "../../../api/axiosRest";
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

const editObjectDefault = {id: null, data: {}}

export default function TrafficInfo() {
    const datas = useSelector(({ fadak }) => fadak);
    const myScrollElement = createRef();
    const dataList = useListState("trafficInfoId")
    const [editObject, set_editObject] = useState(editObjectDefault)
    const [data, set_data] = useState({
        devices: [],
        projects: [],
        factors: [],
        user: {}
    })

    useEffect(() => {
        axios.get("/s1/functionalManagement/trafficInfo").then(res => {
            dataList.set(res.data.trafficInfoList)
        }).catch(() => {})
    },[])

    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    function handle_edit(row) {
        set_editObject({id: row["trafficInfoId"], data: row})
        scroll_to_top()
    }

    useEffect(() => {
        axios.get("/s1/fadak/getUser").then(res => {
            const user = res.data.allUserData.data
            set_data(prevState => ({...prevState, user: {
                userId: user.userId,
                username: user.username,
            }}))
        }).catch(() => {});
        axios.get("/s1/functionalManagement/Devices").then(res => {
            set_data(prevState => ({...prevState, devices: res.data.diviceList}))
        }).catch(() => {});
        axios.get("/s1/payroll/workedProject").then(res => {
            set_data(prevState => ({...prevState, projects: res.data.workedProjectsList}))
        }).catch(()=>{});
    },[])

    return checkPermis("functionalManagement/trafficInfo", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<FunctionalManagementCardHeader title="ثبت کارکرد"/>}
            content={
                <Box p={2}>
                    {(editObject.id || checkPermis("functionalManagement/trafficInfo/add", datas)) &&
                        <>
                        <TrafficInfoForm dataList={dataList} editObject={editObject} resetEditObject={() => set_editObject(editObjectDefault)} data={data} set_data={set_data}/>
                        <Box m={2}/>
                        </>
                    }
                    <TrafficInfoList dataList={dataList} setEditObject={handle_edit} data={data}/>
                </Box>
            }
        />
    )
}
