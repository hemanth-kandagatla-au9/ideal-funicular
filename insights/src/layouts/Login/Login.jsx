import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Container, TextField, Button, Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { loginRequest } from "../../utils/msalAuthConfig.js";
import {
  authAction,
  loginActionInsight,
} from "../../services/configurations/configService.js";
import { getUsernameFromCookies } from "../../utils/cookieUtility.js";
import { UI_TEXTS } from "../../components/common/Constants/label-contants.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { instance } = useMsal();

  const handleLoginRedirect = async () => {
    setIsLoading(true);
    try {
      await instance.initialize();
      // First check for any pending redirects
      const response = await instance.handleRedirectPromise();
      console.log("response==========>", response);
      if (response) {
        // Handle successful redirect response
        const { idToken, accessToken } = response;
        sessionStorage.setItem("msal_id_token", idToken);

        const loginPayload = {
          action: "login",
          accessToken: accessToken,
        };
        console.log("loginPayload=============>", loginPayload);
        await loginActionInsight(loginPayload);
        // await authAction(loginPayload);
      } else {
        // No pending redirect, initiate new login
        await instance.loginRedirect({
          ...loginRequest,
          redirectStartPage: window.location.href,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("process.env?.ENABLE_SSO=====>", process.env?.ENABLE_SSO);
    // Only attempt auto-login if SSO is enabled
    if (process.env?.ENABLE_SSO) {
      handleLoginRedirect();
    }
  }, []); // Empty dependency array to run only once on mount

  const handleFormLogin = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("user_fullname", username);
    sessionStorage.setItem("user_ipAddress", "27.0.0.1");
    history.push("/dashboard");
  };

  if (!process.env?.ENABLE_SSO) {
    const storedUsername = getUsernameFromCookies();
    if (storedUsername) {
      history.push("/dashboard");
      return null;
    }

    return (
      <Container component="main" maxWidth="xs" style={{ background: "white" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 className="">{UI_TEXTS.HEADINGS.LOGIN_PAGE}</h2>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <TextField
              variant="outlined"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              placeholder="Enter Username"
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormLogin}
              sx={{ marginTop: 2 }}
            >
              {UI_TEXTS.TEXTS.LOGIN}
            </Button>
          </Box>
        </div>
      </Container>
    );
  }

  // For SSO, show loading state
  return (
    <Container component="main" maxWidth="xs" style={{ background: "white" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {isLoading ? (
          <p>{UI_TEXTS.LOADING.REDIRECT_TO_LOGIN}</p>
        ) : (
          <p>{UI_TEXTS.LOADING.AUTHENTICATION_IN_PROGRESS}</p>
        )}
      </Box>
    </Container>
  );
};

export default Login;
