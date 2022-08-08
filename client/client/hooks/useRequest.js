import { useState } from "react";
import axios from "axios";

function useRequest({ url, method, body, onSuccess }) {
  const [erros, setErros] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErros(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErros(
        <div className="alert alert-danger">
          <h4>Oops..</h4>
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [doRequest, erros];
}

export default useRequest;
