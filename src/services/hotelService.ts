import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { Hotel, Room } from '../models/types';

export class HotelService {
  private readonly databasePath: string;

  constructor() {
    this.databasePath = path.join(__dirname, '..', 'database', 'hotels');
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await fs.mkdir(this.databasePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create database directory:', error);
    }
  }

  async createHotel(hotelData: Omit<Hotel, 'id' | 'slug'>): Promise<Hotel> {
    const id = Date.now().toString();
    const slug = slugify(hotelData.title, { lower: true });
    
    const hotel: Hotel = {
      ...hotelData,
      id,
      slug,
      images: [],
      rooms: []
    };

    try {
      await fs.writeFile(
        path.join(this.databasePath, `${id}.json`),
        JSON.stringify(hotel, null, 2)
      );
      return hotel;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }

  async getHotel(hotelId: string): Promise<Hotel | null> {
    try {
      const filePath = path.join(this.databasePath, `${hotelId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading hotel ${hotelId}:`, error);
      return null;
    }
  }

  async getHotelBySlug(slug: string): Promise<Hotel | null> {
    try {
      const files = await fs.readdir(this.databasePath);
      
      for (const file of files) {
        const filePath = path.join(this.databasePath, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const hotel = JSON.parse(data);
        
        if (hotel.slug === slug) {
          return hotel;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding hotel by slug ${slug}:`, error);
      return null;
    }
  }

  async updateHotel(hotelId: string, updates: Partial<Hotel>): Promise<Hotel | null> {
    try {
      const hotel = await this.getHotel(hotelId);
      if (!hotel) return null;

      const updatedHotel = { ...hotel, ...updates };
      
      await fs.writeFile(
        path.join(this.databasePath, `${hotel.id}.json`),
        JSON.stringify(updatedHotel, null, 2)
      );

      return updatedHotel;
    } catch (error) {
      console.error(`Error updating hotel ${hotelId}:`, error);
      throw error;
    }
  }

  async updateHotelImages(hotelId: string, imageUrls: string[]): Promise<Hotel | null> {
    return this.updateHotel(hotelId, { images: imageUrls });
  }

  async addRoom(hotelSlug: string, roomData: Omit<Room, 'roomSlug' | 'roomImage'>): Promise<Hotel | null> {
    try {
      const hotel = await this.getHotelBySlug(hotelSlug);
      if (!hotel) return null;

      const roomSlug = slugify(roomData.roomTitle, { lower: true });
      const newRoom: Room = {
        ...roomData,
        hotelSlug,
        roomSlug,
        roomImage: ''
      };

      hotel.rooms = [...hotel.rooms, newRoom];
      
      await fs.writeFile(
        path.join(this.databasePath, `${hotel.id}.json`),
        JSON.stringify(hotel, null, 2)
      );

      return hotel;
    } catch (error) {
      console.error(`Error adding room to hotel ${hotelSlug}:`, error);
      throw error;
    }
  }

  async updateRoomImage(hotelSlug: string, roomSlug: string, imageUrl: string): Promise<Hotel | null> {
    try {
      const hotel = await this.getHotelBySlug(hotelSlug);
      if (!hotel) return null;

      const roomIndex = hotel.rooms.findIndex(room => room.roomSlug === roomSlug);
      if (roomIndex === -1) return null;

      hotel.rooms[roomIndex].roomImage = imageUrl;
      
      await fs.writeFile(
        path.join(this.databasePath, `${hotel.id}.json`),
        JSON.stringify(hotel, null, 2)
      );

      return hotel;
    } catch (error) {
      console.error(`Error updating room image for ${hotelSlug}/${roomSlug}:`, error);
      throw error;
    }
  }
}