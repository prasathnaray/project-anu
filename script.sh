#!/bin/bash
sudo rm -r server/v1
git pull
cd server/v1
npm install
pm2 restart app.js