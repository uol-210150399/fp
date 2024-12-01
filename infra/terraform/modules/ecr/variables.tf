variable "service_name" {
  description = "The name of the service"
  type        = string
}

variable "service_environment" {
  description = "The environment of the service (e.g., dev, staging, prod)"
  type        = string
}

variable "ecr_name" {
  description = "The name of the ECR repository"
  type        = string
}

variable "image_tag_mutability" {
  description = "The mutability of the image tag"
  type        = string
  default     = "MUTABLE"
}
