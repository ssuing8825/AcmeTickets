#  Storage account IaC
resource "azurerm_storage_account" "stg" {
  name                     = var.stgname
  resource_group_name      = var.rgpname
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "GRS"


  
}

output "name"{
  value=azurerm_storage_account.stg.name
}
output "key"{
  value=azurerm_storage_account.stg.primary_access_key
}