const POLL_INTERVAL_MS = 100;
const POLL_TIMEOUT_MS = 8000;

interface TokenPair {
  accessToken: string;
  idToken: string | null;
}

const waitForBridge = (): Promise<boolean> => {
  return new Promise(resolve => {
    if (typeof window.__HOST_GET_TOKEN__ === "function") {
      resolve(true);
      return;
    }

    const start = Date.now();
    const poll = setInterval(() => {
      if (typeof window.__HOST_GET_TOKEN__ === "function") {
        clearInterval(poll);
        resolve(true);
        return;
      }
      if (Date.now() - start >= POLL_TIMEOUT_MS) {
        clearInterval(poll);
        console.error(
          `[Auth tokenService] window.__HOST_GET_TOKEN__ not found after ${POLL_TIMEOUT_MS / 1000}s. ` + "Ensure host has called initTokenBridge() before loading this remote.",
        );
        resolve(false);
      }
    }, POLL_INTERVAL_MS);
  });
};

const getTokensFromBridge = async (): Promise<TokenPair | null> => {
  const bridgeReady = await waitForBridge();
  if (!bridgeReady) return null;

  try {
    const [accessToken, idToken] = await Promise.all([window.__HOST_GET_TOKEN__?.(), window.__HOST_GET_ID_TOKEN__?.()]);

    if (!accessToken) {
      console.error("[Auth tokenService] tokenBridge returned empty access token");
      return null;
    }

    return { accessToken, idToken: idToken ?? null };
  } catch (err) {
    console.error("[Auth tokenService] tokenBridge call failed:", err);
    return null;
  }
};

export const getTokens = (): Promise<TokenPair | null> => getTokensFromBridge();

export const getAccessToken = async (): Promise<string | null> => {
  const tokens = await getTokensFromBridge();
  return tokens?.accessToken ?? null;
};

export const getIdToken = async (): Promise<string | null> => {
  const tokens = await getTokensFromBridge();
  return tokens?.idToken ?? null;
};
