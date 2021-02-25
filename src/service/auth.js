import axios from "axios";

const baseUrl = "https://api.piseth.me/v1";

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("ACCESS_TOKEN");

const handleError = (e) => {
  console.error(e.response);
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
  const res = await tryCatch(axios.get("/users/me"));
  console.log(res);

  return res;
};

export const login = async (form) => {
  const res = await tryCatch(axios.post("/auth/login", form));

  if (!hasError(res)) setToken(res);

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
  if (!hasError(res)) {
  } // set success message
};

export const resetPassword = async ({ query, password }) => {
  const res = await tryCatch(
    axios.post("/auth/reset-password" + query, { password })
  );
  if (!hasError(res)) {
  } // set success message
};

export const randomize = async (form) => {
  const res = await tryCatch(axios.post("/randomizer", form));
  if (!hasError(res)) return res;
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
  };

  return await randomize(payload);
};

export const saveRandomizer = async (randomizerId) => {
  const res = await tryCatch(axios.patch(`/randomizer/${randomizerId}`));
};
