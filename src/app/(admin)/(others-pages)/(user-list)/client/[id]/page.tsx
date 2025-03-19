// // app/clients/[id]/page.tsx
// "use client";
// import { useSelector } from 'react-redux';
// import { format } from 'date-fns';
// import CustomImage from '@/components/CustomImage';
// import { RootState } from '@reduxjs/toolkit/query';
// import SectionList from '@/components/reusable/SectionList';
// import DetailItem from '@/components/reusable/DetailItem';

// export default function ClientDetails() {
//   const { selectedClient } = useSelector((state: RootState) => state.clientDetails);
//   console.log(selectedClient, 'checking the details of selected client')

//   if (!selectedClient) return <div>No client selected</div>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex items-start gap-6 mb-8">
//         <div className="w-32 h-32 rounded-full overflow-hidden">
//           <CustomImage
//             src={selectedClient.profile_image}
//             alt={selectedClient.name}
//             width={128}
//             height={128}
//             fallbackSrc="/images/default-avatar.png"
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold">{selectedClient.name}</h1>
//           <p className="text-gray-600">{selectedClient.email}</p>
//           <div className="mt-2 flex gap-2">
//             <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//               {selectedClient.status}
//             </span>
//             <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//               {selectedClient.gender}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="card p-6">
//           <h2 className="text-xl font-semibold mb-4">Details</h2>
//           <dl className="space-y-2">
//             <DetailItem label="Phone" value={selectedClient.phone} />
//             <DetailItem label="Address" value={selectedClient.address} />
//             <DetailItem label="Created At" value={format(new Date(selectedClient.created_at), "dd MMM yyyy, HH:mm")} />
//             <DetailItem label="Updated At" value={format(new Date(selectedClient.updated_at), "dd MMM yyyy, HH:mm")} />
//           </dl>
//         </div>

//         <div className="card p-6">
//           <h2 className="text-xl font-semibold mb-4">Additional Info</h2>
//           <div className="space-y-2">
//             <SectionList title="Pet Preferences" items={selectedClient.pet_preferences} />
//             <SectionList title="Preferred Carer Gender" items={[selectedClient.preferred_carer_gender]} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//new v2
// app/clients/[id]/page.tsx
"use client";
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import CustomImage from '@/components/CustomImage';
import { RootState } from '@reduxjs/toolkit/query';
import SectionList from '@/components/reusable/SectionList';
import DetailItem from '@/components/reusable/DetailItem';

export default function ClientDetails() {
  const { selectedClient } = useSelector((state: RootState) => state.clientDetails);

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
              <CustomImage
                src={selectedClient.profile_image}
                alt={selectedClient.name}
                width={128}
                height={128}
                fallbackSrc="/images/default-avatar.png"
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{selectedClient.name}</h1>
              <p className="text-blue-600 font-medium">{selectedClient.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  {selectedClient.status}
                </span>
                <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                  {selectedClient.gender}
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
                <DetailItem label="Phone" value={selectedClient.phone} />
                <DetailItem label="Address" value={selectedClient.address} />
                <DetailItem label="Created At" value={format(new Date(selectedClient.created_at), "dd MMM yyyy, HH:mm")} />
                <DetailItem label="Updated At" value={format(new Date(selectedClient.updated_at), "dd MMM yyyy, HH:mm")} />
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
                <SectionList title="Pet Preferences" items={selectedClient.pet_preferences} />
                <SectionList title="Preferred Carer Gender" items={[selectedClient.preferred_carer_gender]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}