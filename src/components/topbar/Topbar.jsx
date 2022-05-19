import React from 'react'
import "./Topbar.css"
import { NotificationsNone } from '@material-ui/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from './906341.png'
export default function Topbar(props) {
    const token = props.token || {};
    return (
        <div className="topbar">
            <div className="topbarWrapper">

                <div className="topLeft">
                    <h3 className="textLogo">
                      <a href="../">BHD Galaxy</a>
                    </h3>
                    <h1><b>Hệ thống đặt vé xem phim</b></h1>
                </div>
                <div className="topRight">
                    <div className="topbarIcons">
{/* 
                            <h2 style={{marginRight:"20px"}}>
                                Chào, {token.split(",")[0]}
                            </h2> */}
                        <div className="wrap-icon">
                            <FacebookIcon />

                        </div>
                        <div className="wrap-icon">
                            <TelegramIcon />

                        </div>
                        <div className="wrap-icon">
                            <InstagramIcon />

                        </div>
                        <button onClick={() => {
                            window.sessionStorage.clear();
                            window.location.reload(false);
                        }} className="btn-logout">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
