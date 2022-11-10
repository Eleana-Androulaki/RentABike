import React, { useContext, useState, useEffect } from "react";
import { Container, CssBaseline } from '@mui/material';
import Navbar from '../components/general/Navbar';
import CustomAlert from "../components/general/CustomAlert";
import { Context as AppContext}  from '../context/appContext';
import Loader from '../components/general/Loader';
import LogoComp from "../components/general/LogoComp";
import CustomBreadcrumbs from '../components/general/CustomBreadcrumbs';


const MainLayout = ({hasNavbar, breadcrumbs, children}) => {
  var { state } = useContext(AppContext);
  const [isloading, setIsLoading] = useState(false);
  

  useEffect(() => {
    setIsLoading(state.loading);
  }, [state.loading])
  
  return (
    <React.Fragment>
      <CssBaseline />
      {
        hasNavbar && <Navbar />
      }
      <Container maxWidth="lg" sx={{ mt: 2 , mb:2}}>
        <LogoComp 
          display={'flex'}
          size="h3"
          style={{
            m: 2,
            mt:4,
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize:{xs:'2rem',sm:'3rem'},
            letterSpacing: '.3rem',
            color: "#1976d2",
            textDecoration: 'none',
            justifyContent:'center',
            cursor: 'pointer',
            display: 'flex'
          }}
        />

        {
          breadcrumbs && breadcrumbs.length &&
          <CustomBreadcrumbs breadcrumbs={breadcrumbs}/>
        }

        <CustomAlert />

        {
          isloading
          ?  <Loader />
          :  children
        }
      </Container>
    </React.Fragment>
  );
}

export default MainLayout;