# Hotel Management System API

A RESTful API built with Node.js, Express.js, and TypeScript for managing hotel information.

## Features

- POST, GET and PUT operations for hotel management
- Image upload functionality
- JSON file-based data storage
- TypeScript implementation
- Unit testing with Jest
- ESLint configuration
- Input validation
- Error handling


## Technology Stack

- Node JS
- Express
- TypeScript

## Project Structure

```plaintext
hotel-management-system/
├── src/
│   ├── controllers/
│   │   └── hotelController.ts
│   ├── database/
│   │   └── hotels/
│   ├── models/
│   │   └── types.ts
│   ├── routes/
│   │   └── hotelRoutes.ts
│   ├── services/
│   │   └── hotelServices.ts
│   ├── tests/
│   │   └──  hotelController.test.ts
│   │   └──  hotelService.test.ts
│   │   └──  jest.config.js
│   └── app.ts
├── uploads/
├── ReadME.md
├── .gitignore
├── babel.config.js
├── .eslintrc.json
├── package.json
└── tsconfig.json


```

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Project Setup

#### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- VS code editor


#### Clone the Repository

```bash
- git clone https://github.com/Khairun-Nahar-Munne/hotel-management-system.git
- cd hotel-management-system
```

#### Add Another Folder in Root
```bash
- mkdir -p uploads/{images}
```

#### Initialize Project
```bash
- npm init -y
```
#### Install Dependencies
```bash
- npm install express cors dotenv multer slugify uuid
```
#### Install Dev Dependencies
```bash
- npm install -D typescript @types/node @types/express @types/cors @types/multer \
  ts-node-dev jest ts-jest @types/jest supertest @types/supertest \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```

### Run Application

#### Development Mode:
```bash
- npm run dev
```

#### Production Mode:
```bash
- npm run build
- npm start
```

#### Run Tests:
```bash
- npm test
```

#### Run Esint:
```bash
- npx eslint .
```

### Test Opeartions Using CURL

#### POST Hotel Data:

```bash
- curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Suites",
    "description": "A luxury hotel with world-class amenities",
    "guestCount": 2,
    "bedroomCount": 1,
    "bathroomCount": 1,
    "amenities": ["pool", "gym", "restaurant", "spa"],
    "host": {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "987-654-3210"
    },
    "address": {
      "street": "456 Elite Rd",
      "city": "Prestige City",
      "state": "Prime State",
      "country": "Exotic Country",
      "zipCode": "67890"
    },
    "location": {
      "latitude": 23.45,
      "longitude": 67.89
    }
  }'
  ```

#### GET Hotel Data by Unique-ID

```bash
- curl http://localhost:3000/api/hotels/1731479202985
```
#### GET Hotel Data by by slug

```bash
- curl http://localhost:3000/api/hotels/slug/ocean-breeze-resort
```

#### PUT Hotel Data by Unique-ID

```bash
- curl -X PUT http://localhost:3000/api/hotels/1731416516744 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Grand Plaza Hotel & Suites",
    "description": "A luxurious 5-star hotel in the heart of Manhattan",
    "guestCount": 6,
    "bedroomCount": 3,
    "bathroomCount": 3,
    "amenities": [
      "Free High-Speed WiFi",
      "Infinity Pool",
      "Luxury Spa",
      "Modern Gym",
      "Michelin Star Restaurant",
      "24/7 Concierge",
      "Valet Parking",
      "Executive Business Center"
    ],
    "host": {
      "name": "John Smith",
      "email": "john.smith@grandplaza.com",
      "phone": "+1-555-123-4567"
    },
    "address": {
      "street": "123 Luxury Avenue",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'

```

#### Post Hotel Images

```bash
  - curl -X POST http://localhost:3000/api/hotels/1731479202985/images \
  -F "images=@/home/w3e60/Documents/w3_assignment1/images/img1.jpg" \
  -F "images=@/home/w3e60/Documents/w3_assignment1/images/img2.jpg" \
  -F "images=@/home/w3e60/Documents/w3_assignment1/images/img3.jpg" \
  -F "images=@/home/w3e60/Documents/w3_assignment1/images/img4.jpg"

```
#### Post Room Details in Hotel Data
```bash
- curl -X POST http://localhost:3000/api/hotels/ocean-breeze-resort/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomTitle": "Deluxe Suite",
    "bedroomCount": 1
  }'
  ```

#### Post Room Image
```bash
  - curl -X POST http://localhost:3000/api/hotels/ocean-breeze-resort/rooms/deluxe-suite/image  
   -F "image=@/home/w3e60/Documents/w3_assignment1/images/img1.jpg"
```

## Contributing
Contributions are welcome! Here's how you can contribute:

### Fork the Repository
```bash
- git clone https://github.com/Khairun-Nahar-Munne/hotel-management-system.git
- cd hotel-management-system
```
### Create a New Branch

```bash
- git checkout -b feature/add-new-feature
```
### Make Modifications and Commit Changes
```bash
- git commit -m 'Add new feature: [brief description of the feature]'

```
### Push Changes to the Branch

```bash
- git push origin feature/add-new-feature

```
### Create a New Pull Request
- Navigate to the repository on GitHub.
- Click on the "Compare & pull request" button.
- Fill in the pull request details and submit it for review.


