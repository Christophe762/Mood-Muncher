resource "azurerm_virtual_network" "main" {
  name = var.vnet_name
  location = var.location
  resource_group_name = azurerm_resource_group.main.name
  address_space = var.vnet_address_space
}

resource "azurerm_subnet" "frontend" {
    name = var.frontend_subnet_name
    virtual_network_name = azurerm_virtual_network.main.name
    resource_group_name = azurerm_resource_group.main.name
    address_prefixes = var.frontend_subnet_prefix
}

resource "azurerm_subnet" "backend" {
    name = var.backend_subnet_name
    virtual_network_name = azurerm_virtual_network.main.name
    resource_group_name = azurerm_resource_group.main.name
    address_prefixes = var.backend_subnet_prefix
}

resource "azurerm_subnet" "database" {
  name = var.database_subnet_name
  resource_group_name = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes = var.database_subnet_prefix
  delegation {
    name = "postgres-flexible-server-delegation"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action"
      ]
      }
      }
  }