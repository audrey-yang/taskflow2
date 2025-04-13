import axios from "axios";
import * as authService from "./auth-service";

export const getPrivateData = async () => {
  const result = await axios.get("http://localhost:3000/private", {
    headers: {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    },
  });
  return result.data;
};
