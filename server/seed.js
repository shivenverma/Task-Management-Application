require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing demo user data...');
    const demoEmail = 'demo@example.com';
    
    // Find or remove existing demo user
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Task.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: 'Demo@123',
    });

    console.log(`[Seed] Created Demo User: ${user.email}`);

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const sampleTasks = [
      {
        title: 'Complete JWT Authentication & Security Audit',
        description: 'Implement JWT authentication, password hashing with bcrypt, and verify route authorization for all API endpoints.',
        status: 'In Progress',
        priority: 'High',
        dueDate: inTwoDays,
        userId: user._id,
      },
      {
        title: 'Design Responsive SaaS Dashboard UI',
        description: 'Build modern responsive layouts using React and Tailwind CSS with vibrant status badges, dark accent panels, and smooth micro-animations.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: yesterday,
        userId: user._id,
      },
      {
        title: 'Submit Q3 Product Roadmap & Deliverables',
        description: 'Review task performance metrics, export task reports, and share deliverable updates with stakeholders.',
        status: 'Pending',
        priority: 'High',
        dueDate: yesterday, // Overdue because status is Pending and dueDate < now
        userId: user._id,
      },
      {
        title: 'Setup Database Indexing & Query Optimization',
        description: 'Add index on userId, status, and dueDate fields in MongoDB Task schema to optimize multi-criteria task search queries.',
        status: 'Pending',
        priority: 'Low',
        dueDate: inFiveDays,
        userId: user._id,
      },
      {
        title: 'Integrate Socket.IO Real-time Notifications',
        description: 'Broadcast taskCreated, taskUpdated, and taskDeleted events to authenticated socket rooms for instantaneous UI sync.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: inTenDays,
        userId: user._id,
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seed] Inserted ${sampleTasks.length} sample tasks successfully.`);

    console.log('\n=============================================');
    console.log(' Seed Data Ready!');
    console.log(` Email:    ${demoEmail}`);
    console.log(' Password: Demo@123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
