
$env:AzureServiceBus_ConnectionString = 'Endpoint=sb://eventellectstandardsbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=jDYKocpcqjIJe7nr0A2rEmsrU0GNHi7WhGcuOUPwwzg='

# $env:AzureServiceBus_ConnectionString = 'Endpoint=sb://nservicebusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=qYBALzUlxPI/Wd0o2nSCDxV7XmVUqlXiMBN5xM8/SV4='

# https://docs.particular.net/transports/azure-service-bus/operational-scripting
# asb-transport endpoint create name [--size] [--partitioned] [--topic] [--subscription]
# asb-transport endpoint subscribe name event-type [--topic] [--subscription] [--rule-name]

asb-transport endpoint create ASBTriggerEventManagementPurchase -t AcmeTickets
asb-transport endpoint create ASBTriggerEventManagementPurchase -t topicEventManagementPurchase -b subEventManagementPurchase

asb-transport endpoint create ASBTriggerInventory -t acmetickets
#asb-transport endpoint subscribe ASBTriggerInventory AcmeTickets.EventManagement.Contracts.Events.IPurchaseOrderPlaced -t AcmeTickets -b ASBTriggerInventory -r IPurchaseOrderPlaced
asb-transport endpoint subscribe ASBTriggerInventory AcmeTickets.EventManagement.Contracts.Events.IHoldTicketsOrderPlaced -t AcmeTickets -b ASBTriggerInventory -r IHoldTicketsOrderPlaced
asb-transport endpoint subscribe ASBTriggerInventory AcmeTickets.EventManagement.Contracts.Command.HoldTickets -t AcmeTickets -b ASBTriggerInventory -r HoldTickets
asb-transport endpoint subscribe ASBTriggerInventory AcmeTickets.EventManagement.Contracts.Events.IOrderCancelled -t AcmeTickets -b ASBTriggerInventory -r IOrderCancelled
#asb-transport endpoint subscribe ASBTriggerInventory AcmeTickets.EventManagement.Contracts.Events.IOrderCancelled -t AcmeTickets -b ASBTriggerInventory -r IOrderCancelled


asb-transport endpoint create ASBTriggerFraudProtection -t acmetickets
asb-transport endpoint subscribe ASBTriggerFraudProtection AcmeTickets.EventManagement.Contracts.Events.IPurchaseOrderPlaced -t AcmeTickets -b ASBTriggerFraudProtection -r IPurchaseOrderPlaced

asb-transport endpoint create ASBTriggerITOps -t acmetickets
asb-transport endpoint subscribe ASBTriggerITOps AcmeTickets.EventManagement.Contracts.Events.INeedAdditionalDataToCompletePurchase -t AcmeTickets -b ASBTriggerITOps -r INeedAdditionalDataToCompletePurchase
#asb-transport endpoint subscribe ASBTriggerITOps AcmeTickets.Inventory.Contracts.Events.ITicketsAllocatedToOrder -t AcmeTickets -b ASBTriggerITOps -r ITicketsAllocatedToOrder

asb-transport endpoint create ASBTriggerITOpsSync -t acmetickets
asb-transport endpoint create ASBTriggerITOpsSync-1 -t acmetickets

asb-transport endpoint create ASBTriggerFulfillment -t acmetickets
asb-transport endpoint subscribe ASBTriggerFulfillment AcmeTickets.Inventory.Contracts.Events.ITicketsPurchased -t AcmeTickets -b ASBTriggerFulfillment -r ITicketsPurchased
asb-transport endpoint subscribe ASBTriggerFulfillment AcmeTickets.Inventory.Contracts.Events.ITicketsAllocatedToOrder -t AcmeTickets -b ASBTriggerFulfillment -r ITicketsAllocatedToOrder

asb-transport endpoint create Particular.Monitoring -t acmetickets


