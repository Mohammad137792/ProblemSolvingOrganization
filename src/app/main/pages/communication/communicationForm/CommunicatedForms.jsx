import React, { useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import CommunicationElectronicForm from './CommunicationElectronicForm';
import CommunicationPrintedForm from './CommunicationPrintedForm';
import Tooltip from "@material-ui/core/Tooltip";
import PrintIcon from "@material-ui/icons/Print";
import { IconButton } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';




const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
}));

export default function CommunicatedForms() {
  const componentRef = useRef();
  const tutorialSteps = [
    {
      label: 'نسخه الکترونیک',
      componnet: <CommunicationElectronicForm componentRef={componentRef} />
    },
    {
      label: 'نسخه چاپی',
      componnet: <CommunicationPrintedForm componentRef={componentRef} />

    },

  ];
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography>{tutorialSteps[activeStep].label}</Typography>
        <div>
          <Tooltip title=" چاپ">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Paper>
      {tutorialSteps[activeStep].componnet}
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Tooltip title="نسخه چاپی">
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              صفحه بعد
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          </Tooltip>
        }
        backButton={
          <Tooltip title="نسخه الکترونیک">
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              صفحه قبل
            </Button>
          </Tooltip>

        }
      />
    </div>
  );
}
