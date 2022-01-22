import {createConnection, getRepository} from "typeorm";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from "../utils/middleware"
import {User} from "../entity/User";
//NOT USED !!!!!!!
/* const userRepository = getRepository(User); */

export const saveUser: RequestHandler = async (req, res, next) => {
  const { name, surname, username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await getRepository(User).create({ name: name, surname: surname, username: username, password: hashedPassword })
  console.log(user);
  await getRepository(User).save(user)
  /* const result = await getRepository(User).save() */
  //save method returns an instance of the same object you pass to it. It's not a new copy of the object, it modifies its "id" and returns it.
  next();

}


export const checkUser: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body
  const users = await getRepository(User).find()
  console.log(users)
  next();
  /* await createConnection().then(async connection => {
    const userRepository = await connection.getRepository(User);
    const user = await userRepository.findOne({username: username});
  if (!user) {
    req.flash('error', 'User not found!')
    return res.redirect('login')
  }
  try {
    //if user exists in database, then compare the given info with the one in db. in other words, check if the password is correct with bcrypt compare. 
      if (await user.username === username && await bcrypt.compare(password, user.password)) {
        //after username & password correction, generate token for the user for specified minutes.
        const name = { name: username }
        //generate jwt token.
        const accessToken = await generateAccessToken(name)
        //jwt token generated and sent to client as cookie.
        res.cookie("token", accessToken, { httpOnly: true, sameSite: "strict" });
        //username added into session info.
        req.session.username = user.username;
        req.flash('success', 'Successfully logged in!')
        res.redirect('users')
      } else {
        req.flash('error', 'Wrong username or password!')
        return res.redirect('login')
      }
  
    } catch (e) {
      req.flash('error', 'Sorry, something went wrong while loggin in!')
      res.redirect('login')
    }}).catch(e => console.log(e)) */
}



/* 
export class UserController {

    private userRepository = getRepository(Shirts);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

} */