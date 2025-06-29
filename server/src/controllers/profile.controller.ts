import { Request, Response } from 'express';
import User from '../models/User';
import VulnerabilityKnowledge from '../models/Vulnerability';

// Получить профиль текущего пользователя
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Обновить профиль текущего пользователя
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const updateFields = (({
      name, about, city, website, skills, specializations, avatar, contacts
    }) => ({ name, about, city, website, skills, specializations, avatar, contacts }))(req.body);
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Получить вклад пользователя (contributions)
export const getContributions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Предполагается, что в модели VulnerabilityKnowledge будет поле authorId
    const contributions = await VulnerabilityKnowledge.find({ authorId: userId });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 