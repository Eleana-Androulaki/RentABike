import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import moment from 'moment';



const RangeDatePicker = ({datesComplete}) => {
    const [range, setRange] = useState(
        {
            from: {
                value:null,
                formatted: '',
            },
            to: {
                value:null,
                formatted: '',
            },
        }
    )

    const dateAdded = (newValue, prop) =>{
        let newRange = {
            ...range, 
            [prop]: {
                value:newValue,
                formatted: newValue?.format("DD/MM/yyyy")
            }
        };
        setRange(newRange);
        if(newRange.from.value && newRange.to.value)
        {
            datesComplete(newRange)
        }
    }


    return (
        <React.Fragment>
            <Container maxWidth="md" sx={{ mt: 2 , mb:2, textAlign:'center'}}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="From"
                        value={range.from.value}
                        onChange={(newValue) => {
                            dateAdded(newValue,'from');
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{m:1}}
                        minDate={moment()}
                        inputFormat="DD/MM/YYYY"
                    />
                </LocalizationProvider>
                <Divider  
                    variant="inset" 
                    component="span" 
                    sx={{display:{xs:'block', md:'inline'}, m:1, borderColor:'#fff'}}
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="To"
                        value={range.to.value}
                        onChange={(newValue) => {
                            dateAdded(newValue, 'to');
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={moment(range.from.value)}
                        inputFormat="DD/MM/YYYY"
                    />
                </LocalizationProvider>
            </Container>
        </React.Fragment>
      );
}

export default RangeDatePicker;