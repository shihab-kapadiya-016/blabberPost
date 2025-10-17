import { Suspense } from 'react';
import LoginPage from './SignInpage';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
