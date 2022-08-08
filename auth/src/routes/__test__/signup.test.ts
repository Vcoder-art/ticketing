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

it("return 201 status it signup sucessfully", async () => {
    return request(app)
        .post("/api/signup")
        .send({
            email: "dummy332@gmail.com",
            password:"wgwigwgegf"
        })
        .expect(201)
});

it("return 400 status this is a invalid email", async ()=>{
     await request(app)
     .post("/api/signup")
     .send({
        email : "kjwhwfgwegfwgf",
        password : "lofjweiofweohf"
     })
     .expect(400)
})

it("return 400 status  this is invalid email password",async ()=>{
    await utility("/api/signup","vssdfdfdf","p",400)
})

it("return 400 status any passwor and email is not filled",async ()=>{
    await utility("/api/signup","vishalsahu012@gmail.com","",400);
    await utility("/api/signup","","fwefweffwefew",400)
})

it("disallow duplicate email values",async()=>{
    await utility("/api/signup","vishalsahu012@gmail.com","hamilton",201)
    await utility("/api/signup","vishalsahu012@gmail.com","hamilton",400)
})

it("sets the cookie in response header",async ()=>{
    const response = await utility("/api/signup","vishalsahu012@gmail.com","hamilton",201)
    expect(response.get('Set-Cookie')).toBeDefined();
})