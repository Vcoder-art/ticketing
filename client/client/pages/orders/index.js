const ShowTickets = ({ orders }) => {
  console.log(orders);
  return (
    <div className="container shadow p-3  bg-white rounded m-5">
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>OrderID</th>
            <th>Status</th>
            <th>Ticket Title</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>{order.ticket.title}</td>
                <td>{order.ticket.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ShowTickets.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders/");
  return { orders: data };
};

export default ShowTickets;
