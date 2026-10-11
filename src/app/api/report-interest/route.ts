
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "../../../lib/supabase/server";


export async function POST(request: Request) {
  try {
    // 1. Read and validate the submitted email.
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim() : "";

    if (
      email.length < 5 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Save the email interest in Supabase.
    const supabase = await createClient();

    const { error: databaseError } = await supabase
      .from("report_interest_events")
      .insert({
        event_type: "email_signup",
        email,
      });

    if (databaseError) {
      console.error(
        "Report interest database error:",
        databaseError
      );

      return NextResponse.json(
        {
          error: "We couldn't save your interest. Please try again.",
        },
        { status: 500 }
      );
    }

    // 3. Read Resend configuration from environment variables.
    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail =
      process.env.REPORT_NOTIFICATION_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    // 4. If email configuration is missing, keep the saved interest.
    if (!apiKey || !notificationEmail || !fromEmail) {
      console.error(
        "Report interest email environment variables are missing."
      );

      return NextResponse.json({
        saved: true,
        notificationSent: false,
        message:
          "Your interest was saved, but the notification is not configured yet.",
      });
    }

    // 5. Send a notification to your configured email address.
    const resend = new Resend(apiKey);

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: "New ZILIGO report interest",
      text: [
        "Someone expressed interest in the ZILIGO personalized report.",
        "",
        `Email address: ${email}`,
        `Submitted at: ${new Date().toISOString()}`,
        "",
        "This is an interest notification, not a purchase.",
      ].join("\n"),
    });

    if (emailError) {
      console.error(
        "Resend notification error:",
        emailError
      );

      return NextResponse.json({
        saved: true,
        notificationSent: false,
        message:
          "Your interest was saved, but the notification could not be sent.",
      });
    }

    // 6. Return success to the frontend.
    return NextResponse.json({
      saved: true,
      notificationSent: true,
      message: "Your interest was recorded successfully.",
    });
  } catch (error) {
    console.error("Report interest request error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
