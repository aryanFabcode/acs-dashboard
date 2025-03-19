// hooks/useAuth.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const useAuth = () => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/signin');
    }
  }, [token, router]);

  return { token };
};

export default useAuth;