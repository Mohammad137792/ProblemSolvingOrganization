import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid } from "@material-ui/core";
import { SERVER_URL } from 'configs';
import { useDispatch } from 'react-redux';
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import axios from 'axios';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { setFormDataHelper } from 'app/main/helpers/setFormDataHelper';
import config from 'app/fuse-layouts/layout1/Layout1Config';
import Skeleton from "@material-ui/lab/Skeleton";
import UploadImage from 'app/main/components/UploadImage';


const OrganFormHeader = (props) => {
    const [formValues, setFormValues] = useState([])
    const [formValidation, setFormValidation] = useState([]);
    const [partyRoleList, setPartyRoleList] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState("");

    const formStructure = [{
        label: " کد سازمان ",
        name: "pseudoId",
        type: "text",
        col: 4
    },
    {
        label: " عنوان سازمان ",
        name: "organizationName",
        type: "text",
        col: 4
    },
    {
        label: " کد اقتصادی ",
        name: "EconomicCode",
        type: "text",
        col: 4
    },
    {
        label: " شماره ثبت ",
        name: "CompanyRegistrationNumber",
        type: "text",
        col: 4
    },
    {
        label: " حوزه فعالیت ",
        name: "partyRoleList",
        type: "multiselect",
        options: partyRoleList,
        optionLabelField: "description",
        optionIdField: "roleTypeId",
        col: 4
    },
    {
        label: "توضیحات ",
        name: "noteText",
        type: "textarea",
        col: 4
    }
    ]

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const getPartyRoleList = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getPartyRole", axiosKey
        ).then(res => {
            setPartyRoleList(res.data.result)
        }).catch(err => {
        });
    }
    const getCompanyInfo = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/companyInfo", axiosKey
        ).then(res => {
            setFormValues(prevS => ({
                ...prevS,
                partyId: res.data.result[0].partyId,
                pseudoId: res.data.result[0].pseudoId,
                organizationName: res.data.result[0].organizationName,
                CompanyRegistrationNumber: res.data.result[0].CompanyRegistrationNumber,
                EconomicCode: res.data.result[0].EconomicCode,
                partyRoleList: res.data.result[0].partyRoleList,
                partyContentId: res.data.result[0].partyContentId,
                contentLocation: res.data.result[0].contentLocation,
                noteText: res.data.result[0].noteText,

            }))
            setLoading(false)
        }).catch(err => {
        });
    }
    useEffect(() => {
        getPartyRoleList()
    }, [])

    useEffect(() => {
        getCompanyInfo()
    }, [loading])

    const submit = () => {

        axios.put(SERVER_URL + "/rest/s1/fadak/companyInfo", { data: formValues }, axiosKey
        ).then(res => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش اطلاعات با موفقیت انجام شد."))
            setLoading(true)

        }).catch(err => {
        });
    }

    const handleReset = () => { setFormValues([]) }

    return (
        <Box>
            <Grid container direction="row">
                <Grid item xs={10} sm={10} style={{ padding: 5 }} >
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        setFormValidation={setFormValidation}
                        formValidation={formValidation}
                        submitCallback={
                            submit
                        }
                        resetCallback={handleReset}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">ثبت</Button>
                            <Button type="reset" role="secondary">لغو</Button>
                        </ActionBox>}

                    />
                </Grid>
                <Grid item xs={2} sm={2}  >
                    {loading ? (
                        <Skeleton variant="rect" height={50} />
                    ) : (
                        <ColAvatar
                            avatar={formValues.contentLocation}
                            setAvatar={setAvatar}
                            partyId={formValues.partyId}
                            config={config}
                            setFormValues={setFormValues}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    )

}



export default OrganFormHeader;


function ColAvatar({ avatar, setAvatar, partyId, partyRelationshipId, config, setFormValues }) {
    const dispatch = useDispatch();
    const [file, set_file] = useState(null);
    const handle_post = () =>
        new Promise((resolve, reject) => {
            const packet = new FormData();
            packet.append("file", file);
            packet.append("partyContentTypeEnumId", "PcntLogoImage");
            packet.append("partyId", partyId);
            axios
                .post(SERVER_URL + "/rest/s1/fadak/createPartyContent", packet, config)
                .then((res) => {
                    setAvatar(res.data.contentLocation);
                    setFormValues(prevS => ({
                        ...prevS,
                        contentLocation: res.data.contentLocation

                    }))
                    dispatch(
                        setAlertContent(
                            ALERT_TYPES.SUCCESS,
                            "بارگذاری لوگوی سازمان با موفقیت انجام شد."
                        )
                    );
                    resolve();
                })
                .catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
                    reject();
                });
        });
    return (
        <UploadImage
            style={{ with: "50%", height: "50%" }}
            imageLocation={avatar}
            label=" لوگوی سازمان"
            padding={0}
            cardVariant="outlined"
            setValue={set_file}
            onSubmit={handle_post}
        />
    );
}

