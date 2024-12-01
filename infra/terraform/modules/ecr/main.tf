
resource "aws_ecr_repository" "main" {
  name = var.ecr_name

  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Name        = "${var.service_name}-${var.service_environment}-ecr"
    Environment = var.service_environment
  }
}
