# Function App IaC
# Using data source to access exisitng resource in this configuration.
data "azurerm_app_service_plan" "asp" {
  name                = var.aspname
  resource_group_name = var.rgpname
}

data "azurerm_storage_account" "stg" {
  name                = var.stgname
  resource_group_name = var.rgpname
}

data "azurerm_application_insights" "appi" {
  name                = var.appiname
  resource_group_name = var.rgpname
}


# we can maybe group all in one module in the future ??
resource "azurerm_function_app" "function_app" {
  name                       = "testdevyanshi-function-app"
  resource_group_name        = var.rgpname
  location                   = var.location
  app_service_plan_id        = data.azurerm_app_service_plan.asp.id

  # configure app settings 
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1",  
    "FUNCTIONS_WORKER_RUNTIME" = "dotnet",
    "AzureWebJobsDisableHomepage" = "true",
   
  }
  os_type = var.os == "linux" ? "linux" : null
  site_config {
    linux_fx_version          = var.os == "linux" ? "dotnet|6" : null
    use_32_bit_worker_process = false
  }
  # Prepare the package zip:
  storage_account_name       = data.azurerm_storage_account.stg.name
  storage_account_access_key = data.azurerm_storage_account.stg.primary_access_key
  version                    = "~3"
}

# code will be pushed to the function app with Azure CLI command
locals {
    publish_code_command = "az webapp deployment source config-zip --resource-group ${var.rgpname} --name ${azurerm_function_app.function_app.name} --src ${var.archive_file.output_path}"
}

# We use null_resource to run the publish command.
# local exec provsioner is being used to execute cli commands

resource "null_resource" "function_app_publish" {
  provisioner "local-exec" {
    command = <<COMMAND
    az login --service-principal --username=${var.client-id} --password=${var.client-secret} --tenant=${var.tenant-id}  
    az webapp deployment source config-zip --resource-group ${var.rgpname} --name ${azurerm_function_app.function_app.name} --src ${var.archive_file.output_path}
   COMMAND
  
  }
  
  depends_on = [local.publish_code_command]
  triggers = {
    input_json = filemd5(var.archive_file.output_path)
    publish_code_command = local.publish_code_command
  }
}
# test
output "function_app_default_hostname" {
  value = azurerm_function_app.function_app.default_hostname
}
