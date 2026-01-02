import express from 'express';
import { scanner_controller } from '../controllers/scanner.controller';

const scanner = express.Router();

// Create route
scanner.post('/', scanner_controller.checkUrl);

export default scanner;
