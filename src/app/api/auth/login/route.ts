import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // 1. Check for JWT_SECRET in your .env.local file
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in .env.local');
      // In a real app, you'd want to handle this error more gracefully
      throw new Error('Server configuration error: JWT_SECRET is missing.');
    }

    // 2. Connect to the database
    await dbConnect();

    // 3. Get user data from the request
    const { email, password } = await request.json();

    // 4. Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 5. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // 6. If credentials are valid, create a JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user._id }, // The data to store in the token
      jwtSecret,            // The secret key to sign the token
      { expiresIn: '1h' }    // Make the token expire in 1 hour
    );

    // 7. Send the token back to the client
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}