import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import SupportPagesCard from '../components/general/SupportPagesCard';
import { Context as AppContext } from '../context/appContext';

const GeneralError = () => {
  var {setHasServerError} = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <SupportPagesCard 
        title = 'Ooops, something went wrong...'
        message = 'Please try again later or contact support.'
        action = {() => {
            setHasServerError(false);
            navigate("/");
          }
        }
        btnText = 'Back to Home'
      />
    </React.Fragment>
  );
}
  
export default GeneralError;