import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import DetermineTestTimeForm from './DetermineTestTimeForm'
import { Box, CardHeader } from '@material-ui/core';

const DetermineTestTime = (props) => {
  const { formValuesDefineTestTime, setFormValuesDefineTestTime, myElement, bcolor,parentCallBack,setBcolor } = props

  return (
    <>
          <DetermineTestTimeForm
            formValuesDefineTestTime={formValuesDefineTestTime}
            setFormValuesDefineTestTime={setFormValuesDefineTestTime}
            myElement={myElement}
            bcolor={bcolor} setBcolor={setBcolor}
            parentCallBack={parentCallBack}
          />
       
    </>
  );
}
export default DetermineTestTime;