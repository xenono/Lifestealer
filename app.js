const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multer = require("multer")
const {v4: uuidv4} = require('uuid');

const dotenv = require('dotenv').config()
const mongoose = require("mongoose")


const app = express()

const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')
const userRoutes = require('./routes/user')

const fileStorage = multer.diskStorage(({
	destination: function (req, file, cb) {
		cb(null, 'images')
	},
	filename: function (req, file, cb) {
		cb(null, uuidv4() + "-" + file.originalname)
	}
}))

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg") {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

app.use(multer({
	storage: fileStorage,
	fileFilter: fileFilter,
	limits: {fileSize: 5000000},
	dest: "images"
}).fields([{name: "profileImage", maxCount: 1}, {name: "backgroundImage", maxCount: 1},{name: 'postImage',maxCount: 1}]))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Methods', '*')
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,X-CSRF-Token, csrf-token, X-Requested-With, Origin')
	res.setHeader("Access-Control-Allow-Credentials", "true");

	next()
})

// Middlewares
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/images', express.static(path.join(__dirname, 'images')))

// Routes
app.use('/api', authRoutes)
app.use('/api', dashboardRoutes)
app.use('/api', userRoutes)
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500
	const message = error.message
	const data = error.data
	res.status(statusCode).json({message, success: false})
})

app.use(express.static(path.join("client", "build")))
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

mongoose.connect(process.env.MONGODB_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		const server = 	app.listen(process.env.PORT || 8080)
		const io = require('./socket').init(server)
		io.on('connection', socket => {
			console.log('client connected')
		})
	})
	.catch(err => {
		console.log(err)
	})

