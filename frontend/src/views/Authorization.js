import React, { useState, useEffect, useContext } from 'react';
import { Container, CssBaseline } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Login from '../components/auth/Login';
import Registration from '../components/auth/Registration';
import Skeleton from '@mui/material/Skeleton';
import { Context as AppContext}  from '../context/appContext';
import LogoComp from '../components/general/LogoComp';
import CustomAlert from "../components/general/CustomAlert";


const Authorization = () => {
  var { state } = useContext(AppContext);
  const [isloading, setIsLoading] = useState(false);

  const [tab, setTab] = useState('login');

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    setIsLoading(state.loading);
  }, [state.loading])

  return (
    <React.Fragment>
      <CssBaseline />
      {
        isloading
        ? <Skeleton 
            variant="rectangular" 
            sx={{ maxWidth: 600, m:'auto', mt: 6, height:500 }}
          >
          </Skeleton>
        : <Container maxWidth="md" sx={{ mt: 6 }}>
            <CustomAlert />
            <Card sx={{ maxWidth: 600, m:'auto' }}>
              <CardContent>
                <LogoComp 
                  display={'flex'}
                  size="h3"
                  style={{
                    mr: 2,
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
              </CardContent>
              <CardContent>
                <Tabs
                  value={tab}
                  onChange={handleChange}
                  aria-label="wrapped label tabs example"
                >
                  <Tab value="login" label="Login" wrapped/>
                  <Tab value="register" label="Register" wrapped/>
                </Tabs>
              </CardContent>
              <CardContent>
                {
                  tab === 'register' 
                  ? <Registration setTab={setTab}/>
                  : <Login />
                }
              </CardContent>
            </Card>
          </Container>
      }
    </React.Fragment>
  );
}
  
  export default Authorization;