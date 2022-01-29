import mongoose from 'mongoose'
import {roles} from './../config.js'

export const ROLES = roles;

const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 4,
      maxlength: 15,
      required: true,
      unique: true
    },
  },
  {
    versionKey: false,
  }
)

export default model('Role', roleSchema)
