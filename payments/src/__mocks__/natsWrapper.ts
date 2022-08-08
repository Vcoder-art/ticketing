export const nats = {
  getClient: {
    publish: jest
      .fn()
      .mockImplementation(function (
        subject: string,
        data: string,
        callback: () => void
      ) {
        callback();
      }),
  },
};
