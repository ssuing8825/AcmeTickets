terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
     
    }
    }
}

provider "azurerm" {
  features {}
  subscription_id = var.spn-subscription-id
  client_id       = var.spn-client-id
  client_secret   = var.spn-client-secret
  tenant_id       = var.spn-tenant-id
  
}

# The client id, secret , tenant id are stored as secret in the keyvault