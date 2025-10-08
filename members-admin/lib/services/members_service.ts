import { getGraphqlEndpoint } from '@/lib/config/env';
import type {
  AccountStatus,
  Member,
  VerificationStatus,
} from '@/lib/types/member';

type MemberEdge = {
  node: {
    id: string;
    name: string | null;
    verificationStatus: VerificationStatus | null;
    emailAddress: string | null;
    mobileNumber: string | null;
    domain: string | null;
    dateTimeCreated: string | null;
    dateTimeLastActive: string | null;
    status: AccountStatus | null;
  };
};

type MembersQuery = {
  members: {
    edges: MemberEdge[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

type GraphqlResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export type GraphqlFilter = {
  status?: { in: AccountStatus[] };
  verificationStatus?: { in: VerificationStatus[] };
  domain?: { in: string[] };
  dateTimeCreated?: {
    greaterThanOrEqual?: string;
    lesserThanOrEqual?: string;
  };
  dateTimeLastActive?: {
    greaterThanOrEqual?: string;
    lesserThanOrEqual?: string;
  };
};

const MEMBERS_QUERY = `
  query Members(
    $first: Int = 50
    $after: Cursor
    $filter: MemberFilterInput
  ) {
    members(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const mapMember = (edge: MemberEdge): Member => {
  const {
    id,
    name,
    verificationStatus,
    emailAddress,
    mobileNumber,
    domain,
    dateTimeCreated,
    dateTimeLastActive,
    status,
  } = edge.node;

  if (!id || !name || !verificationStatus || !status) {
    throw new Error('Incomplete member data received from GraphQL API');
  }

  return {
    id,
    name,
    verificationStatus,
    emailAddress,
    mobileNumber,
    domain,
    dateTimeCreated: dateTimeCreated ?? '',
    dateTimeLastActive: dateTimeLastActive ?? '',
    status,
  };
};

const executeGraphql = async <T>(
  token: string,
  variables: Record<string, unknown>,
): Promise<T> => {
  const response = await fetch(getGraphqlEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: MEMBERS_QUERY,
      variables,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GraphqlResponse<T>;

  if (payload.errors?.length) {
    console.error('GraphQL errors', payload.errors);
    throw new Error('UNAUTHORIZED');
  }

  if (!payload.data) {
    throw new Error('GraphQL response missing data');
  }

  return payload.data;
};

export const fetchMembers = async (
  token: string,
  filter?: GraphqlFilter,
): Promise<Member[]> => {
  const members: Member[] = [];
  let hasNextPage = true;
  let after: string | null | undefined;
  let safetyCounter = 0;

  while (hasNextPage) {
    const data = await executeGraphql<MembersQuery>(token, {
      first: 50,
      after,
      filter,
    });

    const edges = data.members?.edges ?? [];
    edges.forEach((edge) => {
      members.push(mapMember(edge));
    });

    hasNextPage = Boolean(data.members?.pageInfo?.hasNextPage);
    after = data.members?.pageInfo?.endCursor ?? null;

    safetyCounter += 1;
    if (safetyCounter > 20) {
      throw new Error('Too many GraphQL pagination requests');
    }
  }

  return members;
};
