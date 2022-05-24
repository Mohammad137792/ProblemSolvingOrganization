import React from "react";
import {withStyles} from "@material-ui/styles";
import {IconButton, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import UploadIcon from '@material-ui/icons/CloudUpload';
import UploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import {blue} from "@material-ui/core/colors";

const useStyles = () => ({
    root: {
        width: "100%",
        display: 'flex',
        position: 'relative',
        height: "51px !important",
    },
    multilineRoot: {
        width: "100%",
        display: 'inline-block',
        position: 'relative',
        height: "176px !important",
    },
    draggingArea: {
        width: "calc(100% - 10px)",
        height: "calc(100% - 10px)",
        margin: "4px",
        border: "1px dashed #ddd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})

class FormInputDropFile extends React.Component {
    state = {
        dragging: false,
        file: null
    }
    dropRef = React.createRef()
    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({dragging: true})
        }
    }
    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({dragging: false})
        }
    }
    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({dragging: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.selectFile(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }
    componentDidMount() {
        this.dragCounter = 0
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }
    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    selectFile(files) {
        const newFile = files[0]
        this.setState({file: newFile})
        if (this.props.setValue) this.props.setValue(newFile)
        if (this.props.setValidation && newFile) this.props.setValidation()
    }
    removeFile() {
        this.setState({file: null})
        if (this.props.setValue) this.props.setValue(null)
    }

    render() {
        const {classes, multiline, label="فایل", variant="outlined", error, disableClearable} = this.props;
        const cx = require('classnames');
        const choose_file = () => {
            let input = document.createElement('input');
            input.type = 'file';
            input.onchange = _ => {
                let files =   Array.from(input.files);
                this.selectFile(files)
            };
            input.click();
        }
        const remove_file = () => {
            this.removeFile()
        }
        if (multiline) return (
            <div className={cx(classes.multilineRoot,variant==="outlined"&&"outlined-input",error&&"error")} ref={this.dropRef}>
                {this.state.dragging ? (
                    <Box className={classes.draggingArea}>
                        <Typography style={{fontSize: "small"}}>{label} را در این قسمت قرار دهید</Typography>
                    </Box>
                ) : this.state.file ? (
                    <Box className="h-full flex flex-col justify-center items-center">
                        <Box p={2}>
                            <Typography color="textPrimary">{this.state.file.name}</Typography>
                        </Box>
                        {!disableClearable && <Button size="small" onClick={remove_file}>حذف فایل</Button>}
                    </Box>
                ):(
                    <Box textAlign="center" p={2}>
                        <UploadIcon style={{fontSize:60, color:blue[50]}}/>
                        <Typography style={{fontSize: "small"}}>{label} را در این قسمت قرار دهید</Typography>
                        <Typography style={{fontSize: "small"}}>یا</Typography>
                        <Button onClick={choose_file}>انتخاب کنید</Button>
                    </Box>
                )}
            </div>
        )
        return (
            <div className={cx(classes.root,variant==="outlined"&&"outlined-input",error&&"error")} ref={this.dropRef}>
                {this.state.dragging ? (
                    <div className={classes.draggingArea}>
                        <Typography style={{fontSize: "small"}}>{label} را در این قسمت قرار دهید</Typography>
                    </div>
                ):(
                    <Box display="flex" className="w-full">
                        <Box flexGrow={1} style={{padding:"18px 14px", overflow: "hidden"}}>
                            <Typography noWrap color={this.state.file?"textPrimary":"textSecondary"}>{this.state.file?this.state.file.name:"فایلی انتخاب نشده است!"}</Typography>
                        </Box>
                        <Box flexShrink={0} style={{padding:"3px 0 3px 14px"}}>
                            {this.state.file && !disableClearable &&
                                <Tooltip title="حذف فایل">
                                    <IconButton onClick={remove_file}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title="انتخاب فایل">
                                <IconButton onClick={choose_file}>
                                    <UploadOutlinedIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                )}
            </div>
        )
    }
}

export default withStyles(useStyles)(FormInputDropFile);
