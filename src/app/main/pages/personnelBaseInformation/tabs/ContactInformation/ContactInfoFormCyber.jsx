import React from 'react';
import {Button, Card, CardContent, Grid, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import CTable from "../../../../components/CTable";
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import CardHeader from '@material-ui/core/CardHeader';
import ModalDelete1 from "./ModalDelete1";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TablePro from 'app/main/components/TablePro';


const useStyles = makeStyles((theme,theme1) => ({

//     &.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary {
//   display : "none"
// },
    adornedStart : {
        // paddingRight:0,
        display : "none"
    },
    buttonStyle: {
        disabled: true
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    as:{
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
  
    div: {
     
        "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
        }
    }

}));
const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red"
    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        }
    }
}));
const ContactInfoForm = ({addFormData,  setFormData, formData,data, tableContent, setTableContent,currentData, setCurrentData,fromDate,addressEdit,
                             addressToEdit1, setStyle, setId, idDelete, open, handleClose, setEnableDisableCreate,enableDisableCreate,cancelUpdate,addRow,enablecancel,
                             updateRow,display,style,currentData2,cancelAdd,addressToEdit,contactMechId,tel,settel,setaddrow,partyIdsets}) => {
    const classes = useStyles();
    const helperTestClasses = helperTextStyles();

    const [afteradd, setafteradd] = React.useState(false);
    const [afteradd1, setafteradd1] = React.useState(false);


    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !==null) ? partyIdUser : partyIdLogin
    {
    }

    const email= useSelector(({auth}) => auth.user.data.email);

    const tableCols = [
        { name: "description", label: " نوع راه های ارتباطی  ", type: "text", style: { minWidth: "130px" } },
        { name: "infoString", label: " راه های ارتباطی", type: "text", style: { minWidth: "130px" } },
       
    ]
    return (
        <Card variant="outlined">
            <CardHeader title="راه های ارتباط فضای مجازی "/>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    
                        <Autocomplete style={{marginTop:-16}}
                                      id="description" name="description"
                                      options={data}
                                      disabled={addressToEdit1 === true ? true : false}
                                      getOptionLabel={option => option.description || "" }
                                      onChange={(event, newValue) => {
                                          if(newValue !== null){
                                            setStyle(prevState =>({
                                                ...prevState,
                                                description:false
                                            }))
                                              
                                              setFormData({ ...formData, ["description"]: newValue.contactMechPurposeId});
                                              formData.description = newValue.contactMechPurposeId;
                                          }
                                          if(newValue === null){
                                              setafteradd(false)
                                              setaddrow(false)
                                              setFormData(Object.assign({} , formData  , {description: ""}))
                                              if(typeof currentData != "undefined"){
                                                  if(typeof currentData.contactMechPurposeId != "undefined"){
                                                      formData.postalAddress = {...formData.postalAddress,["description"]: ""};
                                                      const newFormdata = Object.assign({},formData);
                                                      setFormData(newFormdata)
                                                  }
                                              }
                                          }
                                      }}
                                      defaultValue={()=>{
                                          let current = null;
                                          if( addressEdit === -1 && addressEdit !== 100){
                                              if(typeof currentData[addressToEdit] !='undefined'){
                                                  if(currentData[addressToEdit].contactMechPurposeId !==''){
                                                      data.map((item,index) => {
                                                          if(item.contactMechPurposeId === currentData[addressToEdit].contactMechPurposeId){
                                                              current = item;
                                                          }
                                                      });
                                                  }
                                              }
                                          }

                                          else if( addressEdit !== -1 && display === true &&
                                              typeof currentData2[addressToEdit] !='undefined'){
                                             
                                              current = currentData2[addressToEdit];

                                          }

                                          return current;
                                      }
                                      }
                                      renderInput={params => {
                                          return (
                                              <TextField
                                                  // value={formData.description}
                                                  {...params} required
                                                  className={(style.description && afteradd === false) ?  classes.as :classes.formControl }
                                                  helperText={(style.description && afteradd === false)  ? "پر کردن این فیلد الزامی است" : ""}
                                                  FormHelperTextProps={{ classes: helperTestClasses }}
                                                  variant="outlined"
                                                  label="نوع راه ارتباطی"
                                                  margin="normal"
                                                  fullWidth
                                              />
                                          );
                                      }}
                        />

                    </Grid>
                 
                    <Grid item xs={12} md={6}>
                        <TextField required fullWidth
                                   className={(style.infoString   || afteradd1 === true) ?  classes.as :classes.formControl }
                                   helperText={(style.infoString  || afteradd1 === true)  ? "پر کردن این فیلد الزامی است" : ""}
                                   FormHelperTextProps={{ classes: helperTestClasses }}
                                   label="راه ارتباطی"
                                   variant="outlined" id="infoString" name="infoString"
                                   value={formData.infoString}
                                   onChange={(e)=>{
                                       if ((e.target.value) === ''){
                                          
                                           formData.person = {...formData.person,["infoString"]: ""};
                                           const newFormdata = Object.assign({},formData);
                                           setFormData(newFormdata)
                                       } else if((e.target.value) !== ''){
                                         
                                          
                                           setStyle(prevState =>({
                                               ...prevState,
                                               infoString:false
                                           }))
                                           formData.person = {...formData.person,["infoString"]: e.target.value };
                                           const newFormdata = Object.assign({},formData);
                                           setFormData(newFormdata)
                                       }
                                   }}
                           
                                   defaultValue={ addressEdit !== 100 && currentData[addressToEdit]
                                   && currentData[addressToEdit].infoString ?
                                       currentData[addressToEdit].infoString : (addressEdit === 100 & display === true &&
                                           typeof currentData2 !='undefined'&& typeof currentData2[addressToEdit] !='undefined'
                                           && typeof currentData2[addressToEdit].person !='undefined'
                                           && currentData2[addressToEdit].person.infoString !== '' ? currentData2[addressToEdit].person.infoString :""
                                       )}
                        />

                    </Grid>
                </Grid>
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    { !enableDisableCreate ? <Button variant="outlined"  id="add" variant="contained" color="primary" startIcon={<Add/>}
                                                     className="mt-5"  onClick={addRow}>افزودن</Button> : null }
                    { !enableDisableCreate ? <Button variant="outlined" style={{marginLeft : "20px"}} variant="contained"
                                                     className="mt-5"  onClick={cancelAdd}>لغو</Button> : null }
                </Grid>
                <br/>
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    { enableDisableCreate ?  <Button id="modify" variant="outlined" variant="contained" color="primary" startIcon={<Add/>}
                                                     className="mt-5"   disabled={!enableDisableCreate }
                                                     onClick={() =>{updateRow(contactMechId,data,addressEdit) }
                                                     }>ثبت</Button> : null }
                    { (enableDisableCreate ) ?  <Button id="modify" variant="outlined" style={{marginLeft : "20px"}}
                                                        className="mt-5" variant="contained"
                                                        onClick={cancelUpdate}>لغو</Button> : null }
                </Grid>
                <ModalDelete1 fromDate={fromDate} open={open} id={idDelete} handleClose={handleClose} setTableContent={setTableContent} partyIdsets={partyIdsets}
                />
                <CTable headers={[{
                    id: "contactInformationType1",
                    label: "نوع  راه ارتباطی"
                }, {
                    id: "infoString",
                    label: "راه ارتباطی"
                }, {
                    id: "delete",
                    label: "حذف"
                },
                    {
                        id: "modify",
                        label: "ویرایش"
                    },]} rows={tableContent}/>

            </CardContent>


        </Card>
    );
};

export default ContactInfoForm;
