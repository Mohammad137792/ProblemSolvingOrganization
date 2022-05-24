import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import SuggestionResultForm from './SuggestionResultForm'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';



const SuggestionResult = () => {
    const history = useHistory();

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10"> نتیجه پیشنهاد</Typography>

                    
                    <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={()=>{history.goBack()}}
                        startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>
                    
                </ div>
            }
            content={
                <Box>
                    <SuggestionResultForm />
                </Box>
            }
        />
    </React.Fragment>
    )
};

export default SuggestionResult;