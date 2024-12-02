# OkMillie Infrastructure Setup Guide

## Overview
This guide provides instructions for setting up and managing OkMillie's infrastructure using Terraform and AWS.

## Prerequisites

- Terraform
- AWS CLI
- AWS Account with appropriate permissions

## Installation


```
brew install hashicorp/tap/terraform

brew install hashicorp/tap/terraform

terraform -v
```

AWS CLI Configuration
```
# Configure AWS CLI profile
aws configure --profile okmillie-terraform-local

# Verify configuration
aws s3 ls --profile okmillie-terraform-local

# List available profiles
aws configure list-profiles

# Set active profile
aws configure set-profile okmillie-terraform-local
export AWS_PROFILE=okmillie-terraform-local
```

## Initial Setup
```
aws s3api create-bucket \
    --bucket okmillie-dev-tf-state \
    --region us-east-1
```

## Terraform Commands

### Code Quality
```
# Check formatting
terraform fmt -check

# Auto-format code
terraform fmt
```

### Deployment
```
# Validate configuration
terraform validate

# Plan deployment
terraform plan --var-file="inputs.tfvars"

# Apply changes
terraform apply --var-file="inputs.tfvars"
```

## Best Practices

- Always use version control
- Review plans before applying
- Use consistent naming conventions
- Maintain documentation
- Use state locking (DynamoDB)
