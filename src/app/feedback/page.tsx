import { redirect } from "next/navigation";

// V3: feedback is now inline on the main page
export default function FeedbackRedirect() {
  redirect("/");
}
