import { baseUrl } from "../constants";
function CreateConfig(url) {
  return {
    baseURL: url,
  };
}
export const URL = baseUrl;

export const axiosConfigOptions = CreateConfig(URL);

