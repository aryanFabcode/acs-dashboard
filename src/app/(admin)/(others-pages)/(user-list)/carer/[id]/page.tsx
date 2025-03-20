// app/carers/[id]/page.tsx
'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Badge from '@/components/ui/badge/Badge';
import { useSelector } from 'react-redux';
import CustomImage from '@/components/CustomImage';
import { useGetCarerDetailsQuery } from '@/lib/redux/api/carersApi';

export default function CarerDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const paramsfromNavigate = useParams();
  const carerId = paramsfromNavigate?.id;

  const { data: fetchedClient, isLoading, isFetching } = useGetCarerDetailsQuery(carerId);

  const { selectedCarer } = useSelector((state: any) => state.carerDetails);
  const carer = selectedCarer || fetchedClient?.data;

  if (!selectedCarer && (isFetching || isLoading)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-xl font-medium text-gray-700">Loading client details...</h2>
        </div>
      </div>
    );
  }

  if (!carer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Carer Selected</h2>
          <p className="text-gray-600 mb-6">Please select a carer from the list to view details.</p>
          <button
            onClick={() => router.push("/carer")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Carers
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div className="p-6 max-w-7xl mx-auto">
    //   {/* Header Section */}
    //   <div className="flex items-center justify-between mb-8">
    //     <div className="flex items-center gap-4">
    //       <CustomImage
    //         src={carer.profile_image}
    //         alt={carer.name}
    //         width={80}
    //         height={80}
    //         className="rounded-full"
    //       />
    //       <div>
    //         <h1 className="text-2xl font-bold">{carer.name}</h1>
    //         <div className="flex items-center gap-2 mt-2">
    //           <Badge color={carer.status === 'active' ? 'success' : 'error'}>
    //             {carer.status}
    //           </Badge>
    //           <span className="text-gray-600">
    //             {carer.total_experience} years experience
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <Button 
    //       color="error" 
    //       onClick={() => deleteCarer({ id: carer._id })}
    //     >
    //       <Icon icon="heroicons:trash" className="mr-2" />
    //       Delete Carer
    //     </Button> */}
    //   </div>

    //   {/* Details Grid */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     {/* Personal Info Card */}
    //     <div className="bg-white p-6 rounded-lg shadow-sm">
    //       <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
    //       <DetailItem label="Email" value={carer.email} />
    //       <DetailItem label="Phone" value={carer.phone} />
    //       <DetailItem label="Gender" value={carer.gender} />
    //       <DetailItem 
    //         label="Hourly Rate" 
    //         value={new Intl.NumberFormat('en-GB', {
    //           style: 'currency',
    //           currency: 'GBP',
    //         }).format(carer.hourly_rate / 100)}
    //       />
    //     </div>

    //     {/* Skills & Experience Card */}
    //     <div className="bg-white p-6 rounded-lg shadow-sm">
    //       <h2 className="text-lg font-semibold mb-4">Skills & Experience</h2>
    //       <DetailList label="Skills" items={carer.skills} />
    //       <DetailList label="Experience with Conditions" items={carer.experience} />
    //       <DetailList label="Languages" items={carer.languages} />
    //       <DetailList label="Hobbies" items={carer.hobbies} />
    //     </div>

    //     {/* Documents Card */}
    //     <div className="bg-white p-6 rounded-lg shadow-sm">
    //       <h2 className="text-lg font-semibold mb-4">Documents & Certificates</h2>
    //       <DocumentItem label="DBS Certificate" path={carer.doc_dbs} />
    //       <DocumentItem label="Right to Work" path={carer.doc_rtw_uk} />
    //       <DocumentItem label="Training Certificates" path={carer.doc_training_certificates} />
    //     </div>

    //     {/* Additional Info Card */}
    //     <div className="bg-white p-6 rounded-lg shadow-sm">
    //       <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
    //       <DetailItem label="Can Drive Patients" value={carer.can_drive_patients ? 'Yes' : 'No'} />
    //       <DetailItem label="Owns Car" value={carer.own_car ? 'Yes' : 'No'} />
    //       <DetailList label="Pet Preferences" items={carer.pet_preferences} />
    //       <DetailItem label="Reference Email" value={carer.reference_email} />
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-4 md:mb-0">
              <div className="w-32 h-32 rounded-full border-4 border-blue-100 shadow-md overflow-hidden">
                {carer.profile_image ? (<CustomImage
                  src={carer.profile_image}
                  alt={carer.name}
                  width={128}
                  height={128}
                  fallbackSrc="/images/default-avatar.png"
                  className="w-full h-full object-cover"
                />) : (<div className="w-full h-full bg-brand-500 flex items-center justify-center text-white">
                  {carer.name.charAt(0)}
                </div>)}

              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{carer.name}</h1>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <Badge color={carer.status === 'active' ? 'success' : 'error'}>
                    {carer.status}
                  </Badge>
                  <span className="text-gray-600 font-medium">
                    {carer.total_experience} years experience
                  </span>
                </div>
                <p className="text-blue-600 mt-2">{carer.email}</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/carer")}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Carers
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Hourly Rate</p>
              <p className="font-semibold text-lg text-gray-900">
                {/* {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                }).format(carer.hourly_rate / 100)} */}
                {carer.hourly_rate ? `£${carer.hourly_rate}` : '-'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{carer.phone}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold text-gray-900">{carer.gender}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Driver</p>
              <p className="font-semibold text-gray-900">{carer.can_drive_patients ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills & Experience Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Skills & Experience</h2>
            </div>
            <div className="p-6">
              <DetailList label="Skills" items={carer.skills} />
              <DetailList label="Experience with Conditions" items={carer.experience} />
              <DetailList label="Languages" items={carer.languages} />
              <DetailList label="Hobbies" items={carer.hobbies} />
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Documents & Certificates</h2>
            </div>
            <div className="p-6">
              <DocumentItem label="DBS Certificate" path={carer.doc_dbs} />
              <DocumentItem label="Right to Work" path={carer.doc_rtw_uk} />
              <DocumentItem label="Training Certificates" path={carer.doc_training_certificates} />
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Additional Information</h2>
            </div>
            <div className="p-6">
              <DetailItem label="Can Drive Patients" value={carer.can_drive_patients ? 'Yes' : 'No'} />
              <DetailItem label="Owns Car" value={carer.own_car ? 'Yes' : 'No'} />
              <DetailList label="Pet Preferences" items={carer.pet_preferences} />
              <DetailItem label="Reference Email" value={carer.reference_email} />
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Availability & Preferences</h2>
            </div>
            <div className="p-6">
              {carer.availability ? (
                <div className="space-y-4">
                  {Object.entries(carer.availability).map(([day, available]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="font-medium capitalize">{day}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No availability information</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable components for details page
const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between py-3 border-b">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value || '-'}</span>
  </div>
);

const DetailList = ({ label, items }: { label: string; items?: string[] }) => (
  <div className="py-3 border-b">
    <div className="text-gray-600 font-medium mb-2">{label}</div>
    <div className="flex flex-wrap gap-2">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-sm font-medium"
          >
            {item}
          </span>
        ))
      ) : (
        <span className="text-gray-500 italic">None specified</span>
      )}
    </div>
  </div>
);

const DocumentItem = ({ label, path }: { label: string; path?: string }) => (
  <div className="flex justify-between items-center py-3 border-b">
    <span className="text-gray-600 font-medium">{label}</span>
    {path ? (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        View Document
      </a>
    ) : (
      <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">Not available</span>
    )}
  </div>
);