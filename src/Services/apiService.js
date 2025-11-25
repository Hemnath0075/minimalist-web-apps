import axios from "axios";
import { dsiData, getAllPcroProducts, getAllSessions, getAllUnitsSessionDetails, getBarCode, getProductDetails } from "../Mock/responses";
import { XFilled } from "@ant-design/icons";
import { BarchartSessions, DayWiseSession, drop_down_config, perforationChartMock, PieChartData, units, weightChart } from "../Mock/dashboard";
import { getAllMachines, getAllUsers, getMachineTableProperities, getProductTableProperities, getUserTableProperities, getAllProducts } from "../Mock/admin_responses";
import history from "../";
import { customHistory } from "../history";



export const Endpoint = {
  LOGIN: "/auth/signin",


  // GET ALL SESSIONS 
  GET_ALL_SESSIONS: "/pipeline-session/all?limit=50&sort=1",

  GET_SESSION_OUTPUTS: "/pipeline-session/{id}?overview=0",


  // CREATE SESSION
  CREATE_SESSION: "/pipeline-session/new",

  CREATE_MANUAL_OUTPUT: "/pipeline-session-output/new?manual=0",

  CREATE_AUTOMATIC_OUTPUT: "/pipeline-session-output/new?manual=1&property_key={property_key}",

  // GET_CLD_ANAYSIS_RESULTS : "/pipeline-session/{session_id}",

  // GENERAL PROPERTIES

  GET_ALL_GENERAL_PROPERTIES: "/general-property/all",

  ADD_GENERAL_PROPERTY: "/general-property/new",

  START_ANALYZE_SESSION: "/pipeline-session-output-unit?unit_id={unit_id}",


  // GET VARIANT DETAILS

  GET_VARIANT_DETAILS: "/pipeline-input/{id}",

  GET_ALL_USERS: "/users/all",

  GET_ALL_DEVICES: "/device/all",

  GET_ALL_VARIANT_DETAILS: "/pipeline-input/all",


  // PIPELINE INPUT

  GET_PIPELINE_INPUT: "/pipeline-input/{pipeline_input_id}",

  GET_ALL_UNITS_SESSION: "/pipeline-session/{session_id}?overview=0",

  UPDATE_MANUAL_ANALYSIS: "/pipeline-session-output-unit/?unit_id={unit_id}",

  END_SESSION: "/general-property/{id}/update",

  // ADMINISTRATION

  GET_FORM_FIELDS: "/admin/form-fields/{form_factor}",

  CREATE_USER: "/users",

  CREATE_MACHINE: "/admin/machine",

  DELETE_USER: "/users/{username}",

  UPDATE_USER: "/users/{username}",

  UPLOAD_USER_BULK: "/users/bulk",

  DELETE_MACHINE: "/device/{device_id}",

  UPDATE_MACHINE: "/device/{device_id}",

  UPLOAD_MACHINE_BULK: "/admin/machine/bulk",

  CREATE_PRODUCT: "/admin/product",

  DELETE_PRODUCT: "/admin/product/{product_id}",

  UPDATE_PRODUCT: "/admin/product/{product_id}",

  UPLOAD_PRODUCT_BULK: "/admin/product/bulk",

  
  // CREATE PIPELINE SESSION OUTPUT UNIT

  CREATE_PIPELINE_SESSION_OUTPUT_UNIT: "/pipeline-session-output-unit/new",

  GET_PIPELINE_SESSION_OUTPUT : "/pipeline-session-output-unit/all?pipeline_session_output_id={pipeline_session_output_id}",

  RESET_PIPELINE_SESSION_OUTPUT: "/pipeline-session-output-unit/all?pipeline_session_output_id={pipeline_session_output_id}&output_key={output_key}"
};

