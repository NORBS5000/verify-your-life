import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Lock,
  LogOut,
  RefreshCw,
  Users,
  Clock,
  TrendingDown,
  CheckCircle,
  Activity,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import SecurityFooter from "@/components/SecurityFooter";

const STEP_NAMES: Record<number, string> = {
  1: "Profile",
  2: "Medical",
  3: "Collateral",
  4: "Verify",
  5: "Guarantors",
  6: "Review",
};

interface TrackingEvent {
  id: string;
  session_id: string;
  phone_number: string | null;
  step_number: number;
  step_name: string;
  event_type: string;
  entered_at: string;
  left_at: string | null;
  duration_seconds: number | null;
  created_at: string;
}

interface SessionSummary {
  session_id: string;
  phone_number: string | null;
  current_step: number;
  current_step_name: string;
  started_at: string;
  last_activity: string;
  completed: boolean;
  steps_visited: number[];
  total_time_seconds: number;
  step_durations: Record<number, number>;
}

const Tracker = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (authenticated) {
      fetchEvents();
      if (autoRefresh) {
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [authenticated, autoRefresh]);

  const handlePinSubmit = () => {
    if (pin === "tracker1234") {
      setAuthenticated(true);
    } else {
      alert("Invalid tracker PIN");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_tracking" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!error && data) {
      setEvents(data as unknown as TrackingEvent[]);
    }
    setLoading(false);
  };

  // Aggregate sessions
  const sessions: SessionSummary[] = (() => {
    const sessionMap = new Map<string, TrackingEvent[]>();
    events.forEach((e) => {
      if (!sessionMap.has(e.session_id)) sessionMap.set(e.session_id, []);
      sessionMap.get(e.session_id)!.push(e);
    });

    return Array.from(sessionMap.entries())
      .map(([session_id, evts]) => {
        const sorted = evts.sort(
          (a, b) => new Date(a.entered_at).getTime() - new Date(b.entered_at).getTime()
        );
        const last = sorted[sorted.length - 1];
        const steps_visited = [...new Set(sorted.map((e) => e.step_number))].sort();
        const step_durations: Record<number, number> = {};
        sorted.forEach((e) => {
          if (e.duration_seconds) {
            step_durations[e.step_number] =
              (step_durations[e.step_number] || 0) + e.duration_seconds;
          }
        });
        const total_time_seconds = Object.values(step_durations).reduce((a, b) => a + b, 0);

        return {
          session_id,
          phone_number: last.phone_number || sorted.find((e) => e.phone_number)?.phone_number || null,
          current_step: last.step_number,
          current_step_name: last.step_name,
          started_at: sorted[0].entered_at,
          last_activity: last.left_at || last.entered_at,
          completed: last.event_type === "completed",
          steps_visited,
          total_time_seconds,
          step_durations,
        };
      })
      .sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
  })();

  // Stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed).length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Drop-off analysis: count how many sessions stopped at each step
  const dropOffs: Record<number, number> = {};
  sessions
    .filter((s) => !s.completed)
    .forEach((s) => {
      dropOffs[s.current_step] = (dropOffs[s.current_step] || 0) + 1;
    });

  // Average time per step
  const stepTimeTotals: Record<number, { total: number; count: number }> = {};
  sessions.forEach((s) => {
    Object.entries(s.step_durations).forEach(([step, duration]) => {
      const stepNum = parseInt(step);
      if (!stepTimeTotals[stepNum]) stepTimeTotals[stepNum] = { total: 0, count: 0 };
      stepTimeTotals[stepNum].total += duration;
      stepTimeTotals[stepNum].count += 1;
    });
  });

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Active sessions (last activity within 5 minutes)
  const activeSessions = sessions.filter(
    (s) => !s.completed && Date.now() - new Date(s.last_activity).getTime() < 5 * 60 * 1000
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Form Tracker</CardTitle>
            <CardDescription>Enter tracker PIN to view user navigation data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter tracker PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handlePinSubmit}>
                Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto p-6 space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Form Navigation Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Monitor how users navigate through the application form
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {autoRefresh && (
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3 animate-pulse text-green-500" />
                Live
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Pause" : "Resume"} Auto-Refresh
            </Button>
            <Button variant="outline" size="icon" onClick={fetchEvents} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Object.keys(dropOffs).length > 0
                      ? `Step ${Object.entries(dropOffs).sort(([, a], [, b]) => b - a)[0][0]}`
                      : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">Top Drop-off</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Funnel & Time Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Drop-off Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step Funnel & Drop-offs</CardTitle>
              <CardDescription>Where users stop in the form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const reached = sessions.filter((s) =>
                  s.steps_visited.includes(step)
                ).length;
                const dropped = dropOffs[step] || 0;
                const pct = totalSessions > 0 ? Math.round((reached / totalSessions) * 100) : 0;

                return (
                  <div key={step} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Step {step}: {STEP_NAMES[step]}
                      </span>
                      <span className="text-muted-foreground">
                        {reached} users ({pct}%)
                        {dropped > 0 && (
                          <span className="text-red-500 ml-2">↓ {dropped} dropped</span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Average Time Per Step */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Time Per Step</CardTitle>
              <CardDescription>How long users spend on each step</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const data = stepTimeTotals[step];
                const avgSeconds = data ? Math.round(data.total / data.count) : 0;
                const maxExpected = 300; // 5 min max for bar width
                const barPct = Math.min(100, (avgSeconds / maxExpected) * 100);

                return (
                  <div key={step} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Step {step}: {STEP_NAMES[step]}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {avgSeconds > 0 ? formatDuration(avgSeconds) : "No data"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Active & Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>User Sessions</span>
              <Badge variant="outline">{sessions.length} sessions</Badge>
            </CardTitle>
            <CardDescription>Real-time view of user form navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Steps Visited</TableHead>
                    <TableHead>Total Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No tracking data yet. Users will appear here as they start the form.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.slice(0, 50).map((session) => {
                      const isActive =
                        !session.completed &&
                        Date.now() - new Date(session.last_activity).getTime() < 5 * 60 * 1000;

                      return (
                        <TableRow key={session.session_id}>
                          <TableCell>
                            {session.completed ? (
                              <Badge className="bg-green-600">Completed</Badge>
                            ) : isActive ? (
                              <Badge className="bg-blue-600 gap-1">
                                <Activity className="h-3 w-3 animate-pulse" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {session.phone_number || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Step {session.current_step}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {session.current_step_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5, 6].map((step) => (
                                <div
                                  key={step}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    session.steps_visited.includes(step)
                                      ? step === session.current_step
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {step}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {session.total_time_seconds > 0
                              ? formatDuration(session.total_time_seconds)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(session.last_activity), {
                              addSuffix: true,
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <SecurityFooter />
    </div>
  );
};

export default Tracker;
