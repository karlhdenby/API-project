const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { where } = require('sequelize');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');


router.use(restoreUser);


router.use('/spots', spotsRouter);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/reviews', reviewsRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});


module.exports = router;
