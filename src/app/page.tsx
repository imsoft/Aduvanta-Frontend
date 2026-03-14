import { redirect } from 'next/navigation';

// Root redirects to sign-in; the dashboard layout handles authenticated redirects.
export default function RootPage() {
  redirect('/sign-in');
}
