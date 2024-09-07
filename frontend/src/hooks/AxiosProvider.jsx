import axios from "axios"
import { baseUrl } from "../config/baseurl";
import Cookies from "js-cookie";

const authToken = Cookies.get("authToken");

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
});

export default AxiosInstance;