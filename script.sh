#!/bin/bash
sudo rm -r server/v1
git pull
cd server/v1
npm install
pm2 restart app.jsultrasound volumes, 3D recordings & S3 uploads
├── streaming-service/        # AWS IVS live streaming & VR/MR simulation telemetry
├── analytics-service/        # Trainee dashboard metrics, skill competency & benchmarking
└── notification-service/     # Emails, system alerts & student query ticketing