resource "aws_dynamodb_table" "terraform_state_lock" {
  name         = "${var.service_name}-${var.service_environment}-tf-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "${var.service_name}-${var.service_environment}-tf-state-lock"
    Environment = "${var.service_environment}"
  }
}
