const fs = require('fs');
const path = './data/data.json';

exports.readData = () => JSON.parse(fs.readFileSync(path, 'utf-8'));
exports.writeData = (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));