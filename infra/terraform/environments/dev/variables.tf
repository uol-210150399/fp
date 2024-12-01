variable "module_source_path" {
  type        = string
  default = "../../modules"
}

variable "aws_region" {
  description = "AWS region to deploy the resources in"
  type        = string
  default     = "us-east-1"
}

variable "service_environment" {
  description = "The environment for the service (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "service_name" {
  description = "The name of the service"
  type        = string
  default     = "okmillie"
}

# VPC
variable "vpc_ipv4_cidr" {
  description = "The IPv4 CIDR block for the new VPC"
  type        = string
  default     = "10.201.0.0/16"
}

variable "vpc_ipv6_cidr" {
  description = "VPC Public Subnet for availability zone 1 IPv6"
  type        = string
  default     = "fd00:10:201::/48"
}

variable "vpc_subnet_ipv4_public_1" {
  description = "Public subnet 1 IPv4 CIDR block"
  type        = string
  default     = "10.201.210.0/24"
}

variable "vpc_subnet_ipv4_public_2" {
  description = "Public subnet 2 IPv4 CIDR block"
  type        = string
  default     = "10.201.220.0/24"
}

variable "vpc_subnet_ipv4_private_1" {
  description = "Private subnet 1 IPv4 CIDR block"
  type        = string
  default     = "10.201.110.0/24"
}

variable "vpc_subnet_ipv4_private_2" {
  description = "Private subnet 2 IPv4 CIDR block"
  type        = string
  default     = "10.201.120.0/24"
}

variable "vpc_availability_zone_1" {
  description = "The availability zone for public and private subnet 1"
  type        = string
  default     = "us-east-1a"
}

variable "vpc_availability_zone_2" {
  description = "The availability zone for public and private subnet 2"
  type        = string
  default     = "us-east-1b"
}


// ################################################################
// Section - ALB and ECS Variables
// ################################################################

variable "ecs_container_exposed_port" {
  description = "Port exposed by the ECS container"
  type        = number
  default     = 3177
}

variable "ecs_health_check_endpoint" {
  description = "Health check endpoint for the target group"
  type        = string
  default     = "/health"
}

variable "ecs_desired_scale" {
  description = "Desired scale for ECS service"
  type        = number
  default     = 1
}

variable "ecs_certificate_domains" {
  description = "Domains to create certificates for"
  type        = list(string)
  default     = ["api.dev.okmillies.com"]
}

variable "ecs_certificate_primary_domain" {
  description = "Primary Domain Certificate for ACM"
  type        = string
  default     = "api.dev.okmillies.com"
}

variable "domain_name" {
  description = "The domain name for the certificate (e.g., dev.okmillies.com)"
  type        = string
  default     = "api.dev.okmillies.com"
}

variable "ecs_container_insights" {
  description = "Enable or disable container insights"
  type        = string
  default     = "disabled"
}

variable "ecs_maximum_scale" {
  description = "The maximum number of instances for ECS scaling"
  type        = string
  default     = "3"
}

variable "ecs_minimum_scale" {
  description = "The minimum number of instances for ECS scaling"
  type        = string
  default     = "1"
}

variable "ecs_task_cpu" {
  description = "CPU units for the ECS task definition"
  type        = string
  default     = 256
}

variable "ecs_task_memory" {
  description = "Memory for the ECS task definition"
  type        = string
  default     = 512
}

variable "container_definitions_file" {
  description = "Path to the container definition JSON file"
  type        = string
}

variable "launch_template_ssh_key_name" {
  description = "The SSH key name for the launch template"
  type        = string
  default     = "okmillie-dev"
}


# ################################################################
# Section - ECR
# ################################################################
variable "ecr_name" {
  description = "The name of the ECR repository"
  type        = string
  default     = "okmillie-ecr"
}

variable "image_tag_mutability" {
  description = "The mutability of the image tag"
  type        = string
  default     = "MUTABLE"
}

# ################################################################
# Section - DynamoDB
# ################################################################

variable "table_name" {
  type        = string
  description = "Name of the DynamoDB table"
  default     = "okmillie-dev"
}

variable "billing_mode" {
  type        = string
  description = "Billing mode for DynamoDB (PAY_PER_REQUEST or PROVISIONED)"
  default     = "PAY_PER_REQUEST"
}

variable "hash_key" {
  type        = string
  description = "Primary key (partition key) for the table"
  default     = "PK"
}

variable "range_key" {
  type        = string
  description = "Sort key (optional) for the table"
  default     = "SK"
}
