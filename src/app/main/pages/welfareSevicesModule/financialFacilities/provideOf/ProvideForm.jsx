import { FusePageSimple } from '@fuse'
import { Card, CardContent, Button, CardHeader } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import React, { useState, useEffect } from 'react'
import TabPro from "app/main/components/TabPro";

import Share from './tabs/Share'
import PrioritizationCriteria from './tabs/PrioritizationCriteria'
import ListofRequests from './tabs/ListofRequests'
export default function ProvideForm({ showTwoTabs }) {
    const tabs = [
        ...(showTwoTabs ? [
            {
                label: "سهم بندی",
                panel: <Share />
            }, {
                label: "معیارهای اولویت بندی",
                panel: <PrioritizationCriteria />

            }
        ] : []),
        ...(!showTwoTabs ? [{
            label: "لیست درخواست ها  ",
            panel: <ListofRequests />

        }] : [])
    ]
    const [formValues, setFormValues] = useState()
    const formStructure = [
        {
            name: "number1",
            label: "تعریف کننده  ",
            type: "text",
            col: 3
        },

        {
            name: "text1",
            label: "پست سازمانی",
            type: "select",
            options: "Test1",
            col: 3
        },
        {
            name: "date1",
            label: "کد رهگیری",
            type: "text",
            col: 3

        },
        {
            name: "select1",
            label: "تاریخ ایجاد",
            type: "date",
        },
        {
            name: "select1",
            label: "انتخاب تسهیل مالی",
            type: "select",
            options: "Test1",
            required: true,
        },
        {
            name: "select1",
            label: " نوع تسهیل مالی",
            type: "select",
            options: "Test1",
        },
        {
            name: "text55",
            label: "مبلغ تامینی",
            type: "text",
            required: true,

        },
        {
            name: "select1",
            label: "تاریخ درخواست از",
            type: "date",
            required: true,

        },
        {
            name: "select1",
            label: "تاریخ درخواست تا",
            type: "date",
            required: true,
        },
        {
            name: "select1",
            label: "  تاریخ پرداخت تسهیل مالی",
            type: "date",
            required: true,
        },

    ]





    return (

        <>
            <Box p={2} >

                <Card variant="outlined">
                    <CardHeader title={'تامین تسهیل مالی'} />
                    <CardContent>
                        <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            actionBox={
                                <ActionBox>
                                    <Button type="submit" role="primary" >ثبت </Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>
                            }
                        />
                        <Box p={2} />
                        <Card variant="outlined">
                            <TabPro tabs={tabs} />
                        </Card>

                    </CardContent>
                </Card>

           
            </Box>
        </>
    )
}
