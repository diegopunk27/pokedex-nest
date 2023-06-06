import { Injectable } from "@nestjs/common";
import { HttpInterface } from "../Interfaces/http-interface";
import axios, {AxiosInstance} from "axios";

@Injectable()
export class HttpAxiosAdapter implements HttpInterface{

    private axios:AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        const {data} = await this.axios.get(url);
        return data;
    }

}