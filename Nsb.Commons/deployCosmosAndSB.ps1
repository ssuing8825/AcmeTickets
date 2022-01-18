Import-Module Az.ServiceBus

$location= "East US"
$resourceGroupName = "veresourcegroup" # Resource Group name
$accountName = "vecosmosaccountname" # Must be all lower case
$databaseName = "vecosmosDatabase"
$serviceBusName ="veservicebus"



New-AzResourceGroup -Name $resourceGroupName -Location $location

New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $accountName  -Location $location -ApiKind "Sql"

New-AzCosmosDBSqlDatabase -ResourceGroupName $resourceGroupName -AccountName $accountName -Name $databaseName

New-AzCosmosDBSqlContainer -ResourceGroupName $resourceGroupName -AccountName $accountName -DatabaseName $databaseName -Name "Server" -PartitionKeyPath "/id" -PartitionKeyKind Hash

#create az servicebus
New-AzServiceBusNamespace -ResourceGroupName $resourceGroupName -Name $serviceBusName -Location $location -SkuName "Standard"

Get-AzCosmosDBAccountKey -ResourceGroupName $resourceGroupName -Name $accountName -Type "ConnectionStrings"

Get-AzServiceBusKey -ResourceGroup $resourceGroupName -Namespace $serviceBusName -Name RootManageSharedAccessKey

# Delete ResourceGroup, uncomment the following line if you want to start over
# Remove-AzResourceGroup -Name $resourceGroupName
