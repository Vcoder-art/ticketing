import React from "react";
import axios from "axios";

class TicketCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      price: "",
      error: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async onSubmit(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/tickets", {
        title: this.state.title,
        price: this.state.price,
      });
      this.setState({ error: "" });
      console.log(data);
    } catch (err) {
      this.setState({
        error: (
          <div className="alert alert-danger mt-5">
            <h4>Oops..</h4>
            <ul className="my-0">
              {err.response.data.errors.map((error) => (
                <li key={error.message}>{error.message}</li>
              ))}
            </ul>
          </div>
        ),
      });
    }
  }

  onBlur(e) {
    const value = parseFloat(this.state.price);
    this.setState({ price: value.toFixed(2) });
  }

  render() {
    return (
      <>
        <div className="shadow p-3 mb-5 bg-white rounded m-5">
          <form className="container" onSubmit={this.onSubmit}>
            <h1>Create an Ticket</h1>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                onChange={this.onChange}
                name="title"
                value={this.state.title}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                onChange={this.onChange}
                name="price"
                onBlur={this.onBlur}
                value={this.state.price}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Save
            </button>
            {this.state.error}
          </form>
        </div>
      </>
    );
  }
}

export default TicketCreate;
