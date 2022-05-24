import React from 'react';
import TablePro from 'app/main/components/TablePro';
import {Button, CardContent , Box, Card, CardHeader ,Collapse} from "@material-ui/core";
import FormPro from './../../../components/formControls/FormPro';
import ActionBox from './../../../components/ActionBox';
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";

const Cost = (props) => {
    const {ticketTypeEnumId , welfareId} = props
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const [costFormValues,setCostFormValues]=React.useState({})
    const [edit,setEdit]= React.useState(false);
    const [finalCost,setFinalCost]= React.useState(0);
    const [discountUomIdInfo,setDiscountUomIdInfo]= React.useState();
    const [costUomIdInfo,setCostUomIdInfo]=React.useState();
    const [ticketType,setTicketType]=React.useState([]);
    const [EntpaymentMethodId,setEntPaymentMethodId]=React.useState([]);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {label:  "نوع هزینه", name:   "costType", type:   "select", options : ticketType , optionIdField  : "enumId" , optionLabelField  : "description" , },
        {label:  "بازه سنی هزینه", name:   "age", type:   "text"},
        {label:  "نحوه پرداخت", name:   "paymentMethodId", type:   "select", options : EntpaymentMethodId , optionIdField  : "paymentMethodId" , optionLabelField  : "description" },
        {label:  "هزینه", name:   "amount", type:   "number",  },
        {label:  "واحد هزینه", name:   "uomId", type:   "select", options : costUomIdInfo , optionIdField  : "uomId" , optionLabelField  : "description"  },
        {label:  "تخفیف", name:   "discount", type:   "number" },
        {label:  "واحد تخفیف", name:   "discountUomId", type:   "select", options : discountUomIdInfo , optionIdField  : "uomId" , optionLabelField  : "description"  },
        // {label:  "هزینه نهایی", name:   "costResult", type:   "number",} ,
        // {label:  "واحد هزینه نهایی", name:   "uomId",type:   "select", options : costUomIdInfo , optionIdField  : "uomId" , optionLabelField  : "description"  },
    ]
    const formStructure = [{
        label:  "نوع هزینه",
        name:   "costType",
        type:   "select",
        options : ticketType ,
        optionLabelField : "description" ,
        optionIdField : "enumId" ,
        col     : 4
    },{
        type    : "group",
        items   : [{
            label   : "بازه سنی هزینه : از",
            type    : "text",
            disableClearable: true,
            style:  {minWidth:"35%"}
        },{
            name    : "fromAge",
            type    : "number",
            style:  {minWidth:"20%"}
        },{
            label   : "تا",
            type    : "text",
            disableClearable: true,
        },{
            name    : "thruAge",
            type    : "number",
            style:  {minWidth:"20%"}
        },{
            label   : "سال",
            type    : "text",
            disableClearable: true,
        }],
        col:    4
    },{
        label:  "نحوه پرداخت هزینه",
        name:   "paymentMethodId",
        type:   "select",
        options : EntpaymentMethodId ,
        optionLabelField  :  "description" ,
        optionIdField  : "paymentMethodId" ,
        filterOptions   : options => options.filter(o=>o.paymentMethodTypeEnumId=="PaymentMethod"),
        col     : 4
    },{
        type    : "group",
        items   : [{
            name    : "amount",
            label   : "هزینه",
            type    : "number",
        },{
            name    : "uomId",
            type    : "select",
            options : costUomIdInfo ,
            optionIdField  : "uomId",
            optionLabelField  : "description" ,
            disableClearable: true,
            style:  {minWidth:"30%"}
        }],
        col     : 4
    },{
        type    : "group",
        items   : [{
            name    : "discount",
            label   : "تخفیف",
            type    : "number",
            disabled: (!costFormValues?.amount || costFormValues?.amount== "") ? true : false ,
        },{
            name    : "discountUomId",
            type    : "select",
            options : discountUomIdInfo ,
            optionIdField  : "uomId",
            optionLabelField  : "description" ,
            disableClearable: true,
            style:  {minWidth:"30%"}
        }],
        col     : 4
    },{
        type    : "group",
        items   : [{
            name    : "costResult",
            label   : (!costFormValues?.amount || costFormValues?.amount== "") ? "هزینه نهایی" : finalCost ,
            type    : "text",
            disableClearable: true,
            disabled: true,
        },{
            name    : "uomId",
            type    : "select",
            options : costUomIdInfo ,
            optionIdField  : "uomId",
            optionLabelField  : "description" ,
            disableClearable: true,
            disabled: true,
            style:  {minWidth:"30%"}
        }],
        col     : 4
    }]
    const calculateFinalCost=(DiscountUom,CostUom , DiscountValue,CostValue)=>{
        if(DiscountUom=="تومان" && CostUom=="تومان"){
            setFinalCost(parseInt( CostValue , 10)-parseInt(DiscountValue ,10))
        }
        if(DiscountUom=="ریال" && CostUom=="تومان"){
            setFinalCost(parseInt( CostValue , 10)-(0.1*parseInt(DiscountValue ,10)))
        }
        if(DiscountUom=="درصد" && CostUom=="تومان"){
            setFinalCost(parseInt( CostValue , 10)-(parseInt(DiscountValue ,10)/100*parseInt( CostValue , 10)))
        }
        if(DiscountUom=="تومان" && CostUom=="ریال"){
            setFinalCost(parseInt( CostValue, 10)-(10*parseInt(DiscountValue ,10)))
        }
        if(DiscountUom=="ریال" && CostUom=="ریال"){
            setFinalCost(parseInt( CostValue , 10)-parseInt(DiscountValue ,10))
        }
        if(DiscountUom=="درصد" && CostUom=="ریال"){
            setFinalCost(parseInt( CostValue , 10)-(parseInt(DiscountValue ,10)/100*parseInt( CostValue, 10)))
        }
    }
    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Uom?abbreviation=" + "IRI" , axiosKey )
            .then((dis)=>{
                dis.data.result.map((item)=>{
                    if(item.description == "ریال"){
                        costFormValues.discountUomId=item.uomId
                        setCostFormValues(Object.assign({},costFormValues) )
                    }
                })
                setDiscountUomIdInfo(dis.data.result)
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Uom?abbreviation=" + "IRI" , axiosKey )
                    .then((cost)=>{
                        setCostUomIdInfo(cost.data.result)
                        cost.data.result.map((item)=>{
                            if(item.description == "ریال"){
                                costFormValues.uomId=item.uomId
                                setCostFormValues(Object.assign({},costFormValues) )
                            }
                        })
                    })
            })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/PaymentMethod", axiosKey )
            .then((method)=>{  
                setEntPaymentMethodId(method.data.result)
            })  
    },[])
    React.useEffect(()=>{
        if (costFormValues.amount && (!costFormValues.discount || costFormValues.discount=="") ){
            setFinalCost(costFormValues.amount)
        }
        if (costFormValues.amount && (costFormValues.discount) && costFormValues.discountUomId && costFormValues.uomId ){
            console.log("discountUomIdInfo" ,discountUomIdInfo);
            discountUomIdInfo.map((item)=>{
                if(item.uomId==costFormValues.discountUomId){
                    console.log("item.description" ,  item.description);
                    costUomIdInfo.map((costItem)=>{
                        if(costItem.uomId==costFormValues.uomId){
                            calculateFinalCost(item.description,costItem.description ,costFormValues.discount,costFormValues.amount)
                        }
                    })
                }
            })
        }
    },[costFormValues.amount , (costFormValues.discount) , costFormValues.discountUomId , costFormValues.uomId])
    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/welfare/ticketType?typeId=" + ticketTypeEnumId , axiosKey )
            .then((type)=>{ 
                setTicketType(type.data.opt)
            })
    },[ticketTypeEnumId])
    React.useEffect(()=>{
        if (loading){
            axios.get(SERVER_URL + "/rest/s1/welfare/entity/WelfareCost?welfareId=" + welfareId , axiosKey )
                .then((info)=>{ 
                    let data =[]
                    if(info.data.length>0){
                        info.data.map((item , index)=>{
                            item ={...item ,  age : `${item.fromAge} - ${item.thruAge}  سال` }
                            data.push(item)
                            if (index== info.data.length-1){
                                setTableContent(data)
                                setLoading(false)
                            }
                        })
                    }
                    else{
                        setTableContent(data)
                        setLoading(false) 
                    }
                })
            }
    },[loading ])
    const handleCreate =()=>{
        let postData = {...costFormValues , welfareId : welfareId}
        axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareCost" , postData , axiosKey )
            .then(()=>{
                setCostFormValues({})
                setLoading(true)
            })
    }
    const handleEdit =()=>{
        let postData = {...costFormValues , welfareId : welfareId}
        axios.put(SERVER_URL + "/rest/s1/welfare/entity/WelfareCost" , postData , axiosKey )
            .then(()=>{
                setCostFormValues({})
                setLoading(true)
            })
    }
    const handleRemove =(rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareCost?welfareCostId=" + rowData.welfareCostId , axiosKey )
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }
    const handleClose =()=>{

    }
    const setTableData =(rowData)=>{
        setCostFormValues(rowData)
        setEdit(true)
    }
    return (
        <>
            <FormPro
                prepend={formStructure}
                formValues={costFormValues}
                setFormValues={setCostFormValues}
                submitCallback={()=>{
                    if(edit){
                        handleEdit()
                    }else{
                        handleCreate()
                    }
                }}
                resetCallback={handleClose}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary">{edit?"ویرایش":"افزودن"}</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
            />
            <TablePro
                title="هزینه"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                edit="callback"
                editCallback={setTableData}
                removeCallback={handleRemove}
                loading={loading}
            />  
        </>
    );
};

export default Cost;
