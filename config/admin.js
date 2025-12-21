import dotenv from 'dotenv';
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import Profile from '../model/profile.js';
import dotenv from 'dotenv';

dotenv.config();

export  const createAdmin =  async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const adminExist = await User.findOne({ where: { email: adminEmail } });
    if (!adminExist) {
        const hashAdminPassword = await bcrypt.hash(adminPassword, 12);
      const admin =  await User.create({
            firstName: 'Hassan',
            surName: 'Fullstack',
            dateOfBirth: '2004-02-03',
            email: adminEmail,
            gender: 'male',
            password: hashAdminPassword,
            isVerify: true,
            role: 'admin'
        });

         await Profile.create({
                image: process.env.AVATER_MALE_PROFIL,
                userId: admin.id,
              });
        console.log('Admin user created successfully!');
    } else {
        console.log('Admin user already exists.');
    }
}
