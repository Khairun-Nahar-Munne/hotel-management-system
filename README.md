
# Hotel Management API

A RESTful API built with Node.js, Express.js, and TypeScript for managing hotel information.

## Features

- CRUD operations for hotel management
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
│   ├── models/
│   │   └── Hotel.ts
│   ├── routes/
│   │   └── hotelRoutes.ts
│   ├── tests/
│   │   └── hotel.test.ts
│   └── app.ts
├── database/
│   └── hotels/
├── uploads/
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── package.json

```

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.


### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- TypeScript knowledge
- Git
- VS code editor


### Clone the Repository

```bash
- git clone https://github.com/Khairun-Nahar-Munne/w3_assignment2.git
- cd property-details-website 
```

### Project Setup

#### Create project directory
```bash
mkdir hotel-management-api
cd hotel-management-api
```
#### Initialize project
```bash
npm init -y
```
#### Install dependencies
```bash
npm install express cors dotenv multer slugify uuid
```
#### Install dev dependencies
```bash
npm install -D typescript @types/node @types/express @types/cors @types/multer \
  ts-node-dev jest ts-jest @types/jest supertest @types/supertest \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```

### Run Application

#### Development mode:
```bash
npm run dev
```

#### Production mode:
```bash
npm run build
npm start
```

#### Run tests:
```bash
npm test
```

#### Lint code:
```bash
npm run lint
```

### How to open the website

- Open `propertyDetails.html` in your preferred web browser.
- Explore different property listings, features, and safety guidelines.

## Contributing
Contributions are welcome! Here's how you can contribute:

### Fork the Repository
```bash
- git clone https://github.com/Khairun-Nahar-Munne/w3_assignment2.git
- cd w3_assignment2
```
### Create a New Branch

```bash
git checkout -b feature/add-new-feature
```
### Make Modifications and Commit Changes
```bash
git commit -m 'Add new feature'
```
### Push Changes to the Branch

```bash
git push origin feature/add-new-feature
```
### Create a New Pull Request
- Navigate to the repository on GitHub.
- Click on the "Compare & pull request" button.
- Fill in the pull request details and submit it for review.


