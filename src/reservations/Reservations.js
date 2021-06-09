import React, { useEffect, useState } from 'react';

import { DogReservation } from "../interfaces/dogreservation";
import { CalendarEvent } from "../interfaces/calendarevent";

import { Link } from "react-router-dom";
import RevoCalendar from 'revo-calendar';
import Container from './components/container';


const Reservations = () => {
    const [reservations, setReservations] = useState([]);

    // Returns days between s and e as array
    var getDaysArray = function (s, e) { for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };


    useEffect(() => {
        (
            async () => {
                const response = await fetch('http://localhost:8000/api/dog-reservations');

                const data = await response.json();
                let parsedData = [];
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
                console.log(parsedData);

                setReservations(parsedData);
            }
        )();
    }, []);

    return <div>
        <Container triggerText="Open" />
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
        />
    </div>
}
export default Reservations;
