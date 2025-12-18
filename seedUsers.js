import bcrypt from 'bcryptjs';
import User from './model/user.js';
import Profile from './model/profile.js';
import { dbConnection } from './config/db.js';

// Example profile and cover photo URLs

const usersData =  [
  // 30 users with same firstName
  { firstName: 'John', surName: 'Smith1', email: 'john1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith2', email: 'john2@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith3', email: 'john3@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith4', email: 'john4@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith5', email: 'john5@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith6', email: 'john6@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith7', email: 'john7@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith8', email: 'john8@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith9', email: 'john9@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith10', email: 'john10@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith11', email: 'john11@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith12', email: 'john12@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith13', email: 'john13@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith14', email: 'john14@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith15', email: 'john15@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith16', email: 'john16@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith17', email: 'john17@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith18', email: 'john18@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith19', email: 'john19@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith20', email: 'john20@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith21', email: 'john21@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith22', email: 'john22@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith23', email: 'john23@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith24', email: 'john24@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith25', email: 'john25@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith26', email: 'john26@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith27', email: 'john27@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith28', email: 'john28@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith29', email: 'john29@test.com', password: '1234567', gender: 'male' },
  { firstName: 'John', surName: 'Smith30', email: 'john30@test.com', password: '1234567', gender: 'male' },

  // 20 unique users
  { firstName: 'Alice', surName: 'Johnson', email: 'alice1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Bob', surName: 'Williams', email: 'bob1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Cathy', surName: 'Brown', email: 'cathy1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'David', surName: 'Jones', email: 'david1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Eva', surName: 'Miller', email: 'eva1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Frank', surName: 'Davis', email: 'frank1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Grace', surName: 'Garcia', email: 'grace1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Henry', surName: 'Martinez', email: 'henry1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Ivy', surName: 'Rodriguez', email: 'ivy1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Jack', surName: 'Hernandez', email: 'jack1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Karen', surName: 'Lopez', email: 'karen1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Leo', surName: 'Gonzalez', email: 'leo1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Mia', surName: 'Perez', email: 'mia1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Nick', surName: 'Ramos', email: 'nick1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Olivia', surName: 'Sanchez', email: 'olivia1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Paul', surName: 'Ramirez', email: 'paul1@test.com', password: '1234567', gender: 'male' },
  { firstName: 'Quinn', surName: 'Gomez', email: 'quinn1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Rachel', surName: 'Murray', email: 'rachel1@test.com', password: '1234567', gender: 'female' },
  { firstName: 'Steve', surName: 'Diaz', email: 'steve1@test.com', password: '1234567', gender: 'male' }, // this
  { firstName: 'Tina', surName: 'Foster', email: 'tina1@test.com', password: '1234567', gender: 'female' }
];
const seedUsers = async () => {
  try {
    await dbConnection.authenticate(); // Drops and recreates tables
    console.log('Database synced!');

    for (let i = 0; i < usersData.length; i++) {
      // Hash password
      const hashedPassword = await bcrypt.hash(usersData[i].password, 10);

      // Create user
      const user = await User.create({
        firstName: usersData[i].firstName,
        surName: usersData[i].surName,
        dateOfBirth: '2000-01-01', // example
        gender: usersData[i].gender,
        email: usersData[i].email,
        password: hashedPassword,
        isVerify: true, // make verified to test
      });

      // Create profile picture
      await Profile.create({
        image: 'https://res.cloudinary.com/dxcrzy2ea/image/upload/v1763111653/abater_ps87oa.png',
        userId: user.id,
      });

      

      console.log(`User ${user.firstName} created!`);
    }

    console.log('✅ Seeding finished!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedUsers();
