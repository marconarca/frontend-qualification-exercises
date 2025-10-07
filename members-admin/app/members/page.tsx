import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_NAME_COOKIE,
  ADMIN_TOKEN_COOKIE,
} from '@/lib/config/auth';
import { MembersDashboard } from './features/members_dashboard/MembersDashboard';

const MembersPage = () => {
  const store = cookies();
  const token = store.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect('/login');
  }

  const adminName = store.get(ADMIN_NAME_COOKIE)?.value ?? 'Administrator';

  return <MembersDashboard adminName={adminName} />;
};

export default MembersPage;
