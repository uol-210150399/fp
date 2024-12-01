resource "aws_vpc" "main" {
  cidr_block           = var.vpc_ipv4_cidr
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.service_name}-${var.service_environment}"
    Description = "${var.service_name}-${var.service_environment}"
  }
}


// allows access into the default vpc for the region. Use `data.aws_vpc.default.id` for example
// Should only use for troubleshooting. Nothing associated with an environment should be in this vpc.
data "aws_vpc" "default" {
  default = true
}

// ################################################################
//
// VPC - Internet Gateway
//
// ################################################################

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.service_name}-${var.service_environment}"
    Description = "${var.service_name}-${var.service_environment}"
  }
}


// ################################################################
//
// VPC - Security Groups
//
// ################################################################

resource "aws_security_group" "main" {
  name        = "Do not use"
  description = "Do not use the default security group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description      = "Allow all traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = [aws_vpc.main.cidr_block]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description      = "Allow all outgoing traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"] // This will be closed down to allow access to AWS services only in the future, we will need to create vpc endpoints for other services
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name        = "default - do not use"
    Description = "default - do not use"
  }
}




// ################################################################
//
// VPC - Route Table
//
// ################################################################

resource "aws_default_route_table" "igw_egress" {
  default_route_table_id = aws_vpc.main.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.service_name}-${var.service_environment}-igw_egress"
    Description = "${var.service_name}-${var.service_environment}-igw_egress"
  }
}


// ################################################################
//
// VPC - Subnets
//
// ################################################################

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_subnet_ipv4_public_1
  availability_zone       = var.vpc_availability_zone_1
  map_public_ip_on_launch = true
  depends_on = [
    aws_internet_gateway.main
  ]

  tags = {
    Name = "${var.service_name}-${var.service_environment}_public_a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_subnet_ipv4_public_2
  availability_zone       = var.vpc_availability_zone_2
  map_public_ip_on_launch = true
  depends_on = [
    aws_internet_gateway.main
  ]

  tags = {
    Name = "${var.service_name}-${var.service_environment}_public_b"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_subnet_ipv4_private_1
  availability_zone       = var.vpc_availability_zone_1
  map_public_ip_on_launch = false
  depends_on = [
    aws_internet_gateway.main
  ]

  tags = {
    Name = "${var.service_name}-${var.service_environment}_private_a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_subnet_ipv4_private_2
  availability_zone       = var.vpc_availability_zone_2
  map_public_ip_on_launch = false
  depends_on = [
    aws_internet_gateway.main
  ]

  tags = {
    Name = "${var.service_name}-${var.service_environment}_private_b"
  }
}


// ################################################################
//
// VPC - S3 VPC Endpoint
//
// ################################################################

resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids = [
    aws_default_route_table.igw_egress.id,
  ]
  tags = {
    Name = "${var.service_name}-${var.service_environment}_s3_endpoint"
  }
}
