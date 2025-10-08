const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const ADMIN_TOKEN = 'mock-admin-token';

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const admin = router.db.get('admins').find({ username }).value();

  if (!admin || admin.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: ADMIN_TOKEN,
    admin: {
      username: admin.username,
      name: admin.name,
    },
  });
});

server.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }

  const authHeader = req.headers.authorization || '';
  const isAuthorized = authHeader === `Bearer ${ADMIN_TOKEN}`;

  if (!isAuthorized) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
});

const readMembers = () => router.db.get('members').value();

const filterMembers = (predicate) => readMembers().filter(predicate);

server.get('/members/search/name', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const members = query
    ? filterMembers((member) => member.name.toLowerCase().includes(query))
    : readMembers();
  return res.json(members);
});

server.get('/members/search/email', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const members = query
    ? filterMembers((member) =>
        member.emailAddress.toLowerCase().includes(query),
      )
    : readMembers();
  return res.json(members);
});

server.get('/members/search/mobile', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const members = query
    ? filterMembers((member) =>
        member.mobileNumber.toLowerCase().includes(query),
      )
    : readMembers();
  return res.json(members);
});

server.use(router);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`JSON Server with auth is running on port ${port}`);
});
