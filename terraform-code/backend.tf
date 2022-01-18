terraform {
  
    backend "azurerm" {
        resource_group_name  = "scu-tfstate-rg"
        storage_account_name = "stevietfstate001"
        container_name       = "terraformstate"
        key                  = "terraform.tfstate"
    }

}

# Replace values with the storage account proviosned to store terraform backend
# This value is used to define the backend that will be used to store terraform state file