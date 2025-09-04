'use client';

import Image from 'next/image';
import { SITE_NAME } from '@/utils/constants';
import { Login } from '@/components/Login';

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex">
      <div className="lg:w-1/2 w-full flex items-center justify-center">
        <Login />
      </div>

      <div className="lg:w-1/2 lg:relative lg:block hidden">
        <Image
          src="/bgLogin.webp"
          alt={SITE_NAME}
          fill
          className="object-cover"
          sizes='100vh'
        />
      </div>
    </div>
  );
}
