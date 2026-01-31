import ApiService from "./ApiService";
import { axiosPublic, axiosPrivate } from "./axios";

export const publicApi = new ApiService(axiosPublic);
export const privateApi = new ApiService(axiosPrivate);
