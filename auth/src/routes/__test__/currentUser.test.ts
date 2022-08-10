import {app} from "../../app"
import request from "supertest"
import {getCookie} from "../../test/getCookie"

it("this is current user",async ()=>{


  const cookie= await getCookie();

  const response = await request(app)
  .get("/api/currentUser")
  .set("Cookie",cookie)
  .send()
  .expect(200)

  console.log(response.body);
})

it("this is not current User",async ()=>{
  const response = await request(app)
  .get("/api/currentUser")
  .send()
  .expect(200)

  expect(response.body.currentUser).toEqual(null)

})