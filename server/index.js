const express = require("express")
const bodyParser = require('body-parser')
const { createRecord, readRecords, updateRecord, deleteRecord } = require("./modules/sqliteManager")
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.listen("3000",()=>{
    console.log("http://localhost:3000/")
})

app.get("/getClientes",async (req,res) =>{
    const resp = await readRecords('clientes')
    res.send(resp)
})
app.get("/getProdutos",async (req,res) =>{
    const resp = await readRecords('produtos')
    res.send(resp)
})
app.get("/getPedidos",async (req,res) =>{
    const resp = await readRecords('pedidos')
    res.send(resp)
})

app.post("/editClient",async (req,res) => {
    const clientData = req.body
    const { id, ...dataWithoutId } = clientData; // Remove o id do objeto
    try{
        await updateRecord("clientes",clientData.id,clientData)
        res.status(200).send({error : false})
    }catch{
        res.status(402).send({error : true})
    }
})

app.post("/delClient",async (req,res) => {
    const {id} = req.body
    try{
        await deleteRecord('clientes',id)
        res.status(200).send({error : false})
    }catch{
        res.status(402).send({error : true})
    }
})