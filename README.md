# Warehouse Management System
A full-stack web application for real-time inventory tracking, built with Django and React.

# Overview
This system tracks the position and quantity of all items in a warehouse. It supports real-time updates, zone-level inventory checks, and provides a complete history for every stock movement.

# Key Features
* Real-Time UI updates via Django WebSockets
* Physical Zone-level stock validation
* Movement history with filtering
* Add/Manage items, categories, and zones from the UI
* Includes management utilities for data seeding and API load testing


# Quick Setup

Follow these steps to get the application running locally. You will need two separate terminals.

# Backend (Django) - Terminal 1

1.  # Clone the Repository:
    git clone <repository-url>
    cd warehouse

2.  ## Create and Activate a Virtual Environment:
    python -m venv venv
    source venv/bin/activate 

3.  # Install Dependencies:
    pip install -r requirements.txt

4.  # Create and Apply Database Migrations:**
    * Create a `.env` file in the project root folder. Copy the contents from `env.example` and paste them into the new `.env` file.
    * Create a MySQL database : `CREATE DATABASE warehouse_db;`
    * Add database credentials to the `.env` file.
    * Run the migration command:
        python manage.py migrate

5.  # (Optional) Seed the Database: To test with a large amount of fake data, run:
    python manage.py seed_data

6.  # Run the Server:
    python manage.py runserver

# Frontend (React) - Terminal 2

1.  # Navigate to the Frontend Directory:
    cd warehouse_frontend
    cd warehouse

2.  # Install Dependencies:
    npm install

3.  # Run the Development Server:
    npm start
