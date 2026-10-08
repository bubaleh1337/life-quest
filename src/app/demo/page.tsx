import Dashboard from "@/components/Dashboard";

export const metadata = { title: { absolute: "Life Quest — Demo" } };

export default function DemoPage() {
  return <Dashboard userId="demo-user" email="demo@lifequest.app" demo />;
}
