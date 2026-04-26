const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres'
});
client.connect().then(() => {
  console.log('Connected!');
  client.end();
}).catch(e => {
  console.error('Connection failed:', e);
});
