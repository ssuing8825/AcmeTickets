# Key Vault IaC

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kvt" {
  name                       = var.keyvaultname
  location                   = var.location
  resource_group_name        = var.rgpname
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "create",
      "get",
    ]

    secret_permissions = [
      "set",
      "get",
      "delete",
      "purge",
      "recover"
    ]
  }
}

# this is test secret value will need to update

resource "azurerm_key_vault_secret" "kvtsecret"{
  name         = "testsecret"
  value        = "szechuan"
  key_vault_id = azurerm_key_vault.kvt.id
}