# Log Analytics IaC

resource "azurerm_log_analytics_workspace" "law" {
  name                = var.lawname
  location            = var.location
  resource_group_name = var.rgpname
  sku                 = "PerGB2018"
  retention_in_days   = 30
}