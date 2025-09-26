
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className="flex flex-col justify-center items-center h-screen text-black">
      <h1 className="text-2xl mb-2">
        Welcome {user?.name ? user.name : "Guest"} 
      </h1>
      {user && (
        <div className="text-lg text-black">
          <div><b>Email:</b> {user.email}</div>
          <div><b>User ID:</b> {user.id}</div>
        </div>
      )}
    </div>
  );
}
