import useRequest from "../../hooks/useRequest";
import router from "next/router";

const Show = ({ ticket }) => {
  const [doRequest, errors] = useRequest({
    url: "/api/orders/",
    method: "post",
    body: {
      ticketID: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderID]", `/orders/${order.id}`),
  });

  const createOrder = () => {
    doRequest();
  };

  return (
    <div
      className="shadow p-3  bg-white rounded "
      style={{
        width: "30%",
        height: "50%",
        marginLeft: "35%",
        marginTop: "10%",
      }}
    >
      <div className="container text-center">
        <h1>Title</h1>
        <h3>{ticket.title}</h3>
        <h1>Price</h1>
        <h3>{ticket.price}</h3>
        <button className="btn btn-primary" onClick={createOrder}>
          Create Order
        </button>
        <div className="mt-5">{errors}</div>
      </div>
    </div>
  );
};

Show.getInitialProps = async (context, client) => {
  const { ticketID } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketID}`);
  return { ticket: data };
};

export default Show;
