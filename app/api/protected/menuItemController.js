const express = require('express')
const MenuItem = require('../../models/menuItem').MenuItem
const router = express.Router({mergeParams: true})

router.route('/edit/:id').get(function (req, res) {
  MenuItem.findById(req.params.id, function (err, MenuItem) {
    res.json(MenuItem)
  })
})

router.route('/add').post(function (req, res) {
  const menuItem = new MenuItem(req.body)
  menuItem.save().then(e => {
    res.status(200).json(e)
  }).catch(e => {
    console.log(e)
    res.status(400).send('Unable to save to database')
  })
})

router.route('/update/:id').post(function (req, res) {
  MenuItem.findById(req.params.id, function (err, menuItem) {
    if (!menuItem)
      res.status(404).send('data is not found')
    else {
      menuItem.title = req.body.title
      menuItem.description = req.body.description
      menuItem.categoryId = req.body.categoryId
      menuItem.price = req.body.price
      menuItem.image = req.body.image
      menuItem.save().then(() => {
        res.json('Update complete')
      })
        .catch(() => {
          res.status(400).send('unable to update the database')
        })
    }
  })
})

router.route('/delete/:id').delete(function (req, res) {
  MenuItem.remove({_id: req.params.id}, (err) => {
    if (err) {
      res.json(err)
    } else {
      res.json('Successfully removed')
    }
  })
})

module.exports = router