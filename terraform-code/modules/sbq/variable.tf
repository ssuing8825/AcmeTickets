variable "rgpname"{
    type= string 
    description="the name of the resource grp to be created"

}
variable "location"{
    type= string 
    description="the location of the resource grp to be created"
    
}

variable "numberofqueue"{
    type= number 
    description="Defines the number of queues required in the service bus"
    
}
variable "sbnamespace"{
    type= string 
    description="the namespace of the Service Bus"

}