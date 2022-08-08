import client, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get getClient() {
    if (!this._client) {
      throw new Error("client is not connected yet");
    }

    return this._client;
  }

  connect(clusterID: string, clientID: string, url: string): Promise<void> {
    this._client = client.connect(clusterID, clientID, { url });

    this._client.on("close", () => {
      console.log("nats is shutdown sucessfully");
      process.exit();
    });

    process.on("SIGINT", () => {
      console.log("sigint");
      nats.getClient.close();
    });
    process.on("SIGTERM", () => {
      console.log("sigterm");
      nats.getClient.close();
    });

    return new Promise((resolve, reject) => {
      this.getClient.on("connect", () => {
        console.log("NATS STREAMING SERVER CONNECTED");
        resolve();
      });

      this.getClient.on("error", () => {
        reject();
      });
    });
  }
}

export const nats = new NatsWrapper();
