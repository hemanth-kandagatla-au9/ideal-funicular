import Cookies from "universal-cookie";
const cookies = new Cookies();

export const getUsernameFromCookies = () => cookies.get("username");
