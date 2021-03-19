const express = require('express');
const fetch = require('node-fetch');
const formRouter = express.Router();

module.exports = formRouter.get('', async(req, res) => {
  try {
    const fieldsApi =  await fetch('http://localhost:3000/fields', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    const data = await fieldsApi.json();

    res.render('form', {
        title: "Field Form",
        records: data,
        editRec: false
    })
  } catch(err){
    console.log(err)
  }
})