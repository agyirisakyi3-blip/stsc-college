import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Programs from "./admin/Programs";
import Applications from "./admin/Applications";
import Users from "./admin/Users";
import Settings from "./admin/Settings";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}

export default function AdminRouter() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/programs" component={Programs} />
          <Route path="/admin/applications" component={Applications} />
          <Route path="/admin/users" component={Users} />
          <Route path="/admin/settings" component={Settings} />
          <Route>
            <div className="text-center py-20">
              <h2 className="text-xl font-bold mb-2">404</h2>
              <p className="text-muted-foreground">Admin page not found</p>
            </div>
          </Route>
        </Switch>
      </AdminLayout>
    </ProtectedRoute>
  );
}
