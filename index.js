const fs = require('fs');
const mysql = require('mysql');









// Função que troca os caracters corrompidos

function changCaracters (data) {
    if (typeof data === 'string') {
        data = data.replace(/æ/g, 'a').replace(/ø/g, 'o');
        return data;
    } else if (typeof data === 'object') {
    for (let key in data) {
        data[key] = changCaracters(data[key]);
    }
}
    return data;
}

// Função que troca numeros do tipo string para number

function changType(data) {
    if (typeof data === 'object') {
        for (let key in data) {
            if (key === 'vendas') {
                data[key] = Number(data[key]);
            } else {
                data[key] = changType(data[key]);
            }
        }
    }
return data;
}


function fixData(filePath) {

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dataCorrigida = changCaracters(data);
    const dataCorrigidaVendas = changType(dataCorrigida);
    return dataCorrigidaVendas;
}

// Função que converte e exporta os arquivos corrigidos

function exportFiles(filePath, data) {
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(filePath, jsonData, 'utf8');
}

// Chamada das funções com os arquivos originais

const repairedData1 = fixData ('broken_database_1.json');
const repairedData2 = fixData ('broken_database_2.json');

// Chamada das funções que exporta os arquivos corrigidos 

exportFiles('saida1.json', repairedData1);
exportFiles('saida2.json', repairedData2);

const data = require('./saida1.json');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234@@alexandre',
    database: 'testeRocky'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conexão bem sucedida com o banco de dados!');
});


data.forEach((objeto) => {
    connection.query(
    'INSERT INTO vendas (data, id_marca_, vendas, valor_do_veiculo, nome) VALUES (?, ?, ?, ?, ?)',
    [objeto.data, objeto.id_marca_, objeto.vendas, objeto.valor_do_veiculo, objeto.nome],
    (error, result) => {
        if (error) throw error;
        console.log('Dados inseridos com sucesso!');
    }
    );
});



