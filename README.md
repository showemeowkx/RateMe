# 📌 RateMe - review tracker

## 🚀 Overview

RateMe is a web application that allows users to track and leave reviews for different products. Users can browse and add products, submit and analyze reviews using data analytics.

## ✅ Features

- Product listing and search
- User authentication & review submission
- Review rating system
- Data analysis on review trends
- Responsive UI with React

## 🚀 Getting Started

1️⃣ Prerequisites

Ensure you have the following installed:

- Node.js and npm
- Docker, Docker Compose
- Python 3.10.11
- Stripe CLI ([instalation guide](https://docs.stripe.com/stripe-cli))

2️⃣ Installation

Clone the repository

```bash
git clone https://github.com/showemeowkx/RateMe.git
cd rate-me
```

Create an environment file in the root directory (`./.env`)

Log in to Stripe CLI and connect to webhooks

```bash
stripe login
stripe listen -f http://host:port/payments/webhooks
```

Copy the generated key and pass it to the `.env` file

```bash
STRIPE_WEBHOOK_KEY=whsec_YOUR_KEY
```

Add other required values to the `.env` file (e.g., DB credentials, ports)

Build the Docker images

```bash
docker-compose build
```

Run the app

```bash
docker-compose up
```

## 🤝 Contribution Guide

1. Fork the repository
2. Create a new branch (feature-xyz)
3. Commit and push
4. Open a pull request

# Rate! Rate! Rate!
