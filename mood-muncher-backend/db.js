import pkg from "pg";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

// Read environment variables
const KEYVAULT_URI = process.env.KEYVAULT_URI;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;    

export async function createDbPool() {
  // Azure authentication via Managed Identity
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(KEYVAULT_URI, credential);

  // Fetch DB credentials from Key Vault
  const dbUserSecret = await client.getSecret("db-username");
  const dbPassSecret = await client.getSecret("db-password");

  const pool = new Pool({
    user: dbUserSecret.value,
    host: DB_HOST,
    database: DB_NAME,
    password: dbPassSecret.value,
    port: 5432,
    ssl: {
    rejectUnauthorized: false
  }
  });

  await pool.query("SELECT 1");

  return pool;
}

