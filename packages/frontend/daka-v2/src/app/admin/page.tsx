import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to the Admin Dashboard</h1>
    </div>
  );
}