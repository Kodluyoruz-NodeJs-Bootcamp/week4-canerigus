import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

//generating JWT token function.
export const generateAccessToken = (user: Object) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15s' })
}

//session checker function
export const requireLogin: RequestHandler = (req, res, next) => {
  if (!req.session.username) {
    req.flash('error', 'Session Not Found')
    return res.redirect('login')
  }
  next();
}

//jwt token authentication function. 
//after authentication, we set user info in decoded to req.body in which 
//the middleware will pass it to renderUsers to display info on /users
export const authenticateToken: RequestHandler = async (req, res, next) => {
  const token = req.cookies.token
  if (token == null) {
     //if token is null, set req.session.username to null to change navbar. sets res.locals.currentUser's length to 0.
    req.session.username = null;
    req.flash('error', 'Token Not Found!')
    return res.status(401).redirect('login')
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    //after verification, add decoded info (name, iat and exp) to req.body. req.body will be send to users route to be handled and displayed.
    req.body = decoded
    next()
  } catch (error) {
    //if token is invalid, set req.session.username to null to change navbar. sets res.locals.currentUser's length to 0.
    req.session.username = null;
    req.flash('error', 'Token is not valid!')
    return res.status(403).redirect('login')
  }
  }



