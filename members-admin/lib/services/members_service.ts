import { getGraphqlEndpoint } from '@/lib/config/env';
import type {
  AccountStatus,
  Member,
  VerificationStatus,
} from '@/lib/types/member';

type GraphqlMember = {
  id: string | null;
  name: string | null;
  verificationStatus: VerificationStatus | null;
  emailAddress: string | null;
  mobileNumber: string | null;
  domain: string | null;
  dateTimeCreated: string | null;
  dateTimeLastActive: string | null;
  status: AccountStatus | null;
};

type MemberEdge = {
  node: GraphqlMember;
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

type MembersByNameQuery = {
  membersByName?: GraphqlMember[] | null;
};

type MembersByEmailQuery = {
  membersByEmailAddress?: GraphqlMember[] | null;
};

type MembersByMobileQuery = {
  membersByMobileNumber?: GraphqlMember[] | null;
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

const MEMBER_FIELDS = `
  name
  verificationStatus
  emailAddress
  mobileNumber
  domain
  dateTimeCreated
  dateTimeLastActive
  status
`;

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
            ${MEMBER_FIELDS}
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

const MEMBERS_BY_NAME_QUERY = `
  query MembersByName($search: String!, $first: Int = 20) {
    membersByName(search: $search, first: $first) {
      id
      ... on Member {
        ${MEMBER_FIELDS}
      }
    }
  }
`;

const MEMBERS_BY_EMAIL_QUERY = `
  query MembersByEmail($search: String!, $first: Int = 10) {
    membersByEmailAddress(search: $search, first: $first) {
      id
      ... on Member {
        ${MEMBER_FIELDS}
      }
    }
  }
`;

const MEMBERS_BY_MOBILE_QUERY = `
  query MembersByMobile($search: String!, $first: Int = 10) {
    membersByMobileNumber(search: $search, first: $first) {
      id
      ... on Member {
        ${MEMBER_FIELDS}
      }
    }
  }
`;

const mapMemberNode = (node: GraphqlMember): Member => {
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
  } = node;

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
  query: string,
  variables: Record<string, unknown>,
): Promise<T> => {
  const response = await fetch(getGraphqlEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('UNAUTHORIZED');
  }

  const payload = (await response.json()) as GraphqlResponse<T>;

  if (payload.errors?.length) {
    throw new Error('UNAUTHORIZED');
  }

  if (!payload.data) {
    throw new Error('UNAUTHORIZED');
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
    const data = await executeGraphql<MembersQuery>(token, MEMBERS_QUERY, {
      first: 50,
      after,
      filter,
    });

    const edges = data.members?.edges ?? [];
    edges.forEach((edge) => {
      members.push(mapMemberNode(edge.node));
    });

    hasNextPage = Boolean(data.members?.pageInfo?.hasNextPage);
    after = data.members?.pageInfo?.endCursor ?? null;

    safetyCounter += 1;
    if (safetyCounter > 20) {
      throw new Error('UNAUTHORIZED');
    }
  }

  return members;
};

const searchMembers = async (
  token: string,
  query: string,
  search: string,
  first: number,
): Promise<Member[]> => {
  const trimmed = search.trim();
  if (!trimmed) {
    return [];
  }

  const data = await executeGraphql<
    MembersByNameQuery | MembersByEmailQuery | MembersByMobileQuery
  >(token, query, {
    search: trimmed,
    first,
  });

  const collection =
    (data as MembersByNameQuery).membersByName ??
    (data as MembersByEmailQuery).membersByEmailAddress ??
    (data as MembersByMobileQuery).membersByMobileNumber ??
    [];

  return collection
    .filter((node): node is GraphqlMember => node !== null && typeof node === 'object')
    .map(mapMemberNode);
};

export const searchMembersByName = (token: string, search: string) =>
  searchMembers(token, MEMBERS_BY_NAME_QUERY, search, 20);

export const searchMembersByEmail = (token: string, search: string) =>
  searchMembers(token, MEMBERS_BY_EMAIL_QUERY, search, 10);

export const searchMembersByMobile = (token: string, search: string) =>
  searchMembers(token, MEMBERS_BY_MOBILE_QUERY, search, 10);
