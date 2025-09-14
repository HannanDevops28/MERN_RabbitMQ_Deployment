provider "aws" {
  region = "us-east-1"  # free tier eligible
}

resource "aws_security_group" "mern_sg" {
  name        = "mern-security-group"
  description = "Allow ports for MERN app + RabbitMQ"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 3000
    to_port     = 5004
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5672
    to_port     = 5672
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 15672
    to_port     = 15672
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "mern_app" {
  ami           = "ami-0c02fb55956c7d316" # Ubuntu 22.04
  instance_type = "t2.micro"
  key_name      = var.key_name
  security_groups = [aws_security_group.mern_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install -y docker.io docker-compose jq awscli

              # Fetch Mongo URI from Secrets Manager
              MONGO_URI=$(aws secretsmanager get-secret-value --secret-id ${var.mongo_secret_name} --query SecretString --output text | jq -r .MONGO_URI)
              echo "export MONGO_URI=$MONGO_URI" >> /etc/profile
              source /etc/profile

              # Pull your repo (replace with your GitHub repo)
              apt install -y git
              cd /home/ubuntu
              git clone https://github.com/HannanDevops28/MERN_RabbitMQ_Deployment.git
              cd MERN_RabbitMQ_Deployment

              docker-compose up -d
              EOF

  tags = {
    Name = "MERN-FreeTier"
  }
}
