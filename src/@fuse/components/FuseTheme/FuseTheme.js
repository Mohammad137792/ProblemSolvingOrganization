import React from 'react';
import {ThemeProvider} from '@material-ui/styles';
import {useSelector} from 'react-redux';
import CAlert from "../../../app/main/components/CAlert";

function FuseTheme(props)
{
    const mainTheme = useSelector(({fuse}) => fuse.settings.mainTheme);

    // console.warn('FuseTheme:: rendered',mainTheme);
    return (
        <ThemeProvider theme={mainTheme}>
            <CAlert/>

            {props.children}
        </ThemeProvider>
    )
}

export default React.memo(FuseTheme);
