import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vendor_slug, customer_name, language = 'ko',
      wedding_date, budget, category, message, source = 'hub',
      ambassador_ref,
    } = body;

    if (!vendor_slug || !message) {
      return Response.json({ error: 'vendor_slug and message are required' }, { status: 400 });
    }

    const payload = {
      tenant_id: 'kwedding',
      vendor_slug,
      customer_name: customer_name || 'Anonymous',
      language,
      wedding_date: wedding_date || null,
      budget: budget || null,
      interested_category: category || null,
      message_original: message,
      status: 'new',
      source,
      ambassador_id: ambassador_ref || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('leads').insert([payload]).select('id');

    if (error) {
      console.error('Lead insert error:', error);
      // Graceful fallback: log the lead even if DB fails
      return Response.json({ success: true, fallback: true, lead: payload });
    }

    return Response.json({ success: true, id: data?.[0]?.id });
  } catch (e) {
    console.error('Lead API error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
