output "frontend_subnet_id" {
  value = azurerm_subnet.frontend.id
}

output "backend_subnet_id" {
  value = azurerm_subnet.backend.id
}

output "database_subnet_id" {
  value = azurerm_subnet.database.id
}

output "frontend_public_ip" {
  value = azurerm_public_ip.frontend_ip.ip_address
}

output "backend_private_ip" {
  value = azurerm_network_interface.backend_nic.private_ip_address
}

output "keyvault_uri" {
  value = azurerm_key_vault.main.vault_uri
}

output "postgres_private_fqdn" {
  value = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_db_name" {
  value = azurerm_postgresql_flexible_server_database.main.name
}