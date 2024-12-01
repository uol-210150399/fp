output "aws_lb_target_group_arn" {
  description = "The ARN of the target group"
  value       = aws_lb_target_group.main.arn
}

output "aws_lb_security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.alb_default.id
}

output "aws_instance_security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.instances.id
}

output "aws_bastion_security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.bastion.id
}

output "aws_lb_target_group_instance_arn" {
  description = "The ARN of the target group"
  value       = aws_lb_target_group.main.arn
}
