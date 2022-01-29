import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { appParams } from './config.js'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

const app = express()
app.set('port', appParams.PORT || 3000)

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

export default app;