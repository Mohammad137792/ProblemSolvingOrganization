import React from "react";
import FolderIcon from "@material-ui/icons/FolderOutlined";
import OtherFileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import ImageIcon from '@material-ui/icons/ImageOutlined';
import TextFileIcon from '@material-ui/icons/DescriptionOutlined';
import SpreadIcon from '@material-ui/icons/GridOn';
import VideoIcon from '@material-ui/icons/VideocamOutlined';
import AudioIcon from '@material-ui/icons/MusicVideoOutlined';
import PresentIcon from '@material-ui/icons/DesktopMacOutlined';
import ArchiveIcon from '@material-ui/icons/AllInboxOutlined';

import amber from "@material-ui/core/colors/amber";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";
import purple from "@material-ui/core/colors/purple";
import deepPurple from "@material-ui/core/colors/deepPurple";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

export const imageFileTypes = ["jpg","jpeg","png"]
const audioFileTypes = ["mp3"]
const videoFileTypes = ["mp4","mkv"]
const pdfFileTypes = ["pdf"]
const textFileTypes = ["doc","docx","txt"]
const spreadsheetFileTypes = ["xls","xlsx","csv"]
const presentationFileTypes = ["ppt","pptx"]
const archiveFileTypes = ["zip","rar"]

export default function FileTypeIcon({fileType, size="default"}) {
    if(!fileType)
        return <FolderIcon fontSize={size} style={{color: amber[500]}}/>
    if(imageFileTypes.indexOf(fileType)>-1)
        return <ImageIcon fontSize={size} style={{color: purple[500]}}/>
    if(audioFileTypes.indexOf(fileType)>-1)
        return <AudioIcon fontSize={size} style={{color: purple[500]}}/>
    if(videoFileTypes.indexOf(fileType)>-1)
        return <VideoIcon fontSize={size} style={{color: purple[500]}}/>
    if(textFileTypes.indexOf(fileType)>-1)
        return <TextFileIcon fontSize={size} style={{color: blue[500]}}/>
    if(pdfFileTypes.indexOf(fileType)>-1)
        return <TextFileIcon fontSize={size} style={{color: red["A700"]}}/>
    if(spreadsheetFileTypes.indexOf(fileType)>-1)
        return <SpreadIcon fontSize={size} style={{color: green[500]}}/>
    if(presentationFileTypes.indexOf(fileType)>-1)
        return <PresentIcon fontSize={size} style={{color: red[500]}}/>
    if(archiveFileTypes.indexOf(fileType)>-1)
        return <ArchiveIcon fontSize={size} style={{color: deepPurple[500]}}/>
    return <OtherFileIcon fontSize={size} style={{color: grey[500]}}/>
}
