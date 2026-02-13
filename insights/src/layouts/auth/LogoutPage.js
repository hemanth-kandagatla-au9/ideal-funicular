import React from "react";
import "../../layouts/auth/authStyles.css"
import logoutlogo from '../../assets/images/Insightslogo.png'
import Button from '../../components/common/Button/Button'
import { UI_TEXTS } from "../../components/common/Constants/label-contants";


const LogoutPage = () => {

    return (
        <div className="expired-container">
            <div className="item-align">
                <img src={logoutlogo} alt="timeout" width="610px"
                    height="auto"></img>
                <h3>{UI_TEXTS.MESSAGES.LOG_OUT_SUCCESS}
                </h3>
                <Button type="primary" onClick={() => {
                    window.location.href = '/signin';
                }}>
                    {UI_TEXTS.TEXTS.LOGIN}
                </Button>
            </div>

        </div>
    );
};

export default LogoutPage;
