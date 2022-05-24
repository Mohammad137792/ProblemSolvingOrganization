import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";


import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { SERVER_URL } from 'configs';
import { gray } from 'd3-color';

const SuggestionInfoForm = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});
    const dispatch = useDispatch()



    const formStructure = [{
        label: "کد پیشنهاد",
        name: "category",
        type: "text",
        col: 3
    }
        , {
        label: "   شرکت ",
        name: "name",
        type: "text",
        col: 3
    },
        , {
        label: "  تاریخ ایجاد ",
        name: "name",
        type: "date",
        col: 3
    }, {
        label: "  حوزه پیشنهاد ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        label: "  کد فراخوان ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        label: "   نحوه اجرای پیشنهاد ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        label: "تاثیر حاصل پیشنهاد ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        label: "منشا پیشنهاد ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        label: " ترجیح در نحوه دریافت پاداش ",
        name: "status",
        type: "text",
        col: 3

    }
        , {
        name: "status",
        type: "component",
        component: <FormControl component="fieldset">

            <FormLabel component="legend">نحوه ارائه پیشنهاد</FormLabel>
            <RadioGroup aria-label="cost" name="payCost">
                <FormControlLabel value=" فردی " control={<Radio />} label=" فردی " onChange={handleChange} />
                <FormControlLabel value="  گروهی" control={<Radio />} label="گروهی" onChange={handleChange1} />
            </RadioGroup>
        </FormControl>,
        col: 3

    }
    ]

    const handleChange = e => {
        const { name, value } = e.target;

        // setval(value)
    };
    const handleChange1 = e => {
        const { name, value } = e.target;

        // setval(value)
    };

    const tableCols = [
        { name: "company", label: " شرکت ", type: "text", style: { minWidth: "130px" } },
        { name: "unit", label: "واحد سازمانی", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: " پست سازمانی", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "     نقش در کمینه ", type: "text", style: { minWidth: "130px" } },

    ]
    const tableColsCommitee = [
        { name: "code", label: " کد کمیته ", type: "text", style: { minWidth: "130px" } },
        { name: "nmae", label: " عنوان کمیته", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: "  حوزه", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "  فعال  ", type: "text", style: { minWidth: "130px" } },

    ]

    const handle_submit = () => {

    }

    const handle_reset = () => {
        setFormValues([])
    }

    return (
        <Box>
            <Card >
                <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                    <Card>
                        <CardContent>
                            <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                                actionBox={<ActionBox>
                                    <Button type="submit" role="primary">افزودن</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>}
                                submitCallback={handle_submit} resetCallback={handle_reset}
                            />
                        </CardContent>

                    </Card>
                </Card>





            </Card>
        </Box>
    )
}


export default SuggestionInfoForm;











