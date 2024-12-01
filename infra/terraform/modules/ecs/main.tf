data "aws_caller_identity" "main" {}

resource "aws_ecs_cluster" "main" {
  name = "${var.service_name}-${var.service_environment}-cluster"

  setting {
    name  = "containerInsights"
    value = var.ecs_container_insights
  }
}

# CloudWatch Log Group for ECS Service Logs
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/${var.service_name}-${var.service_environment}-service"
  retention_in_days = var.ecs_log_group_retention
}

# ECS Task Definition
resource "aws_ecs_task_definition" "main" {
  family                = "${var.service_name}-${var.service_environment}-service"
  network_mode          = "awsvpc"
  execution_role_arn    = aws_iam_role.ecs-instance-role.arn
  container_definitions = file(var.container_definitions_file)


  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory

}

# ECS Service with Rolling Updates and Dynamic Port Mapping
resource "aws_ecs_service" "service" {
  name            = "${var.service_name}-${var.service_environment}-service"
  cluster         = aws_ecs_cluster.main.arn
  task_definition = aws_ecs_task_definition.main.family
  desired_count   = tonumber(var.ecs_desired_scale)
  launch_type     = "FARGATE"

  deployment_controller {
    type = "ECS"
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = "${var.service_name}-${var.service_environment}-service"
    container_port   = var.ecs_container_exposed_port
  }

  network_configuration {
    subnets          = var.vpc_subnet_ids
    security_groups  = [var.ec2_security_group_id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [desired_count] # Prevent updating the service due to desired count changes
  }
}



# IAM Policies for ECS Instances
resource "aws_iam_policy" "ecs_secrets_access" {
  name        = "ecs-instance-secret-access-${var.service_name}-${var.service_environment}"
  description = "ecs-instance-secret-access-${var.service_name}-${var.service_environment}"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds"
      ],
      Resource = "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.main.account_id}:secret:*"
    }]
  })
}

resource "aws_iam_policy" "ecs_logs_access" {
  name        = "ecs-instance-logs-access-${var.service_name}-${var.service_environment}"
  description = "ecs-instance-logs-access-${var.service_name}-${var.service_environment}"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      Resource = "arn:aws:logs:*:*:*"
    }]
  })
}

resource "aws_iam_role" "ecs-instance-role" {
  name = "ecs-instance-role-${var.service_name}-${var.service_environment}"
  path = "/"

  assume_role_policy = jsonencode({
    Version = "2008-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Principal = { Service = "ecs-tasks.amazonaws.com" },
        Effect    = "Allow"
      },
      {
        Action    = "sts:AssumeRole",
        Principal = { Service = "ec2.amazonaws.com" },
        Effect    = "Allow"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ecs_service_role" {
  role = aws_iam_role.ecs-instance-role.name
}

resource "aws_iam_role_policy_attachment" "ecs-instance-role-attachment" {
  role       = aws_iam_role.ecs-instance-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "ecs-instance-secret_access-role-attachment" {
  role       = aws_iam_role.ecs-instance-role.name
  policy_arn = aws_iam_policy.ecs_secrets_access.arn
}

resource "aws_iam_role_policy_attachment" "ecs-instance-logs_access-role-attachment" {
  role       = aws_iam_role.ecs-instance-role.name
  policy_arn = aws_iam_policy.ecs_logs_access.arn
}
