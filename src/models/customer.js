import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import {fieldControllers, defaultPhotoURL} from '../config.js'

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, fieldControllers.EMAIL_REQUIRED],
      unique: [true, fieldControllers.EMAIL_UNIQUE],
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 25,
      required: [true, fieldControllers.NAME_REQUIRED],
    },
    surname: {
      type: String,
      minlength: 2,
      maxlength: 40,
      required: [true, fieldControllers.SURNAME_REQUIRED],
    },
    photoUrl: {
      type: String,
      default: defaultPhotoURL,
      required: [false],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

customerSchema.plugin(mongoosePaginate)

export default model('Customer', customerSchema)
