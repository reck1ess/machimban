import fetch from "isomorphic-unfetch";

const updateOptions = options => {
  const update = { ...options };
  update.headers = {
    ...update.headers,
    "Content-Type": "application/json"
  };
  return update;
};

export default async function(...args) {
  const res = await fetch(...args, updateOptions());
  return res.json();
}
