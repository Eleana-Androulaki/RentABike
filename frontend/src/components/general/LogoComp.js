import React from 'react';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import bicycle from '../../assets/images/bicycle.png';

const LogoComp = ({display, size, style}) => {
  const navigate = useNavigate();

  return (
    <Typography
      variant={size}
      noWrap
      component="a"
      onClick={()=>navigate("/")}
      sx={
        {
          ...style,
        }
      }
    >
      Rent
      <Avatar sx={{ mr: 1, alignSelf:'center', display: {...display} }} alt="Logo" src={bicycle} />
      Bike
    </Typography>
  )
}

export default LogoComp;