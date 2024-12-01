output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_1_id" {
  description = "ID of the public subnet in availability zone 1"
  value       = aws_subnet.public_a.id
}

output "public_subnet_2_id" {
  description = "ID of the public subnet in availability zone 2"
  value       = aws_subnet.public_b.id
}

output "private_subnet_1_id" {
  description = "ID of the private subnet in availability zone 1"
  value       = aws_subnet.private_a.id
}

output "private_subnet_2_id" {
  description = "ID of the private subnet in availability zone 2"
  value       = aws_subnet.private_b.id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "default_route_table_id" {
  description = "ID of the default route table for the VPC"
  value       = aws_default_route_table.igw_egress.id
}

output "s3_vpc_endpoint_id" {
  description = "ID of the S3 VPC endpoint"
  value       = aws_vpc_endpoint.s3.id
}
output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}
