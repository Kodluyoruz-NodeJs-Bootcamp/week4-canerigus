import { RequestHandler } from "express";
import { ExpressError } from "../utils/ErrorHandler";
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from "../utils/middleware"
import {getRepository} from "typeorm";
import {User} from "../entity/User";

//app use controller. available every req/res
//The res.locals property is an object that contains response local variables scoped to the request and because of this, 
//it is only available to the view(s) rendered during that request / response cyc
export const handleViews: RequestHandler = (req, res, next) => {
  //assign username info added at login post to res.locals to change navbar.
  res.locals.currentUser = req.session.username;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
}

//home get controller
export const renderHome: RequestHandler = (req, res) => {
  res.render('home')
}

//register get controller
export const renderRegister: RequestHandler = (req, res)  => {
  res.render('register')
}

//register post controller
//right now, a simple validation on client side /client/public/validation.js and on model side are used. 
//will add more validations using regex or a third party package.
export const register: RequestHandler = async (req, res)  => {
  try {
    //destructure info from request.body
    const name = req.body.name
    const surname = req.body.surname
    const username = req.body.username
    const password = req.body.password
    //hash the given password using bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10)
    //get User entity and create a new User entity using the given information.
    const user  = await getRepository(User).create({ name: name, surname: surname, username: username, password: hashedPassword })
    console.log(user);
    //save the new User into database.
    await getRepository(User).save(user)
    req.flash('success', 'Successfully signed up!')
    res.redirect('login')
  } catch (e) {
    //catch if user.save throws an error. in order words the username should already exist in database since it is the only unique property.
    req.flash('error', 'Something went wrong!. Maybe the username already in use!')
    res.redirect('register')
  }
}


//login get controller
export const renderLogin: RequestHandler = (req, res)  => {
  res.render('login')
}

//login post controller
export const login: RequestHandler = async (req, res) => {
  //get username&password from body then correct it with the registered userbase.
  const username = req.body.username
  const password = req.body.password
  const user = await getRepository(User).findOne({username: username})
  //if user doesnt exist in database, redirect.
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
  }
}

//user get controller
//redirect sends req.body info temporarily to /users get route
export const renderUsers: RequestHandler =  async (req, res) => {
  //find the current user by session.
  //const user = await User.findOne({ username: req.session.username });
  //find the current user by token
  //the request body is sent via /login post temporarily to /users get. So we can get the info we need from req.body.
  const currentUser = await getRepository(User).findOne({ username: req.body.name });
  const otherUsers = await getRepository(User).find({})
  const session = req.sessionID
  const token = req.cookies.token
  //token expiration date
  const expDate = new Date(req.body.exp * 1000).toLocaleString('tr-TR', { timeZone: 'Turkey' })
  //token initiation date
  const iatDate = new Date(req.body.iat * 1000).toLocaleString('tr-TR', { timeZone: 'Turkey' })
  res.render('users', { currentUser, session, token, expDate, iatDate, otherUsers })
}

//logout controller
export const logout: RequestHandler = (req, res)  => {
  req.session.username = null;
  res.clearCookie('token');
  res.redirect('/');
}

//unknown url handler
export const NotFound: RequestHandler = (req, res, next) => {
  next(new ExpressError('Page not Found', 404))
}

