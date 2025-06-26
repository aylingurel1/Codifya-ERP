import React, { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}
export const Table: React.FC<TableProps> = ({ children, className }) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
)

export const TableHead: React.FC<TableProps> = ({ children, className }) => (
  <thead className={className}>{children}</thead>
)

export const TableBody: React.FC<TableProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
)

export const TableRow: React.FC<TableProps> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
)

export const TableCell: React.FC<TableProps> = ({ children, className }) => (
  <td className={`px-4 py-2 whitespace-nowrap ${className}`}>{children}</td>
)

export const TableHeader: React.FC<TableProps> = ({ children, className }) => (
  <th className={`px-4 py-2 text-left font-medium text-gray-700 ${className}`}>{children}</th>
) 