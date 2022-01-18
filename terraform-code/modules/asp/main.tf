# App Service Plan IaC for the Function Apps
resource "azurerm_app_service_plan" "asp" {
  name                = var.aspname
  location            = var.location
  resource_group_name = var.rgpname
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

output "id"{
  value= azurerm_app_service_plan.asp.id
}
