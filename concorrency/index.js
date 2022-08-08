const axios = require("axios");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const cookie =
  "session=eyJqc29uV2ViVG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WkdKak1tRmtOamhqTldObU5tVmpZVGt3TVRWbU5DSXNJbVZ0WVdsc0lqb2lkbWx6YUdGc2MyRm9kVEF4TWtCbmJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5UZzFOamswT0RWOS50MTMxV19UdnFUSGZHcHY5QWVPWnBKRGROek5LODctbWE3TE9Ra19lVWx3In0=";

async function start() {
  const { data } = await axios.post(
    "https://ticketing.dev/api/tickets",
    {
      title: "baby first",
      price: 5,
    },
    {
      headers: { cookie },
    }
  );

  const { data: updatedData } = await axios.put(
    "https://ticketing.dev/api/tickets/" + data.id,
    {
      title: "baby first",
      price: 10,
    },
    {
      headers: { cookie },
    }
  );

  const { data: updatedData2 } = await axios.put(
    "https://ticketing.dev/api/tickets/" + data.id,
    {
      title: "baby first",
      price: 15,
    },
    {
      headers: { cookie },
    }
  );
}

for (let i = 0; i < 500; i++) {
  start().then((res) => console.log("request complete"));
}
