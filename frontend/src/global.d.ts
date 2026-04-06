interface Window {
  __HOST_GET_TOKEN__?: () => Promise<string | null>;
  __HOST_GET_ID_TOKEN__?: () => Promise<string | null>;
}
