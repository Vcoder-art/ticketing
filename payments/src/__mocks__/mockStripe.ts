export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockImplementation(
        (data: { amount: number; currency: string; source: string }) => {
          return new Promise((res, rej) => {
            res({
              success: "payment",
            });
          });
        }
      ),
  },
};
