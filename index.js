const fs = require('fs');

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

/* 
    Função que realiza a leitura e chama as funções de correção 
    changCaracters e changType 
*/

function fixData(filePath) {

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dataFixed = changCaracters(data);
    const dataFixedsales = changType(dataFixed);
    return dataFixedsales;
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

exportFiles('fixed_database_1.json', repairedData1);
exportFiles('fixed_database_2.json', repairedData2);
