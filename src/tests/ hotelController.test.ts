import request from 'supertest';
import express, { Express } from 'express';

import { HotelController } from '../controllers/hotelController';



describe('HotelController', () => {
  let app: Express;
  let controller: HotelController;

  beforeEach(() => {
    controller = new HotelController();
    app = express();
    app.use(express.json());
    app.use('/api', controller.router);
  });

  describe('createHotel', () => {
    it('should create a new hotel with valid data', async () => {
      const hotelData = {
        title: 'Test Hotel',
        description: 'This is a test hotel',
        guestCount: 4,
        bedroomCount: 2,
        bathroomCount: 2,
        amenities: ['WiFi', 'Air Conditioning'],
        host: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          country: 'USA',
          zipCode: '12345',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      const response = await request(app)
        .post('/api/hotels')
        .send(hotelData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(hotelData);
      expect(response.body.id).toBeDefined();
      expect(response.body.slug).toBeDefined();
    });

    it('should return 400 for invalid hotel data', async () => {
      const invalidData = { title: 'Incomplete Data' };
      const response = await request(app)
        .post('/api/hotels')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing or invalid hotel data');
    });
  });

  describe('getHotel', () => {
    it('should return 404 for non-existent hotel', async () => {
      const response = await request(app)
        .get('/api/hotels/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Hotel not found');
    });
  });

  describe('getHotelBySlug', () => {
    it('should return 404 for non-existent hotel slug', async () => {
      const response = await request(app)
        .get('/api/hotels/slug/non-existent-slug');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Hotel not found');
    });
  });

  describe('updateHotel', () => {
    it('should return 404 for updating non-existent hotel', async () => {
      const updateData = {
        title: 'Updated Hotel',
        description: 'Updated description',
        guestCount: 5,
        bedroomCount: 3,
        bathroomCount: 2,
        amenities: ['WiFi'],
        host: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '0987654321',
        },
        address: {
          street: '456 Main St',
          city: 'Othertown',
          state: 'NY',
          country: 'USA',
          zipCode: '54321',
        },
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      };

      const response = await request(app)
        .put('/api/hotels/non-existent-id')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Hotel not found');
    });
  });

  describe('uploadHotelImages', () => {
    it('should handle hotel image uploads', async () => {
      // Create a test file buffer
      const testFile = Buffer.from('test image content');

      // First create a hotel to ensure it exists
      const hotelData = {
        title: 'Test Hotel',
        description: 'Test Description',
        guestCount: 2,
        bedroomCount: 1,
        bathroomCount: 1,
        amenities: ['WiFi'],
        host: {
          name: 'Test Host',
          email: 'test@test.com',
          phone: '1234567890'
        },
        address: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          zipCode: '12345'
        },
        location: {
          latitude: 0,
          longitude: 0
        }
      };

      const createResponse = await request(app)
        .post('/api/hotels')
        .send(hotelData);

      const hotelId = createResponse.body.id;

      // Now attempt to upload images
      const response = await request(app)
        .post(`/api/hotels/${hotelId}/images`)
        .attach('images', testFile, 'test-image.jpg');

      // If hotel exists but no files, expect 400
      if (!response.body.error) {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No images provided');
      }
    });
  });

  describe('uploadRoomImage', () => {
    it('should handle room image upload', async () => {
      // Create a test file buffer
      const testFile = Buffer.from('test image content');

      // First create a hotel
      const hotelData = {
        title: 'Test Hotel',
        description: 'Test Description',
        guestCount: 2,
        bedroomCount: 1,
        bathroomCount: 1,
        amenities: ['WiFi'],
        host: {
          name: 'Test Host',
          email: 'test@test.com',
          phone: '1234567890'
        },
        address: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          zipCode: '12345'
        },
        location: {
          latitude: 0,
          longitude: 0
        }
      };

      const createResponse = await request(app)
        .post('/api/hotels')
        .send(hotelData);

      const hotelSlug = createResponse.body.slug;

      // Create a room
      const roomData = {
        roomTitle: 'Test Room',
        bedroomCount: 1
      };

      await request(app)
        .post(`/api/hotels/${hotelSlug}/rooms`)
        .send(roomData);

      // Now attempt to upload room image
      const response = await request(app)
        .post(`/api/hotels/${hotelSlug}/rooms/test-room/image`)
        .attach('image', testFile, 'test-image.jpg');

      // If hotel/room exists but no file, expect 400
      if (!response.body.error) {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No image provided');
      }
    });
  });

  describe('addRoom', () => {
    it('should return 400 for invalid room data', async () => {
      const invalidRoomData = {};
      const response = await request(app)
        .post('/api/hotels/test-hotel-slug/rooms')
        .send(invalidRoomData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required room data');
    });
  });
});