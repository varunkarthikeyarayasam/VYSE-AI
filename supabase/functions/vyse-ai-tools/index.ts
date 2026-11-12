// ============================================================================
// VYSE Smart Campus AI Tool Layer & Orchestrator Edge Function
// ============================================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";

    // Create client preserving the caller's authenticated user context
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const body = await req.json();
    const { tool, params, action } = body;

    // ------------------------------------------------------------------------
    // MODE 1: High-Level Assistant Chat Orchestration
    // ------------------------------------------------------------------------
    if (action === "chat" || !tool) {
      const message: string = (body.message ?? "").trim();
      let studentId: string = body.student_id;
      let sessionId: string = body.session_id;

      // Extract student from auth context if not provided
      if (!studentId && authHeader) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) studentId = user.id;
      }
      if (!studentId) {
        studentId = "11111111-1111-1111-1111-111111111111"; // Fallback demo Arjun
      }

      // Initialize or reuse session
      if (!sessionId) {
        const { data: newSession } = await supabase
          .from("ai_conversation_sessions")
          .insert({
            user_id: studentId,
            title: message.slice(0, 40) || "Campus Consultation",
          })
          .select()
          .single();
        if (newSession) sessionId = newSession.id;
      }

      const lower = message.toLowerCase();
      let intent = "general";
      let reply = "";
      const toolCalls: any[] = [];
      let actionCard: any = null;
      let citations: any[] = [];
      const entities: Record<string, any> = {};
      // INTENT 1: OD Request / Hackathon Attendance
      if (lower.includes("od") || lower.includes("on-duty") || lower.includes("on duty") || lower.includes("leave")) {
        intent = "od_request";
        toolCalls.push({ tool: "search_events", status: "completed", query: "hackathon" });

        // Search for the event (e.g. Hackathon)
        const { data: events } = await supabase.rpc("search_events", {
          p_search_text: "hackathon",
        });

        const targetEvent = events && events.length > 0 ? events[0] : null;

        if (targetEvent) {
          entities.event = targetEvent.title;
          entities.event_id = targetEvent.id;

          // Deterministic eligibility check via RPC
          toolCalls.push({ tool: "check_od_eligibility", status: "completed", event_id: targetEvent.id });
          const { data: eligibility, error: eligError } = await supabase.rpc("check_od_eligibility", {
            p_student_id: studentId,
            p_event_id: targetEvent.id,
          });

          if (eligError) {
            reply = `I encountered an error checking your eligibility: ${eligError.message}`;
          } else if (eligibility.eligible) {
            // Consequential action: PREPARE OD request (does not execute)
            toolCalls.push({ tool: "prepare_od_request", status: "completed" });
            const { data: prepared } = await supabase.rpc("prepare_od_request", {
              p_student_id: studentId,
              p_event_id: targetEvent.id,
              p_reason: `Participation in ${targetEvent.title}`,
              p_from_date: targetEvent.event_date,
              p_to_date: targetEvent.event_date,
            });

            reply = `You are eligible for On-Duty (OD) leave for **${targetEvent.title}**! Your attendance is **${eligibility.attendance_percent}%** (minimum required: ${eligibility.min_required}%), and you have used ${eligibility.od_used_this_semester} of ${eligibility.max_allowed} semester allowances.

I have prepared your OD submission draft below. Please review the details and click **Confirm** to submit it to faculty for approval.`;

            actionCard = {
              type: "action_card",
              action: "confirm_od_request",
              draft_token: prepared?.draft_token,
              title: `Submit OD Request: ${targetEvent.title}`,
              event_title: targetEvent.title,
              event_date: targetEvent.event_date,
              reason: `Participation in ${targetEvent.title}`,
              attendance_percent: eligibility.attendance_percent,
              status: "READY_FOR_CONFIRMATION",
            };
          } else {
            reply = `I checked your OD eligibility for **${targetEvent.title}**, but you are currently not eligible for the following reasons:\n` +
              eligibility.reasons.map((r: string) => `• ${r}`).join("\n");
          }
        } else {
          reply = "I couldn't find an active campus event matching that request. Please verify the event name or browse upcoming events.";
        }
      }
      // INTENT 2: Transport / Bus Route Inquiry
      else if (lower.includes("bus") || lower.includes("route") || lower.includes("transport") || lower.includes("reach") || lower.includes("tambaram")) {
        intent = "bus_inquiry";
        entities.origin = lower.includes("tambaram") ? "Tambaram" : "Home";

        toolCalls.push({ tool: "get_active_bus_route", status: "completed", origin: "Tambaram" });
        const { data: route } = await supabase.rpc("get_active_bus_route", {
          p_origin: "Tambaram",
          p_destination: "Campus",
        });

        if (route) {
          const isTemp = route.is_temporary;
          reply = `Here is your optimal transport route from **${route.origin}**:\n\n` +
            `🚌 **${route.route_name}** ${isTemp ? "*(Special Event-Day Schedule Active)*" : ""}\n` +
            `• Destination: ${route.destination}\n` +
            (route.stops && route.stops.length > 0
              ? `• Departure: **${route.stops[0].arrival_time}** from ${route.stops[0].stop_name}\n` +
                `• Estimated Campus Arrival: **${route.stops[route.stops.length - 1].arrival_time}**\n\n` +
                `**Scheduled Stops:**\n` +
                route.stops.map((s: any) => `  ${s.stop_order}. ${s.stop_name} — ${s.arrival_time}`).join("\n")
              : "");
        } else {
          reply = "No active bus routes found matching your location. Please check regular transport timings or contact the Transport Office.";
        }
      }
      // INTENT 3: Timetable / Today's Classes
      else if (lower.includes("class") || lower.includes("timetable") || lower.includes("schedule") || lower.includes("today")) {
        intent = "timetable_inquiry";
        toolCalls.push({ tool: "get_student_context", status: "completed", student_id: studentId });

        const { data: context } = await supabase.rpc("get_student_context", {
          p_student_id: studentId,
        });

        if (context && context.today_timetable && context.today_timetable.length > 0) {
          reply = `Here is your schedule for today:\n\n` +
            context.today_timetable.map((c: any) =>
              `• **${c.course_code} - ${c.course_name}**\n  ⏰ ${c.start_time} - ${c.end_time} | 📍 ${c.room} | 👨‍🏫 ${c.faculty_name}`
            ).join("\n\n");
        } else {
          reply = "You have no scheduled classes for today on your timetable.";
        }
      }
      // INTENT 4: Attendance Inquiry
      else if (lower.includes("attendance") || lower.includes("percentage") || lower.includes("threshold")) {
        intent = "attendance_inquiry";
        toolCalls.push({ tool: "get_student_context", status: "completed", student_id: studentId });

        const { data: context } = await supabase.rpc("get_student_context", {
          p_student_id: studentId,
        });

        if (context && context.attendance) {
          const att = context.attendance;
          reply = `Your aggregate attendance is currently **${att.attendance_percent}%** (${att.present_classes} attended out of ${att.total_classes} classes).\n\n` +
            (att.threshold_met
              ? "✅ You satisfy the mandatory 75% attendance threshold and are in good standing for examinations and OD requests."
              : "⚠️ You are below the 75% attendance threshold. Prioritize attending upcoming classes to regain eligibility.");
        } else {
          reply = "Unable to retrieve attendance records at this time.";
        }
      }
      // INTENT 5: Verified Institutional Knowledge Retrieval (RAG)
      else {
        intent = "campus_knowledge";
        toolCalls.push({ tool: "search_verified_knowledge", status: "completed", query: message });

        const { data: knowledgeDocs } = await supabase.rpc("search_verified_knowledge", {
          p_search_text: message,
        });

        if (knowledgeDocs && knowledgeDocs.length > 0) {
  citations = knowledgeDocs.slice(0, 3).map((d: any) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    source: d.source,
  }));

  reply =
    `According to verified institutional documentation:\n\n` +
    knowledgeDocs[0].content +
    `\n\n*Source: ${
      knowledgeDocs[0].source || "University Handbook"
    }*`;
} else {
    reply="I could not find any verified institutional documentation matching your query.";
}
// ------------------------------------------------------------------------
      // FALLBACK: Fine-tuned VYSE model via Cloudflare
      // ------------------------------------------------------------------------

      // Persist messages in conversation history
      if (sessionId) {
        await supabase.from("ai_messages").insert([
          { session_id: sessionId, role: "user", content: message, intent, entities },
          { session_id: sessionId, role: "assistant", content: reply, tool_calls: toolCalls, intent, entities },
        ]);
        await supabase.from("ai_conversation_sessions")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", sessionId);
      }

      return new Response(
        JSON.stringify({
          success: true,
          session_id: sessionId,
          intent,
          entities,
          reply,
          tool_calls: toolCalls,
          action_card: actionCard,
          citations,
        }),
        { headers: { ...
          Headers, "Content-Type": "application/json" } }
      );
    }

    // ------------------------------------------------------------------------
    // MODE 2: Discrete Named Tool Invocations
    // ------------------------------------------------------------------------
    let toolResult: any;
    let source = "database";

    switch (tool) {
      case "check_od_eligibility": {
        const { data, error } = await supabase.rpc("check_od_eligibility", {
          p_student_id: params.student_id,
          p_event_id: params.event_id,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "prepare_od_request": {
        const { data, error } = await supabase.rpc("prepare_od_request", {
          p_student_id: params.student_id,
          p_event_id: params.event_id,
          p_reason: params.reason,
          p_from_date: params.from_date,
          p_to_date: params.to_date,
          p_document_url: params.document_url || null,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "confirm_od_request": {
        const { data, error } = await supabase.rpc("confirm_od_request", {
          p_draft_token: params.draft_token,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "prepare_event_registration": {
        const { data, error } = await supabase.rpc("prepare_event_registration", {
          p_student_id: params.student_id,
          p_event_id: params.event_id,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "confirm_event_registration": {
        const { data, error } = await supabase.rpc("confirm_event_registration", {
          p_draft_token: params.draft_token,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "search_events": {
        const { data, error } = await supabase.rpc("search_events", {
          p_search_text: params.search_text || null,
          p_date_filter: params.date_filter || null,
        });
        if (error) throw error;
        toolResult = data;
        source = "database";
        break;
      }

      case "get_event_details": {
        const { data, error } = await supabase.rpc("get_event_details", {
          p_event_id: params.event_id,
        });
        if (error) throw error;
        toolResult = data;
        source = "database";
        break;
      }

      case "get_active_bus_route": {
        const { data, error } = await supabase.rpc("get_active_bus_route", {
          p_origin: params.origin,
          p_destination: params.destination || "Campus",
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "find_bus_routes": {
        const { data, error } = await supabase.rpc("find_bus_routes", {
          p_origin: params.origin,
          p_destination: params.destination,
          p_target_arrival_time: params.target_arrival_time || null,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "search_verified_knowledge": {
        const { data, error } = await supabase.rpc("search_verified_knowledge", {
          p_search_text: params.search_text || "",
        });
        if (error) throw error;
        toolResult = data;
        source = "verified_knowledge";
        break;
      }

      case "get_student_context": {
        const { data, error } = await supabase.rpc("get_student_context", {
          p_student_id: params.student_id,
        });
        if (error) throw error;
        toolResult = data;
        source = "rpc";
        break;
      }

      case "search_marketplace": {
        let query = supabase.from("marketplace_items").select("*").eq("status", "available");
        if (params.category) query = query.eq("category", params.category);
        if (params.search_text) query = query.ilike("title", `%${params.search_text}%`);
        const { data, error } = await query.order("created_at", { ascending: false }).limit(20);
        if (error) throw error;
        toolResult = data;
        source = "database";
        break;
      }

      case "get_notifications": {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", params.user_id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        toolResult = data;
        source = "database";
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: { code: "UNKNOWN_TOOL", message: `Tool '${tool}' is not recognized.` },
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        tool,
        data: toolResult,
        source,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: err.code || "INTERNAL_ERROR", message: err.message || String(err) },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});