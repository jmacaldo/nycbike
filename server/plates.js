const db = require('../db') //this is required
const Plate = require('../db/models/plate');

const router = require('express').Router()

//add a plate number to the DB
router.post('/submit', function(req, res, next) {
  console.log('plate submit backend fired!', req.body.plate);
  Plate.sync().then(function(){
    Plate.create({
      plate: req.body.plate,
      state: req.body.state
    }).then(result => {
        res.status(200).send(result);
    })
    .catch(next);
  });
});


module.exports = router
