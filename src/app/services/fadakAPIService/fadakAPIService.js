/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * a custom authentication service which has some methods that used in fuse Auth component and login.actions
 */

import axios from "axios";
import FuseUtils from "@fuse/FuseUtils";
import { SERVER_URL } from "../../../configs";

class fadakAPIService extends FuseUtils.EventEmitter {
  init() {
    this.setAxiosInterceptors();
    return this.authentication();
  }

  setAxiosInterceptors() {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise(() => {
          if (!err.response || err.response.status === 401)
            this.setSession(null);
          throw err;
        });
      }
    );
  }

  isTokenValid = () => {
    const token = this.getApiKey();

    return token && token.length === 40;
  };

  authentication = () => {
    const token = this.getApiKey();
    if (!token || token.length !== 40) this.logout();
    this.emit("autoLogin");
  };

  signIn = (username, password) => {
    return new Promise((resolve, reject) => {
      axios
        .get(SERVER_URL + "/rest/api_key", {
          headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
          },
        })
        .then((response) => {
          if (response.data) {
            this.setSession(response.data);
            resolve(this.getUserData());
          } else reject(response.data.error);
        })
        .catch((e) => reject(e));
    });
  };

  setSession(token) {
    if (token) {
      window.localStorage.setItem("api_key", token);
      axios.defaults.headers.common["api_key"] = token;
      axios.defaults.headers.common["Authorization"] =
        window.localStorage.getItem("Authorization");
    } else {
      window.localStorage.removeItem("api_key");
      window.localStorage.removeItem("Authorization");
      delete axios.defaults.headers.common["api_key"];
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  logout = () => {
    this.setSession(null);
  };

  getUserData = () => {
    if (this.isTokenValid() === false) return this.logout();
    return new Promise((resolve, reject) => {
      axios
        .get(SERVER_URL + "/rest/s1/fadak/getUser", {
          headers: {
            api_key: this.getApiKey(),
          },
        })
        .then((response) => {
          response = response.data.allUserData;

          const userInfo = {
            from: "fadak",
            data: {
              dataLoaded: true,
              // displayName: response.data.userFullName,
              // displayName: "admin",
              email: response?.data?.emailAddress,
              // email: "admin@fadak.com",
              userId: response?.data?.userId,
              partyId: response?.data?.partyId,
              partyRelationshipId: response?.data?.partyRelationshipId,
              username: response?.data?.username,
              ownerPartyId:response?.data?.ownerPartyId
            },
            role: response?.roles,
          };

          resolve(userInfo);
        });
    });
  };

  getApiKey() {
    return window.localStorage.getItem("api_key");
  }

  getPermisionList() {
    return new Promise((resolve, reject) => {
      var config = {
        method: "get",
        url: `${SERVER_URL}/rest/s1/security/permisionList`,
        headers: { api_key: localStorage.getItem("api_key") },
      };

      axios(config)
        .then((res) => {
          resolve(res.data.dicit);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const obj = new fadakAPIService();

export default obj;
