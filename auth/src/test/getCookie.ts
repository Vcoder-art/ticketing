import {app} from "../app"
import request from "supertest"

const getCookie=async ()=>{
    const email = "vishalsahu012@gmail.com";
    const password = "fpvbjerhgerhg"

    const signupResponse = await request(app)
    .post("/api/signup")
    .send({
        email,
        password
    })
    .expect(201)

    const cookie = signupResponse.get("Set-Cookie");

    return cookie;
}

export {getCookie}