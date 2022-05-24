import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";


import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup,Radio } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';

const ResultReviews = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [tableContent, setTableContent] = useState([]);
    const dispatch = useDispatch()



    const handleChange = e => {
        const { name, value } = e.target;

        // setval(value)
    };
    const handleChange1 = e => {
        const { name, value } = e.target;

        // setval(value)
    };

    const tableCols = [
        { name: "company", label: " عنوان بررسی کننده ", type: "text", style: { minWidth: "130px" } },
        { name: "unit", label: " شرکت", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: "  کد پرسنلی", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "       نام و نام خانوادگی ", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "       واحد سازمانی ", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "       پست سازمانی ", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "       مهلت بررسی ", type: "text", style: { minWidth: "130px" } },
        { name: "role", label: "       تاریخ بررسی ", type: "date", style: { minWidth: "130px" } },

    

    ]



    return (
        <Box>
            <Card >
                <Card >
                    <CardContent>
                    <TablePro
            title="جدول نتایج بررسی کنندگان پیشنهاد"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
     
        
            rowActions={[
                {
                    title: "مشاهده بررسی پیشنهاد",
                    icon: VisibilityIcon,
                    // onClick: (row) => {
                    //     dispatch(setUser(row.partyId))
                    //     dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
                    //     history.push(`/personnelBaseInformation`);
                    // }
                },

        
            ]}
        />
                    </CardContent>

                </Card>





            </Card>
        </Box>
    )
}


export default ResultReviews;











