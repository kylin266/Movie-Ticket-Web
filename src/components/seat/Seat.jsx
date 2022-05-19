import React, { useRef } from 'react';
import './Seat.css';
import { TextField, Stack, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from "axios";
import logo from './Home.png'
import Typography from '@mui/material/Typography';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { useParams } from 'react-router-dom';
import Paypal from '../Paypal';

export default function Seat() {
    let { movePlayTimeId } = useParams();
    const [data, setData] = useState([]);
    const [playtime, setPlayTime] = useState({});
    const [isMounted, setMounted] = useState(true)
    const [movie, setMovie] = useState({});
    const [hall, setHall] = useState({});
    const [checkout, setCheckout] = useState(false);
    const [chosen,setChosen] = useState([]);
    const [chosenSeats,setSeats] = useState([]);
    let seats = [];

    useEffect(() => {


        let movePlayTimeApi = `http://localhost:3000/api/movie_playtimes/${movePlayTimeId}`;
        let token = window.sessionStorage.getItem('token');
        let config = {
            headers: {
                'x-access-token': token
            }
        };
        (async () => {
            await axios.get(movePlayTimeApi, config).then(async res => {
                if (res.data) {
                    if (isMounted) {
                        let playtime = res.data.data;
                        setPlayTime(playtime);
                        setHall(res.data.data.hall)
                        let hallApi = `http://localhost:3000/api/seats?hall=${playtime.hallId}`;
                        let movieApi = `http://localhost:3000/api/movies/${playtime.movieId}`;
                        await axios.get(movieApi, config).then(async res => {
                            if (res.data) {
                                if (isMounted) {
                                    setMovie(res.data.data);
                                }
                            }
                        }).catch(err => {
                            alert(err);
                            setMounted(false);
                        })

                        await axios.get(hallApi, config).then(async res => {
                            if (res.data) {
                                if (isMounted) {
                                    setData(res.data.data);
                                }
                            }
                        }).catch(err => {
                            alert(err);
                            setMounted(false);
                        })
                    }
                }
            }).catch(err => {
                alert(err);
                setMounted(false);
            })

            setMounted(false);


        })()


    }, []);
    return (
        <div className='homeContainer'>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div style={{ "display": "flex" }}>
                <Card className="movieCard" sx={{ minWidth: 400 }}>
                    <CardMedia
                        style={{
                            "width": '100%',
                            "height": '100%'
                        }}
                        component="img"
                        height="194"
                        image={movie.poster_path}
                        alt="Paella dish"
                    />
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {movie.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {movie.tagline}
                        </Typography>
                        <b>IMDB: </b> <i>{movie.vote_average}</i>
                    </CardContent>
                </Card>
                <Card className="seatCard" sx={{ minWidth: 400 }} >
                    <Typography variant="h2" component="div" style={{
                        "textAlign": "center",
                        "marginTop": "20px"
                    }}>
                        Các vị trí còn trống trong phòng chiếu
                    </Typography>
                    <Grid container style={{ marginTop: "40px" }}>
                        {data.map((value, key) => {

                            return !value.status ? (
                                <Grid key={key} item xs={6} sm={4} md={2}>
                                    <Button style={{
                                        "height": "100px",
                                        "width": "100px",
                                        "marginBot": "20px",
                                        "color": "blue"
                                    }} variant="outlined" onClick={(e) => {
                                        if (e.target.style.color == "blue") {
                                            e.target.style.color = "green";
                                            let dataE = chosen;
                                            dataE.push(value.id);
                                            let dataName = chosenSeats;
                                            dataName.push(value.seatNumber);

                                            setSeats([...dataName]);
                                            setChosen([...dataE]);
                                        }
                                        else if (e.target.style.color == "green") {
                                            e.target.style.color = "blue";     
                                            let dataE = chosen;
                                            let index = dataE.indexOf(value.id)
                                            dataE.splice(index, 1)
                                            let dataName = chosenSeats;
                                            let indexx = dataName.indexOf(value.seatNumber);
                                            dataName.splice(index, 1);
                                            setSeats([...dataName]);
                                            setChosen([...dataE]);
                                        }
                                    }}><EventSeatIcon />{value.seatNumber}</Button>
                                </Grid>) : (
                                <Grid key={key} item xs={6} sm={4} md={2}>
                                    <Button style={{
                                        "height": "100px",
                                        "width": "100px",
                                        "marginBot": "20px",
                                        "color": "red"
                                    }} variant="outlined" disabled><EventSeatIcon />{value.seatNumber}</Button>
                                </Grid>)

                        })}
                    </Grid>
                    <Card style={{ marginTop: "40px", flex: 1 }} sx={{ minWidth: 400 }} >
                    <Typography variant="h5" component="div" style={{
                            "textAlign": "center",
                            "marginTop": "20px"
                        }}>
                            Các ghế đã chọn: {chosenSeats.join(",").toString()}
                        </Typography>
                        <Typography variant="h5" component="div" style={{
                            "textAlign": "center",
                            "marginTop": "20px"
                        }}>
                            Thông tin phòng chiếu
                        </Typography>
                        <Typography variant="h5" component="div" style={{
                            "textAlign": "center",
                            "marginTop": "20px"
                        }}>
                            Tên phòng chiếu: {hall.name}
                        </Typography>
                        <Typography variant="h5" component="div" style={{
                            "textAlign": "center",
                            "marginTop": "20px"
                        }}>
                            Số chỗ ngồi: {hall.totalSeat}
                        </Typography>
                        <Typography variant="h4" component="div" style={{
                            "textAlign": "center",
                            "marginTop": "20px",
                            "fontStyle": "italic"
                        }}>
                            (Ghế đỏ là ghế đã được đặt / Ghế xanh là ghế còn trống)
                        </Typography>
                    </Card>
                    {checkout ?  <Paypal seats={chosen} movePlayTime={playtime} />
                        :
                        <Button style={{
                            "height": "50px",
                            "width": "200px",
                            "marginTop": "40px",
                        }} variant="outlined" onClick={() => {
                            setCheckout(true);
                        }}><CreditCardIcon />Thanh toán</Button>
                    }
                </Card>

            </div>

        </div>
    )
}