"use client";

interface OnlineUser {
  id: number;
  name: string;
  role: string;
}

interface OnlineUsersCardProps {
  users: OnlineUser[];
}

const OnlineUsersCard = ({ users }: OnlineUsersCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-neutral-800">
        Pengguna Online
      </h2>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-6 text-center text-sm text-neutral-500">
            Tidak ada pengguna online.
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-all hover:bg-neutral-50"
            >
              <div className="relative flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsersCard;

