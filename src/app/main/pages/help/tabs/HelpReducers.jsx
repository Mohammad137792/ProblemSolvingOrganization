import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent} from "@material-ui/core";
import useListState from "../../../reducers/listState";
import Button from "@material-ui/core/Button";
import TablePro from "../../../components/TablePro";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import Box from "@material-ui/core/Box";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FuseHighlight from "../../../../../@fuse/components/FuseHighlight/FuseHighlight";
import Paper from "@material-ui/core/Paper";

export default function HelpReducers() {
    return (
        <React.Fragment>
            <StateListReducer/>
        </React.Fragment>
    )
}

function StateListReducer() {
    const personnel = useListState("id",[])
    const [formValues, set_formValues] = React.useState({})
    const [editing, set_editing] = React.useState(false)

    const formStructure = [{
        name    : "id",
        label   : "شناسه",
        type    : "text",
        required: true,
    },{
        name    : "firstName",
        label   : "نام",
        type    : "text",
        required: true,
    },{
        name    : "lastName",
        label   : "نام خانوادگی",
        type    : "text",
        required: true,
    },{
        name    : "age",
        label   : "سن",
        type    : "number",
    },{
        name    : "date",
        label   : "تاریخ ثبت نام",
        type    : "date",
    }]

    function handle_log() {
        console.log("personnel:",personnel.list)
    }
    function handle_log_length() {
        console.log("personnel count:",personnel.length)
    }
    function handle_set() {
        personnel.set([
            {id: "100", firstName: "مجتبی", lastName: "حسن زاده", age: 26},
            {id: "101", firstName: "سید مصطفی", lastName: "حسینی", age: 28},
        ])
    }
    function handle_empty() {
        personnel.empty()
    }
    function handle_submit() {
        if(editing){
            personnel.update(formValues)
        }else{
            personnel.add(formValues)
        }
    }
    function handle_reset() {
        set_editing(false)
        set_formValues({})
    }
    function handle_remove(rowData) {
        personnel.remove(rowData)
    }

    React.useEffect(()=>{
        handle_set()
    },[])

    return (
        <Card>
            <CardHeader
                title="کاهنده لیست (useListState)"
                action={<Box>
                    <Button onClick={handle_log}>Log</Button>
                    <Button onClick={handle_set}>Load</Button>
                    <Button onClick={handle_empty}>Empty</Button>
                    <Button onClick={handle_log_length}>Count</Button>
                </Box>}
            />
            <CardContent>
                <Paper variant="outlined" style={{backgroundColor:'#263238',direction:'ltr'}}>
                    <FuseHighlight component="pre" className="language-js">
                        {`const sampleList = useListState(pk, initialState) // define a list state
                        
sampleList.list // return items of sampleList
sampleList.length // return the number of items in the sampleList
sampleList.set(newList) // assign newList to sampleList
sampleList.set((prevState)=>{...do somethings on prevState and return newList}) // another way to assign newList to sampleList
sampleList.update(item) // edit item in the sampleList
sampleList.add(newItem) // add newItem into sampleList
sampleList.add([newItem1,newItem2,...]) // add array of newItems into sampleList
sampleList.remove(item) // remove the item of sampleList
sampleList.remove([item1,item2,...]) // remove multiple items of sampleList
sampleList.empty() // remove all items of sampleList`}
                    </FuseHighlight>
                </Paper>
                <Box m={2}/>
                <Card variant="outlined">
                    <CardContent>
                        <FormPro
                            formValues={formValues}
                            setFormValues={set_formValues}
                            prepend={formStructure}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                            submitCallback={handle_submit}
                            resetCallback={handle_reset}
                        />
                    </CardContent>
                </Card>
                <Box m={2}/>
                <Card variant="outlined">
                    <TablePro
                        title="لیست افراد"
                        rows={personnel.list}
                        columns={formStructure}
                        rowActions={[{
                            title: "حذف",
                            icon: DeleteIcon,
                            onClick: (row)=>handle_remove(row)
                        },{
                            title: "ویرایش",
                            icon: EditIcon,
                            onClick: (row)=>{
                                set_formValues(row)
                                set_editing(true)
                            }
                        }]}
                    />
                </Card>
            </CardContent>
        </Card>
    )
}
