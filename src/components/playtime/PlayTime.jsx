import React from 'react';
import './PlayTime.css';
import { TextField, Stack, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from "axios";
import logo from './Home.png'
import Typography from '@mui/material/Typography';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {Link} from 'react-router-dom';
import { useParams } from 'react-router-dom';
export default function PlayTime() {
    let { movieId } = useParams();
    const [data, setData] = useState([]);
    const [movie, setMovie] = useState({});
    const [isMounted, setMounted] = useState(true)
    useEffect(() => {


        let movieApi = `http://localhost:3000/api/movies/${movieId}`;
        let api = `http://localhost:3000/api/movie_playtimes?movie=${movieId}`;
        let token = window.sessionStorage.getItem('token');
        let config = {
            headers: {
                'x-access-token': token
            }
        };
        (async () => {
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

            await axios.get(api, config).then(async res => {
                if (res.data) {
                    if (isMounted) {
                        setData(res.data.data);
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
                <Card className="playTimeCard" sx={{ minWidth: 400 }} >
                    <Typography variant="h2" component="div" style={{
                        "textAlign" : "center",
                        "marginTop" : "20px"
                    }}>
                        Các suất chiếu hiện có của phim
                    </Typography>
                    <Grid container>
                        {data.map((value, key) => {
                            return (
                                <Link key={key} to={"/seats/" + value.id}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button style={{
                                        "height" : "200px",
                                        "width" : "200px",
                                        "margin": '30px'
                                    }} variant="outlined"><AccessTimeIcon />{value.startTime} - <AccessTimeIcon />{value.endTime}</Button>
                                </Grid>
                                </Link>
                            )
                        })}
                    </Grid>
                </Card>
            </div>

        </div>
    )
}