import React from 'react';
import './Home.css';
import { TextField, Stack, Button, Card, CardContent, CardMedia , Grid} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from "axios";
import logo from './Home.png'
import {Link} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
export default function Home() {
    const [data,setData] = useState([]);
    const [isMounted,setMounted] = useState(true)
    const [searchtext,setSearchText] = useState('');
    useEffect(()=>{
        let api = 'http://localhost:3000/api/movies/get';
        let token = window.sessionStorage.getItem('token');
        let config = {
            headers: {
                'x-access-token': token
            }
        };
        (async ()=>{
            await axios.get(api,config).then(async res=>{
                if (res.data){
                    if (isMounted){
                        setData(res.data.data);
                        setMounted(false);
                    }
                }
            }).catch(err =>{
                setMounted(false);
            })
        })()
    },[]);
    return (
        <div className='homeContainer'>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <Stack direction="row" spacing={2}>
                <TextField
                    className='searchBar'
                    id="outlined-helperText"
                    label="General Search"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{
                        marginLeft: "20px",
                    }}
                    value={searchtext}
                    onChange={(e)=>setSearchText(e.target.value)}
                    defaultValue={searchtext}
                    placeholder="Search for movies by name"
                    variant="standard"
                />
                <Button onClick={async ()=>{
                      let token = window.sessionStorage.getItem('token');
                      let config = {
                          headers: {
                              'x-access-token': token
                          }
                      };
                      let api = `http://localhost:3000/api/movies?title=${searchtext}`
                       await axios.get(api,config).then(async res=>{
                        if (res.data){
                            let result = [];
                            result.push(res.data.data)
                                setData(result);
                        }
                    }).catch(err =>{
                        setMounted(false);
                    })
                }} ><SearchIcon /></Button>
            </Stack>
            <Grid container>
            {data && data.length>0 && data.map((value, key)=>{
                    return (
                    <Grid  key={key} item xs={12} sm={6} md={4}>
                        <Card className="movieCard" sx={{ minWidth: 400 }}>
                        <CardMedia
                            style={{
                                "width":'100%',
                                "height": '100%'
                            }}
                            component="img"
                            height="194"
                            image={value.poster_path}
                            alt="Paella dish"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {value.title}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {value.tagline}
                            </Typography>
                            <b>IMDB: </b> <i>{value.vote_average}</i>
                            <Link to={"/movie_playtimes/" + value.id}>
                            <Button><ConfirmationNumberIcon /> Ấn vào đây để đặt vé xem phim</Button>
                            </Link>
                        </CardContent>
                    </Card>
                    </Grid>
                    )
            })}
            </Grid>
        </div>
    )
}