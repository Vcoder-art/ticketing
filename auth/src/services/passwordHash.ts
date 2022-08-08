import {randomBytes,scrypt} from "crypto"
import {promisify} from "util";
const asyncScrypt = promisify(scrypt)
export class Password{

  static async toHash(password:string):Promise<string>{
    const salt=randomBytes(8).toString("hex");
    const hash = (await asyncScrypt(password,salt,64)) as Buffer;

    return `${hash.toString("hex")}.${salt}`
  }

  static async toCompare(savedPassword:string,supplyPassword:string):Promise<boolean>{
     const [hashPassword,salt] = savedPassword.split(".");
     const hash = (await asyncScrypt(supplyPassword,salt,64)) as Buffer;

     return hash.toString("hex") == hashPassword;
  }
}