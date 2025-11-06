import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNotesById,
  updateNote,
} from '../controlles/notesController.js';

const router = Router();

// router.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello Node.js',
//   });
// });

router.get('/notes', getAllNotes);

router.get('/notes/:noteId', getNotesById);

router.get('/notes', createNote);

router.get('/notes/:noteId', deleteNote);

router.get('/notes/:noteId', updateNote);

export default router;
