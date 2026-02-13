import React from "react";

import { Container, TextField, Button, Box } from "@mui/material";
import { useMsal } from '@azure/msal-react';
import "./authStyles.css"
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

const Unauthorized = () => {
    const { instance } = useMsal();

    const handleLogoutRedirect = async () => {

        instance
            .logoutRedirect({
                postLogoutRedirectUri: "/logout",
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="expired-container">
            <div className="item-align">
                <h1 className="color-401">401</h1>
                <h1>{UI_TEXTS.PERMISSIONS.UN_AUTHORIZED_TEXT}</h1>
                <p>{UI_TEXTS.PERMISSIONS.NO_ACCESS_TO_THIS_PAGE}
                </p>
            </div>

        </div>
    );
};

export default Unauthorized;
