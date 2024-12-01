
# ################################################################
# VPC
# ################################################################
module "vpc" {
  source = "../../modules/vpc"

  vpc_ipv4_cidr             = var.vpc_ipv4_cidr
  vpc_subnet_ipv4_public_1  = var.vpc_subnet_ipv4_public_1
  vpc_subnet_ipv4_public_2  = var.vpc_subnet_ipv4_public_2
  vpc_subnet_ipv4_private_1 = var.vpc_subnet_ipv4_private_1
  vpc_subnet_ipv4_private_2 = var.vpc_subnet_ipv4_private_2
  vpc_availability_zone_1   = var.vpc_availability_zone_1
  vpc_availability_zone_2   = var.vpc_availability_zone_2
  service_name              = var.service_name
  service_environment       = var.service_environment
  aws_region                = var.aws_region
}

data "aws_route53_zone" "dev" {
  name = "dev.okmillies.com"
}

# ################################################################
# ALB
# ################################################################
module "alb" {
  source                         = "../../modules/alb"
  service_name                   = var.service_name
  service_environment            = var.service_environment
  ecs_certificate_domains        = var.ecs_certificate_domains
  ecs_certificate_primary_domain = var.ecs_certificate_primary_domain
  domain_name                    = var.domain_name
  route53_zone_id                = data.aws_route53_zone.dev.id
  vpc_id                         = module.vpc.vpc_id
  subnets                        = ["${module.vpc.private_subnet_1_id}", "${module.vpc.private_subnet_2_id}"]
  ecs_container_exposed_port     = var.ecs_container_exposed_port
  ecs_health_check_endpoint      = var.ecs_health_check_endpoint
  vpc_cidr_block                 = var.vpc_ipv4_cidr
  vpc_public_subnets             = ["${module.vpc.public_subnet_1_id}", "${module.vpc.public_subnet_2_id}"]
}
# ################################################################

