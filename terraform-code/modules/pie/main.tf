# Private Endpoint IaC

data "azurerm_virtual_network" "vnet" {
  name                = var.vnetname
  resource_group_name = var.rgpname
}

data "azurerm_subnet" "service" {
  name                 = "service"
  virtual_network_name = var.vnetname
  resource_group_name  = var.rgpname
}

data "azurerm_subnet" "endpoint" {
  name                 = "endpoint"
  virtual_network_name = var.vnetname
  resource_group_name  = var.rgpname
}


# public ip

resource "azurerm_public_ip" "pip" {
  name                = var.pipname 
  sku                 = "Standard"
  location            = var.location
  resource_group_name = var.rgpname
  allocation_method   = "Static"
}

# load balancer
resource "azurerm_lb" "lb" {
  name                = var.lbname
  sku                 = "Standard"
  location            = var.location
  resource_group_name = var.rgpname

  frontend_ip_configuration {
    name                 = azurerm_public_ip.pip.name
    public_ip_address_id = azurerm_public_ip.pip.id
  }
}

# Private links service
resource "azurerm_private_link_service" "pls" {
  name                = var.plsname
  location            = var.location
  resource_group_name = var.rgpname

  nat_ip_configuration {
    name      = azurerm_public_ip.pip.name
    primary   = true
    subnet_id = data.azurerm_subnet.service.id
  }

  load_balancer_frontend_ip_configuration_ids = [
    azurerm_lb.lb.frontend_ip_configuration.0.id,
  ]
}

resource "azurerm_private_endpoint" "pie" {
  name                = var.piename
  location            = var.location
  resource_group_name = var.rgpname
  subnet_id           = data.azurerm_subnet.endpoint.id

  private_service_connection {
    name                           = "sqltest1-privateserviceconnection"
    private_connection_resource_id = azurerm_private_link_service.pls.id
    is_manual_connection           = false
  }
}