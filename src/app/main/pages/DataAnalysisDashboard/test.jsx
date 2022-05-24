import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { FusePageSimple } from "@fuse";

// import tileData from './tileData';
import { Button, Typography } from "@material-ui/core";

import axios from "axios";
import { SERVER_URL } from "../../../../configs";

// const useStyles = makeStyles(theme => ({
//   root: {
//     marginTop: 10,
//     display: "flex",
//     justifyContent: "space-around",
//         alignItems: "baseline",
//     overflow: "hidden",
//     height: "100%",
//      boxSizing: "border-box"
//      // backgroundColor: theme.palette.background.paper

//   },
//   gridList: {
//     width: 800,
//     // height: 'auto',

//   },
//   list: {
//     listStyleType: "none",
//     display: "flex",
//     flexWrap: "wrap",
//     width: 625,
//     overflowY: "auto",
//     height:"100%",
//     justifyContent: "space-between"

//   },
//   itemOflist: {
//     // width: 90,'\'
//   height: 120,
//     marginTop:5
//   },
//   icon: {
//     color: "rgba(255, 255, 255, 0.54)"
//   }
// }));

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: 'flex',
    justifyContent: 'center'
  },
  main: {
    width: 660,
    display: "flex",

  },
  ulList: {
    listStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
   
    justifyContent: "space-around"

  },
  liList: {
    marginBottom:7,
    height:120,
  }
}));
export default function GridComponent() {
  const classes = useStyles();
  const [title, setTitle] = React.useState("");
  const [selected, setSelected] = React.useState();
  const [current, setCurrentData] = useState();
  const config = {
    headers: {
      api_key: localStorage.getItem("api_key")
    }
  };
  const tileDatas = [];
  function handleClick(index, title) {
    console.log("title", title);
    setSelected(index);
    setTitle(title);
  }

  function handleIconClick(index, icon) {
    console.log("icon", icon);
    setSelected(index);
    setTitle(icon);
  }

  useEffect(() => {
    axios.get(SERVER_URL + "/rest/s1/fadak/entity/Dashboard", config).then(response => {
      let data = response.data.result;
      let array = response.data.result;

      let col = [400, 210];

      for (let i = 0; i < data.length; i++) {
        
        data[i].style = "100%";
        if (col.length == 0) {
          col = [400, 210];
        }

        let len = Math.floor(Math.random() * col.length);
        data[i].cols = col[len];
        col.splice(len, 1);
        if (data.length % 2 !== 0) {
          data[data.length - 1].cols = 620;
        }
      }
      setCurrentData(data);
    });
  }, []);

  console.log("avaascaavasevavavav", current);

  return (
    <FusePageSimple
      header={<Typography variant="h6" className="p-10">  داشیورد</Typography>}
      content={
        <>
          <div className={classes.root} >
            <div className={classes.main}>
              <ul className={classes.ulList}>
                {current?.map(tile => (
                  <li
                    style={{
                      width: tile.cols
                    }}
                    className={classes.liList} >
                    <Button
                      style={{
                        width: tile.style,
                        height: "100%",
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                        borderRadius: 15
                      }}
                      variant="contained"
                    // color="secondary"
                    >
                      {`${tile.title}`}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </>
      }
    />
  );
}
// <GridList cellHeight={130} className={classes.gridList}  cols={9}>
//   {current?.map(tile => (
//     <GridListTile key={tile.style} cols={tile.cols || 9}>
//       <Button
//         style={{
//           width: tile.style,
//           height: "100%",
//           background : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//         boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
//           borderRadius: 20,
//         }}
//         variant="contained"
//         // color="secondary"
//       >
//         {`${tile.title}`}
//       </Button>
//     </GridListTile>
//   ))}
// </GridList>
