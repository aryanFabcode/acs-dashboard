import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Button from "../ui/button/Button";
import { Icon } from "@iconify/react";

export interface Client {
  _id: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  status: string;
  // Add other necessary fields from the API response
}

interface ClientTableProps {
  clients: Client[];
  page: number;
  limit: number;
  totalClients: number;
  loading?: boolean;
  onPageChange: (newPage: number) => void;
  onDelete: (clientId: string) => void;
  onViewDetails: (clientId: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  page,
  limit,
  totalClients,
  loading,
  onPageChange,
  onDelete,
  onViewDetails
}) => {
  const totalPages = Math.ceil(totalClients / limit);
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalClients);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Name', 'Gender', 'Phone', 'Email', 'Status', 'Actions'].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <SkeletonRow />
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                      #{client._id.slice(-6)}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          {client?.profile_image ? (
                            <Image
                              width={40}
                              height={40}
                              src={client.gender === 'female' ? '/images/user/female-avatar.png' : '/images/user/male-avatar.png'}
                              alt={client.name}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white">
                              {client?.name.charAt(0)}
                            </div>
                          )
                          }
                        </div>
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {client.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {client.gender || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {client.phone}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {client.email}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          client.status === 'active'
                            ? 'success'
                            : client.status === 'pending'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onViewDetails(client)}
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="error"
                          onClick={() => onDelete(client._id)}
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startRange} to {endRange} of {totalClients} clients
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 7 }).map((_, i) => (
          <TableCell key={i} className="px-5 py-4 sm:px-6">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default ClientTable;