resource "azurerm_private_dns_zone" "pg" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                = var.postgres_server_name
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  version             = var.postgres_version

  administrator_login          = var.postgres_admin_username
  administrator_password     = var.db_password

  sku_name     = var.postgres_sku_name
  storage_mb   = 32768
  backup_retention_days = 7
  geo_redundant_backup_enabled = false

  delegated_subnet_id = azurerm_subnet.database.id
  private_dns_zone_id = azurerm_private_dns_zone.pg.id

  public_network_access_enabled = false
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name                = var.postgres_db_name
  server_id           = azurerm_postgresql_flexible_server.main.id
  charset             = "UTF8"
  collation           = "en_US.utf8"
}