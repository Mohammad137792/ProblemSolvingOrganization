import { FusePageSimple } from '@fuse'
import { Card, CardContent, Button, CardHeader, Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import React, { useState, useEffect } from 'react'
import ProvideForm from './../provideOf/ProvideForm'
import TabPro from "app/main/components/TabPro";
import { useHistory } from 'react-router';
import UploadImage from "app/main/components/UploadImage";

import Signature from './tabs/Signature'
import CommentBoxTab from './tabs/CommentBoxTab';
import ActionBox from 'app/main/components/ActionBox';


export default function ProvidingloansForm() {
    const pages= useHistory()
    const tabs = [



        {
            label: "مدیر اداری",
            panel: < Signature />
        }, {
            label: " مدیر منابع انسانی",
            panel: < Signature />

        },
        {
            label: "مدیر عامل ",
            panel: < Signature />

        },
        {
            label: "مکاتبات ",
            panel: <CommentBoxTab />

        }
    ]

    return (
        <FusePageSimple
            header={
                <>
                </>
            }
            content={
                <>
                    <ProvideForm showTwoTabs={true} />
                        <Box p={2} >

                            <Card variant="outlined">
                                <TabPro tabs={tabs} />
                                <ActionBox>
                                    <Button role="primary" onClick={() =>{pages.push('/requestList')}} >
                                        تایید
                                    </Button>
                                    <Button role="secondary">
                                        رد
                                    </Button>
                                    <Button role="secondary">
                                        اصلاح
                                    </Button>
                                </ActionBox>
                            </Card>
                        </Box>

                </>
            }
        />
    )
}


export function CardSignature({ signatureLocation, permission = true }) {
    const [signature, set_signature] = useState(null)
    const [file, set_file] = useState(null)

    useEffect(() => {
        if (signatureLocation)
            set_signature(signatureLocation)
    }, [signatureLocation])

    const handle_post = () => new Promise((resolve, reject) => {

    })
    return (
        <Box>

            <UploadImage imageLocation={signature} label="تصویر امضاء" card cardVariant="outlined" setValue={set_file} onSubmit={handle_post} />

        </Box>
    )
}