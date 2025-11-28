"use client";

import { HiOutlineUser } from "react-icons/hi";
import {
  MdAdminPanelSettings,
  MdOutlineSupervisorAccount,
} from "react-icons/md";

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const normalizedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "User";

  const roleColors: { [key: string]: string } = {
    Admin: "bg-red-100 text-red-700",
    Owner: "bg-yellow-100 text-yellow-700",
    User: "bg-green-100 text-green-700",
  };
  const roleIcon: { [key: string]: React.ReactNode } = {
    Admin: <MdAdminPanelSettings className="mr-1 w-4 h-4" />,
    Owner: <MdOutlineSupervisorAccount className="mr-1 w-4 h-4" />,
    User: <HiOutlineUser className="mr-1 w-4 h-4" />,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        roleColors[normalizedRole] || "bg-neutral-100 text-neutral-700"
      }`}
    >
      {roleIcon[normalizedRole]}
      {normalizedRole}
    </span>
  );
};

export default RoleBadge;







