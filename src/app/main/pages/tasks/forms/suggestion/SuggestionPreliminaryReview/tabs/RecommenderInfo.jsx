import React, { useState } from 'react';
import { Box, Card, CardContent } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';


const RecommenderInfo = (props) => {
    const { formValues, setFormValues } = props

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValidation, setFormValidation] = useState([]);


    const formStructure = [{
        label: " شماره ملی",
        name: "idValue",
        type: "text",
        readOnly: true,
        col: 6
    }, {
        label: "  نام ",
        name: "firstName",
        type: "text",
        readOnly: true,
        col: 6
    }, {
        label: "     نام خانوادگی ",
        name: "lastName",
        type: "text",
        readOnly: true,
        col: 6,

    }, {
        label: "   تلفن همراه",
        name: "phoneNumber",
        type: "number",
        readOnly: true,
        col: 6
    },
    {
        label: "   شرکت",
        name: "companyName",
        type: "text",
        readOnly: true,
        col: 6
    }
        , {
        label: "   واحد سازمانی",
        name: "orgName",
        type: "text",
        readOnly: true,
        col: 6
    },
        , {
        label: "   پست سازمانی",
        name: "empPositionName",
        type: "text",
        readOnly: true,
        col: 6
    },
        , {
        label: "  شماره پرسنلی",
        name: "pseudoId",
        type: "text",
        readOnly: true,
        col: 6
    },


    ]


    const tableCols = [
        { name: "unit", label: " شماره دفعات اعتراض", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: "   تاریخ اعترض", type: "text", style: { minWidth: "130px" } }
    ]

    const handle_submit = () => { }
    const handle_reset = () => { }




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

                            />
                        </CardContent>
                    </Card>
                </Card>
                <Card >


                </Card>





            </Card>
        </Box>
    )
}


export default RecommenderInfo;












