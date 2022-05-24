import React from 'react';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import { HashRouter } from 'react-router-dom';
import jssExtend from 'jss-extend';
import history from '@history';
import { Auth } from './auth';
import store from './store';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';
import '@fake-db';
import Maintenance from './main/components/Maintenance';

import axios from 'axios';
import WithAccess from './main/components/withAccess';
// import Maintenance

const jss = create({
    ...jssPreset(),
    plugins: [...jssPreset().plugins, jssExtend(), rtl()],
    insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName();

const App = () => {
    window.apiOrigin = "http://localhost:8080";
    const [display, setDisplay] = React.useState(false)
    if (history.location.hash !== "#/login" && history.location.hash.slice(0,11) !== "#/jobBoards") {
        if (window.localStorage.getItem("api_key") === null) {
            console.log('acvavavav 1', history.location.pathname);

            history.push("/#/login")
        }
    }

    React.useEffect(() => {
        const myHeaders = new Headers({
            "Content-Type": "application/json",
            Accept: "application/json"
        });
        fetch(`appConfig.json?date=${Date.now()}`, {
            headers: myHeaders,
        }).then(response => {
            return response.json();
        }).then(data => {
            setDisplay(data.mode)
        });








    }, [])
    const textOfErrorPage = {
        span: 'لطفا دقایقی دیگر مجددا مراجعه نمایید',
        h2: 'سامانه در حال به‌روزرسانی یا تعمیر می‌باشد، شکیبا باشید. '
    }

    return (
        <AppContext.Provider
            value={{
                routes
            }}
        >
            <StylesProvider jss={jss} generateClassName={generateClassName}>
                <Provider store={store}>
                    <Auth>

                        <HashRouter history={history}>


                            <FuseAuthorization>
                                <FuseTheme>
                                    <WithAccess>                                    {
                                        (display) ? (<Maintenance textOfErrorPage={textOfErrorPage} />) : (
                                            <FuseLayout />)
                                    }
                                    </WithAccess>

                                </FuseTheme>
                            </FuseAuthorization>


                        </HashRouter>
                    </Auth>
                </Provider>
            </StylesProvider >
        </AppContext.Provider >
    );
};

export default App;
