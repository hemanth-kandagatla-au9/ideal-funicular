interface Window {
  __POWERED_BY_HOST__?: boolean;
  __REMOTE_NAME__?: string;
  __HOST_APP__?: boolean;
  __HOST_GET_TOKEN__?: () => Promise<string | null>;
  __HOST_GET_ID_TOKEN__?: () => Promise<string | null>;
  __POWERED_BY_IASPHERE__?: boolean;
  __INSIGHTS_CONFIG_SHIM__?: {
    ENV: string;
    INSIGHTS_ENABLED: boolean;
  };
  __WF_NAVIGATE__?: (input: string | { pathname: string; search?: string; state?: any }) => void;
  __HOST_GET_INSIGHTS_TOKEN__?: () => Promise<string | null>;
  __INSIGHTS_AUTH__?: {
    idToken: string | null;
    accessToken: string | null;
  };
  __REDUX_STORE__?: Store<any, any>;
}
