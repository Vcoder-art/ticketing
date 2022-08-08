import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home({ currentUser, tickets }) {
  const card = ({ header, title, price, id }) => {
    return (
      <div className="m-2" key={id}>
        <div
          className="card text-white bg-light mb-3 text-center"
          style={{ maxWidth: "18rem" }}
        >
          <div className="card-header" style={{ color: "black" }}>
            {header}
          </div>
          <div className="card-body">
            <h5 className="card-title" style={{ color: "black" }}>
              {title}
            </h5>
            <p className="card-text" style={{ color: "black" }}>
              price : {price}
            </p>
            <Link href="/tickets/[ticketID]" as={`/tickets/${id}`}>
              <a>
                <button className="btn btn-primary">Checkout</button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* {currentUser ? (
        <h1>You are signed In yet </h1>
      ) : (
        <h1>you are not signed in yet</h1>
      )} */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          texAlign: "center",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {tickets.map((ticket) => {
          return card({
            header: "ticket",
            title: ticket.title,
            price: ticket.price,
            id: ticket.id,
          });
        })}
      </div>
    </div>
  );
}

Home.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};
