variable "vpc_ipv4_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "vpc_subnet_ipv4_public_1" {
  description = "CIDR block for the public subnet in availability zone 1"
  type        = string
}

variable "vpc_subnet_ipv4_public_2" {
  description = "CIDR block for the public subnet in availability zone 2"
  type        = string
}

variable "vpc_subnet_ipv4_private_1" {
  description = "CIDR block for the private subnet in availability zone 1"
  type        = string
}

variable "vpc_subnet_ipv4_private_2" {
  description = "CIDR block for the private subnet in availability zone 2"
  type        = string
}

variable "vpc_availability_zone_1" {
  description = "Availability zone 1 for the VPC"
  type        = string
}

variable "vpc_availability_zone_2" {
  description = "Availability zone 2 for the VPC"
  type        = string
}

variable "service_name" {
  description = "Name of the service"
  type        = string
}

variable "service_environment" {
  description = "Environment for the service (e.g., dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region for the VPC"
  type        = string
}
