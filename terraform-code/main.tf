# This is our root module, we will call all our modules from this file
resource "azurerm_resource_group" "rg" {
  name     = var.rgpname
  location = var.location
}

resource "azurerm_resource_group" "secondary" {
  name     = var.rgpnamesec
  location = var.locationsec
}

# Storage account
module "stg" {

    source= "./modules/stg"
    stgname = var.stgname
    location=var.location
    rgpname = var.rgpname
    depends_on = [
    azurerm_resource_group.rg
  ]
}
# Key vault
module "keyvault" {

    source= "./modules/kvt"
    keyvaultname = var.keyvaultname
    location=var.location
    rgpname = var.rgpname
    depends_on = [
    azurerm_resource_group.rg
  ]
}
# Log analytics workspace
module "law" {

    source= "./modules/law"
    lawname = var.lawname
    location=var.location
    rgpname = var.rgpname
      depends_on = [
    azurerm_resource_group.rg
  ]
}


# Virtual Network, NSG (Networking Module)
module "vnet" {

    source= "./modules/vnet"
    vnetname = var.vnetname
    location=var.location
    nsgname = var.nsgname
    rgpname = var.rgpname
    sbtname=var.sbtname
    depends_on = [
    azurerm_resource_group.rg
  ]
}


# Application Insights
module "appi" {

    source= "./modules/appi"
    appiname = var.appiname
    location=var.location
    rgpname = var.rgpname
    depends_on = [
    azurerm_resource_group.rg
  ]
}

# App Service Plan
module "asp" {

    source= "./modules/asp"
    aspname = var.aspname
    location=var.location
    rgpname = var.rgpname
    depends_on = [
    azurerm_resource_group.rg
  ]
}


# reading secrets from key vault to execute local exec
data "azurerm_key_vault" "test" {
  name      = "kv-evie-d-01"
  resource_group_name = "scu-tfstate-rg"



data "azurerm_key_vault_secret" "id" {
  name = "clientid" 
  key_vault_id = "${data.azurerm_key_vault.test.id}" 
}

data "azurerm_key_vault_secret" "sec"{
  name = "clientsecret" 
  key_vault_id = "${data.azurerm_key_vault.test.id}" 
}
data "azurerm_key_vault_secret" "tid"{
  name = "tenantid" 
  key_vault_id = "${data.azurerm_key_vault.test.id}" 
}

# Prepare the package zip:
#function app is a test  hello world dotnet app to demo zip deploy 
data "archive_file" "file_function_app1" {
  type        = "zip"
  source_dir  = "../function-app" 
  output_path = "function-app.zip"
}


# Azure Function App with the function code -I
module "azfunc1" {

    source= "./modules/azfunc"
    azfuncname="test-tiwari-f1"
    location=var.location
    rgpname = var.rgpname
    aspname = var.aspname
    stgname = var.stgname
    appiname=var.appiname
    archive_file = data.archive_file.file_function_app1
    os = "windows"
    client-id   = data.azurerm_key_vault_secret.id.value
    client-secret= data.azurerm_key_vault_secret.sec.value
    tenant-id     = data.azurerm_key_vault_secret.tid.value
    depends_on = [
    azurerm_resource_group.rg,
    module.stg,
    module.asp,
    module.appi
  ]
}

# Prepare the package zip:
#function app is a test  hello world dotnet app to demo zip deploy 
data "archive_file" "file_function_app2" {
  type        = "zip"
  source_dir  = "../function-app" 
  output_path = "function-app.zip"
}



# Azure Function App with the function code -II
module "azfunc2" {

    source= "./modules/azfunc"
    
    azfuncname="test-tiwari-f2"
    location=var.location
    rgpname = var.rgpname
    aspname = var.aspname
    stgname = var.stgname
    appiname=var.appiname
    archive_file = data.archive_file.file_function_app2
    os = "windows"
    client-id   = data.azurerm_key_vault_secret.id.value
    client-secret= data.azurerm_key_vault_secret.sec.value
    tenant-id     = data.azurerm_key_vault_secret.tid.value
    depends_on = [
    azurerm_resource_group.rg,
    module.stg,
    module.asp,
    module.appi
  ]
}
# Prepare the package zip:
#function app is a test  hello world dotnet app to demo zip deploy 
data "archive_file" "file_function_app3" {
  type        = "zip"
  source_dir  = "../function-app" 
  output_path = "function-app.zip"
}



# Azure Function App with the function code -III
module "azfunc3" {

    source= "./modules/azfunc"
    azfuncname="test-tiwari-f3"
    location=var.location
    rgpname = var.rgpname
    aspname = var.aspname
    stgname = var.stgname
    appiname=var.appiname
    archive_file = data.archive_file.file_function_app3
    os = "windows"
    client-id   = data.azurerm_key_vault_secret.id.value
    client-secret= data.azurerm_key_vault_secret.sec.value
    tenant-id     = data.azurerm_key_vault_secret.tid.value
    depends_on = [
    azurerm_resource_group.rg,
    module.stg,
    module.asp,
    module.appi
  ]
}
# Prepare the package zip:
#function app is a test  hello world dotnet app to demo zip deploy 
data "archive_file" "file_function_app4" {
  type        = "zip"
  source_dir  = "../function-app" 
  output_path = "function-app.zip"
}



# Azure Function App with the function code -IV
module "azfunc4" {

    source= "./modules/azfunc"
    azfuncname="test-tiwari-f4"
    location=var.location
    rgpname = var.rgpname
    aspname = var.aspname
    stgname = var.stgname
    appiname=var.appiname
    archive_file = data.archive_file.file_function_app4
    os = "windows"
    client-id   = data.azurerm_key_vault_secret.id.value
    client-secret= data.azurerm_key_vault_secret.sec.value
    tenant-id     = data.azurerm_key_vault_secret.tid.value
    depends_on = [
    azurerm_resource_group.rg,
    module.stg,
    module.asp,
    module.appi
  ]
}




# Private Endpoint 

module "pie" {
  source = "./modules/pie"

  
  location  = var.location
  rgpname = var.rgpname
  lbname=var.lbname
  piename=var.piename
  pipname=var.pipname
  plsname=var.plsname
  vnetname=var.vnetname

  depends_on = [
    azurerm_resource_group.rg,
    module.vnet]
}

# Service Bus
module "sb" {
  source = "./modules/sb"

  location  = var.location
  rgpname = var.rgpname
  sbnamespace=var.sbnamespace
  depends_on = [
    azurerm_resource_group.rg
    ]
}

# Service Bus Queue
module "sbq" {
  source = "./modules/sbq"

  location  = var.location
  rgpname = var.rgpname
  sbnamespace= var.sbnamespace
  numberofqueue= var.numberofqueue

  depends_on = [
    azurerm_resource_group.rg,
    module.sb
    ]
}

 # Service Bus Topic

 module "sbt" {
  source = "./modules/sbt"

  location  = var.location
  rgpname = var.rgpname
  sbnamespace= var.sbnamespace
  numberoftopic= var.numberoftopic

  depends_on = [
    azurerm_resource_group.rg,
    module.sb
    ]
}