import { useDispatch } from 'react-redux';
import { apiSlice } from '../apiSlice';

export const useLazyLoading = (endpoint: string) => {
  const dispatch = useDispatch();

  const loadData = (params?: any) => {
    dispatch(apiSlice.util.prefetch(endpoint, params, { force: true }));
  };

  return loadData;
};

export const useOptimisticUpdates = (mutationHook: any, invalidateTag: any) => {
  const [trigger] = mutationHook();
  const dispatch = useDispatch();

  return async (data: any) => {
    try {
      const result = await trigger(data).unwrap();
      dispatch(apiSlice.util.invalidateTags([invalidateTag]));
      return result;
    } catch (error) {
      // Handle error
      throw error;
    }
  };
};