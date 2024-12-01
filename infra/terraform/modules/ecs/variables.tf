# AWS Region
variable "aws_region" {
  description = "AWS region to deploy the resources in"
  type        = string
}

# Service name and environment
variable "service_name" {
  description = "The name of the service"
  type        = string
}

variable "service_environment" {
  description = "The environment for the service (e.g., dev, staging, prod)"
  type        = string
}

# ECS Task and Service Configurations
variable "ecs_container_insights" {
  description = "Enable or disable ECS container insights"
  type        = string
  default     = "enabled"
}

variable "ecs_maximum_scale" {
  description = "Maximum scale for ECS auto-scaling"
  type        = number
}

variable "ecs_minimum_scale" {
  description = "Minimum scale for ECS auto-scaling"
  type        = number
}

variable "ecs_desired_scale" {
  description = "Desired scale for ECS service"
  type        = number
}

# Task Definition Configurations
variable "ecs_task_cpu" {
  description = "The amount of CPU units used by the ECS task"
  type        = number
}

variable "ecs_task_memory" {
  description = "The amount of memory (in MiB) used by the ECS task"
  type        = number
}

variable "container_definitions_file" {
  description = "Path to the container definitions JSON file"
  type        = string
}

# Load Balancer and Networking Configurations
variable "alb_target_group_arn" {
  description = "ARN of the target group for the ECS service"
  type        = string
}

variable "alb_target_group_instance_arn" {

  description = "ARN of the target group for the ECS service"
  type        = string

}

variable "ecs_container_exposed_port" {
  description = "Port exposed by the ECS container"
  type        = number
}

variable "vpc_subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "ec2_security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "vpc_availability_zone_1" {
  description = "VPC Availability Zone 1"
  type        = string
}

variable "vpc_availability_zone_2" {
  description = "VPC Availability Zone 2"
  type        = string
}



variable "vpc_public_subnet_a_id" {
  description = "Public subnet A ID"
  type        = string
}

variable "ecs_log_group_retention" {
  description = "Retention period for the ECS log group"
  type        = number
  default     = 14
}
