const express = require("express")
const bodyParser = require('body-parser')
const { createRecord, readRecords, updateRecord, deleteRecord } = require("./modules/sqliteManager")
const xlsx = require('xlsx');
const uuid = require("uuid")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

app.post("/editProduto", upload.single('file'),async (req,res) => {
    const { id, description, value ,oldImage} = req.body;

    
    let imageName
    if(req.file){
        const filePath = './public/images/' + oldImage
        fs.unlinkSync(filePath);
        imageName = req.file.filename;
    }else{
        imageName = oldImage
    }

    const productData = {
        descricao : description,
        valor : value,
        image : imageName
    }

    try{
        await updateRecord("produtos",id,productData)
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

app.post("/delPedido",async (req,res) => {
    const {id} = req.body
    try{
        await deleteRecord('pedidos',id)
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

app.post('/newPedido', upload.single('file'), async (req, res) => {
    const { cliente_id, forma_pag, produtos ,valorTotal,dtPedido} = req.body;
    const data = {
        cliente_id: cliente_id,
        forma_pag: forma_pag,
        produtos: JSON.stringify(produtos),
        valorTotal:valorTotal,
        dtPedido:dtPedido
    };

    try {
        await createRecord('pedidos', data);
        res.status(200).send({ error: false });
    } catch (error) {
        console.error('Erro ao criar pedido:', error); // Loga o erro no servidor
        res.status(500).send({ error: true, message: error.message }); // Envia o erro de volta ao cliente
    }
});

app.get("/export",async (req,res) => {
    const workbook = xlsx.utils.book_new();

    // Adicionar uma planilha para cada tabela
    const addWorksheet = (data, sheetName) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    const getTableData = async (tableName) => {
        let data = await readRecords(tableName);
        let finalData = [];
    
        data.forEach(item => {
            if (item.dtnasc !== undefined) {
                item.dtnasc = formatDateToDDMMYYYY(secondsToDate(item.dtnasc));
            }
            if (item.dtPedido !== undefined) {
                item.dtPedido = formatDateToDDMMYYYY(secondsToDate(item.dtPedido));
            }
            if (item.cliente_id !== undefined) {
                clientes.forEach(cliente => {
                    if (cliente.id == item.cliente_id) {
                        // Cria um novo objeto com as propriedades na ordem desejada
                        item = {
                            id: item.id,
                            nome_cliente: cliente.nome, // Renomeando 'cliente_id' para 'nome_cliente'
                            forma_pag: item.forma_pag,
                            produtos: item.produtos,
                            valorTotal: item.valorTotal,
                            dtPedido: item.dtPedido
                        };
                    }
                });
            }
            if (item.produtos) {
                let jsonData = JSON.parse(JSON.parse(item.produtos));
                let idProdutos = Object.keys(jsonData);
    
                idProdutos.forEach(produtoId => {
                    produtos.forEach(prodbd => {
                        if (prodbd.id == produtoId) {
                            let newItem = { ...item }; // Clone the item
                            newItem.produtos = `${jsonData[produtoId]} - ${prodbd.descricao}`;
                            newItem.valorTotal = `${prodbd.valor * jsonData[produtoId]}`
                            finalData.push(newItem); // Add the new item to finalData
                        }
                    });
                });
            } else {
                finalData.push(item); // If no products, add the item as is
            }
        });
        console.log(finalData)
        return finalData;
    }

    const produtos = await getTableData('produtos')
    const clientes = await getTableData('clientes');
    const pedidos = await getTableData('pedidos');

    // console.log(pedidos)

    addWorksheet(clientes, 'clientes');
    addWorksheet(pedidos, 'pedidos');

    // Gerar o buffer do arquivo Excel
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Definir os headers para download
    res.setHeader('Content-Disposition', 'attachment; filename=dadosExportados.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Enviar o buffer como resposta
    res.send(buffer);
})

function secondsToDate(seconds) {
    const date = new Date(seconds * 1000);
    return date.toISOString().split('T')[0];
}

function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}