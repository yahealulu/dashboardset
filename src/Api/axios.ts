import Axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from 'axios'
  import { toast } from 'react-toastify';

  export const  imgUrl = 'https://setalkel.amjadshbib.com/public'
  const axios: AxiosInstance = Axios.create({
    baseURL: "https://setalkel.amjadshbib.com/api/",
    // baseURL: "http://127.0.0.1:8001/api/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  axios.interceptors.request.use((config) => {

   if(localStorage.getItem("adminToken")){
    config.headers.Authorization = "Bearer " + localStorage.getItem("adminToken");


   }


    return config;
  });
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.message === 'Network Error') {
        toast.error('Check your internet connection')
      } else if (+error?.response?.status === 404) {
        //404
        toast.error("The requested data hasn't been found")
        // notFound();
      } else if (+error?.response?.status === 401) {
        //401
        // toast.error('You have no permission to access this data')
        localStorage.clear()
        window.location.replace('/login')
        // if (typeof window !== 'undefined') window.location.replace('/login') //redirect("/login");
      } else if (+error?.response?.status === 403) {
        //403
        toast.error('Accessing this data is forbidden')
        // localStorage.setItem('adminToken', '')
        // window.location.replace('/login')
        // if (typeof window !== 'undefined') window.location.replace('/')
      } else if (+error?.response?.status === 500) {
        //500
        toast.error(error?.response?.data?.message)
      } else if (+error?.response?.status === 422) {
        //422
        toast.error(error?.response?.data?.message)
      } else toast.error('Unknown error occurred')
      return Promise.reject(error)
    },
  )

  export default axios
