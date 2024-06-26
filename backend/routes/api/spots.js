const router = require("./session");
const { Spot } = require('../../db/models')

router.get('/spots', async (req, res, next) => {

    const spots = await Spot.findAll()
    console.log("hello")
})

module.exports = {
    router
}