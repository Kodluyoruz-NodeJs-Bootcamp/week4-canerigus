/* import mongoose from 'mongoose';

//define IUser interface to handle data retrieval from and saving to database 
export interface IUser extends mongoose.Document {
  id?: any;
  name: string; 
  surname: string;
  username: string;
  password: string;
};

//define userSchema using mongoose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be blank']
  },
  surname: {
    type: String,
    required: [true, 'Surname cannot be blank']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username cannot be blank']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank']
  }
})

export const User = mongoose.model<IUser>('User', userSchema);

 */