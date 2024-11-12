import { Request, Response } from 'express';
import { HotelService } from '../services/hotelService';
import { Hotel, Room } from '../models/types';

export class HotelController {
  private hotelService: HotelService;

  constructor() {
    this.hotelService = new HotelService();
  }

  async createHotel(req: Request, res: Response): Promise<void> {
    try {
      const hotel = await this.hotelService.createHotel(req.body);
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create hotel' });
    }
  }

  async getHotel(req: Request, res: Response): Promise<void> {
    try {
      const hotel = await this.hotelService.getHotel(req.params.hotelId);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hotel' });
    }
  }

  async getHotelBySlug(req: Request, res: Response): Promise<void> {
    try {
      const hotel = await this.hotelService.getHotelBySlug(req.params.slug);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hotel' });
    }
  }

  async updateHotel(req: Request, res: Response): Promise<void> {
    try {
      const hotel = await this.hotelService.updateHotel(req.params.hotelId, req.body);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update hotel' });
    }
  }

  async uploadHotelImages(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files.map(file => `/uploads/images/${file.filename}`);
      
      const hotel = await this.hotelService.updateHotelImages(
        req.params.hotelId,
        imageUrls
      );

      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }

      res.json({ imageUrls });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload images' });
    }
  }

  async uploadRoomImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file as Express.Multer.File;
      const imageUrl = `/uploads/images/${file.filename}`;
      const { hotelSlug, roomSlug } = req.params;

      const hotel = await this.hotelService.updateRoomImage(
        hotelSlug,
        roomSlug,
        imageUrl
      );

      if (!hotel) {
        res.status(404).json({ error: 'Hotel or room not found' });
        return;
      }

      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload room image' });
    }
  }

  async addRoom(req: Request, res: Response): Promise<void> {
    try {
      const { hotelSlug } = req.params;
      const roomData: Omit<Room, 'roomSlug' | 'roomImage'> = req.body;

      const hotel = await this.hotelService.addRoom(hotelSlug, roomData);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add room' });
    }
  }
}