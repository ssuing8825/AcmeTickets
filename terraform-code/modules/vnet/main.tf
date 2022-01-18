# Networking Module

# NSG IaC
resource "azurerm_network_security_group" "nsg" {
  name                = var.nsgname
  location            = var.location
  resource_group_name = var.rgpname
}

# Test NSG Security Rules 

resource "azurerm_network_security_rule" "nsgrules" {
  name                        = "RULETEST"
  priority                    = 100
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = var.rgpname
  network_security_group_name = azurerm_network_security_group.nsg.name
}


/* DISABLING DDOS PLAN IAC TO REDUCE OVERALL COST OF POC 


#DDOS PLAN

resource "azurerm_network_ddos_protection_plan" "ddosplan" {
  name                = "ddospplan1"
  location            = var.location
  resource_group_name = var.rgpname
}

*/
# Virtual Netowrk IaC
resource "azurerm_virtual_network" "vnet" {
  name                = var.vnetname
  location            = var.location
  resource_group_name = var.rgpname
  address_space       = ["20.0.0.0/16"]
  dns_servers         = ["20.0.0.4", "20.0.0.5"]

  /*ddos_protection_plan {
    id     = azurerm_network_ddos_protection_plan.ddosplan.id
    enable = true
  }
  */
 
}

# Subnet IaC

resource "azurerm_subnet" "sbt" {
  name                 = var.sbtname
  resource_group_name  = var.rgpname
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes       = ["20.0.0.0/24"]


}

resource "azurerm_subnet" "service" {
  name                 = "service"
  resource_group_name  = var.rgpname
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["20.0.1.0/24"]

  enforce_private_link_service_network_policies = true
}

resource "azurerm_subnet" "endpoint" {
  name                 = "endpoint"
  resource_group_name  = var.rgpname
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["20.0.2.0/24"]

  enforce_private_link_endpoint_network_policies = true
}

# NSG Association to test subnet
resource "azurerm_subnet_network_security_group_association" "example" {
  subnet_id                 = azurerm_subnet.sbt.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}
