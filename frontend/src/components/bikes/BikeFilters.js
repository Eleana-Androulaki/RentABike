import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';

const drawerWidth = 300;


const BikeFilters = ({filters, setFilters, filterRating, setFilterRating}) => {
    const [value, setValue] = useState(filterRating);

    const handleSliderChange = (event,newValue) => {
        setValue(newValue);
        setFilterRating(newValue);
    };
    const handleChange = (key, option) => {
        let values = {
            ...filters,
            [key] : {
                options: [...filters[key].options],
                values: filters[key].values.includes(option)
                ? filters[key].values.filter(v => v !== option)
                : [...filters[key].values,option]
            }
        }
        setFilters(values);
    }

    return (
     
        <Box
            component="nav"
            sx={
                {
                    width: { sm: drawerWidth },
                    m:'auto',
                    mt:2, 
                    flexShrink: { sm: 0 }, 
                    textAlign:{xs:'center', md:'left' }
                }
            }
            aria-label="mailbox folders"
        >
            <Drawer
                variant="permanent"
                sx={{
                    display: 'block' ,
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        display:'contents' 
                    },
                }}
                open
            >
                {
                    Object.keys(filters).map(key => {
                        return (
                            <div key={key}>
                                <Typography variant="p" color="text.primary">
                                    {key}
                                </Typography>
                                <Box sx={
                                        { 
                                            display: 'flex', 
                                            flexDirection: {sm:'row', md:'column'}, 
                                            ml: 3,
                                            justifyContent:'center'
                                            
                                        }
                                    }
                                >
                                    {
                                        filters[key].options.map((option,idx) => {
                                            return (
                                                <FormControlLabel
                                                    key={idx+'_'+option}
                                                    label={option}
                                                    control={
                                                        <Checkbox 
                                                             
                                                            onChange={
                                                                ()=>handleChange(key,option)
                                                            } 
                                                        />
                                                    }
                                                />
                                            )
                                        })
                                    }
                                    
                                </Box>
                            </div>
                        )
                    })
                }
                 <Box sx={{ width: 300 }}>
                    <Typography variant="p" sx={{display:'block'}} color="text.primary">
                        Rating
                    </Typography>
                    <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={value}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                        step={1}
                        sx={{
                            mt:1,
                            width:150
                        }}
                    />
                 </Box>
            </Drawer>
        </Box>
    );
}


export default BikeFilters;