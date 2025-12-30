import { Switch, Route } from "wouter";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Chat} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}
