import React from "react";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";


const CustomBreadcrumbs = ({breadcrumbs}) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            { breadcrumbs.map((breadcrumb, idx) => {
                if(breadcrumb.link)
                {
                  return (
                    <Link
                      key={`breadcrumb_${idx}`}
                      underline="hover"
                      color="inherit"
                      onClick={()=>navigate(breadcrumb.link)}
                      sx={{cursor:'pointer'}}
                    >
                      {breadcrumb.name}
                    </Link>
                  )
                }
                return (
                  <Typography 
                    key={`breadcrumb_${idx}`} 
                    color="text.primary"
                  >
                    {breadcrumb.name}
                  </Typography>
                )
              })
            }
        </Breadcrumbs>
    )
}

export default CustomBreadcrumbs;