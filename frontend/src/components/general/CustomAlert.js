import React, { useContext, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Context as AppContext}  from '../../context/appContext';

const CustomAlert = () => {
  var {state, changeAlert} = useContext(AppContext);
  const [alertVariables, setAlertVariables] = useState(null);


  useEffect(() => {
    setAlertVariables(state.alertProps)
  }, [state.alertProps])
  
  if(alertVariables?.show)
  {
    return (
      <Alert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              changeAlert(false,null,'');
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
        severity={alertVariables?.type}
      >
        {alertVariables?.message}
      </Alert>
    );
  }
  return null;
}


export default CustomAlert;