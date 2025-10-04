import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Get the user data from the request
    const { email, password } = await request.json();

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 4. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create a new user with the hashed password
    const newUser = new User({
      email,
      passwordHash: hashedPassword,
    });

    // 6. Save the new user to the database
    await newUser.save();

    // 7. Send a success response
    return NextResponse.json(
      { message: 'User created successfully.' },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}