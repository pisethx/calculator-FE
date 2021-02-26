import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://api.piseth.me/v1";

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("ACCESS_TOKEN");

const handleError = (e, defaultMessage) => {
  const { message, code } = e.response?.data;
  const error = defaultMessage ?? `Error ${code}: ${message}`;
  console.error(e.response);
  toast.error(error);
};

const handleSuccess = (defaultMessage) => {
  toast.success(defaultMessage);
};

const hasError = (res) => {
  return res.error;
};

const tryCatch = (cb) => {
  return cb
    .then(({ data }) => ({ ...data, error: false }))
    .catch((e) => {
      handleError(e);
      return { error: true };
    });
};

const setToken = ({ users, tokens }) => {
  localStorage.setItem("ACCESS_TOKEN", tokens.access.token);
  localStorage.setItem("REFRESH_TOKEN", tokens.refresh.token);

  axios.defaults.headers.common["Authorization"] =
    "Bearer " + tokens.access.token;
};

export const getUser = async () => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (!token) return;

  const res = await tryCatch(axios.get("/users/me"));
  if (!hasError(res)) return res;
};

export const login = async (form) => {
  const res = await tryCatch(axios.post("/auth/login", form));

  if (!hasError(res)) {
    setToken(res);
    handleSuccess("Welcome back!");
  }

  return res;
};

export const signup = async (form) => {
  const res = await tryCatch(axios.post("/auth/register", form));
  if (!hasError(res)) setToken(res);
};

export const logout = async (form) => {
  const res = await tryCatch(
    axios.post("/auth/logout", {
      refreshToken: localStorage.getItem("REFRESH_TOKEN"),
    })
  );

  localStorage.clear();
};

export const forgotPassword = async (form) => {
  const res = await tryCatch(axios.post("/auth/forgot-password", form));
  if (!hasError(res))
    handleSuccess("Reset Passowrd Link has been sent to " + form.email);
};

export const resetPassword = async ({ query, password }) => {
  const res = await tryCatch(
    axios.post("/auth/reset-password" + query, { password })
  );
  if (!hasError(res)) handleSuccess("Password reset Successfully");

  return res;
};

export const randomize = async (form) => {
  const res = await tryCatch(axios.post("/randomizer", form));
  if (!hasError(res)) return res;

  return {};
};

const getRandomizerType = (type) => {
  if (type === "team-generator") return "group";
  if (type === "custom-list") return "custom";

  return "individual";
};

export const onSubmitRandomizer = async (randomizer) => {
  const { dataset, type, quantity } = randomizer;

  const payload = {
    type: getRandomizerType(type),
    dataset: dataset.split("\n").filter((ds) => ds !== ""),
    quantity,
    name: type,
  };

  return await randomize(payload);
};

export const saveRandomizer = async (randomizerId) => {
  const res = await tryCatch(axios.patch(`/randomizer/${randomizerId}`));

  if (!hasError(res)) handleSuccess("Randomizer Saved Successfully.");
};

export const getRandomizer = async () => {
  const res = await tryCatch(axios.get("/randomizer/me"));

  if (!hasError(res)) return res?.results;
};

export const exportRandomzier = async () => {
  axios
    .get(`/randomizer/me/export `, {
      responseType: "blob",
    })
    .then((response) => {
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "random.xls");
      document.body.appendChild(fileLink);

      fileLink.click();
    })
    .catch(handleError);
};
