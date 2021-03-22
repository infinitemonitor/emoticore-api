const express = require("express")
const app = express()
const cfg = require("./config.json")
const port = 3000
const mysql = require("mysql")

var recentRequests = []

var con = mysql.createConnection({
  host: cfg.sql.host,
  user: cfg.sql.user,
  password: cfg.sql.password,
  database: cfg.sql.database
})
con.connect(err => {if(err) throw err; console.log("Connected to database")})
	
function processRatelimit(req, res) {
	if(!recentRequests.filter(x => x.ip == req.connection.remoteAddress)[0]) {
		id = Math.random()
		recentRequests.push({
			"ip": req.connection.remoteAddress,
			"id": id
		})
		setTimeout(() => {recentRequests.splice(recentRequests.findIndex(x => x.id == id),1)}, cfg.ratelimit)
		return false
	} else {
		return true
	}
}

app.get("/api/RandomUser", (req, res) => {
	if(processRatelimit(req, res)) {res.status(429); res.json({"code": 429, "message": "Too many requests!"}); return}
	limit = req.query.limit
	if(!req.query.limit) limit = 1
	if(req.query.limit > 25) {res.status(400); res.json({"code": 400, "message": "Limit must be below 25"}); return}
	con.query("SELECT * FROM users", (err, rows) => {
		start = Math.round(Math.random()*(rows.length-limit))
		row = rows.slice(start,start+Number.parseInt(limit))
		res.json(row)
	})
})

app.get("/api/RandomEmote", (req, res) => {
	if(processRatelimit(req, res)) {res.status(429); res.json({"code": 429, "message": "Too many requests!"}); return}
	limit = req.query.limit
	if(!req.query.limit) limit = 1
	if(req.query.limit > 25) {res.status(400); res.json({"code": 400, "message": "Limit must be below 25"}); return}
	con.query("SELECT * FROM emotes", (err, rows) => {
		start = Math.round(Math.random()*(rows.length-limit))
		row = rows.slice(start,start+Number.parseInt(limit))
		res.json(row)
	})
})

app.get("/api/User", (req, res) => {
	if(processRatelimit(req, res)) {res.status(429); res.json({"code": 429, "message": "Too many requests!"}); return}
	if(!req.query.id) {res.status(400); res.json({"code": 400, "message": "No UserID provided"}); return}
	
	con.query(`SELECT * FROM users WHERE id = '${req.query.id}'`, (err, rows) => {
		if(!rows[0]) {res.status(400); res.json({"code": 400, "message": "User not found"}); return}
		res.json(rows[0])
	})
})

app.get("/api/Emote", (req, res) => {
	if(processRatelimit(req, res)) {res.status(429); res.json({"code": 429, "message": "Too many requests!"}); return}
	if(!req.query.id) {res.status(400); res.json({"code": 400, "message": "No EmoteID provided"}); return}
	
	con.query(`SELECT * FROM emotes WHERE id = '${req.query.id}'`, (err, rows) => {
		if(!rows[0]) {res.status(400); res.json({"code": 400, "message": "Emote not found"}); return}
		res.json(rows[0])
	})
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})