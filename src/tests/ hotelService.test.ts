import { HotelService } from '../services/hotelService';
import { Hotel, Room } from '../models/types';
import fs from 'fs/promises';
jest.mock('fs/promises');

describe('HotelService', () => {
  let hotelService: HotelService;
  
  const mockHotelData: Omit<Hotel, 'id' | 'slug'> = {
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
    images: [],
    rooms: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hotelService = new HotelService();
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
  });

  describe('createHotel', () => {
    it('should create a new hotel successfully', async () => {
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const hotel = await hotelService.createHotel(mockHotelData);

      expect(hotel).toMatchObject(mockHotelData);
      expect(hotel.id).toBeDefined();
      expect(hotel.slug).toBe('test-hotel');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle file system errors', async () => {
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

      await expect(hotelService.createHotel(mockHotelData)).rejects.toThrow();
    });
  });

  describe('getHotel', () => {
    it('should return hotel by ID', async () => {
      const mockHotel = { ...mockHotelData, id: 'test-id', slug: 'test-hotel' };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));

      const hotel = await hotelService.getHotel('test-id');

      expect(hotel).toEqual(mockHotel);
    });

    it('should return null for non-existent hotel', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

      const hotel = await hotelService.getHotel('non-existent');

      expect(hotel).toBeNull();
    });
  });

  describe('getHotelBySlug', () => {
    it('should return hotel by slug', async () => {
      const mockHotel = { ...mockHotelData, id: 'test-id', slug: 'test-hotel' };
      (fs.readdir as jest.Mock).mockResolvedValue(['test-id.json']);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));

      const hotel = await hotelService.getHotelBySlug('test-hotel');

      expect(hotel).toEqual(mockHotel);
    });

    it('should return null for non-existent slug', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue(['test-id.json']);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({ slug: 'different-slug' }));

      const hotel = await hotelService.getHotelBySlug('non-existent');

      expect(hotel).toBeNull();
    });
  });

  describe('updateHotel', () => {
    it('should update hotel successfully', async () => {
      const mockHotel = { ...mockHotelData, id: 'test-id', slug: 'test-hotel' };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const updates = { description: 'Updated description' };
      const hotel = await hotelService.updateHotel('test-id', updates);

      expect(hotel).toMatchObject({ ...mockHotel, ...updates });
    });
  });

  describe('updateHotelImages', () => {
    it('should update hotel images successfully', async () => {
      const mockHotel = { ...mockHotelData, id: 'test-id', slug: 'test-hotel' };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const imageUrls = ['/uploads/image1.jpg', '/uploads/image2.jpg'];
      const hotel = await hotelService.updateHotelImages('test-id', imageUrls);

      expect(hotel?.images).toEqual(imageUrls);
    });
  });

  describe('addRoom', () => {
    it('should add room to hotel successfully', async () => {
      const mockHotel = { ...mockHotelData, id: 'test-id', slug: 'test-hotel' };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const roomData: Omit<Room, 'roomSlug' | 'roomImage'> = {
        hotelSlug: 'test-hotel',
        roomTitle: 'Test Room',
        bedroomCount: 1
      };

      const hotel = await hotelService.addRoom('test-hotel', roomData);

      expect(hotel?.rooms).toHaveLength(1);
      expect(hotel?.rooms[0]).toMatchObject({
        ...roomData,
        roomSlug: 'test-room',
        roomImage: ''
      });
    });
  });

  describe('updateRoomImage', () => {
    it('should update room image successfully', async () => {
      const mockRoom: Room = {
        hotelSlug: 'test-hotel',
        roomSlug: 'test-room',
        roomTitle: 'Test Room',
        roomImage: '',
        bedroomCount: 1
      };
      const mockHotel = { 
        ...mockHotelData, 
        id: 'test-id', 
        slug: 'test-hotel',
        rooms: [mockRoom]
      };
      
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHotel));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const imageUrl = '/uploads/room-image.jpg';
      const hotel = await hotelService.updateRoomImage('test-hotel', 'test-room', imageUrl);

      expect(hotel?.rooms[0].roomImage).toBe(imageUrl);
    });
  });
});