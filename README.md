# Frontend Qualification Exercises

This repository contains the qualification exercises given to frontend engineers interested in joining the **ScaleForge** team. These exercises are designed to evaluate the coding and problem-solving abilities of the candidate. The candidate is given a maximum of 3 days to complete the exercises. The candidate must then submit the completed exercises by sending an email to our HR team.

The completed exercises will be evaluated by the **ScaleForge** team using the following criteria:
- Accuracy of the implementation
- Code quality

# Instructions
1. Clone this repository and push it to a private repository on your personal GitHub account. Refer [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository) to learn how to duplicate a repository.
2. Implement the web application as described in the `Requirements` section. The candiate must use either `Next.js` or `SvelteKit` as the frontend framework. The web application must run locally by running the `npm start` command. The web application must then be accessible via a web browser at `http://localhost:3000`.
3. Push your changes to your cloned repository.
4. Add the following **ScaleForge** team members as collaborators to your cloned repository:
   - `rogermadjos`
   - `Boniqx`
   - `JohnPaulCalvo`

# Requirements
The web application displays a list of members and their corresponding details. The web application must implement the UI as specified in the provided Figma [file](https://www.figma.com/file/AwrMuHBOqmAAj0g8mv4MWb/Frontend-Test-Mockup-Design?type=design&node-id=4%3A121&mode=design&t=gNzV3SQsKXfkhEJR-1). The list of members can be fetched from the provided [GraphQL API](https://report.development.opexa.io/graphql). All the necessary information for using the GraphQL API is provided in the `Docs` section in the GraphQL Playground. In particular, the web application must use the following endpoints:
- `Query.members` - fetch the list of members
- `Query.membersByName` - search members by name
- `Query.membersByEmailAddress` - search members by email address
- `Query.membersByMobileNumber` - search members by mobile number

All requests to the GraphQL endpoint must be authenticated through the use of a standard `Bearer` token:
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

The `accessToken` can be generated as follows:
```bash
curl --request POST \
  --url 'https://auth.development.opexa.io/sessions?ttl=24h' \
  --header 'authorization: Basic e3tPUEVSQVRPUl9OQU1FfX06e3tPUEVSQVRPUl9QQVNTV09SRH19' \
  --header 'platform-code: Z892' \
  --header 'role: OPERATOR'
```

To sum up, the web application includes the following features:
- Table of members
- Search
- Filter
- Pagination

## Sample GraphQL Queries
### Fetch the list of members
```graphql
query ($first: Int, $after: Cursor, $filter: MemberFilterInput) {
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
```
### Search members by name
```graphql
query ($search: String!) {
  membersByName(search: $search, first: 20) {
    id
  }
}
```
