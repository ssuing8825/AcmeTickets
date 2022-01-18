# This file declares all the varaible that will be needed by the main.tf file
variable "spn-client-id" {}
variable "spn-subscription-id" {}
variable "spn-client-secret" {}
variable "spn-tenant-id" {}

variable "rgpname"{
    type= string 
    description="the name of the resource grp to be created"

}
variable "rgpnamesec"{
    type= string 
    description="the name of the secondary resource grp to be created"

}
variable "location"{
    type= string 
    description="the location of the resource grp to be created"
    
}

variable "locationsec"{
    type= string 
    description="the location of the  secondaryresource grp to be created"
    
}

variable "keyvaultname"{
    type=string
    description="The name of the key vault"
    
}

variable "vnetname"{
    type=string
    description="The name of the Virtual Network"
    
}

variable "sbtname"{
    type= string 
    description="the name of the test Subnet to be created"

}

variable "lawname"{
    type=string
    description= "The name of the Log Analytics Workspace."
    
} 

variable "appiname"{
    type= string 
    description="the name of the app insights to be created"

}

variable "stgname"{
    type=string
    description="The name of the storage account"
}
variable "aspname"{
    type=string
    description="The name of the app service plan"
}

variable "nsgname"{
    type=string
    description="The name of the nsg"
}

variable "prefix" {
  description = "The prefix which should be used for all resources in this example"
}

variable "lbname"{
    type= string 
    description="the name of the Load Balancer"

}
variable "plsname"{
    type= string 
    description="the name of the Private Link Service"

}
variable "piename"{
    type= string 
    description="the name of the Private endpoint"

}
variable "pipname"{
    type= string 
    description="the name of the Public IP"

}
variable "sbnamespace"{
    type= string 
    description="the namespace of the Service Bus"

}
variable "numberofqueue"{
    type= number 
    description="Defines the number of queues required in the service bus"
    
}
variable "numberoftopic"{
    type= number 
    description="Defines the number of queues required in the service bus"
    
}