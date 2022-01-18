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