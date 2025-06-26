const {Client} = require('pg');
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:"3306",
    password:"1234",
    database:"igrs"
})
client.connect(function(err){
    if(err) throw err;
    else{
        console.log("connect")
    }
});
module.exports = client;