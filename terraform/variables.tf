variable "location" {
  description = "Azure region"
  default     = "canadacentral"
}

variable "resource_group_name" {
  description = "Main resource group"
  default     = "mood-muncher-rg"
}

variable "project_name" {
  description = "Project prefix"
  default     = "moodmuncher"
}

variable "vnet_name" {
  description = "Virtual network name"
  default     = "moodmuncher-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the VNet"
  default     = ["10.0.0.0/16"]
}

variable "frontend_subnet_name" {
  description = "Frontend subnet"
  default     = "frontend-subnet"
}

variable "frontend_subnet_prefix" {
  description = "Frontend subnet address range"
  default     = ["10.0.1.0/24"]
}

variable "backend_subnet_name" {
  description = "Backend subnet"
  default     = "backend-subnet"
}

variable "backend_subnet_prefix" {
  description = "Backend subnet address range"
  default     = ["10.0.2.0/24"]
}

variable "database_subnet_name" {
  description = "Database subnet"
  default     = "database-subnet"
}

variable "database_subnet_prefix" {
  description = "Database subnet address range"
  default     = ["10.0.3.0/24"]
}

variable "admin_username" {
  description = "Admin username for VM"
  default     = "azureuser"
}

variable "vm_size" {
  description = "VM size"
  default     = "Standard_D2s_v3"
}

variable "frontend_vm_name" {
  default = "frontend-vm"
}

variable "backend_vm_name" {
  default = "backend-vm"
}

variable "ssh_public_key" {
  description = "SSH public key"
}

variable "keyvault_name" {
  description = "Azure Key Vault name"
  default     = "moodmuncher-kv"
}

variable "db_username" {
  description = "Database username"
  default     = "mooduser"
}

variable "db_password" {
  description = "Database password"
  default     = "ChangeMe123!" # For dev only, can override in .tfvars
  sensitive   = true
}

variable "postgres_server_name" {
  description = "PostgreSQL server name"
  default     = "moodmuncher-db"
}

variable "postgres_db_name" {
  description = "PostgreSQL database name"
  default     = "moodmuncher"
}

variable "postgres_version" {
  description = "PostgreSQL version"
  default     = "13"
}

variable "postgres_sku_name" {
  description = "SKU for the PostgreSQL server"
  default     = "B_Standard_B1ms"
}

variable "postgres_admin_username" {
  description = "Admin username for PostgreSQL"
  default     = "pgadmin"
}