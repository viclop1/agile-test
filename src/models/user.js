import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import bcrypt from 'bcryptjs'
import { fieldControllers } from '../config';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, fieldControllers.EMAIL_REQUIRED],
      unique: [true, fieldControllers.EMAIL_UNIQUE],
    },
    password: {
      type: String,
      required: [true, fieldControllers.PASSWORD_REQUIRED],
      select: false,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    name: {
      type: String,
      minlength: 2,
      maxlength: 25,
    },
    surname: {
      type: String,
      minlength: 2,
      maxlength: 40,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

userSchema.plugin(mongoosePaginate)

export default model('User', userSchema)
