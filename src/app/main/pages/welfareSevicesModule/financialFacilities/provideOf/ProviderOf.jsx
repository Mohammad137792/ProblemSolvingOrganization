import { FusePageSimple } from '@fuse'

import React, { useState, useEffect } from 'react'
import ProvideForm from './ProvideForm'
import Box from '@material-ui/core/Box';
import ActionBox from 'app/main/components/ActionBox';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router';
export default function Provide() {
    const pages = useHistory()
    return (
        <FusePageSimple
            header={
                <>
                </>
            }
            content={
                <>
                    <ProvideForm showTwoTabs />
                    <ActionBox>
                        <Button role="primary" onClick={() =>{pages.push('/providingloans')}}  >تایید </Button>
                        <Button role="secondary">لغو</Button>
                    </ActionBox>
                </>
            }
        />

    )
}