import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/Header";
import buildClient from "../helper/reusableApi";
import "../styles/globals.css";

function MyApp({ Component, pageProps, currentUser }) {
  // console.log(pageProps)
  return (
    <>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async function (object) {
  const client = buildClient(object.ctx);
  const { data } = await client.get("/api/currentUser");

  let pageProps = {};

  if (object.Component.getInitialProps) {
    pageProps = await object.Component.getInitialProps(
      object.ctx,
      client,
      data
    );
  }

  // console.log(pageProps);
  return {
    pageProps,
    currentUser: data.currentUser,
  };
};
export default MyApp;
