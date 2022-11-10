import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const SupportPagesCard = ({title, message, action, btnText}) => {
  

  return (
    <React.Fragment>
      <Card sx={{ maxWidth: 600, m:'auto' }}>
        <CardContent style={{textAlign:'center'}}>
          <Typography gutterBottom variant="h3" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            sx={{ m: 'auto' }} 
            size="small" 
            onClick={action}
          >
            {btnText}
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}

export default SupportPagesCard;