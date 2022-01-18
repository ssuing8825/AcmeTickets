variable "rgpname"{
    type= string 
    description="the name of the resource grp to be created"

}
variable "location"{
    type= string 
    description="the location of the resource grp to be created"
    
}

variable "stgname"{
    type=string
    description="The name of the storage account"
}
variable "aspname"{
    type=string
    description="The name of the app service plan"
}

variable "appiname"{
    type= string 
    description="the name of the app insights to be created"

}

variable "archive_file" {
  
}

variable "os" {
  type = string
}


variable "client-id" {}
variable "client-secret" {}
variable "tenant-id" {}