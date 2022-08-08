import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";

export default () => {
  const [doRequest] = useRequest({
    url: "/api/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest().then((res) => {
      // console.log(res)
    });
  }, []);

  return (
    <>
      <h1>You are sign out</h1>
    </>
  );
};
