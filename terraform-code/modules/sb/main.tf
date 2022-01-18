# Azure Service Bus Iac

# Service Bus Namespace

resource "azurerm_servicebus_namespace" "sb-nsp" {
  name                = var.sbnamespace
  location            = var.location
  resource_group_name = var.rgpname
  sku                 = "Premium"
  zone_redundant      = false 
  capacity=1

 
}

# ServiceBus Namespace authorization Rule within a ServiceBus
resource "azurerm_servicebus_namespace_authorization_rule" "sb-nsprule" {
  name                = "examplerule"
  namespace_name      = azurerm_servicebus_namespace.sb-nsp.name
  resource_group_name = var.rgpname

  listen = true
  send   = true
  manage = true
}

#  ServiceBus Namespace Network Rule Set Se
resource "azurerm_servicebus_namespace_network_rule_set" "sb-nspruleset" {
  namespace_name      = azurerm_servicebus_namespace.sb-nsp.name
  resource_group_name =  var.rgpname

  default_action = "Allow"

  ip_rules = []
}





