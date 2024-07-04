require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const cron = require('node-cron');
const mongoose = require('./config/mongoose');
const auditLogController = require('./controllers/LogDataController'); 
const port = process.env.PORT ||3000;
const path = process.env.LOG_PATH;

let jsonObjects = [];

function refreshData() {
  try {
    const fileContent = fs.readFileSync(path, 'utf8');
    jsonObjects = fileContent.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => JSON.parse(line));
    console.log('Data refreshed at', new Date().toLocaleString());
    auditLogController.processAndSaveNewLogs(jsonObjects);
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
}
refreshData();

cron.schedule('* * * * *', refreshData);

app.get('/', (req, res) => {
  res.json(jsonObjects);
});
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});