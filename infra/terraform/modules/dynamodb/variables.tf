variable "table_name" {
  type        = string
  description = "Name of the DynamoDB table"
}

variable "billing_mode" {
  type        = string
  description = "Billing mode for DynamoDB (PAY_PER_REQUEST or PROVISIONED)"
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  type        = number
  description = "Read capacity for PROVISIONED mode (ignored in PAY_PER_REQUEST)"
  default     = 1
}

variable "write_capacity" {
  type        = number
  description = "Write capacity for PROVISIONED mode (ignored in PAY_PER_REQUEST)"
  default     = 1
}

variable "hash_key" {
  type        = string
  description = "Primary key (partition key) for the table"
}

variable "range_key" {
  type        = string
  description = "Sort key (optional) for the table"
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Tags for the DynamoDB table"
  default     = {}
}