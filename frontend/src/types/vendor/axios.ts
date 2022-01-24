import { Method } from "axios";
// Method pode ser get, post  e etc...
export type AxiosParams = {
    method?: Method;
    url: string;
    data?: object;
    params?: object;
  };
  