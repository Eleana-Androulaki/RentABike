import React from 'react';
import { useNavigate } from "react-router-dom";
import SupportPagesCard from '../components/general/SupportPagesCard';

const NoRights = () => {
  
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <SupportPagesCard 
        title = 'Access denied'
        message = 'Sorry, you are not authorized to access this page.'
        action = {() => navigate("/")}
        btnText = 'Back to Home'
      />
    </React.Fragment>
  );
}
  
export default NoRights;