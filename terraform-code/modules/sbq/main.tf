# Service Bus Queue IaC

# Using Service Bus Namespace Data Source
data "azurerm_servicebus_namespace" "sb-nsp" {
  name                = var.sbnamespace
  resource_group_name = var.rgpname
}

# ServiceBus Queue
resource "azurerm_servicebus_queue" "queue" {

  count=var.numberofqueue
  name                = "tfex_servicebus_queue-${count.index}"
  resource_group_name = var.rgpname
  namespace_name      = data.azurerm_servicebus_namespace.sb-nsp.name

  enable_partitioning = true

}

# Authorization Rule for  ServiceBus Queue
resource "azurerm_servicebus_queue_authorization_rule" "queuerule" {
  count= var.numberofqueue
  name                = "examplerule${count.index}"
  namespace_name      = data.azurerm_servicebus_namespace.sb-nsp.name
  queue_name          = azurerm_servicebus_queue.queue[count.index].name
  resource_group_name = var.rgpname

  listen = true
  send   = true
  manage = true
}
