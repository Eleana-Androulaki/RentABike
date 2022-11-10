import React, { useContext, useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { routes } from "../allRoutes";
import Authorization from '../../views/Authorization';
import GeneralError from '../../views/GeneralError';
import MainLayout from "../../layout/MainLayout";
import { Context as AppContext}  from '../../context/appContext';


const  Authmiddleware = () => {
  var { state, fetchLoggedInUser, setLocation, changeAlert } = useContext(AppContext);
  const [user, setUser] = useState(null)
  const token = localStorage.getItem("token");
  const location = useLocation();
  
  useEffect(() => {
    if(state.loggedInUser && token && !state.loading)
    {
      setUser(state.loggedInUser)
    }
    else if(token && !state.loading)
    {
      fetchLoggedInUser(token)
    }
    
  }, [state.loggedInUser,token,state.loading,fetchLoggedInUser])
  
  useEffect(()=>{
    if(location.pathname !== state.location)
    {
      setLocation(location.pathname);
      changeAlert(false,null,'');
    }
  },[location, state.location,changeAlert,setLocation])

  if(token && user)
  {
    if(state.hasServerError)
    {
      return (
        <Routes>
          <Route 
            path="/error" 
            element={
              <MainLayout 
                hasNavbar={false} 
              >
                <GeneralError />
              </MainLayout>
            } 
          />
          <Route 
            path="*" 
            element={<Navigate replace to="/error" />} 
          />
        </Routes>
      )
    }
    return (
      <Routes>
        {
          routes.map((route, index) => 
          {
            if(route.rights.includes(user['role']))
            {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={
                    <MainLayout 
                      hasNavbar={route.hasNavbar} 
                      breadcrumbs={route.breadcrumbs}
                    >
                      <route.main role={user['role']}/>
                    </MainLayout>
                  }
                />
              )
            }
            return (
              <Route 
                key={index}
                path={route.path}
                element={<Navigate replace to="/no-rights" />} 
              />
            );
          })
        }
        
      </Routes>
    )
  }
  else if(token)
  {
    return null;
  }
  else
  {
    return (
      <Routes>
        <Route 
          path="/auth" 
          element={<Authorization />} 
        />
        <Route 
          path="*" 
          element={<Navigate replace to="/auth" />} 
        />
      </Routes>
    )
  }
}

export default Authmiddleware;
