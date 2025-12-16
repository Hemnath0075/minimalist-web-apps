import axios from "axios";
import { customHistory } from "../history";



export const Endpoint = {
  LOGIN: "/auth/signin",

  ANALYTICS: "/analytics/cumulative-count?start_time={start_time}&end_time={end_time}&output_key=detected",

  // GET ALL SESSIONS 
  GET_ALL_SESSIONS: "/pipeline-session/all?limit=50&sort=1",

  GET_SESSION_OUTPUTS: "/pipeline-session/{id}?overview=0",

  GET_SESSION_DATA: "/pipeline-session/all?overview=0&sort=1&start_date={start_time}&end_date={end_time}",


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



export const apiService = new Production();
