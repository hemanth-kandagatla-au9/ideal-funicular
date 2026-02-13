import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { validateUser } from "../../utils/AuthUtils.js";
import { updateLocalTokens } from "../../utils/TokenUtils";
import { cookies } from "../../utils/utils";
import { UI_TEXTS } from "../../components/common/Constants/label-contants.js";

function LoginLayout() {
  const [accessToken, setAccessToken] = useState(UI_TEXTS.TOKENS.LOADING_TOKEN);

  useEffect(() => {
    document.title = `${config.appName} -Login`;
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const token = params.get(UI_TEXTS.TOKENS.TOKEN) || cookies.get(UI_TEXTS.TOKENS.TOKEN);
    const userId = params.get("userId");
    const refreshToken = params.get(UI_TEXTS.TOKENS.REFRESH_TOKEN) || cookies.get(UI_TEXTS.TOKENS.REFRESH_TOKEN);
    if (!token || token === "undefined") {
      setAccessToken(null);
    }
    if (token !== "bm8tYWNjZXNzLXRva2Vu") {
      setAccessToken(token);
    }
    if (refreshToken && refreshToken.length > 0) {
      updateLocalTokens(token, refreshToken);
    }
    validateUser(token, userId);
  }, []);

  return <div style={{ display: "none" }}>{accessToken}</div>;
}

export default LoginLayout;
