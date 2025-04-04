
# ACM Certificate
resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name  # This will be api.dev.okmillies.com
  validation_method = "DNS"
  
  tags = {
    Name        = "${var.service_name}-${var.service_environment}-certificate"
    Environment = var.service_environment
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = var.route53_zone_id
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  ttl             = 60
  allow_overwrite = true
}

resource "aws_route53_record" "alb" {
  zone_id = var.route53_zone_id
  name    = var.domain_name  # This will be api.dev.okmillies.com
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id               = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# Application Load Balancer (ALB) Configuration
resource "aws_lb" "main" {
  name               = "${var.service_name}-${var.service_environment}-lb"
  load_balancer_type = "application"
  internal           = false
  subnets            = var.vpc_public_subnets
  security_groups    = [aws_security_group.alb_default.id]
}

# Listener for HTTP (Redirect to HTTPS)
resource "aws_lb_listener" "alb_port_80_listener" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener for HTTPS
resource "aws_lb_listener" "alb_port_443_listener" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.main.id

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# ALB Target Group for ECS Tasks
resource "aws_lb_target_group" "main" {
  name        = "${var.service_name}-${var.service_environment}-m-tg"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = var.ecs_health_check_endpoint
    healthy_threshold   = 2
    unhealthy_threshold = 5
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "ALB-TG-${var.service_name}"
    Description = "ALB Target Group"
  }
}

# ALB Security Group
resource "aws_security_group" "alb_default" {
  name        = "ALB Allow All"
  description = "ALB Allow All"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "ALB Security Group"
    Description = "Allow HTTP and HTTPS"
  }
}

# ECS Instance Security Group
resource "aws_security_group" "instances" {
  name        = "Instances"
  description = "Applied to all EC2 instances"
  vpc_id      = var.vpc_id

  ingress {
    description      = "Allow TLS Traffic"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = [var.vpc_cidr_block]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description = "Load balancer"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    security_groups = [
      aws_security_group.alb_default.id,
    ]
  }

  egress {
    description      = "Allow all traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "EC2 Instances Security Group"
    Description = "Applied to all EC2 instances"
  }
}

# Bastion Security Group
resource "aws_security_group" "bastion" {
  name        = "Bastion"
  description = "Bastion access"
  vpc_id      = var.vpc_id

  egress {
    description      = "Allow all traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "Bastion Security Group"
    Description = "Allow access for bastion"
  }
}
