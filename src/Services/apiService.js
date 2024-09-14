import axios from "axios";
import { getAllSessions, getAllUnitsSessionDetails, getBarCode, getProductDetails } from "../Mock/responses";
import { BarchartSessions, DayWiseSession, drop_down_config, perforationChartMock, PieChartData, units, weightChart } from "../Mock/dashboard";

export const Endpoint = {
  LOGIN: "/auth/login/",
  
  GET_ALL_PRODUCTS: "/product/all",
  GET_ALL_VARIANTS: "/product/{product_id}/variant/all",
  GET_VARIANT_INFO: "/product/{product_id}/variant/{variant_id}/info",
  START_ANALYZE_UNIT: "/qc-session/unit/{unit_id}/refresh",
  GET_CAMERA_DETAILS: "/qc-session/{session_id}/cam",
  
  ADD_BATCH_CODE: "/product/variant/{variant_id}/property",
  UPDATE_MANUAL_ANALYSIS: "/qc-session/unit-analysis/{unit_id}/detection-value",
  END_SESSION: "/qc-session/{qc_session_id}/submit",
  GET_ALL_SESSIONS: "/qc-session/all",
  GET_ALL_UNITS_SESSION: "/qc-session/{session_id}",
  CREATE_SESSION: "/qc-session/",
  ANALYZE_CLD_BARCODE :"/qc-session/analyse/cld-barcode",
  GET_RESULT_CLD_BARCODE : "/qc-session/analyse/cld-barcode/result",
  GET_DETAILS_BY_BARCODE :"/product/cld-barcode/",
  START_ANALYZE_SESSION : "/qc-session/unit-analysis/{session_id}/refresh",

  // Dash Endpoints

  GET_UNITS_DASHBOARD :"/dash/session-verdict",
  GET_OPTIONS_DASHBOARD :"/dash/option",
  GET_DAY_WISE_SESSION : "/dash/day-session",
  GET_BAR_CHART_SESSIONS : "/dash/product-session",
  GET_PERFORATION_DASHBOARD : "/dash/perforation",
  GET_WEIGHT_DASHBOARD : "/dash/weight",
  // GET_DOWNLOAD_DASHBOARD :"/dash/defect",
  GET_DOWNLOAD_DASHBOARD :"/dash/qc-session/all"
};

class ApiService {
  constructor() {
    if (new.target === ApiService) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  async isLoggedIn() {}

  async login() {}

  async get() {}

  async post() {}

  async patch() {}
}

class Production extends ApiService {
  #host;
  constructor() {
    super();
    this.#host = process.env.REACT_APP_API_URL_PREFIX.length === 0 ? "http://localhost:8000/api/v1":process.env.REACT_APP_API_URL_PREFIX;
    console.log('the host is ',process.env.REACT_APP_API_URL_PREFIX.length)
  }

  async isLoggedIn() {
    if (
      localStorage.getItem("token") === null &&
      sessionStorage.getItem("token") === null
    )
      return false;
    return true;
  }

