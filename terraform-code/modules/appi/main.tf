
# Application Insights IaC
resource "azurerm_application_insights" "appi" {
  name                = var.appiname
  location            = var.location
  resource_group_name = var.rgpname
  application_type    = "web"
}

output "instrumentation_key" {
  value = azurerm_application_insights.appi.instrumentation_key
}

output "app_id" {
  value = azurerm_application_insights.appi.app_id
}