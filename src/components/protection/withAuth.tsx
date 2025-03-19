// components/auth/withAuth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!token) {
        router.push('/login'); // Redirect to login if no token
      }
    }, [token, router]);

    if (!token) {
      return null; // Optional: Show a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;