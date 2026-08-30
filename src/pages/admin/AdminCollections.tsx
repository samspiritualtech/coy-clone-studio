import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BellRing, Plus, Send, Sparkles, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface CollectionRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface NotificationRow {
  id: string;
  title: string;
  body: string;
  deep_link_path: string | null;
  sent_count: number;
  failure_count: number;
  created_at: string;
}

const DEFAULT_TITLE = "New Collection is Live ✨";
const DEFAULT_BODY = "Discover OGURA's latest collection now.";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

const AdminCollections = () => {
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pushTitle, setPushTitle] = useState(DEFAULT_TITLE);
  const [pushBody, setPushBody] = useState(DEFAULT_BODY);

  const loadAll = async () => {
    const [{ data: cols }, { data: notifs }, { count }] = await Promise.all([
      supabase.from("collections").select("*").order("created_at", { ascending: false }),
      supabase
        .from("notifications")
        .select("id, title, body, deep_link_path, sent_count, failure_count, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("device_tokens")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    setCollections((cols ?? []) as CollectionRow[]);
    setNotifications((notifs ?? []) as NotificationRow[]);
    setDeviceCount(count ?? 0);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("collections").insert({
      title: title.trim(),
      slug: `${slugify(title)}-${Date.now().toString(36).slice(-4)}`,
      description: description.trim() || null,
      cover_image: coverImage.trim() || null,
      status: "draft",
      created_by: userData?.user?.id ?? null,
    });
    setIsSaving(false);

    if (error) {
      toast({ title: "Could not create collection", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Collection created", description: "Publish it to send the push notification." });
    setTitle("");
    setDescription("");
    setCoverImage("");
    void loadAll();
  };

  const handlePublish = async (collection: CollectionRow) => {
    setPublishingId(collection.id);
    try {
      const { error: updateError } = await supabase
        .from("collections")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", collection.id);

      if (updateError) throw new Error(updateError.message);

      const { data, error } = await supabase.functions.invoke("send-collection-notification", {
        body: {
          collection_id: collection.id,
          title: pushTitle.trim() || DEFAULT_TITLE,
          body: pushBody.trim() || DEFAULT_BODY,
        },
      });

      if (error) {
        const details =
          error instanceof FunctionsHttpError ? await error.context.text() : error.message;
        console.error("send-collection-notification failed:", details);
        toast({
          title: "Collection published, push failed",
          description: details.slice(0, 200),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Collection published",
          description: `Notification sent to ${data?.sent_count ?? 0} of ${data?.total_devices ?? 0} devices.`,
        });
      }
    } catch (err) {
      toast({ title: "Publish failed", description: String(err), variant: "destructive" });
    } finally {
      setPublishingId(null);
      void loadAll();
    }
  };

  const handleResend = async (collection: CollectionRow) => {
    await handlePublish(collection);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Collections & Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Publish a collection to push a native alert to every registered Android device.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium">
              {deviceCount === null ? "…" : deviceCount} active device
              {deviceCount === 1 ? "" : "s"} registered
            </p>
            <p className="text-xs text-muted-foreground">
              Devices that have granted notification permission in the OGURA app.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" /> New collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="collection-title">Title</Label>
              <Input
                id="collection-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Festive Edit 2026"
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short editorial line about this collection."
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection-cover">Cover image URL</Label>
              <Input
                id="collection-cover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://…"
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="push-title">Notification title</Label>
                <Input
                  id="push-title"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="push-body">Notification body</Label>
                <Input
                  id="push-body"
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  maxLength={240}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Create as draft"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Collections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : collections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collections yet.</p>
          ) : (
            collections.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {c.cover_image && (
                    <img src={c.cover_image} alt={c.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">/collection/{c.slug}</p>
                </div>
                <Badge variant={c.status === "published" ? "default" : "secondary"}>
                  {c.status}
                </Badge>
                {c.status === "published" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResend(c)}
                    disabled={publishingId === c.id}
                  >
                    <BellRing className="mr-1.5 h-3.5 w-3.5" />
                    {publishingId === c.id ? "Sending…" : "Resend push"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handlePublish(c)}
                    disabled={publishingId === c.id}
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    {publishingId === c.id ? "Publishing…" : "Publish & notify"}
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing sent yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{n.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {n.sent_count} delivered · {n.failure_count} failed · {n.deep_link_path}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCollections;
