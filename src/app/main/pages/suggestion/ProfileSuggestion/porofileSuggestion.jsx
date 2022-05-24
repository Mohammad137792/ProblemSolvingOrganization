import React from 'react';
import { Box } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import PorofileSuggestionForm from './PorofileSuggestionForm';
import UserInfoHeader from 'app/main/components/UserInfoHeader';

const porofileSuggestion = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            content={
                <Box>
                    <UserInfoHeader headerTitle={" پروفایل نظام پیشنهادات"}/>
                    <PorofileSuggestionForm/>
                </Box>
            }
        />
    </React.Fragment>
    )
};

export default porofileSuggestion;