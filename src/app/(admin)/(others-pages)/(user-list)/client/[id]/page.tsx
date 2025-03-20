// app/clients/[id]/page.tsx
"use client";
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import CustomImage from '@/components/CustomImage';
import { RootState } from '@reduxjs/toolkit/query';
import SectionList from '@/components/reusable/SectionList';
import DetailItem from '@/components/reusable/DetailItem';
import { useGetClientDetailsQuery } from '@/lib/redux/api/clientApi';
import { useEffect } from 'react';
import { setSelectedClient } from '@/lib/redux/slices/clientDetailsSlice';
import { useParams, useSearchParams } from 'next/navigation';

export default function ClientDetails({ params }: { params: { id: string } }) {
  const paramsfromNavigate = useParams();
  const searchParams = useSearchParams();
  console.log(searchParams, 'searchParams');
  const clientId = paramsfromNavigate?.id;
  const dispatch = useDispatch();
  const { selectedClient } = useSelector((state: RootState) => state.clientDetails);


  // Skip fetching if client data exists in Redux and matches the ID
  const skip = selectedClient?._id === clientId;
  const { data: fetchedClient, isLoading, isFetching } = useGetClientDetailsQuery(clientId, { skip });

  // Update Redux store when new client data is fetched
  useEffect(() => {
    if (fetchedClient) {
      dispatch(setSelectedClient(fetchedClient?.data));
    }
  }, [fetchedClient, dispatch]);

  console.log(skip, 'skip in client details');

  // Determine loading state and which data to use
  const loading = !skip && (isLoading || isFetching);
  const clientData = skip ? selectedClient : fetchedClient?.data;
  console.log(clientData, 'clientData in client details');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-xl font-medium text-gray-700">Loading client details...</h2>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-xl font-medium text-gray-700">Client not found</h2>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-xl font-medium text-gray-700">No client selected</h2>
          <p className="mt-2 text-gray-500">Please select a client from the list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Client Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md flex-shrink-0">
              {clientData.profile_image ? (
                <CustomImage
                  src={clientData.profile_image}
                  alt={clientData.name}
                  width={128}
                  height={128}
                  fallbackSrc="/images/default-avatar.png"
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white">
                  {clientData.name.charAt(0)}
                </div>
              )}

            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{clientData.name}</h1>
              <p className="text-blue-600 font-medium">{clientData.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  {clientData.status}
                </span>
                <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                  {clientData.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Client Details</h2>
            </div>
            <div className="p-6">
              <dl className="space-y-4">
                <DetailItem label="Phone" value={clientData.phone} />
                <DetailItem label="Address" value={clientData.address} />
                <DetailItem label="Created At" value={format(new Date(clientData?.created_at), "dd MMM yyyy, HH:mm")} />
                <DetailItem label="Updated At" value={format(new Date(clientData?.updated_at), "dd MMM yyyy, HH:mm")} />
              </dl>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Preferences</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <SectionList title="Pet Preferences" items={clientData.pet_preferences} />
                <SectionList title="Preferred Carer Gender" items={[clientData.preferred_carer_gender]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}