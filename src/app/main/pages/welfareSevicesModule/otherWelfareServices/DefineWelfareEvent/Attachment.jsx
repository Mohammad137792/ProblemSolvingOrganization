import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress"; import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Button, CardContent, CardHeader, Grid, Typography, Collapse, Card } from "@material-ui/core";
import { Image, TrendingUpRounded } from "@material-ui/icons"

import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';

import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";

export default function Attachment(props) {
  const [loading, setLoading] = useState(true)
  const [formValuseAttach, setFormValuseAttach] = useState([])
  const [attachFormValidation, setAttachFormValidation] = useState([])
  const [location, setLocation] = useState([])
  const [tableContent, setTableContent] = useState([])
  const [expanded, setExpanded] = useState(false);

  const formStructure=[
    {
      name: "description",
      label: " توضیحات",
      type: "textarea",
      col: 6,
  },

    
     {
      type: "component",
      component: <AttachmentComponent location={location} setLocation={setLocation}  tableContent={tableContent} setTableContent={setTableContent} />,
      col: 6
  }
  ]

  return (
    <>

      <FormPro
        prepend={formStructure}
        formValidation={attachFormValidation}
        setFormValidation={setAttachFormValidation}
        formValues={formValuseAttach}
        setFormValues={setFormValuseAttach}
        actionBox={<ActionBox style={{ display: "none" }}>
          <Button  type="submit" role="primary">ثبت</Button>
          {/* <Button type="reset" role="secondary">لغو</Button> */}
        </ActionBox>}
      />
    </>

  )
}






function AttachmentComponent(props) {
  const { location, setLocation, formVariables, tableContent, setTableContent } = props

  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState([])
  const [expanded, setExpanded] = useState(false);


  const axiosKey = {
    headers: {
      'api_key': localStorage.getItem('api_key')
    }
  }
  const tableCols = [

    { name: "observeFile", label: "دانلود فایل", style: { width: "40%" } }
  ]

  const config = {
    timeout: AXIOS_TIMEOUT,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      api_key: localStorage.getItem('api_key')
    }
  }


  const formStructure = [

    {
      label: "پیوست",
      name: "contentLocation",
      type: "inputFile",
      col: 6
    }]

  useEffect(() => {
    let tableData = []
    if (formVariables?.SuggestionContent?.value.length > 0) {
      formVariables.SuggestionContent.value.map((item, index) => {
        let data = {
          observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
            target="_blank" >  <Image />  </Button>,
        }

        tableData.push(data)
        setTimeout(() => {

        }, 50)
      })

      setTableContent(prevState => { return [...prevState, ...tableData] })

    }

  }, [formVariables?.SuggestionContent?.value])


  const handleCreate = (formData) => {
    return new Promise((resolve, reject) => {
      const attachFile = new FormData();
      attachFile.append("file", formValues?.contentLocation);

      axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
        .then(res => {
          let contentLocation = []
          contentLocation.push(res.data)
          let tableData = []
          let locatinData = []
          let locatinElement = {}
          if (contentLocation.length > 0) {
            contentLocation.map((item, index) => {
              let data = {
                observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.name}
                  target="_blank" >  <Image />  </Button>,
                // welfareContentId: item.welfareContentId,
                // attachmentsType: item.welfareContentTypeEnumId
              }
              locatinElement.location = item.name
              locatinElement.contentTypeEnumId = "SuggestionPresentation"
              locatinData.push(locatinElement)
              setLocation(prevState => { return [...prevState, ...locatinData] })

              tableData.push(data)
              // if (index == contentLocation.length - 1) {
              setTimeout(() => {
                setTableContent(prevState => { return [...prevState, ...tableData] })
                setFormValues(prevState => ({
                  ...prevState,
                  contentLocation: ""
                }))
                setLoading(false)
                setExpanded(false)
              }, 50)
              // }
            })
          }
          if (contentLocation.length == 0) {
            setTableContent(tableData)
            setLoading(false)
            setFormValues(prevState => ({
              ...prevState,
              contentLocation: ""
            }))

          }

        })

    })

  }


  const handleRemove = (data) => {
    return new Promise((resolve, reject) => {
      axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent?welfareContentId=" + data.welfareContentId, axiosKey)
        .then(() => {
          setLoading(true)
          resolve()
        }).catch(() => {
          reject()
        })
    })
  }
  return (
    <Card>

      <CardContent>
        <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
          action={
            <Tooltip title="     پیوست    ">
              <ToggleButton
                value="check"
                selected={expanded}
                onChange={() => setExpanded(prevState => !prevState)}
              >
                <AddBoxIcon style={{ color: 'gray' }} />
              </ToggleButton>
            </Tooltip>
          } />
        {expanded ?
          <CardContent >
            <Collapse in={expanded}>
              <CardContent style={{ marginTop: 25 }} >

                <FormPro
                  prepend={formStructure}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  submitCallback={() => {
                    handleCreate(formValues).then((data) => {
                      // successCallback(data)
                    })
                  }}
                  resetCallback={() => {
                    setFormValues({})
                    // handleClose()
                  }}
                  actionBox={<ActionBox>
                    <Button type="submit" role="primary">افزودن</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                  </ActionBox>}
                />
              </CardContent>


            </Collapse>
          </CardContent>
          : ""}
      </CardContent>

      <TablePro
        title="پیوست"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        removeCallback={handleRemove}
        // loading={loading}
        fixedLayout
      />
    </Card>

  )
}