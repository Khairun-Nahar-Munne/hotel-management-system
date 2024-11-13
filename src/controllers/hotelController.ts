import { Request, Response, Router } from 'express';
import { HotelService } from '../services/hotelService';
import { Hotel, Room } from '../models/types';

export class HotelController {
  private hotelService: HotelService;
  public router: Router;

  constructor() {
    this.hotelService = new HotelService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/hotels', this.createHotel.bind(this));
    this.router.get('/hotels/:hotelId', this.getHotel.bind(this));
    this.router.get('/hotels/slug/:slug', this.getHotelBySlug.bind(this));
    this.router.put('/hotels/:hotelId', this.updateHotel.bind(this));
    this.router.post('/hotels/:hotelId/images', this.uploadHotelImages.bind(this));
    this.router.post('/hotels/:hotelSlug/rooms', this.addRoom.bind(this));
    this.router.post('/hotels/:hotelSlug/rooms/:roomSlug/image', this.uploadRoomImage.bind(this));
  }

  private validateHotelData(data: Hotel): boolean {
    return !!(
      data.title &&
      data.description &&
      data.guestCount &&
      data.bedroomCount &&
      data.bathroomCount &&
      data.amenities &&
      data.host?.name &&
      data.host?.email &&
      data.host?.phone &&
      data.address?.street &&
      data.address?.city &&
      data.address?.state &&
      data.address?.country &&
      data.address?.zipCode &&
      data.location?.latitude &&
      data.location?.longitude
    );
  }

  async createHotel(req: Request, res: Response): Promise<void> {
    try {
      if (!this.validateHotelData(req.body)) {
        res.status(400).json({ error: 'Missing or invalid hotel data' });
        return;
      }

      const hotel = await this.hotelService.createHotel(req.body);
      res.status(201).json(hotel);
    } catch (error) {
      console.error(error); 
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
      console.error(error); 
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
      console.error(error); 
      res.status(500).json({ error: 'Failed to fetch hotel' });
    }
  }

  async updateHotel(req: Request, res: Response): Promise<void> {
    try {
      if (!this.validateHotelData(req.body)) {
        res.status(400).json({ error: 'Missing or invalid hotel data' });
        return;
      }

      const hotel = await this.hotelService.updateHotel(req.params.hotelId, req.body);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }
      res.json(hotel);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Failed to update hotel' });
    }
  }

  async uploadHotelImages(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No images provided' });
        return;
      }

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
      console.error(error); 
      res.status(500).json({ error: 'Failed to upload images' });
    }
  }

  async uploadRoomImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        res.status(400).json({ error: 'No image provided' });
        return;
      }

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
      console.error(error); 
      res.status(500).json({ error: 'Failed to upload room image' });
    }
  }

  async addRoom(req: Request, res: Response): Promise<void> {
    try {
      const { hotelSlug } = req.params;
      const roomData: Omit<Room, 'roomSlug' | 'roomImage'> = req.body;

      if (!roomData.roomTitle || !roomData.bedroomCount) {
        res.status(400).json({ error: 'Missing required room data' });
        return;
      }

      const hotel = await this.hotelService.addRoom(hotelSlug, roomData);
      if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }

      res.status(201).json(hotel);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Failed to add room' });
    }
  }
}