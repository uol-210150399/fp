variable "vpc_id" {
  description = "The VPC ID for the ALB"
  type        = string
}

variable "subnets" {
  description = "Subnets for the ALB"
  type        = list(string)
}

variable "ecs_container_exposed_port" {
  description = "The port exposed by the ECS container"
  type        = number
}

variable "ecs_health_check_endpoint" {
  description = "Health check endpoint for the target group"
  type        = string
}

variable "dev_ips" {
  description = "List of developer IPs for the ALB security group"
  type        = list(string)
  default     = [""]
}

variable "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  type        = string
}



variable "service_name" {
  description = "Service name"
  type        = string
}

variable "service_environment" {
  description = "Environment for the service (e.g., dev, staging, prod)"
  type        = string
}


variable "vpc_ipv4_cidr" {
  description = "VPC Public Subnet for availability zone 1 IPv4"
  type        = string
  default     = "10.200.0.0/16"
}

variable "ecs_certificate_domains" {
  description = "Domains to create certificates for"
  type = map(object({
    validation_domain = string
  }))
  default = {
    "set_ecs_certificate_domains.example.com" = {
      validation_domain : "example.com"
    }
  }
}

variable "ecs_certificate_primary_domain" {
  description = "Primary Domain Certificate for ACM"
  type        = string
  default     = "set_ecs_certificate_primary_domain.example.com"
}
variable "vpc_public_subnets" {
  description = "Public subnets for the VPC"
  type        = list(string)
}
