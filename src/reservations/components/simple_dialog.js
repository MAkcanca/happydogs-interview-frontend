import React, { useEffect, useState } from 'react';
import 'date-fns';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [first, setFirst] = useState()
    const [last, setLast] = useState()
    const [selectedStartDate, setSelectedStartDate] = useState()
    const [selectedEndDate, setSelectedEndDate] = useState()

    useEffect(() => {
        if (selectedValue) {
            setSelectedStartDate(new Date(selectedValue))
        }
    }, [selectedValue])

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleSubmit = async (params) => {
        const responseDog = await fetch('http://localhost:8000/api/dogs/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: first,
                last_name: last
            })
        });
        responseDog.json().then(async (data) => {
            await fetch('http://localhost:8000/api/dog-reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_date: selectedStartDate.toISOString().slice(0, 10),
                    end_date: selectedEndDate.toISOString().slice(0, 10),
                    dog: data.id
                })
            });
        });

    }


    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Make an appointment</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Welcome to HappyDogs!<br />Please fill the form below and your reservation will be completed.
                </DialogContentText>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Start Date"
                            value={selectedStartDate}
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="End Date"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
                <TextField
                    autoFocus
                    margin="dense"
                    id="first_name"
                    label="First name"
                    type="text"
                    fullWidth
                    onChange={e => setFirst(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="last_name"
                    label="Last name"
                    type="text"
                    fullWidth
                    onChange={e => setLast(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Complete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SimpleDialog;
