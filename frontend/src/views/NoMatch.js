import React from 'react';
import { useNavigate } from "react-router-dom";
import SupportPagesCard from '../components/general/SupportPagesCard';


const NoMatch = () => {
  
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <SupportPagesCard 
        title = '404'
        message = 'Sorry, page not found'
        action = {() => navigate("/")}
        btnText = 'Back to Home'
      />
    </React.Fragment>
  );
}
  
export default NoMatch;