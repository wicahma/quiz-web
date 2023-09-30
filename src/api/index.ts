import f from "axios";

interface IfetchParam {
  url: string;
  body?: Object;
  params?: String;
  headers?: any;
}

class Fetcher {
  status: number = 0;
  data: any = null;

  public get isOK(): boolean {
    if (this.status == 0) {
      return true;
    }
    return false;
  }

  constructor() {
    f.defaults.headers.common["Content-Type"] = "application/json";
    f.defaults.headers.common["Accept"] = "application/json";
    f.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_API;
  }

  getData = async ({ url, params, headers }: IfetchParam) => {
    const res = await f.get(`${url}${params ? `?${params}` : ""}`, {
      headers: headers,
    });
    this.status = res.data.response_code ?? 0;
    this.data = res.data ?? null;
    return res;
  };

  postData = async ({ url, body, headers }: IfetchParam) => {
    const res = await f.post(`${url}`, body, {
      headers: headers,
    });
    this.status = res.data.response_code ?? 0;
    this.data = res.data ?? null;
    return res;
  };
}

export default Fetcher;
