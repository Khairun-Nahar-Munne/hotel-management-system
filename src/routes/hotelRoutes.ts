import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { HotelController } from '../controllers/hotelController';

const router = Router();
const hotelController = new HotelController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Hotel routes
router.post('/hotels', (req, res) => hotelController.createHotel(req, res));
router.get('/hotels/:hotelId', (req, res) => hotelController.getHotel(req, res));
router.get('/hotels/slug/:slug', (req, res) => hotelController.getHotelBySlug(req, res));
router.put('/hotels/:hotelId', (req, res) => hotelController.updateHotel(req, res));
router.post('/hotels/:hotelId/images', upload.array('images'), (req, res) => 
  hotelController.uploadHotelImages(req, res)
);

// Room routes
router.post('/hotels/:hotelSlug/rooms', (req, res) => 
  hotelController.addRoom(req, res)
);
router.post('/hotels/:hotelSlug/rooms/:roomSlug/image', upload.single('image'), (req, res) => 
  hotelController.uploadRoomImage(req, res)
);

export default router;
