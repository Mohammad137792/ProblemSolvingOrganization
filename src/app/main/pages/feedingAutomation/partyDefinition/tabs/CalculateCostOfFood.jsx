import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Tooltip } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ToggleButton } from '@material-ui/lab';
import AddBoxIcon from '@material-ui/icons/AddBox';


const CalculateCostOfFood = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonNameComm, setButtonNameComm] = useState("افزودن")
    const [formValues, setFormValues] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const dispatch = useDispatch()
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableCols = [
        {
            label: "گروه تغذیه   ",
            name: "partyRelationshipId",
            type: "select",
            required: true,
            col: 3
        }, {
            label: "    نحوه محاسبه هزینه تغذیه  ",
            name: "fromDate",
            type: "select",
            col: 3
        }

    ]


    const formStructure = [
        {
            label: "گروه تغذیه   ",
            name: "partyRelationshipId",
            type: "select",
            required: true,
            col: 3
        }, {
            label: "    نحوه محاسبه هزینه تغذیه  ",
            name: "fromDate",
            type: "select",
            col: 3
        }

    ]









    const submit = () => {


    }






    

    const handleRemove = (oldData) => {

    }


    const handleReset = () => {



    }




    const handleEdit = (row) => {


    }



    return (
        <Card style={{ padding: "1vw" }}>
            <Box>
                <Card >
                    <CardContent ref={myRef}>
                        <CardContent>
                            <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
                                action={
                                    <Tooltip title="     افزودن اعضا    ">
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
                                                append={formStructure}
                                                formValues={formValues}
                                                setFormValues={setFormValues}
                                                setFormValidation={setFormValidation}
                                                formValidation={formValidation}
                                                submitCallback={
                                                    submit
                                                }
                                                resetCallback={handleReset}
                                                actionBox={<ActionBox>
                                                    <Button type="submit" role="primary">{buttonNameComm}</Button>

                                                    <Button type="reset" role="secondary">لغو</Button>
                                                </ActionBox>}

                                            />
                                        </CardContent>


                                    </Collapse>
                                </CardContent>
                                : ""}
                        </CardContent>




                        <TablePro
                            title="   لیست  نحوه محاسبه هزینه غذا   "
                            columns={tableCols}
                            rows={tableContent}
                            editCallback={handleEdit}
                            edit="callback"
                            removeCallback={handleRemove}
                            setTableContent={setTableContent}
                            loading={loading}
                        />
                    </CardContent>



                </Card>
            </Box>
        </Card>
    )
}


export default CalculateCostOfFood;