  async login(user, pwd) {
    try {
      const res = await axios.post(
        `${this.#host}${Endpoint.LOGIN}`,
        { username: user, password: pwd },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      console.log(res);
      localStorage.setItem("token", res.data.access_token);
      return res;
    } catch (e) {
      console.log(e);
      return { status: e.response.status, data: e.response.data.detail };
    }
  }

  async get(endpoint,payload) {
    try {
      const res = await axios.get(`${this.#host}${endpoint}`, {
        params: payload ?? {},
        // headers: this.#getHeaders(),
      });
      return res;
    } catch (e) {
      console.log(e)
      console.log(e.response)
      return e.response
    }
  }

  async post(endpoint, payload) {
    try {
      const res = await axios.post(`${this.#host}${endpoint}`, payload, {
        // params: payload ?? {},
        headers: this.#getHeaders(),
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  async patch(endpoint,payload) {
    try {
      const res = await axios.patch(
        `${this.#host}${endpoint}`,
          payload,
        {
          // params: payload ?? {},
          headers: this.#getHeaders(),
        }
      );
      return res;
    } catch (e) {
      return e;
      //    console.error(e);
    }
  }

  #getHeaders() {
    return {
      Authorization: `Bearer ${
        localStorage.getItem("token") !== null
          ? localStorage.getItem("token")
          : sessionStorage.getItem("token")
      }`,
    };
  }
}

class Mock extends ApiService {
  #tokenType;
  #data;
  #counter; 

  constructor(){
    super();
    this.#counter = 0;
  }

  async isLoggedIn() {
    if (
      localStorage.getItem("token") === null &&
      sessionStorage.getItem("token") === null
    )
      return false;
    return true;
  }

  async login(user, pwd) {
    try {
      let res;
      if (user === "tester@email.com" && pwd === "somerandom") {
        // console.log(res)
        res = {
          status: 200,
          access_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzAzNjIzMzQwfQ.lZJpCK6uL9TOErtffrwzwnc_q2wdAZNTqVRz46UrOyg",
          token_type: "bearer",
        };
        localStorage.setItem("token", res.access_token);
      } else {
        res = {
          status: 401,
        };
      }
      return res;
    } catch (e) {
      console.log(e);
      return { status: e.response.status, data: e.response.data.detail };
    }
  }

  // async login(user, pwd) {
  //   await new Promise((r) => setTimeout(r, 3e1));
  //   this.#tokenType = tokenType;
  //   //tokenType True means use Localstorage else session storage
  //   if (tokenType) {
  //     localStorage.setItem("token", "token");
  //   } else {
  //     sessionStorage.setItem("token", "token");
  //   }
  //   return {
  //     status: 200,
  //     access_token:
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzAzNjIzMzQwfQ.lZJpCK6uL9TOErtffrwzwnc_q2wdAZNTqVRz46UrOyg",
  //     token_type: "bearer",
  //   };
  // }

  async logout() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    return true;
  }

  async get(endpoint, payload) {
    console.log(endpoint)
    try {
      if (/^\/product\/cld-barcode\/$/.test(endpoint)) {
        console.log("hello")
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: getProductDetails, status: 200 };
      }
      else if (/^\/qc-session\/all\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: getAllSessions, status: 200 };
      }
      else if (/^\/qc-session\/\d+\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: getAllUnitsSessionDetails, status: 200 };
      }
      else if (/^\/dash\/option\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: drop_down_config, status: 200 };
      }
      else if (/^\/dash\/session-verdict\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: units, status: 200 };
      }
      else if (/^\/dash\/day-session\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: DayWiseSession, status: 200 };
      }
      else if (/^\/dash\/product-session\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: BarchartSessions, status: 200 };
      }else if (/^\/dash\/defect\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: PieChartData, status: 200 };
      }
      else if (/^\/dash\/perforation\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: perforationChartMock, status: 200 };
      }
      else if (/^\/dash\/weight\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: weightChart, status: 200 };
      }
      // else if (/^\/dash\/day-session\/?$/.test(endpoint)) {
      //   await new Promise((r) => setTimeout(r, 3e1));
      //   console.log(units)
      //   return { data: DayWiseSession, status: 200 };
      // }
      // qc-session/analyze/cld-barcode/result
      else if (/^\/qc-session\/analyse\/cld-barcode\/result$/.test(endpoint)){
        console.log(getBarCode)
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(this.#counter)
        this.#counter += 1;
        if(this.#counter === 3){
          this.#counter = 0 ;
          return { data: getBarCode, status: 200 };
        }
        return { data: getBarCode, status: 425 };
      }
      
    } catch (e) {
      console.error(e);
    }
  }

  async post(endpoint, payload) {
    console.log(endpoint)
    try {
      console.log(endpoint)
      if (/^\/qc-session\/analyse\/cld-barcode$/.test(endpoint)) {
        return { data: {data:1}, status: 201 };
      }
      else if (/^\/qc-session\/$/.test(endpoint)) {
        return { data: {data:18}, status: 201 };
      }
      // /product/variant/{variant_id}/property
      else if (/^\/product\/variant\/\d+\/property$/.test(endpoint)){
        return { data: {data:18}, status: 201 };
      }
      
      // return res;
    } catch (e) {
      console.error(e);
    }
  }

  async patch(endpoint) {
    try {
      // /qc-session/unit-analysis/{session_id}/refresh
      if (/^\/qc-session\/unit-analysis\/\d+\/refresh$/.test(endpoint)) {
        return { data: {data:1}, status: 205 };
      }
    } catch (e) {
        return e
    //    console.error(e);
    }
  }

//   #getHeaders() {
//     return {
//       Authorization: `Bearer ${
//         localStorage.getItem("token") !== null
//           ? localStorage.getItem("token")
//           : sessionStorage.getItem("token")
//       }`,
//     };
//   }
}

export const apiService = process.env.REACT_APP_STATE === "PRODUCTION" ? new Production() : new Mock();