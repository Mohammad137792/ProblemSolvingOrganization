import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Image, TrendingUpRounded } from "@material-ui/icons"
import checkPermis from "app/main/components/CheckPermision";



const Attachment = (props) => {

    const {formValues, setFormValues, contentsName, setContentsName, confirmation = false} = props

    const datas = useSelector(({ fadak }) => fadak);

    const [tableContent, setTableContent] = React.useState([]);
    const [loading,setLoading]=useState(true)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "observeFile", label: "دانلود فایل" , style: {width:"40%"}}
    ]

    React.useEffect(()=>{
        if (loading){
            getData()
        }
    },[loading])
    console.log("contentsName" , contentsName);
    const getData = () => {
        if(contentsName.length > 0){
            let tableDataArray = []
            contentsName.map((item,index)=>{
                if(!confirmation){
                    let data={
                            observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item}
                            target="_blank" >  <Image />  </Button> ,
                        }
                    tableDataArray.push(data)
                }
                if(confirmation){
                    let data={
                            observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item?.contentLocation}
                            target="_blank" >  <Image />  </Button> ,
                            requistionContentId : item?.requistionContentId
                        }
                    tableDataArray.push(data)
                }
                if (index== contentsName.length-1){
                    setTableContent(tableDataArray)
                    setLoading(false)
                }
            })
        }
        else {
            setTableContent([])
            setLoading(false)
        }
    }

    const handleRemove = (data)=>{
        return new Promise((resolve, reject) => {
            if(!confirmation){
                const index = tableContent.indexOf(data);
                if (index > -1) {
                    contentsName.splice(index, 1);
                    setLoading(true)
                    resolve()
                }
            }
            if(confirmation){
                axios.delete(`${SERVER_URL}/rest/s1/humanres/requistionContent?requistionContentId=${data?.requistionContentId}` , axiosKey).then((res)=>{
                    resolve()
                    const index = tableContent.indexOf(data);
                    if (index > -1) {
                        contentsName.splice(index, 1);
                    }
                }).catch(()=>{
                    reject()
                })
            }
        })
    }

    return (
        <TablePro
            title="پیوست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add={(checkPermis("humanResourcesPlanning/creatingJobNeeds/attachment/add", datas) && !confirmation)  ? "external" : false}
            addForm={<AttachmentsForm loading={loading} setLoading={setLoading} contentsName={contentsName} setContentsName={setContentsName} confirmation={confirmation}
                jobRequistionId={formValues?.jobRequistionId}/>}
            removeCondition={(row) =>
                checkPermis("humanResourcesPlanning/creatingJobNeeds/attachment/delete", datas) && !confirmation
            }
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
};

export default Attachment;

function AttachmentsForm (restProps) {

    const {formValues, setFormValues, successCallback, failedCallback, handleClose, contentsName, setContentsName, setLoading, confirmation, jobRequistionId} = restProps;

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const [clicked, setClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);

    const submitRef = createRef(0);
    const cancelRef = createRef(0);

    const contentIdFormData = new FormData()  

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label:  "پیوست",
        name:   "contentLocation",
        type:   "inputFile",
        col     : 6
    }]

    const handleCreate = (formData)=>{
        set_waiting(true)
        contentIdFormData.append("file", formValues.contentLocation)
        axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config).then((res)=>{
            if(confirmation){
                axios.post(SERVER_URL + `/rest/s1/humanres/requistionContent` ,{jobRequistionId : jobRequistionId , contentLocation : res.data?.name} , axiosKey).then((upload)=>{
                    contentsName.push({contentLocation : res.data?.name , requistionContentId : upload?.data?.requistionContentId })
                    setContentsName(contentsName)
                    setLoading(true)
                    trigerHiddenCancelBtn()
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                    set_waiting(false)
                });
            }
            if(!confirmation){
                contentsName.push(res.data?.name)
                setContentsName(contentsName)
                setLoading(true)
                trigerHiddenCancelBtn()
            }
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
        set_waiting(false)
    }

    React.useEffect(() => {
        if (cancelRef.current && cancelClicked > 0) {
          cancelRef.current.click();
        }
    }, [cancelClicked]);

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
            submitRef.current.click();
        }
    }, [clicked]);

    function trigerHiddenSubmitBtn() {
        setClicked(clicked + 1);
    }
      
    function trigerHiddenCancelBtn() {
        setCancelClicked(cancelClicked + 1);
    }

    return(
        <div>
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                submitCallback={handleCreate}
                resetCallback={resetCallback}
                actionBox={
                    <ActionBox>
                        <Button
                        ref={submitRef}
                        type="submit"
                        role="primary"
                        style={{ display: "none" }}
                        />
                        <Button
                        ref={cancelRef}
                        type="reset"
                        role="secondary"
                        style={{ display: "none" }} 
                        />
                    </ActionBox>
                }
            />
            <div style={{display: "flex", justifyContent: "flex-end" }}>
                <Button
                    style={{
                        width: "70px",
                        color: "secondary",
                    }}
                    variant="outlined"
                    type="reset"
                    role="secondary"
                    onClick={trigerHiddenCancelBtn}
                >
                {" "}لغو{" "}
                </Button>
                <Button
                    style={{
                        width: 120,
                        color: "white",
                        backgroundColor: "#039be5",
                        marginRight: "8px",
                    }}
                    variant="outlined"
                    type="submit"
                    role="primary"
                    onClick={trigerHiddenSubmitBtn}
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >
                {" "}افزودن{" "}
                </Button>
            </div>
        </div>
    )
}