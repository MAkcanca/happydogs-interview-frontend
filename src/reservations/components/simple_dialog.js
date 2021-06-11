import React, { useEffect, useState } from 'react';
import 'date-fns';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [first, setFirst] = useState()
    const [last, setLast] = useState()
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error")

    useEffect(() => {
        if (selectedValue) {
            setSelectedStartDate(new Date(selectedValue))
            console.log(selectedStartDate);
        }
    }, [selectedValue])

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleSubmit = async (params) => {
        var currDate = new Date().setHours(0, 0, 0, 0)
        var modifiedStartDate = `${selectedStartDate.getMonth() + 1}/${selectedStartDate.getDate()}/${selectedStartDate.getFullYear()}`
        if (selectedStartDate > selectedEndDate) {
            setErrorMessage("Please choose the start and end date accordingly")
            setShowError(true);
            return;
        }
        if (selectedStartDate < currDate) {
            setErrorMessage("Please choose the start and end date accordingly")
            setShowError(true);
            return;
        }
        const responseDog = await fetch('http://localhost:8000/api/dogs/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: first,
                last_name: last
            })
        });
        responseDog.json().then(async (data) => {
            console.log(selectedStartDate.toISOString().slice(0, 10));
            await fetch('http://localhost:8000/api/dog-reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_date: modifiedStartDate,
                    end_date: selectedEndDate.toLocaleDateString("en-US", { year: "numeric", day: "numeric", month: "numeric", timeZone: 'UTC' }),
                    dog: data.id
                })
            });
        });

        handleClose();
    }


    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
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
