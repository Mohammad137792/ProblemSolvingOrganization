import React from 'react';
import {FusePageSimple} from "@fuse";
import {Paper,Button,Card,FormControl,Select,MenuItem,FormControlLabel,Switch,CardContent,TextField, Tabs,Grid, Tab, Typography, CircularProgress} from '@material-ui/core';
import formData from "../../../../store/reducers/fadak/formData.reducers";
import DatePicker from "../../../components/DatePicker";
import Slider from '@material-ui/core/Slider';
import Filter from '@material-ui/icons/Filter';
import CTable from "../../../components/CTable";
import InlineTable from "../../../components/inlinetabel";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {INPUT_TYPES} from "../../../helpers/setFormDataHelper";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";

const FamilyReportForm=({personData,enumData,formValues, setFormValues,reloadTable,cancelFilter,handleChangeAge,handleChangeChildren,
                               valueAge,valueChildren,ageRangeDefault,childrenRangeDefault,addFormValue,listFilter,orgs,value,setValue,loading,editHandler,fieldEnumChange,setInputValue,inputValue,excelData})=>{
const [filterShow,setFilterShow]=React.useState(false);

const marriageDateHandler =(date) => {
        if (date !== null) {
            formValues.filter = {
                ...formValues.filter,
                marriageDate: date._d.toLocaleDateString()
            }
            const newFormData = Object.assign({}, formValues)
            setFormValues(newFormData)
        }
}
const divorceDateHandler=(date)=>{
        if (date !== null) {
            formValues.filter = {
                ...formValues.filter,
                divorceDate: date._d.toLocaleDateString()
            }
            const newFormData = Object.assign({}, formValues)
            setFormValues(newFormData)
        }
 }
const fromBirthDateHandler=(date)=>{

        if (date !== null) {
            formValues.filter = {
                ...formValues.filter,
                birthdateFrom: date._d.toLocaleDateString()
            }
            const newFormData = Object.assign({}, formValues)
            setFormValues(newFormData)
        }
 }
const toBirthDateHandler=(date)=>{
        if (date !== null) {
            formValues.filter = {
                ...formValues.filter,
                birthdateTo: date._d.toLocaleDateString()
            }
            const newFormData = Object.assign({}, formValues)
            setFormValues(newFormData)
        }
 }

const handleStatus=()=>{
    formValues.filter = {
        ...formValues.filter,
        ownerStatus:!value
    }
    const newFormData = Object.assign({}, formValues)
    setFormValues(newFormData)
    setValue(!value)
}
const unknownOption = {label: "?????? ????????", value: "NA"}
    return(
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">?????????? ?????????????? ??????????????</Typography>}
            content={
                <>
                    <Card>
                <CardContent>
                   <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField select label="??????????????" variant="outlined" id="filter" name="filter" fullWidth>
                                <MenuItem value="">---</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Tooltip title="??????????">
                                <ToggleButton onClick={()=>setFilterShow(!filterShow)}>
                            <FilterListRoundedIcon/>
                                </ToggleButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    {filterShow &&
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        reloadTable(true);
                    }} onReset={function(){
                        cancelFilter();
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <TextField id="toPseudoId" variant="outlined" name="toPseudoId" label="???? ????????????" onChange={addFormValue("","filter")} value={formValues.filter.toPseudoId ?? ""}  fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                        <TextField id="toFirstName" variant="outlined" name="toFirstName" label="?????? ??????????" onChange={addFormValue("","filter")} value={formValues.filter.toFirstName ?? ""} fullWidth />
                        </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField id="toNationalId" variant="outlined" name="toNationalId" label=" ???? ?????? ??????????" onChange={addFormValue("","filter")} value={formValues.filter.toNationalId ?? ""} fullWidth/>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch name="ownerStatus" checked={value}  onChange={()=>{
                                            handleStatus();
                                        }
                                        }/>}
                                        label="?????????? ??????????" name="ownerStatus"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                                <TextField select id="ownerPartyId" variant="outlined" name="ownerPartyId" label="????????" fullWidth inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.ownerPartyId ?? []}>
                                    <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                    {orgs.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.partyId}>{opt.organizationName}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField select variant="outlined" id="relation" name="relation"  label="????????" inputProps={{multiple: true}}
                                       onChange={addFormValue("","filter")}  value={formValues.filter.relation ?? []}  fullWidth>
                                {enumData && enumData?.relationShips?.PartyRelationshipType.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                ))}
                        </TextField>
                        </Grid>
                            <Grid item xs={12} sm={3}>
                                <DatePicker variant="outlined" id="birthdateFrom" name="birthdateFrom"
                                            format={"jYYYY/jMMMM/jDD"}
                                            value={formValues.filter.birthdateFrom ?? null}
                                            setValue={fromBirthDateHandler}
                                            label="?????????? ???????? ????" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <DatePicker variant="outlined" id="birthdateTo" name="birthdateTo"
                                            format={"jYYYY/jMMMM/jDD"}
                                            value={formValues.filter.birthdateTo ?? null}
                                            setValue={toBirthDateHandler}
                                            label="?????????? ???????? ????" fullWidth />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <DatePicker variant="outlined" id="marriageDate" name="marriageDate"
                                            format={"jYYYY/jMMMM/jDD"}
                                            value={formValues.filter.marriageDate ?? null}
                                            setValue={marriageDateHandler}
                                            label="?????????? ????????????" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <DatePicker variant="outlined" id="divorceDate" name="divorceDate"
                                            value={formValues.filter.divorceDate ?? null}
                                            setValue={divorceDateHandler}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="?????????? ????????" fullWidth />
                            </Grid>
                                <Grid item xs={12} sm={3}>
                                <TextField select variant="outlined" id="employmentStatusEnumId" name="employmentStatusEnumId"  label="?????????? ????????????" inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.employmentStatusEnumId ?? []}  fullWidth>
                                    {enumData && enumData?.enums?.EmploymentStatus.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                    ))}
                                    <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                                </TextField>
                            </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField id="firstNameRel" variant="outlined" name="firstName" label="?????? ?? ?????? ????????????????" onChange={addFormValue("","filter")} value={formValues.filter.firstName ?? ""} fullWidth />
                                </Grid>

                            </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                                <TextField id="nationalId" variant="outlined" name="nationalId" label="???? ??????" onChange={addFormValue("","filter")} value={formValues.filter.nationalId ?? ""}  fullWidth/>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                                <TextField id="FatherName" variant="outlined" name="FatherName" label="?????? ??????" onChange={addFormValue("","filter")} value={formValues.filter.FatherName ?? ""} fullWidth/>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField select variant="outlined" id="gender" name="gender"  label="??????????"
                           onChange={addFormValue("","filter")}  value={formValues.filter.gender ?? ""}fullWidth>
                            <MenuItem value="" style={{display:'none'}}> </MenuItem>
                            <MenuItem value="Y" key={1}>??????</MenuItem>
                            <MenuItem value="N" key={2}>????</MenuItem>
                        </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField select variant="outlined" id="militaryState" name="militaryState"  label="?????????? ???????? ??????????"  fullWidth inputProps={{multiple: true}}
                            onChange={addFormValue("","filter")}  value={formValues.filter.militaryState ?? []}>
                            {enumData.classifications && enumData.classifications.Militarystate.map((opt,i)=>(
                                <MenuItem key={i} value={opt.partyClassificationId}>{opt.description}</MenuItem>
                            ))}
                            <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                        </TextField>
                        </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                                <TextField select variant="outlined" id="maritalStatusEnumId" name="maritalStatusEnumId"  label="?????????? ????????"  fullWidth inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.maritalStatusEnumId ?? []}>
                                    {enumData && enumData.enums.MaritalStatus.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                    ))}
                                    <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                                </TextField>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                                <Typography id="range-slider" gutterBottom>?????????? ??????????????</Typography>
                                <Slider id="NumberofKids" name="NumberofKids"
                                        valueLabelDisplay="auto" aria-labelledby="range-slider"
                                        onChange={handleChangeChildren} value={valueChildren}
                                        step={1} min={0} max={15}/>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField variant="outlined" label="?????? ????????" id="birthProvince" name="birthProvince" onChange={addFormValue("","filter")} value={formValues.filter.birthProvince ?? ""} fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField id="residenceStatusEnumId" value={[]} name="residenceStatusEnumId" label="?????????? ??????????" variant="outlined" select fullWidth  inputProps={{multiple: true}}
                            onChange={addFormValue("","filter")}  value={formValues.filter.residenceStatusEnumId ?? []}>
                            {enumData && enumData.enums.ResidenceStatus.map((opt,i)=>(
                                <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                            ))}
                            <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                        </TextField>
                        </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                                <TextField id="Emergencycall" value={[]} name="Emergencycall" label="???????? ???? ?????????? ??????????????" variant="outlined" select fullWidth
                                           onChange={addFormValue("","filter")}  value={formValues.filter.Emergencycall ?? ""}>
                                    <MenuItem value="Y">???????? ?????????? ??????</MenuItem>
                                    <MenuItem value="N">???????? ?????????? ????????</MenuItem>
                                </TextField>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                                <Typography id="range-slider" gutterBottom>????</Typography>
                                <Slider id="age" name="age"
                                        onChange={handleChangeAge}  value={valueAge}
                                        valueLabelDisplay="auto" aria-labelledby="range-slider"
                                        step={1} min={0} max={100}
                                />
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField id="ReligionEnumID" value={[]} name="ReligionEnumID" label="??????" variant="outlined" select fullWidth  inputProps={{multiple: true}}
                            onChange={addFormValue("","filter")}  value={formValues.filter.ReligionEnumID ?? []}>
                            {enumData && enumData.enums.ReligionEnumId.map((opt,i)=>(
                                <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                            ))}
                            <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                        </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField id="sectEnumID" value={[]} name="sectEnumID" label="????????" variant="outlined" select fullWidth  inputProps={{multiple: true}}
                            onChange={addFormValue("","filter")}  value={formValues.filter.sectEnumID ?? []}>
                            {enumData && enumData.enums.SectEnumId.map((opt,i)=>(
                                <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                            ))}
                            <MenuItem value={unknownOption.value} key={unknownOption.value}>{unknownOption.label}</MenuItem>
                        </TextField>
                        </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Autocomplete id="fieldEnumId" name="fieldEnumId" style={{marginTop:-16}} disableClearable
                                              options={enumData?.enums?.UniversityFields} getOptionLabel={option => option?.description}
                                              onChange={(event,newValue)=>fieldEnumChange(event,newValue)}
                                              value={formValues?.filter?.fieldEnumId}
                                              inputValue={inputValue}
                                              onInputChange={(event, newInputValue) => {
                                                  setInputValue(newInputValue);
                                              }}
                                              renderInput={params => {
                                                  return <TextField {...params} variant="outlined" label="???????? ????????????" margin="normal" fullWidth/>
                                              }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField id="qualificationTypeEnumId" value={[]} name="qualificationTypeEnumId" label="???????? ????????????" variant="outlined" select fullWidth  inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.qualificationTypeEnumId ?? []}>
                                    {enumData && enumData.QualificationTypeList.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item sm={3}>
                                <TextField select id="InCompletePurposeId" variant="outlined" name="InCompletePurposeId" label=" ?????????? ????????" fullWidth
                                           onChange={addFormValue("","filter")}  value={formValues.filter.InCompletePurposeId ?? ""}>
                                    <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                    {enumData && enumData?.relationShips?.PartyRelationshipType.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item sm={3}>
                                <TextField select variant="outlined" id="InCompleteItem" name="InCompleteItem" label="?????????????? ????????" onChange={addFormValue("","filter")} value={formValues.filter.InCompleteItem??""} fullWidth>
                                    <MenuItem value="">---</MenuItem>
                                    <MenuItem value="firstName">??????</MenuItem>
                                    <MenuItem value="lastName">?????? ????????????????</MenuItem>
                                    <MenuItem value="nationalId">???? ??????</MenuItem>
                                    <MenuItem value="employmentStatusEnumId">?????????? ????????????</MenuItem>
                                    <MenuItem value="militaryState">?????????? ???????? ??????????</MenuItem>
                                    <MenuItem value="maritalStatusEnumId">?????????? ????????</MenuItem>
                                    <MenuItem value="residenceStatusEnumId">?????????? ??????????</MenuItem>
                                    <MenuItem value="birthProvince">?????? ????????</MenuItem>
                                    <MenuItem value="birthDate">?????????? ????????</MenuItem>
                                    <MenuItem value="marriageDate">?????????? ????????????</MenuItem>
                                    <MenuItem value="divorceDate">?????????? ????????</MenuItem>
                                    <MenuItem value="ReligionEnumID">??????</MenuItem>
                                    <MenuItem value="FatherName">?????? ??????</MenuItem>
                                    <MenuItem value="gender">??????????</MenuItem>
                                    <MenuItem value="sectEnumID">????????</MenuItem>
                                    <MenuItem value="NumberofKids">?????????? ??????????????</MenuItem>
                                    <MenuItem value="Emergencycall">???????? ???? ?????????? ??????????????</MenuItem>
                                    <MenuItem value="fieldEnumId">???????? ????????????</MenuItem>
                                    <MenuItem value="qualificationTypeEnumId">???????? ????????????</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        </Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={3}>
                        <Button variant="contained"color="primary" type="reset"  className="mt-5" >??????</Button>&nbsp;&nbsp;&nbsp;
                        <Button variant="contained"color="primary" type="submit" className="mt-5" >?????????? ??????????</Button>&nbsp;&nbsp;&nbsp;
                         <Button variant="contained"color="primary" className="mt-5" >?????????? ??????????</Button>&nbsp;&nbsp;&nbsp;
                        </Grid>
                        </Grid>
                    </form>
                    }
                 </CardContent>
             </Card>
                    <Card>
                        <CardContent>
                            <InlineTable  columns={[
                                { title: '????????', field: 'index',width:10 },
                                { title: '???? ????????????', field: 'pseudoId' },
                                { title: '?????? ??????????', field: 'personnelName' },
                                { title: '????????', field: 'organization' },
                                { title: '????????', field: 'relation' },
                                { title: '?????? ?? ?????? ????????????????', field: 'name' },
                                { title: '?????? ????????', field: 'birthProvince' },
                                { title: '?????????? ????????', field: "birthDate"},
                                { title: '?????????? ????????', field: 'martialStatusEnumId'},
                                { title: '?????????? ??????????????', field: 'numberOfKids' },
                                { title: '?????????? ????????????', field: 'employmentStatus' },
                                { title: '?????????? ??????????', field: 'residenceStatusEnumId'},
                                { title: '?????????? ???????? ??????????', field: 'militaryState' }]}   title="???????? ??????????" data={personData}
                                 grouping={true} loading={loading} exportButton={true}   editHandler={editHandler} count={personData.length} hideDetail={true} excelData={excelData} excelFileName="?????????????? ?????????????? ??????????">
                            </InlineTable>
                        </CardContent>
                    </Card>
              </>
            }/>
    )
};

export default FamilyReportForm;
                