import React, { useEffect, useState } from 'react';

import { DogReservation } from "../interfaces/dogreservation";
import { CalendarEvent } from "../interfaces/calendarevent";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';


import { Link } from "react-router-dom";
import RevoCalendar from 'revo-calendar';
import SimpleDialog from './components/simple_dialog';


const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [formVisible, setFormVisible] = useState(true)
    const [selectedDate, setSelectedDate] = useState()

    // Returns days between s and e as array
    var getDaysArray = function (s, e) { for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };

    const addEvent = (params) => {
        setFormVisible(true)
    }

    const handleClose = (value) => {
        setFormVisible(false);
        (async () => fetchData())();
    };
    const handleDate = (params) => {
        // TODO: There is this weird bug with month? +1 required
        setSelectedDate(`${params.month + 1}/${params.day}/${params.year}`);
        (async () => fetchData())();
    }

    const fetchData = async () => {
        await fetch('http://localhost:8000/api/dog-reservations')
            .then(response => {
                return response.json();
            })
            .then((data) => {
                var parsedData = [];
                data.map(
                    (r) => {
                        var daysArray = getDaysArray(new Date(r.start_date), new Date(r.end_date));
                        console.log(daysArray)
                        daysArray.forEach(element => {
                            parsedData.push(
                                {
                                    name: r.dog_name,
                                    allDay: true,
                                    date: element
                                }
                            )
                        });
                    }
                )

                setReservations(parsedData);
            });
    }

    useEffect(() => {
        (async () => fetchData())();
    }, []);

    return <div>
        <SimpleDialog open={formVisible} onClose={handleClose} selectedValue={selectedDate} />
        <Box component="span">
            <Button variant="contained" style={{ float: 'right', marginBottom: "10px" }} onClick={addEvent} color="primary">
                Make boarding
        </Button>
        </Box>
        <RevoCalendar
            events={reservations}
            style={{
                height: '35em'
            }}
            primaryColor="rgba(254,221,17,0.32)"
            secondaryColor="#fff"
            todayColor="rgba(255,155,17,0.32)"
            sidebarDefault={false}
            allowDeleteEvent={false}
            addEvent={addEvent}
            dateSelected={handleDate}
            detailDateFormat={'MM/DD/YYYY'}
        />
    </div >
}
export default Reservations;
