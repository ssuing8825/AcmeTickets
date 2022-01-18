
# Setting up POT on local machine



1) Install azure power shell module : [Install the Azure Az PowerShell module | Microsoft Docs](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-7.1.0)
1) Connect to azure in a PS terminal: Connect-AzAccount -Subscription "YOUR SUBSCFRITPION NAME"
1) Change directory to nsbcommon folder in the PS terminal
1) Open the “Nsb.Commons\deployCosmosAndSB.ps1” file and change the following parameters accordingly and execute the script from the PS session openedd in step 2

    $location= "Central US"

    $resourceGroupName = "EastPotDeployRg" # Resource Group name

    $accountName = "evecosmosaccountname" # Must be all lower case

    $databaseName = "evecosmosDatabase"

    $serviceBusName ="eveservicebus"

1) The above script creates cosmos and SB and ouputs the cosmos (Primary SQL Connection String) and sb (PrimaryConnectionString) connection strings in the terminal, updated these values in the following files.
   1. Local.settings.json (in the root folder) 
   1. ITOps\AcmeTickets.ITOps.SyncApi\appsettings.json 
1) Execute the following command “dotnet tool install -g NServiceBus.Transport.AzureServiceBus.CommandLine” this will install the nservicebus SB tooling.
1) In the nsbcommon solution folder, open the file “Nsb.Commons\queues.ps1” and modify the “$env:AzureServiceBus\_ConnectionString“  with value from step 5 and execute the ps script.
1) Postman setup 
   1. open the folder Postman\_Collection (in the root folder) 
   1. Import collection : Eventellect.postman\_collection.json
   1. Import environment: Local.postman\_environment.json
1) Follow the POT video demo steps to run the flow.
