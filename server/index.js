const express = require("express")
const { createRecord, readRecords, updateRecord, deleteRecord } = require("./modules/sqliteManager")
const app = express()

app.use(express.static('public'))

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