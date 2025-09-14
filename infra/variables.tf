variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "mongo_secret_name" {
  description = "Name of MongoDB secret in Secrets Manager"
  type        = string
}
