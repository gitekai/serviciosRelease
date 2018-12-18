import 'dotenv/config'
import { Pool } from 'pg';

const erp2d2 = new Pool({
  database: process.env.DATABASE || process.env.TEST_DATABASE,  //'full_erp',
  host: process.env.HOST, //'localhost',
  user: process.env.DB_USER, //'ekai',
  password: process.env.DB_PASSWORD,  //'ekai',
});

const c3 = new Pool({
  database: process.env.C3_DATABASE, 
  host: process.env.C3_HOST || process.env.C3_TEST_HOST,
  user: process.env.C3_USER,
  password: process.env.C3_PASSWORD
});

export default erp2d2; 
export {c3}; 

