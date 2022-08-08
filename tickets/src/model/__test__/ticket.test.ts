import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create a new ticket

  const ticket = Ticket.build({
    title: "concert",
    price: 455,
    userId: "khhfiohfiodhsfiohsdh",
  });

  // save the ticket

  await ticket.save();

  // fetch the ticket twice

  const ticketCopy1 = await Ticket.findById(ticket.id);
  const ticketCopy2 = await Ticket.findById(ticket.id);

  // make the seprate changes to each of them

  ticketCopy1!.set({ title: "we are legend" });
  ticketCopy2!.set({ title: "never give up" });

  // save the first ticket with version increment
  await ticketCopy1!.save();

  console.log(ticketCopy1);

  // second ticket save with error

  try {
    await ticketCopy2!.save();
  } catch (err) {
    return;
  }

  throw new Error("This is unReachable code");
});

it("increment the version no on every single save", async () => {
  const ticket = Ticket.build({
    title: "we are legends now",
    userId: "dfowpfjww",
    price: 3434,
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
