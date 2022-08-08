import { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import Stripe from "react-stripe-checkout";
import Router from "next/router";
const OrderShow = ({ order, currentUser }) => {
  const [time, setTime] = useState("");

  const [doRequest, errors] = useRequest({
    url: "/api/payments/",
    method: "post",
    body: {
      orderID: order.id,
    },
    onSuccess: (obj) => Router.push("/orders"),
  });

  useEffect(() => {
    console.log(order);
    const timer = () => {
      let time = new Date(order.expiresAt) - new Date();
      time = Math.round(time / 1000);
      setTime(time);
    };
    timer();
    const clear = setInterval(timer, 1000);

    return () => {
      clearInterval(clear);
    };
  }, []);

  const template = ({ message, order }) => {
    return (
      <div
        className="shadow p-3  bg-white rounded text-center"
        style={{
          width: "30%",
          height: "50%",
          marginLeft: "35%",
          marginTop: "10%",
        }}
      >
        <h1>time left to pay is {message}</h1>
        <h3>
          Title : <span>{order.ticket.title}</span>
        </h3>

        <h3>
          Price : <span>{order.ticket.price}</span>
        </h3>

        {message !== "expires" && (
          <Stripe
            amount={order.ticket.price * 100}
            email={currentUser.email}
            token={(token) => doRequest({ token: token.id })}
            stripeKey="pk_test_51I1ZEBCSi1YywohrjC97fU3COOcJL1N6e3hmnUOrj3zcf1RB8k8ECFfRfEzc7FsgZNHFG6ZwZqmDNieWnmyS0JqA002pbeP22R"
          ></Stripe>
        )}
        {errors}
      </div>
    );
  };

  if (time < 0) {
    return <div>{template({ message: "expires", order })}</div>;
  }

  return <>{template({ message: time, order })}</>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderID } = context.query;
  const { data } = await client.get(`/api/orders/${orderID}`);
  return { order: data };
};

export default OrderShow;
