import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/icons/Menu";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {CardContent, Typography} from "@material-ui/core";
import {ReactSortable} from "react-sortablejs";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import Autocomplete from "@material-ui/lab/Autocomplete";

const INHERIT_LABEL = "مطابق تنظیمات عمومی"

function SelectField({name, options, value, setValue, optionIdField="value", optionLabelField="label"}) {
    return (
        <Autocomplete
            name={name}
            options={options}
            getOptionLabel={(option) => option[optionLabelField]}
            value={options.find(o => o ? o[optionIdField] === value : false) ?? null}
            onChange={(event, newOption) => {
                setValue(newOption[optionIdField]);
            }}
            disableClearable
            renderInput={params => <TextField {...params} type="text" size="small"/>}
            openText="نمایش لیست"
            closeText="بستن لیست"
        />
    )
}

export default function EditorPage({index, page, set_page, delete_page, showQuestions, update_pages_question_numbers}) {
    const handle_change = (e) => {
        let newPage = Object.assign({},page,
            {[e.target.name]: (e.target.type==="text" || e.target.type==="textarea") ? e.target.value : e.target.checked?"Y":"N"})
        set_page(newPage)
    }
    const set_value = (name) => (value) => {
        let newPage = Object.assign({}, page)
        newPage[name] = value
        set_page(newPage)
    }
    return (
        <Card variant="outlined">
            <CardContent>
                <Box display="flex" mb={2}>
                    <Box mr={1} className="page-handle">
                        <Tooltip title="جابجایی صفحه">
                            <MenuIcon fontSize="small"/>
                        </Tooltip>
                    </Box>
                    <Box flexGrow={1}>
                        <FormControlLabel
                            labelPlacement="start"
                            label=""
                            className="text-field"
                            control={<TextField type="text" size="small" placeholder="صفحه..." name="name" value={page.name||""} onChange={handle_change} />}  />
                    </Box>
                    <Box ml={2}>
                        <Tooltip title="حذف صفحه">
                            <span>
                                <IconButton size="small" onClick={delete_page} disabled={index===0}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
                {!showQuestions &&
                <Box>
                    <FormControlLabel
                        labelPlacement="start"
                        label="عنوان صفحه: "
                        className="text-field"
                        control={<TextField type="text" size="small" placeholder="ندارد" name="title" value={page.title||""} onChange={handle_change} />}  />
                    <FormControlLabel
                        labelPlacement="start"
                        label="توضیحات: "
                        className="text-field"
                        control={<TextField type="text" size="small" placeholder="ندارد" name="description" value={page.description||""} onChange={handle_change} multiline />}  />
                    <FormControlLabel
                        labelPlacement="start"
                        label="چیدمان سوالات: "
                        className="text-field"
                        control={<SelectField value={page.elementsArrangementEnumId} setValue={set_value("elementsArrangementEnumId")}
                                              options={[
                                                  {value: "ArrSequence", label: "به ترتیب"},
                                                  {value: "ArrRandom", label: "تصادفی"},
                                                  {value: "ArrInherit", label: INHERIT_LABEL },
                                              ]}/>} />
                    <FormControlLabel
                        labelPlacement="start"
                        label="دکمه بازگشت: "
                        className="text-field"
                        control={<SelectField value={page.backButtonDisplayEnumId} setValue={set_value("backButtonDisplayEnumId")}
                                              options={[
                                                  {value: "DispShow", label: "نمایش"},
                                                  {value: "DispHide", label: "عدم نمایش"},
                                                  {value: "DispInherit", label: INHERIT_LABEL },
                                              ]}/>} />
                    <FormGroup>
                        <FormControlLabel
                            label="نمایش صفحه"
                            className="form-grid"
                            control={<Switch size="small" name="display" checked={page.display==="Y"} onChange={handle_change} />}/>
                    </FormGroup>
                </Box>
                }
                {showQuestions &&
                <Box>
                    <Typography variant="caption" color="textSecondary">لیست سوالات صفحه:</Typography>
                    <ReactSortable
                        list={page.elements}
                        setList={set_value("elements")}
                        group={{name: "questions"}}
                        animation={200}
                        delayOnTouchStart={true}
                        delay={false}
                        ghostClass="question-ghost"
                        className="page-editor-question-container"
                        onSort={update_pages_question_numbers}
                    >
                        {page.elements.map((q,ind)=>(
                            <div key={ind} className="page-editor-question-item">
                                {`${ind+page.startNumber}. ${q.name}`}
                            </div>
                        ))}
                    </ReactSortable>
                </Box>
                }
            </CardContent>
        </Card>
    )
}
