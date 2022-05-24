import React from 'react';
import { AppBar, Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import axios from "axios";
import { SERVER_URL } from "../../../configs";
import profile from "./../../../images/sample_avatar.png"

const useStyles = makeStyles(theme => ({
    root: {
        '&.user': {
            '& .username, & .email': {
                transition: theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.shortest,
                    easing: theme.transitions.easing.easeInOut
                })
            }
        }
    },
    avatar: {
        width: 72,
        height: 72,
        position: 'absolute',
        top: 92,
        padding: 8,
        background: theme.palette.background.default,
        boxSizing: 'content-box',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut,
        }),
        '& > img': {
            borderRadius: '50%'
        }
    }
}));

function UserNavbarHeader(props) {

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);

    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin

    const [partyPerson, setpartyPerson] = React.useState([]);
    // const [partyPerson1, setpartyPerson1] = React.useState([]);
    const [partyPerson13, setpartyPerson13] = React.useState(false);
    React.useEffect(() => {
        const axiosKey = {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }
        if (partyIdLogin) {
            axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfoHeader?partyId=" + partyIdLogin, axiosKey).then(response => {
                if (response.data?.partyuserInfolist?.[0]) {
                    response.data.partyuserInfolist.map((identification1, index) => {
                        if (identification1.partyContentTypeEnumId === "PcntFaceImage") {
                            setpartyPerson13(identification1)
                        }
                    })

                    setpartyPerson({
                        fullName: `${response.data.partyuserInfolist[0]?.firstName} ${response.data.partyuserInfolist[0]?.lastName} ${response.data.partyuserInfolist[0]?.suffix || ''} `
                    })

                } else if (typeof response.data.partyuserInfolist[0] == "undefined") {
                    axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" + partyIdLogin, axiosKey).then(response2 => {

                        response2.data.partyuserInfolist.map((identification12, index) => {
                            if ((identification12.partyContentTypeEnumId === "PcntFaceImage"
                                || identification12.partyContentTypeEnumId === "signatureImage")
                                || typeof identification12.partyContentTypeEnumId == "undefined") {
                                identification12.partyContentTypeEnumId = null;


                                setpartyPerson({
                                    fullName: `${identification12.firstName} ${identification12.lastName} ${identification12?.suffix || ''} `
                                });

                            }
                        })

                    })
                }

            })
        }

    }, [partyIdLogin]);
    const user = useSelector(({ auth }) => auth.user);

    const classes = useStyles();




    return (
        <AppBar
            position="static"
            color="primary"
            elevation={0}
            classes={{ root: classes.root }}
            className="user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0"
        >
            <Typography className="username text-16 whitespace-no-wrap" color="inherit">
                {`${partyPerson.fullName || 'درحال پردازش ...'}`}
            </Typography>
            <Typography className="email text-13 mt-8 opacity-50 whitespace-no-wrap" color="inherit">{user.data.email}</Typography>

            {partyPerson13.length !== 0 && partyPerson13.partyContentTypeEnumId !== undefined ?
                <Avatar src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" +
                    partyPerson13.contentLocation)}
                    id={"imagePreview-" + "contentLocation"}
                />
                : <Avatar alt="user photo" className={clsx(classes.avatar, "avatar")} src={profile} />}
        </AppBar>
    );
}

export default UserNavbarHeader;
