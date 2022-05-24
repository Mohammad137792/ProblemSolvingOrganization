import React from "react";
import {Box} from "@material-ui/core";
import {imageFileTypes} from "./FileTypeIcon";
import {makeStyles} from "@material-ui/core/styles";
import {SERVER_URL} from "../../../../../configs";

const useStyles = makeStyles(() => ({
    root: {
        width: "155px",
        height: "116px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        justifyContent: "center",
        overflow: "hidden",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    },
}));

export default function FilePreview({file}) {
    const classes = useStyles();
    const isImage = imageFileTypes.indexOf(file.fileType)>-1
    return (
        <Box className={classes.root} style={{borderColor: isImage?"#ddd":"transparent"}}>
            {isImage && (
                <img src={(SERVER_URL+"/rest/s1/fadak/getpersonnelfile1?name="+file.fileLocation)} className={classes.imagePreview} id={"imagePreview"}/>
            )}
        </Box>
    )
}
