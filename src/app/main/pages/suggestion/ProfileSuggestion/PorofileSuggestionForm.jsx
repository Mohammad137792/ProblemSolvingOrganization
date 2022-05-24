import React, { useState, useEffect } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader,Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { useHistory } from 'react-router-dom';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { getWorkEffotr } from "../../../../store/actions/fadak";
import checkPermis from 'app/main/components/CheckPermision';

const PorofileSuggestionForm = (props) => {
    const history = useHistory();
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});
    const [tableContent, setTableContent] = React.useState([]);
    const [expanded, setExpanded] = useState(false);
    const [suggestionStatus ,setSuggestionStatus] = useState([])
    const [tableLoading, serTableLoading] = useState(true)
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch()

    const tableCols = [
        { name: "suggestionCode", label: " کد پیشنهاد ", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionTitle", label: " عنوان پیشنهاد", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionStatusId", label: "  وضعیت پیشنهاد ", type: "select", style: { minWidth: "130px" }, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId", },
        { name: "suggestionCreationDate", label: "  تاریخ پیشنهاد ", type: "date", style: { minWidth: "130px" } },

    ]


    const formStructure = [{
            label: "کد پیشنهاد",
            name: "suggestionCode",
            type: "text",
            col: 4
        }, 
        {
            label: " عنوان پیشنهاد ",
            name: "suggestionTitle",
            type: "text",
            col: 4
        }, 
        {
            label: "  وضعیت پیشنهاد ",
            name: "suggestionStatusId",
            type: "select",
            options: suggestionStatus,
            optionLabelField: "description",
            optionIdField: "statusId",
            col: 4

        },
        {
            label: " تاریخ ایجاد از ",
            name: "suggestionCreationDateStart",
            type: "date",
            col: 4

        },
        {
            label: " تاریخ ایجاد تا ",
            name: "suggestionCreationDateEnd",
            type: "date",
            col: 4

        }
    ]

    function getSuggestions(filterParam){
        axios.get(SERVER_URL + "/rest/s1/Suggestion/mySuggestionList", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: filterParam
        }).then(res => {
            setTableContent(res.data.list)
            serTableLoading(false)
        }).catch(err => {

        });
    }


    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionStatus(res.data.status)
        }).catch(err => {
        });

    }

    const submit = () => {
        getSuggestions(formValues)
    }

                                                                                                                                                                                                       
    const handleReset = () => {
        setFormValues([])   
    }

    useEffect(() =>{
        getEnum()
        getSuggestions([])
    }, [])

    


    return (
        <Box>
            <Card >
                <CardContent>
                    <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
                        action={
                            <Tooltip title="    جستجوی پیشنهادات    ">
                                <ToggleButton
                                    value="check"
                                    selected={expanded}
                                    onChange={() => setExpanded(prevState => !prevState)}
                                >
                                    <FilterListRoundedIcon style={{ color: 'gray' }} />
                                </ToggleButton>
                            </Tooltip>
                        } />
                    {expanded ?
                        <CardContent >
                            <Collapse in={expanded}>
                                <CardContent style={{ marginTop: 25 }} >

                                    <FormPro
                                        append={formStructure}
                                        formValues={formValues}
                                        setFormValues={setFormValues}
                                        setFormValidation={setFormValidation}
                                        formValidation={formValidation}
                                        submitCallback={submit}
                                        resetCallback={handleReset}
                                        actionBox={<ActionBox>
                                            <Button type="submit" role="primary">فیلتر</Button>

                                            <Button type="reset" role="secondary">لغو</Button>
                                        </ActionBox>}

                                    />
                                </CardContent>

                            </Collapse>
                        </CardContent>
                        : ""}

                    <TablePro
                        title="   لیست  پیشنهادات ارائه شده   "
                        columns={tableCols}
                        rows={tableContent}
                        setTableContent={setTableContent}
                        loading={tableLoading}
                        
                        rowActions={checkPermis("personnelManagement/porofileSuggestion/viewBtn", datas) ? 
                            [
                                  {
                                    title: "مشاهده نتیجه پیشنهاد",
                                    icon:VisibilityIcon,
                                    onClick: (row) => {
                                        dispatch(getWorkEffotr(row))
                                        history.push(`/suggestionResult`);
                                    }
                                }
                            ]:[]}

                    />
                </CardContent>

            </Card>
        </Box>
    )
}


export default PorofileSuggestionForm;











