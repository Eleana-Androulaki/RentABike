import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';



const Loader = () => {
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', m:2 }}>
        <Box sx={{ margin: 1 }}>
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Skeleton width="100%">
            <Typography>.</Typography>
          </Skeleton>
        </Box>
      </Box>
      <Skeleton variant="rectangular" width="100%" height={200}>
        <div style={{ paddingTop: '57%' }} />
      </Skeleton>
      <Typography component="div" variant="h1">
        <Skeleton />
      </Typography>
      <Typography component="div" variant="h3">
        <Skeleton />
      </Typography>
      <Typography component="div" variant="p">
        <Skeleton />
      </Typography>
    </div>
  );
}

export default Loader;