import axios from "axios";

export const api = axios.create({
    baseURL: "https://apptfinder-h7gdacd5g9fwagdb.brazilsouth-01.azurewebsites.net/api/",
    headers: { 
        'X-API-KEY': import.meta.env.VITE_API_KEY
    }
})