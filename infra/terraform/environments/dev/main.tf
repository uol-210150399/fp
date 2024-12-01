terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.72.1"
    }
  }
  backend "s3" {
    bucket = "okmillie-dev-tf-state"
    key    = "env/dev/terraform.tfstate"
    region = "us-east-1"
    # dynamodb_table = "okmillie-dev-tf-state-lock"
    # encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "${var.service_environment}"
    }
  }
}
