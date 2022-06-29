import axios from "axios";
import React, { useRef, useEffect } from "react";

export default function Paypal({ seats, movePlayTime }) {
    console.log('eea',seats,movePlayTime)
    const paypal = useRef();
    useEffect(() => {
        let token = window.sessionStorage.getItem('token');
        let userId = window.sessionStorage.getItem('userId');
        let config = {
            headers: {
                'x-access-token': token
            }
        };
        let ticketApi = "http://localhost:3000/api/tickets/create"
        let paymentApi = "http://localhost:3000/api/payments/create"
        let grossApi = "http://localhost:9000/api/gross/put"
        
        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "Payment for tickets",
                                amount: {
                                    currency_code: "USD",
                                    value: 650.0,
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order);
                    let tickets = [];
                    for await (let i of seats) {
                        let dataTicket = {
                            userId: userId,
                            moviePlayTimeId: movePlayTime.id,
                            seatId: i
                        }
                        await axios.post(ticketApi, dataTicket, config).then(res => {
                            if (res.data) {
                                tickets.push(res.data.data.id);
                            }
                        }).catch(err => {
                            alert(err);
                        })
                         let updateSeats = `http://localhost:3000/api/seats/update/${i}`

                        await axios.put(updateSeats, {status: true }, config).then(res => {
                            if (res.data) {
                                console.log('update success')
                            }
                        }).catch(err => {
                            alert(err);
                        });
                    }
                    let dataPayment = {
                        "ticketIds": tickets,
                        "amount": 650,
                        "transactionId": order.id,
                        "paymentMethod": "paypal"
                    }
                    let movieApi = `http://localhost:3000/api/movies/${movePlayTime.movieId}`
                    await axios.get(movieApi,config).then(async movie =>{
                         movie = movie.data.data;
                         console.log(movie);
                        await axios.post(paymentApi, dataPayment, config).then(async res => {
                            if (res.data) {
                                await axios.put(grossApi, {
                                    tickets: tickets.length,
                                    revenue: dataPayment.amount,
                                    title: movie.title
                                }, config).then(result => {
                                    if (result.data) {
                                       alert("payment success");
                                       
                                    }
                                }).catch(err => {
                                    alert(err);
                                })
                               alert("payment success");
                               
                            }
                        }).catch(err => {
                            alert(err);
                        })
                    })
                     
                },
                onError: (err) => {
                    console.log(err);
                },
            })
            .render(paypal.current);
    }, []);

    return (
        <div ref={paypal} />
    );
}