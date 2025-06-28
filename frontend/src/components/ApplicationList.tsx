import ApplicationCard from "./ApplicationCard";

export default function ApplicationList({ applications }: { applications: any[] }) {
  return (
    <div className="grid gap-4">
      {applications.map((app) => (
        <ApplicationCard key={app.id} app={app} />
      ))}
    </div>
  );
}