class ApiService {
  constructor() {
    if (new.target === ApiService) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  async isLoggedIn() { }

  async login() { }

  async get() { }

  async post() { }

  async patch() { }
}

class Production extends ApiService {
  #host;
  #ramanapihost;
  constructor() {
    super();
    this.#host = process.env.REACT_APP_API_URL_PREFIX.length === 0 ? "http://localhost:8000/v1" : process.env.REACT_APP_API_URL_PREFIX;
    this.#ramanapihost = process.env.REACT_APP_API_URL_PREFIX.length
    console.log('the host is ', process.env.REACT_APP_API_URL_PREFIX.length)
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
      );
      // console.log(res);
      localStorage.setItem("token", res.data.access_token);
      return res;
    } catch (e) {
      console.log(e);
      return { status: e.response.status, data: e.response.data.detail };
    }
  }

  async getRamanAnalysis(endpoint, payload) {
    try {
      const res = await axios.get(`${this.#ramanapihost}${endpoint}`, {
        params: payload ?? {},
        headers: this.#getHeaders(),
      });
      return res;
    }
    catch (e) {
      console.log(e)
      console.log(e.response)
      return e.response
    }
  }

  async get(endpoint, payload) {
  try {
    const res = await axios.get(`${this.#host}${endpoint}`, {
      params: payload ?? {},
      headers: this.#getHeaders(),
    });
    return res;
  } catch (e) {
    console.log(e);
    // Network-level errors (no response from server)
    if (e.response) {
        return { status: e.response.status, data: e.response.data.detail };
      } else {
        customHistory.push("/");
        return { status: 401, data: "UnAuthorized" };
      }
  }
}

  async post(endpoint, payload, params = {}) {
    try {
      const res = await axios.post(
        `${this.#host}${endpoint}`,
        payload, // request body
        {
          params, // query parameters
          headers: this.#getHeaders(),
        }
      );
      return res;
    } catch (e) {
    console.log(e);
    // Network-level errors (no response from server)
    if (e.response) {
        return { status: e.response.status, data: e.response.data.detail };
      } else {
        customHistory.push("/");
        return { status: 401, data: "UnAuthorized" };
      }
  }
  }

  async uploadFile(endpoint, formData, params = {}) {
    try {
      const res = await axios.post(
        `${this.#host}${endpoint}`,
        formData, // request body
        {
          headers: {'Content-Type': 'multipart/form-data',...this.#getHeaders()},
        }
      );
      return res;
    } catch (e) {
      console.error(e);
      return e.response;
    }
  }

  async put(endpoint, payload, params = {}) {
    try {
      const res = await axios.put(
        `${this.#host}${endpoint}`,
        payload, // request body
        {
          params, // query parameters
          headers: this.#getHeaders(),
        }
      );
      return res;
    } catch (e) {
    console.log(e);
    // Network-level errors (no response from server)
    if (e.response) {
        return { status: e.response.status, data: e.response.data.detail };
      } else {
        customHistory.push("/");
        return { status: 401, data: "UnAuthorized" };
      }
  }
  }

  async delete(endpoint, payload, params = {}) {
    try {
      const res = await axios.delete(`${this.#host}${endpoint}`, {
        params: payload ?? {},
        headers: this.#getHeaders(),
      });
      return res;
    } catch (e) {
      console.log(e)
      console.log(e.response)
      return e.response
    }
  }

  async uploadFiles(endpoint, payload) {
    try {
      const res = await axios.post(`${this.#host}${endpoint}`, payload, {
        // params: payload ?? {},
        headers: { ...this.#getHeaders(), ...{ 'Content-Type': 'multipart/form-data' } },
      });
      return res;
    } catch (e) {
      console.error(e);
      return e.response
    }
  }

  async patch(endpoint, payload) {
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
    console.log(e);
    // Network-level errors (no response from server)
    if (e.response) {
        return { status: e.response.status, data: e.response.data.detail };
      } else {
        customHistory.push("/");
        return { status: 401, data: "UnAuthorized" };
      }
  }
  }

  #getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token") !== null
          ? localStorage.getItem("token")
          : sessionStorage.getItem("token")
        }`,
    };
  }
}



export const apiService =
  process.env.REACT_APP_STATE === "PRODUCTION" ? new Production() : new Mock();


  class Mock extends ApiService {
  #tokenType;
  #data;
  #counter;

  constructor() {
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

  async getRamanAnalysis(endpoint, payload) {
    try {
      return { "message": "success" };
    }
    catch (e) {
      console.log(e)
      console.log(e.response)
      return e.response
    }
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
      else if (/^\/qc-session\/recent\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: getAllSessions, status: 200 };
      }
      else if (/^\/qc-session\/pcro\/available-variants\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        return { data: getAllPcroProducts, status: 200 };
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
      else if (/^\/dash\/dsi-data\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: dsiData, status: 200 };
      }
      else if (/^\/dash\/product-session\/?$/.test(endpoint)) {
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(units)
        return { data: BarchartSessions, status: 200 };
      } else if (/^\/dash\/defect\/?$/.test(endpoint)) {
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
      else if (/^\/property-description\/machines?$/.test(endpoint)) {
        // console.log("admin columns")
        return { data: getMachineTableProperities, status: 200 }
      }
      else if (/^\/property-description\/users?$/.test(endpoint)) {
        // console.log("admin columns")
        return { data: getUserTableProperities, status: 200 }
      }
      else if (/^\/property-description\/products?$/.test(endpoint)) {
        // console.log("admin columns")
        return { data: getProductTableProperities, status: 200 }
      }
      else if (/^\/users?$/.test(endpoint)) {
        console.log("admin columns")
        return { data: getAllUsers, status: 200 }
      }
      else if (/^\/product\/properties?$/.test(endpoint)) {
        // console.log("admin columns")
        return { data: getAllProducts, status: 200 }
      }
      else if (/^\/machine\/device?$/.test(endpoint)) {
        // console.log("admin columns")
        return { data: getAllMachines, status: 200 }
      }
      // else if (/^\/dash\/day-session\/?$/.test(endpoint)) {
      //   await new Promise((r) => setTimeout(r, 3e1));
      //   console.log(units)
      //   return { data: DayWiseSession, status: 200 };
      // }
      // qc-session/analyze/cld-barcode/result
      else if (/^\/qc-session\/analyse\/cld-barcode\/result$/.test(endpoint)) {
        console.log(getBarCode)
        await new Promise((r) => setTimeout(r, 3e1));
        console.log(this.#counter)
        this.#counter += 1;
        if (this.#counter === 3) {
          this.#counter = 0;
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
        return { data: { data: 1 }, status: 201 };
      }
      else if (/^\/qc-session\/$/.test(endpoint)) {
        return { data: { data: 18 }, status: 201 };
      }
      // /product/variant/{variant_id}/property
      else if (/^\/product\/variant\/\d+\/property$/.test(endpoint)) {
        return { data: { data: 18 }, status: 201 };
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
        return { data: { data: 1 }, status: 205 };
      }
    } catch (e) {
      return e
      //    console.error(e);
    }
  }

  #getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token") !== null
          ? localStorage.getItem("token")
          : sessionStorage.getItem("token")
        }`,
    };
  }
}