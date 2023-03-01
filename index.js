const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234@@alexandre',
    database: 'praticaJoao'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conexão bem sucedida com o banco de dados!');
});

const tableName = 'relatVendas';

const createTableQuery = `CREATE TABLE ${tableName} (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  idade INT(11) NOT NULL,
  PRIMARY KEY (id)
);`;

connection.query(createTableQuery, (error, results, fields) => {
  if (error) throw error;
  console.log('Tabela criada com sucesso!');
});


/*connection.query('SELECT * FROM usuarios', (err, results, fields) => {
    if (err) throw err;
    console.log(results);
});*/






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


