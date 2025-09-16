🚀 MERN + RabbitMQ Microservices Deployment

This project is a production-style MERN application deployed on AWS EC2 with RabbitMQ messaging and MongoDB-backed microservices.

It demonstrates event-driven microservices architecture with:

Users, Products, Orders, Analytics microservices

RabbitMQ for asynchronous communication

MongoDB for persistence

Next.js frontend for interaction

🏗️ Architecture

Frontend (Next.js) → UI for interacting with services

Users Service → Manages users (MongoDB backend)

Products Service → Manages products (MongoDB backend)

Orders Service → Creates orders and publishes events to RabbitMQ

Analytics Service → Consumes RabbitMQ events and processes analytics

MongoDB → Databases for services

RabbitMQ → Message broker for microservices communication

Flow:
Frontend → Orders API → RabbitMQ → Analytics API
↑ ↓
Users API | Products API

⚡ Prerequisites

AWS EC2 Linux instance (tested on Amazon Linux 2, user: ec2-user)

Docker installed on EC2

Docker Compose installed at /usr/local/bin/docker-compose

Open AWS Security Group ports:

3000 → Frontend

5001 → Users API

5002 → Products API

5003 → Orders API

5004 → Analytics API

15672 → RabbitMQ Management

🔧 Deployment on EC2

SSH into EC2

ssh -i your-key.pem ec2-user@52.200.29.90


Clone the repository

git clone https://github.com/your-username/MERN_RabbitMQ_Deployment.git
cd MERN_RabbitMQ_Deployment


Start services with Docker Compose

sudo /usr/local/bin/docker-compose up -d --build


Verify running containers

docker ps

🌐 Accessing Services

Frontend → http://52.200.29.90:3000

Users API → http://52.200.29.90:5001

Products API → http://52.200.29.90:5002

Orders API → http://52.200.29.90:5003

Analytics API → http://52.200.29.90:5004

RabbitMQ Management → http://52.200.29.90:15672
 (user: guest, pass: guest)

🐇 RabbitMQ Usage

When a new Order is created, the Orders Service publishes a message to RabbitMQ (orderQueue).

The Analytics Service consumes this message and updates analytics data.

📦 Example API Usage

1️⃣ Create a User

curl -X POST http://52.200.29.90:5001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'


2️⃣ Create a Product

curl -X POST http://52.200.29.90:5002/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":1200,"category":"Electronics"}'


3️⃣ Place an Order (Triggers RabbitMQ)

curl -X POST http://52.200.29.90:5003/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"<USER_ID>","productId":"<PRODUCT_ID>","quantity":1}'


4️⃣ Get Orders

curl http://52.200.29.90:5003/orders


5️⃣ Check Analytics

curl http://52.200.29.90:5004/analytics

✅ GitHub Actions (Reference)

A simple workflow to deploy on EC2 via SSH:

name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          port: 22
          script: |
            cd ~/MERN_RabbitMQ_Deployment
            git fetch --all
            git reset --hard origin/main
            /usr/local/bin/docker-compose down
            /usr/local/bin/docker-compose up -d --build
            docker ps

🔒 Security Notes

Store EC2 IP, username, and private key as GitHub Secrets (EC2_HOST, EC2_USER, EC2_KEY).

Restrict RabbitMQ access to trusted IPs if used in production.

Use TLS & private subnets for databases and brokers in real deployments.

📜 License

MIT License – free to use and modify.
