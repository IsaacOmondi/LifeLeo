# LifeLeo
LifeLeo is a journalling app allowing users to record their thoughts for the day. Capture life's moments that should help you reflect on your day. 

## Prerequisites
- PostgreSQL: Create a db in postgres named 'lifeleo'
## Setup
Requires node v22+. 
Uses Google Login, this would need a setting up on GCP (Google Cloud Platform)
```bash
git clone git@github.com:IsaacOmondi/LifeLeo.git
cd LifeLeo
npm install
node ace generate:key
node ace migration:run
cp ./.env.example .env
npm run dev
```
