const {Client} = require('pg');
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:"5432",
    password:"1234",
    database:"postgres"
})
client.connect(function(err){
    if(err) throw err;
    else{
        console.log("connect")
    }
});
module.exports = client;