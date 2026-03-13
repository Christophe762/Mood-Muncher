data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "main" {
  name                        = var.keyvault_name
  location                    = var.location
  resource_group_name         = azurerm_resource_group.main.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  purge_protection_enabled    = false

  network_acls {
  default_action = "Deny"
  bypass         = "AzureServices"
}
}

# Allow backend VM managed identity to get secrets
resource "azurerm_key_vault_access_policy" "backend_vm" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_virtual_machine.backend_vm.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# Store database credentials
resource "azurerm_key_vault_secret" "db_username" {
  name         = "db-username"
  value        = var.db_username
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "db_password" {
  name         = "db-password"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.main.id
}