
import {useState} from 'react';
import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Toolbar} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ReplyIcon from '@material-ui/icons/Reply';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { Replay } from '@material-ui/icons';
// const useStyles = makeStyles((theme) => ({
//   icons:{
//     size:"small"
//   },

//     root: {
//       width: '100%',
//       backgroundColor: theme.palette.background.paper,
//       maxHeight: 400,
//     },
//     listSection: {
//       maxHeight: 300,
//       backgroundColor: 'inherit',
//     },
//     ul: {
//       maxHeight: 300,
//       backgroundColor: 'inherit',
//       padding: 0,
//       display:"block",
//     },
//     li:{
//       maxHeight: 300,
//       width:"100%",
//     },
//     textField: {
//       marginLeft: theme.spacing(1),
//       marginRight: theme.spacing(1),
//       width: '100%',
//       display:'block'
//     },
//     icons:{
//       size:"small"
//     },
//       listSection: {
//         backgroundColor: 'inherit',
//         display: "flex",
//         justifyContent: "center"
//       },
//       ul: {
//         backgroundColor: 'inherit',
//         padding: 0,
//       },
//     }
// ));

// export default function AlignItemsList({textarea}) {
  //   const setValue=(event)=>{
  //     Setarray(event.target.value);
  //   }
  //   const [array,Setarray]=useState('')
  //   const [Reply,setReply]=useState(false)
  // const classes = useStyles();
  // const Edithandker=()=>{
  //   console.log("Edit")
  //   setReply(true)
  // }
//   return (
//     <>
//     <List className={classes.root}>
//       {console.log(textarea,"textarea")}
//       {textarea.map((sectionId) => (
//         <li  className={classes.listSection}>
//           <ul className={classes.ul}>
//               <ListItem  className={classes.li} alignItems="flex-start">
//               <Toolbar>
//                 <ListItemAvatar alignItems="flex-start">
//                   <AccountCircle fontSize="large"/>
//                 </ListItemAvatar>
//                 <ListItemText
//                   primary={"name"}
//                   className={classes.li}
//                   secondary={
//                     <React.Fragment className={classes.textField}>
//                       <Typography
//                       className={classes.textField}
//                         >
//                         {sectionId}
//                       </Typography>
//                       <Divider/>
//                         time
//                         <IconButton className={classes.icons}>
//                       <EditIcon onClick={Edithandker} fontSize="smaller"/>
//                         </IconButton>
//                         <IconButton >
//                         <DeleteIcon 
//                         fontSize="smaller"
//                         onClick={Edithandker}/>
//                         </IconButton>
//                         <IconButton  >
//                         <ReplyIcon onClick={Edithandker} fontSize="small"/>
//                         </IconButton>
//                     </React.Fragment>}
//                   />  
//                    </Toolbar>       
//               </ListItem>
//           </ul>
//           <Divider/>
//         </li>
//       ))}
               
//     </List>
 

//      </>     
//   );
// }

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default function PinnedSubheaderList({textarea}) {
  // const {textarea}=props
  const classes = useStyles();
  const setValue=(event)=>{
    Setarray(event.target.value);
  }
  const [array,Setarray]=useState('')
  const [Replys,setReply]=useState(false)
// const classes = useStyles();
const Edithandker=()=>{
  console.log("Edit")
  setReply(true)
  console.log(Replys,"Replys")
}

  return (
    <List className={classes.root} subheader={<li />} 
    // backgroundcolor={(Replys?"textPrimary":"secondary")}
    >
      {textarea.map((sectionId) => (
        <li>
          <ul className={classes.ul}
        //  backgroundcolor={(Replys?"textPrimary":"secondary")}
          >
              <ListItem alignItems="flex-start">
               <Toolbar>
                 <ListItemAvatar alignItems="flex-start">
                   <AccountCircle fontSize="large"/>
                 </ListItemAvatar>
                 <ListItemText
                  primary={"name"}
                  secondary={
                    <React.Fragment
                     >
                      <Typography
                        >
                        {sectionId}
                      </Typography>
                      <Divider/>
                        time
                        <IconButton className={classes.icons}>
                      <EditIcon onClick={Edithandker} fontSize="smaller"/>
                        </IconButton>
                        <IconButton >
                        <DeleteIcon 
                        fontSize="smaller"
                        onClick={Edithandker}/>
                        </IconButton>
                        <IconButton  >
                        <ReplyIcon onClick={Edithandker} fontSize="small"/>
                        </IconButton>
                    </React.Fragment>}
                  />  
                   </Toolbar>       
              </ListItem>
          </ul>
        </li>
      ))}
    </List>
  );
}