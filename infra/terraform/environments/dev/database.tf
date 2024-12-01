module "dynamodb_user_data" {
  source     = "../../modules/dynamodb"
  table_name = var.table_name
  hash_key   = var.hash_key
  range_key  = var.range_key
  tags = {
    Environment = var.service_environment
    Purpose     = var.service_name
  }
}