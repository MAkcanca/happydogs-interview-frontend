import React, { useEffect, useState } from 'react';

import { DogReservation } from "../interfaces/dogreservation";
import { Link } from "react-router-dom";
import RevoCalendar from 'revo-calendar';


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
                    (r: DogReservation) => {
                        getDaysArray(r.start_date, r.end_date).forEach(element => {
                            parsedData.push(
                                {
                                    name: r.dog,
                                    allDay: true,
                                    date: element
                                }
                            )
                        });
                    }
                )
                setReservations(parsedData);
            }
        )();
    }, []);

    return <RevoCalendar
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
}
