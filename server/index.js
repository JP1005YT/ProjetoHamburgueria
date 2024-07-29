const express = require("express")
const bodyParser = require('body-parser')
const { createRecord, readRecords, updateRecord, deleteRecord } = require("./modules/sqliteManager")
const uuid = require("uuid")
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = uuid.v4() + ext;
      cb(null, name);
    }
});
const upload = multer({ storage });

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

app.post("/delProduto",async (req,res) => {
    const {id,imageUrl} = req.body
    const filePath = './public/images/' + imageUrl
    fs.unlinkSync(filePath);
    try{
        await deleteRecord('produtos',id)
        res.status(200).send({error : false})
    }catch{
            res.status(402).send({error : true})
        }
})

app.post("/newClient",async (req,res) => {
    const data = req.body
    try{
        await createRecord('clientes', data)
        res.status(200).send({error : false})
    }catch{
        res.status(402).send({error : true})
    }
})

app.post('/newProduto', upload.single('file'), async (req, res) => {
    const { description, value } = req.body;
    const file = req.file;
  
    const data = {
        descricao : description,
        valor : value,
        image : file.filename
    }
    try{
        await createRecord('produtos', data)
        res.status(200).send({error : false})
    }catch{
        res.status(402).send({error : true})
    }
});