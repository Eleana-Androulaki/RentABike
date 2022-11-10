import React from 'react'; 
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const DataRow = ({avatar, hasDivider, typography, text, actions, itemOpacity}) => {
    return (
        <React.Fragment>
            <ListItem 
                alignItems="flex-start"
                secondaryAction={actions}
                sx={{opacity:itemOpacity ? itemOpacity : 1}}
            >
                <ListItemAvatar>
                    <Avatar alt={avatar.alt} src={avatar.src} />
                </ListItemAvatar>
                
                <ListItemText
                    sx={{mr:6}}
                    primary={text}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={typography.style ? {...typography.style} :{ display: 'inline' }}
                                component="span"
                                variant={typography.variant ? typography.variant :"body2"}
                                color={typography.color ? typography.color :"text.primary"}
                            >
                                {typography.value}
                            </Typography>
                            {typography.secondary_value}
                        </React.Fragment>
                }
                />
            </ListItem>
            {hasDivider && <Divider  variant="inset" component="li" />}
        </React.Fragment>
    )
}

export default DataRow;