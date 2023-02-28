const fs = require('fs');

try {
    const data = fs.readFileSync('broken_database_1.json', 'utf8');
    if (data) {
    console.log('Arquivo lido corretamente!');
    const jsonData = JSON.parse(data);
    var jsonString = JSON.stringify(jsonData);


    //trocar caracteres
    var jsonString = jsonString.replace(/æ/g, "a");
    var jsonString = jsonString.replace(/ø/g, "o");



    fs.writeFileSync('saida1.json', jsonString);


    } else {
    console.log('O arquivo está vazio.');
    }
} catch (err) {
    console.error(err);
}






