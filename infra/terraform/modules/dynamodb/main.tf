resource "aws_dynamodb_table" "dynamodb_table" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key
  range_key    = "SK"  # Add this if SK is meant to be your sort key

  # Define the attributes
  attribute {
    name = var.hash_key
    type = "S"  # Adjust type as needed (S for string, N for number, B for binary)
  }

  attribute {
    name = "SK"
    type = "S"  # Adjust type as needed
  }

  # If SK is not meant to be a range key, you can create a GSI instead:
  # global_secondary_index {
  #   name               = "SKIndex"
  #   hash_key          = "SK"
  #   projection_type   = "ALL"
  #   read_capacity     = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  #   write_capacity    = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  # }

  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
}
