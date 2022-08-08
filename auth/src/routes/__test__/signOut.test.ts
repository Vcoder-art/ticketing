import  request from "supertest"
import {app} from "../../app"

const utility =(url:string,expect:number)=>{
    return request(app)
      .post(url)
      .send({})
      .expect(expect)
  
  }

it("clear the cookie in session-cookie ",async ()=>{
    await request(app)
    .post("/api/signup")
    .send({
        email:"vishalsahu012@gmail.com",
        password:"wffwefwe"
    })
    .expect(201)

   const res= await utility("/api/signout",200)
   expect(res.get("Set-Cookie")[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
})