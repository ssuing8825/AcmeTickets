variable "rgpname"{
    type= string 
    description="the name of the resource grp to be created"

}
variable "location"{
    type= string 
    description="the location of the resource grp to be created"
    
}
variable "vnetname"{
    type= string 
    description="the name of the Virtual network to be created"

}

variable "sbtname"{
    type= string 
    description="the name of the Subnet to be created"

}

variable "nsgname"{
    type= string 
    description="the name of the NSG to be created"

}