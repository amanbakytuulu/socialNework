import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function SettingLayout({title, children}) {

    const navigate = useNavigate();
    
    return (
        <div className="settingLayout">
            <div className="container">
                <div className="box mt-5 px-0 py-0 is-rounded m-5">
                    <section className="hero is-link">
                        <div className="hero-body px-4 py-5">
                            <span class="icon-text has-text-weight-semibold is-size-5">
                                <a href="#" onClick={()=>navigate(-1)}>
                                    <span class="icon">
                                        <ArrowBackIcon />
                                    </span>
                                </a>
                                <span className="ml-4 ">{title}</span>
                            </span>
                        </div>
                    </section>
                    <section className="section">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default SettingLayout