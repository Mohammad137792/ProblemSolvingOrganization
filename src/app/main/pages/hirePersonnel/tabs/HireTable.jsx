import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CTable from "../../../components/CTable";
import {Button} from "@material-ui/core";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },

});



const rows=[];
export default function HireTable() {
    return (
<CTable
    headers={[{
        id: "codepersonnel",
        label: "کد پرسنلی "
    }, {
        id: "name",
        label: "نام "
    }, {
        id: "vasiattahol",
        label: "شغل "
    },
        {
            id: "vasiatsokoonat",
            label: "شرکت  "
        },
        {
            id: "tarikhtavalod",
            label: " واحد سازمانی "
        },
        {
            id: "shoghl",
            label: " سمت "
        },{
            id: "sherkats",
            label: "نوع "
        },
        {
            id: "sherkats1",
            label: "تاریخ "
        },

        {
            id: "sherkats2",
            label: "+ "
        },]} rows={rows}
/>

    );
}