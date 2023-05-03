const express = require('express');
const expressPartials = require('express-ejs-layouts');
const {body, validationResult, check} = require('express-validator');
const port = 3000;
const app = express();
const methodOverride = require('method-override');
const Contact = require('./model/contact');
require('dotenv').config();
require('./utils/db');

app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.use(expressPartials);

//Built-In Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//Main Page
app.get('/', (req, res) => {
    res.render('index', { 
      layout: 'partials/main-partial',
      title: 'Home',
      });
  })

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', {
      layout: 'partials/main-partial',
      title: 'Contact',
      contacts,
    });
  })

app.get('/contact/add', (req,res) => {
   res.render('add-contact',{
      title: "Add Contact Form",
      layout: 'partials/main-partial',
    })
  })

app.post('/contact',[
    body('name').custom( async (value) => {
      const isDuplicate = await Contact.findOne({name: value});
      if(isDuplicate){
        res.status(400);
        throw new Error ('Name already used');
      }
      return true;
    }),
    check('email', 'Email is not valid').isEmail(),
    check('number', 'Phone number is not valid').isMobilePhone('id-ID'),
    ], (req,res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('add-contact', {
          title: 'Add Contact Form',
          layout: 'partials/main-partial',
          errors: errors.array()
        })
      } else {
        Contact.insertMany(req.body, (err,result) => {
          res.status(200);
          res.redirect('/contact');
        });
      }
  })

  
  app.get('/contact/:name', async(req, res) => {
    const contact = await Contact.findOne({name: req.params.name});
    res.render('detail', {
      layout: 'partials/main-partial',
      title: 'Detail Kontak',
      contact,
    });
  })

  app.delete('/contact', (req,res) => {
    Contact.deleteOne({name: req.body.name}).then((result) => {
      res.status(200)
      res.redirect('/contact')
    })
  })

  app.get('/contact/edit/:name', async (req,res) => {
    const contact = await Contact.findOne({name: req.params.name});
    res.render('edit-contact',{
      title: "Update Contact Data Form",
      layout: 'partials/main-partial',
      contact,
    })
  })

  app.put('/contact',[
    body('name').custom( async (value, {req}) => {
      const isDuplicate = await Contact.findOne({name: value});
      if(value !== req.body.oldName && isDuplicate){
        throw new Error ('Name already used');
      }
      return true;
    }),
    check('email', 'Email is not valid').isEmail(),
    check('number', 'Phone number is not valid').isMobilePhone('id-ID'),
    ], (req,res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('edit-contact', {
          title: 'Update Contact Data Form',
          layout: 'partials/main-partial',
          errors: errors.array(),
          contact: req.body,
        })
      } else {
        Contact.updateOne({_id: req.body._id}, {
          $set: {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email,
          }
        }).then((result) => {
          res.status(200);
          res.redirect('/contact');
        })
      }
  })

app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
})
