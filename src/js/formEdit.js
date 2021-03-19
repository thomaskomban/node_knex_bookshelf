const express = require('express');
const fetch = require('node-fetch');
const formRouter = express.Router();

module.exports = formRouter.get('/f/:id', async(req, res) => {
  try {
    const id = req?.params?.id ?? false;
    const fieldsApi =  await fetch('http://localhost:3000/field/'+id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    const data = await fieldsApi.json();

    res.render('form', {
        title: "Field Form",
        records: false,
        editRec: data        
    })
  } catch(err){
    console.log(err)
  }
})