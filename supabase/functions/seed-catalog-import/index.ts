import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEED_BATCH_KEY = "ogura-catalog-seed-v1";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // --- admin authorization (JWT + admin role), no shared-secret bypass ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Unauthorized" }, 401);

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
  const actor = userData.user.id;

  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", actor)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) return json({ error: "Forbidden: admin role required" }, 403);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const step: string = body?.step;
  const dryRun: boolean = body?.dry_run !== false;
  const rows: any[] = Array.isArray(body?.rows) ? body.rows : [];
  if (!["sellers", "products", "variants", "images", "publish", "verify"].includes(step)) {
    return json({ error: "Invalid step" }, 400);
  }
  if (body?.seed_batch_key && body.seed_batch_key !== SEED_BATCH_KEY) {
    return json({ error: "Invalid seed_batch_key" }, 400);
  }

  const counts: Record<string, number> = {};
  const failures: any[] = [];
  const bump = (k: string, n = 1) => (counts[k] = (counts[k] ?? 0) + n);

  try {
    if (step === "sellers") {
      for (const r of rows) {
        try {
          let userId: string | null = null;
          const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
          const existing = list?.users?.find((u: any) => u.email === r.account_email);
          if (existing) {
            userId = existing.id;
            if (r.password && !dryRun) {
              await admin.auth.admin.updateUserById(userId, {
                password: r.password,
                email_confirm: true,
              });
            }
            bump("auth_users_reused");
          } else if (!dryRun) {
            const { data: created, error: cErr } = await admin.auth.admin.createUser({
              email: r.account_email,
              password: r.password,
              email_confirm: true,
              user_metadata: { full_name: r.brand_name },
            });
            if (cErr) throw cErr;
            userId = created.user!.id;
            bump("auth_users_created");
          } else {
            bump("auth_users_would_create");
          }

          if (!dryRun && userId) {
            const { error: sErr } = await admin.from("sellers").upsert(
              {
                id: r.seller_id,
                user_id: userId,
                brand_name: r.brand_name,
                city: r.city,
                seller_type: "independent_designer",
                description: r.brand_description,
                application_status: "approved",
                is_verified: true,
                is_active: true,
              },
              { onConflict: "id" },
            );
            if (sErr) throw sErr;
            bump("sellers_upserted");
            await admin
              .from("user_roles")
              .upsert({ user_id: userId, role: "seller" }, { onConflict: "user_id,role" });
          } else {
            bump("sellers_validated");
          }
        } catch (e) {
          failures.push({ seller: r.seller_slug, error: String(e?.message ?? e) });
        }
      }
    }

    if (step === "products") {
      if (!dryRun) {
        const { error } = await admin.from("products").upsert(rows, { onConflict: "id" });
        if (error) throw error;
      }
      bump(dryRun ? "products_validated" : "products_upserted", rows.length);
    }

    if (step === "variants") {
      if (!dryRun) {
        const { error } = await admin
          .from("product_variants")
          .upsert(rows, { onConflict: "product_id,size,color_name" });
        if (error) throw error;
      }
      bump(dryRun ? "variants_validated" : "variants_upserted", rows.length);
    }

    if (step === "images") {
      // rows: [{ product_db_id, target_storage_path, source_url, image_order, is_primary }]
      const force = body?.force === true;
      const driveDirect = (url: string) => {
        const m = String(url).match(/(?:\/file\/d\/|[?&]id=)([A-Za-z0-9_-]{20,})/);
        return m
          ? `https://drive.usercontent.google.com/download?id=${m[1]}&export=download`
          : url;
      };
      const byProduct = new Map<string, { order: number; url: string }[]>();
      for (const r of rows) {
        try {
          const { data: head } = await admin.storage
            .from("product-images")
            .list(r.target_storage_path.split("/").slice(0, -1).join("/"), {
              search: r.target_storage_path.split("/").pop(),
            });
          const alreadyThere = !force && (head ?? []).length > 0;

          if (!alreadyThere && !dryRun) {
            const res = await fetch(driveDirect(r.source_url), {
              headers: { "User-Agent": "Mozilla/5.0 (compatible; OGURA-Seed/1.0)" },
            });
            if (!res.ok) throw new Error(`fetch ${res.status}`);
            const ct = res.headers.get("content-type") ?? "";
            if (!ct.startsWith("image/")) throw new Error(`not an image (${ct})`);
            const bytes = new Uint8Array(await res.arrayBuffer());
            if (bytes.byteLength < 500) throw new Error("image too small / not accessible");
            const { error: upErr } = await admin.storage
              .from("product-images")
              .upload(r.target_storage_path, bytes, {
                contentType: ct,
                upsert: true,
              });
            if (upErr) throw upErr;
            bump("images_uploaded");
          } else if (alreadyThere) {
            bump("images_reused");
          } else {
            bump("images_would_upload");
          }


          const { data: pub } = admin.storage
            .from("product-images")
            .getPublicUrl(r.target_storage_path);
          const arr = byProduct.get(r.product_db_id) ?? [];
          arr.push({ order: Number(r.image_order) || 1, url: pub.publicUrl });
          byProduct.set(r.product_db_id, arr);
        } catch (e) {
          failures.push({ path: r.target_storage_path, error: String(e?.message ?? e) });
        }
      }

      if (!dryRun) {
        for (const [productId, imgs] of byProduct) {
          const ordered = imgs.sort((a, b) => a.order - b.order).map((i) => i.url);
          const { error } = await admin
            .from("products")
            .update({ images: ordered })
            .eq("id", productId);
          if (error) failures.push({ product: productId, error: error.message });
          else bump("products_images_set");
        }
      }
    }

    if (step === "publish") {
      const ids: string[] = rows.map((r) => (typeof r === "string" ? r : r.id));
      if (!dryRun) {
        const { data, error } = await admin
          .from("products")
          .update({ status: "live", is_available: true })
          .in("id", ids)
          .eq("status", "submitted")
          .select("id");
        if (error) throw error;
        bump("products_published", data?.length ?? 0);
      } else {
        bump("products_to_publish", ids.length);
      }
    }

    if (step === "verify") {
      const { count: sellerCount } = await admin
        .from("sellers")
        .select("id", { count: "exact", head: true });
      const { count: liveCount } = await admin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("status", "live");
      counts.sellers_total = sellerCount ?? 0;
      counts.products_live = liveCount ?? 0;
    }

    await admin.from("seed_import_runs").insert({
      seed_batch_key: SEED_BATCH_KEY,
      actor_user_id: actor,
      mode: dryRun ? "dry_run" : "execute",
      step,
      counts,
      failures,
    });

    return json({ step, mode: dryRun ? "dry_run" : "execute", counts, failures });
  } catch (e) {
    return json({ step, error: String((e as Error)?.message ?? e), counts, failures }, 500);
  }
});
