# ################################################################
# ECR
# ################################################################

module "ecr" {
  source = "../../modules/ecr"

  image_tag_mutability = var.image_tag_mutability
  ecr_name             = "${var.service_name}-${var.service_environment}-ecr"
  service_name         = var.service_name
  service_environment  = var.service_environment

}

# ################################################################


# ################################################################
# ECS
# ################################################################

module "ecs_service" {
  source = "../../modules/ecs"

  # General service variables
  service_name        = var.service_name
  service_environment = var.service_environment
  aws_region          = var.aws_region



  # ECS configuration
  ecs_container_insights  = var.ecs_container_insights
  ecs_maximum_scale       = var.ecs_maximum_scale
  ecs_minimum_scale       = var.ecs_minimum_scale
  ecs_desired_scale       = var.ecs_desired_scale
  ecs_task_cpu            = var.ecs_task_cpu
  ecs_task_memory         = var.ecs_task_memory
  ecs_log_group_retention = 7


  # Load balancer and networking
  ecs_container_exposed_port    = var.ecs_container_exposed_port
  alb_target_group_arn          = module.alb.aws_lb_target_group_arn
  vpc_subnet_ids                = ["${module.vpc.private_subnet_1_id}", "${module.vpc.private_subnet_2_id}"]
  ec2_security_group_id         = module.alb.aws_instance_security_group_id
  vpc_public_subnet_a_id        = module.vpc.public_subnet_1_id
  alb_target_group_instance_arn = module.alb.aws_lb_target_group_instance_arn
  vpc_availability_zone_1       = var.vpc_availability_zone_1
  vpc_availability_zone_2       = var.vpc_availability_zone_2


  # Task Definition Configurations
  container_definitions_file = var.container_definitions_file
}


