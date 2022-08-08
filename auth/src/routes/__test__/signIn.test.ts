import { app } from "../../app";
import request from "supertest"

const utility =(url:string,email:string,password:string,expect:number)=>{
    return request(app)
      .post(url)
      .send({
         email ,
         password
      })
      .expect(expect)
  
  }

it("status 400 invalid email",async ()=>{
    await utility("/api/signin","vishalsahu012@gmail.com","fwefefwe",400);
})


it("status 400 invalid password",async ()=>{
    await utility("/api/signup","vishalsahu012@gmail.com","fwefefwe",201);
    await utility("/api/signin","vishalsahu012@gmail.com","ewfefef",400);
})

it("status 200 compelete sigin process",async ()=>{
    await utility("/api/signup","vishalsahu012@gmail.com","fwefefwe",201);
    const response =await utility("/api/signin","vishalsahu012@gmail.com","fwefefwe",200);
    expect(response.get("Set-Cookie")).toBeDefined();
})