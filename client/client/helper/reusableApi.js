import axios from "axios";

export default ({ req }) => {
  if (req) {
    return axios.create({
      baseURL: "http://my-ingress-nginx-controller.default.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "",
    });
  }
};
